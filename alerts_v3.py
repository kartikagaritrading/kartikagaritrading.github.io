import os
import warnings
import requests
import numpy as np
import pandas as pd
import yfinance as yf
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

warnings.filterwarnings("ignore")

TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
CHAT = "@kartiktradinghindi"
MODE = os.environ.get("MODE", "auto")  # "all" = har market ka test alert

# naam, emoji, symbol, hashtag, 1 ghante ki halchal limit (%), chinh, dasmlav ank
MARKETS = [
    ("BITCOIN", "🟠", "BTC-USD", "#Bitcoin", 1.5, "$", 0),
    ("ETHEREUM", "🔷", "ETH-USD", "#Ethereum", 2.0, "$", 0),
    ("GOLD", "🟡", "GC=F", "#Gold", 0.7, "$", 1),
    ("EUR/USD", "💶", "EURUSD=X", "#EURUSD", 0.4, "", 4),
    ("NASDAQ", "📈", "^IXIC", "#Nasdaq", 0.8, "", 0),
]
SHOW = 120  # chart par kitni 4-ghante ki mombattiyan (lagbhag 20 din)


# ---------- data ----------
def get_hourly(symbol):
    df = yf.download(symbol, period="60d", interval="1h", progress=False, auto_adjust=True)
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    df = df[["Open", "High", "Low", "Close", "Volume"]].dropna()
    df.columns = ["o", "h", "l", "c", "v"]
    return df


def to_4h(df):
    return df.resample("4h").agg(
        {"o": "first", "h": "max", "l": "min", "c": "last", "v": "sum"}
    ).dropna()


def ist(ts):
    ts = pd.Timestamp(ts)
    if ts.tzinfo is None:
        ts = ts.tz_localize("UTC")
    return ts.tz_convert("Asia/Kolkata")


# ---------- indicators ----------
def ema(s, n):
    return s.ewm(span=n, adjust=False).mean()


def rsi(s, n=14):
    d = s.diff()
    up = d.clip(lower=0).ewm(alpha=1 / n, adjust=False).mean()
    dn = (-d.clip(upper=0)).ewm(alpha=1 / n, adjust=False).mean()
    rs = up / dn.replace(0, np.nan)
    return (100 - 100 / (1 + rs)).fillna(50)


def macd(s):
    m = ema(s, 12) - ema(s, 26)
    sig = ema(m, 9)
    return m, sig, m - sig


def swing_levels(h, l, w=4):
    pts = []
    for i in range(w, len(h) - w):
        if h[i] == h[i - w:i + w + 1].max():
            pts.append(h[i])
        if l[i] == l[i - w:i + w + 1].min():
            pts.append(l[i])
    return pts


def cluster(levels, tol=0.005):
    groups = []
    for v in sorted(levels):
        if groups and abs(v - np.mean(groups[-1])) / np.mean(groups[-1]) < tol:
            groups[-1].append(v)
        else:
            groups.append([v])
    return [(float(np.mean(g)), len(g)) for g in groups]


def candle_pattern(d4):
    o, h, l, c = [float(d4[k].iloc[-1]) for k in ("o", "h", "l", "c")]
    po, pc = float(d4["o"].iloc[-2]), float(d4["c"].iloc[-2])
    body, rng = abs(c - o), h - l
    if rng <= 0:
        return "कोई ख़ास पैटर्न नहीं"
    upper, lower = h - max(o, c), min(o, c) - l
    if c > o and pc < po and c >= po and o <= pc:
        return "बुलिश एंगल्फ़िंग: ख़रीदारों ने पिछली बिकवाली को ढक दिया (तेज़ी का संकेत)"
    if c < o and pc > po and c <= po and o >= pc:
        return "बेयरिश एंगल्फ़िंग: बेचने वालों ने पिछली ख़रीदारी को ढक दिया (मंदी का संकेत)"
    if body <= 0.1 * rng:
        return "डोजी: ख़रीदार और बेचने वाले बराबर, बाज़ार असमंजस में"
    if lower >= 2 * body and upper <= body:
        return "हैमर: नीचे से ज़ोरदार ख़रीदारी आई (संभावित उछाल)"
    if upper >= 2 * body and lower <= body:
        return "शूटिंग स्टार: ऊपर से ज़ोरदार बिकवाली आई (संभावित नरमी)"
    return "कोई ख़ास पैटर्न नहीं"


# ---------- analysis ----------
def analyse(d1, d4):
    c4 = d4["c"]
    e20, e50 = ema(c4, 20), ema(c4, 50)
    r = rsi(c4)
    m, sg, hist = macd(c4)
    now = float(d1["c"].iloc[-1])
    chg1 = (now - float(d1["c"].iloc[-2])) / float(d1["c"].iloc[-2]) * 100
    prev = d1["c"].loc[: d1.index[-1] - pd.Timedelta(hours=24)]
    base = float(prev.iloc[-1]) if len(prev) else float(d1["c"].iloc[0])
    chg24 = (now - base) / base * 100
    w = d4.tail(SHOW)
    hi, lo = float(w["h"].max()), float(w["l"].min())
    ihi, ilo = int(np.argmax(w["h"].values)), int(np.argmin(w["l"].values))
    levels = cluster(swing_levels(w["h"].values, w["l"].values))
    sups = sorted([x for x in levels if x[0] < now], key=lambda t: now - t[0])[:2]
    ress = sorted([x for x in levels if x[0] > now], key=lambda t: t[0] - now)[:2]
    if not sups:
        sups = [(lo, 1)]
    if not ress:
        ress = [(hi, 1)]
    vol = d4["v"]
    vol_x = None
    if float(vol.tail(20).mean()) > 0 and float(vol.iloc[-1]) > 0:
        vol_x = float(vol.iloc[-1]) / float(vol.tail(21).iloc[:-1].mean())
    score = sum([now > float(e50.iloc[-1]), float(e20.iloc[-1]) > float(e50.iloc[-1]),
                 float(hist.iloc[-1]) > 0, float(r.iloc[-1]) > 50])
    cross = None
    if float(hist.iloc[-1]) > 0 >= float(hist.iloc[-2]):
        cross = "up"
    elif float(hist.iloc[-1]) < 0 <= float(hist.iloc[-2]):
        cross = "down"
    ret1 = d1["c"].pct_change().dropna() * 100
    return dict(now=now, chg1=chg1, chg24=chg24, hi=hi, lo=lo, ihi=ihi, ilo=ilo,
                from_hi=(now - hi) / hi * 100, from_lo=(now - lo) / lo * 100,
                sups=sups, ress=ress, e20=e20, e50=e50, rsi=r, macd=m, sig=sg, hist=hist,
                vol_x=vol_x, score=score, cross=cross, pattern=candle_pattern(d4),
                sd=float(ret1.std()) or 0.0001)


# ---------- chart ----------
def draw_candles(ax, w):
    for i, (o, h, l, c) in enumerate(zip(w["o"], w["h"], w["l"], w["c"])):
        col = "#16a34a" if c >= o else "#dc2626"
        ax.vlines(i, l, h, color=col, linewidth=0.8)
        top, bot = max(o, c), min(o, c)
        ax.bar(i, max(top - bot, (h - l) * 0.01), bottom=bot, width=0.6, color=col)


def make_chart(d4, a, name, dec, path):
    w = d4.tail(SHOW)
    n = len(w)
    x = np.arange(n)
    fig, axes = plt.subplots(4, 1, figsize=(10, 12), sharex=True,
                             gridspec_kw={"height_ratios": [5, 1.2, 1.6, 1.6], "hspace": 0.06})
    ax, axv, axr, axm = axes
    draw_candles(ax, w)
    ax.plot(x, a["e20"].tail(n).values, color="#f59e0b", linewidth=1.3, label="EMA 20")
    ax.plot(x, a["e50"].tail(n).values, color="#7c3aed", linewidth=1.3, label="EMA 50")

    # trend channel (pichhli 60 mombatti)
    k = min(60, n)
    xs = np.arange(n - k, n)
    ys = w["c"].values[-k:]
    slope, icpt = np.polyfit(xs, ys, 1)
    line = slope * xs + icpt
    sd = float(np.std(ys - line))
    ax.plot(xs, line, color="#2563eb", linewidth=1, linestyle="--", label="Trend channel")
    ax.fill_between(xs, line - 2 * sd, line + 2 * sd, color="#2563eb", alpha=0.07)

    # support / resistance zones
    for i, (lv, t) in enumerate(a["ress"], 1):
        ax.axhspan(lv * 0.998, lv * 1.002, color="red", alpha=0.15)
        ax.axhline(lv, color="red", linewidth=0.8, linestyle=":")
        ax.text(n + 0.5, lv, f"R{i} {lv:,.{dec}f} ({t}x)", color="red", fontsize=8, va="center")
    for i, (lv, t) in enumerate(a["sups"], 1):
        ax.axhspan(lv * 0.998, lv * 1.002, color="green", alpha=0.15)
        ax.axhline(lv, color="green", linewidth=0.8, linestyle=":")
        ax.text(n + 0.5, lv, f"S{i} {lv:,.{dec}f} ({t}x)", color="green", fontsize=8, va="center")

    # fibonacci
    hi, lo = a["hi"], a["lo"]
    for r_ in (0.382, 0.5, 0.618):
        lv = hi - (hi - lo) * r_ if a["ilo"] < a["ihi"] else lo + (hi - lo) * r_
        ax.axhline(lv, color="gray", linewidth=0.6, linestyle="-.")
        ax.text(0.3, lv, f"Fib {r_ * 100:.1f}%", color="gray", fontsize=7, va="bottom")

    # high / low / now
    ax.scatter([a["ihi"]], [hi], color="green", zorder=6)
    ax.annotate(f"High {hi:,.{dec}f}", (a["ihi"], hi), textcoords="offset points",
                xytext=(0, 9), ha="center", fontsize=8, color="green", fontweight="bold")
    ax.scatter([a["ilo"]], [lo], color="red", zorder=6)
    ax.annotate(f"Low {lo:,.{dec}f}", (a["ilo"], lo), textcoords="offset points",
                xytext=(0, -14), ha="center", fontsize=8, color="red", fontweight="bold")
    ax.axhline(a["now"], color="black", linewidth=0.8)
    ax.text(n + 0.5, a["now"], f"Now {a['now']:,.{dec}f}", color="white", fontsize=8,
            va="center", fontweight="bold", bbox=dict(facecolor="black", edgecolor="none", pad=2))
    if a["ihi"] < n - 1 and abs(a["from_hi"]) > 0.3:
        col = "red" if a["from_hi"] < 0 else "green"
        ax.annotate("", xy=(n - 1, a["now"]), xytext=(a["ihi"], hi),
                    arrowprops=dict(arrowstyle="->", color=col, lw=1.4, linestyle="--"))
        ax.text((a["ihi"] + n - 1) / 2, (hi + a["now"]) / 2, f"{a['from_hi']:+.2f}% from high",
                color=col, fontsize=9, fontweight="bold", ha="center",
                bbox=dict(facecolor="white", alpha=0.85, edgecolor="none"))
    ax.set_title(f"{name} - 4H chart | Support/Resistance, Trend, Fibonacci | IST",
                 fontsize=12, fontweight="bold", pad=26)
    ax.legend(loc="lower left", bbox_to_anchor=(0, 1.0), fontsize=8, ncol=3, frameon=False)
    ax.grid(alpha=0.25)
    ax.margins(y=0.08)

    # volume
    cols = ["#16a34a" if cc >= oo else "#dc2626" for oo, cc in zip(w["o"], w["c"])]
    axv.bar(x, w["v"].values, color=cols, width=0.6)
    axv.set_ylabel("Volume", fontsize=8)
    axv.grid(alpha=0.25)

    # RSI
    axr.plot(x, a["rsi"].tail(n).values, color="#0ea5e9", linewidth=1.3)
    axr.axhline(70, color="red", linewidth=0.7, linestyle="--")
    axr.axhline(30, color="green", linewidth=0.7, linestyle="--")
    axr.fill_between(x, 70, 100, color="red", alpha=0.07)
    axr.fill_between(x, 0, 30, color="green", alpha=0.07)
    axr.set_ylim(0, 100)
    axr.set_ylabel("RSI 14", fontsize=8)
    axr.grid(alpha=0.25)

    # MACD
    h_ = a["hist"].tail(n).values
    axm.bar(x, h_, color=["#16a34a" if v >= 0 else "#dc2626" for v in h_], width=0.6)
    axm.plot(x, a["macd"].tail(n).values, color="#2563eb", linewidth=1.1, label="MACD")
    axm.plot(x, a["sig"].tail(n).values, color="#f59e0b", linewidth=1.1, label="Signal")
    axm.axhline(0, color="black", linewidth=0.5)
    axm.set_ylabel("MACD", fontsize=8)
    axm.legend(loc="upper left", fontsize=7, ncol=2)
    axm.grid(alpha=0.25)

    ticks = np.linspace(0, n - 1, 7).astype(int)
    axm.set_xticks(ticks)
    axm.set_xticklabels([ist(w.index[i]).strftime("%d %b\n%H:%M") for i in ticks], fontsize=8)
    ax.set_xlim(-1, n + 14)
    fig.savefig(path, dpi=130, bbox_inches="tight")
    plt.close(fig)


# ---------- text ----------
BIAS = {4: "मज़बूत तेज़ी 🟢", 3: "तेज़ी की ओर झुकाव 🟢", 2: "मिला-जुला / साइडवेज़ 🟡",
        1: "मंदी की ओर झुकाव 🔴", 0: "मज़बूत मंदी 🔴"}


def build_caption(name, emoji, tag, a, prefix, dec):
    f = lambda v: f"{prefix}{v:,.{dec}f}"
    word = "तेज़ी 📈" if a["chg1"] > 0 else "गिरावट 📉"
    return (
        f"{emoji} {name} अलर्ट: {word}\n\n"
        f"💰 भाव: {f(a['now'])}\n"
        f"⏱ 1 घंटे में {a['chg1']:+.2f}% | 24 घंटे में {a['chg24']:+.2f}%\n"
        f"📉 20-दिन की ऊँचाई से {a['from_hi']:+.2f}%\n\n"
        f"🧭 कुल संकेत: {BIAS[a['score']]}\n"
        f"🟢 सपोर्ट {f(a['sups'][0][0])} | 🔴 रेज़िस्टेंस {f(a['ress'][0][0])}\n\n"
        "👇 नीचे आसान भाषा में पूरा विश्लेषण\n\n"
        f"{tag}"
    )[:1020]


def build_explain(name, a, prefix, dec):
    f = lambda v: f"{prefix}{v:,.{dec}f}"
    s1, r1 = a["sups"][0][0], a["ress"][0][0]
    s2 = a["sups"][1][0] if len(a["sups"]) > 1 else None
    r2 = a["ress"][1][0] if len(a["ress"]) > 1 else None
    now = a["now"]
    e20, e50 = float(a["e20"].iloc[-1]), float(a["e50"].iloc[-1])
    rv = float(a["rsi"].iloc[-1])

    if abs(a["chg1"]) > 2 * a["sd"]:
        speed = "यह चाल अचानक और सामान्य से कहीं तेज़ है, आम तौर पर बड़ी ख़बर या बड़े ऑर्डर से ऐसा होता है।"
    else:
        speed = "यह चाल सामान्य दायरे में है, कोई अचानक झटका नहीं दिखता।"

    if now > e50 and e20 > e50:
        trend = (f"भाव दोनों औसतों (EMA20 {f(e20)}, EMA50 {f(e50)}) के ऊपर है और छोटी औसत बड़ी से ऊपर है। "
                 "आसान भाषा में: बाज़ार की चाल अभी ऊपर की तरफ़ है।")
    elif now < e50 and e20 < e50:
        trend = (f"भाव दोनों औसतों (EMA20 {f(e20)}, EMA50 {f(e50)}) के नीचे है और छोटी औसत बड़ी से नीचे है। "
                 "आसान भाषा में: बाज़ार की चाल अभी नीचे की तरफ़ है।")
    else:
        trend = (f"भाव औसतों (EMA20 {f(e20)}, EMA50 {f(e50)}) के बीच उलझा है। "
                 "आसान भाषा में: बाज़ार अभी दिशा तय नहीं कर पाया है।")

    if rv < 30:
        rs = f"RSI {rv:.0f}: बहुत ज़्यादा बिकवाली हो चुकी है, इसलिए यहाँ से उछाल बन सकता है, पर पक्का नहीं।"
    elif rv > 70:
        rs = f"RSI {rv:.0f}: बहुत ज़्यादा ख़रीदारी हो चुकी है, इसलिए यहाँ नरमी आ सकती है, पर पक्का नहीं।"
    else:
        rs = f"RSI {rv:.0f}: सामान्य ज़ोन (30 से 70 के बीच), न ज़्यादा ख़रीदा न ज़्यादा बेचा गया।"

    if a["cross"] == "up":
        mc = "MACD ने अभी-अभी ऊपर की तरफ़ कटान बनाई है, यह तेज़ी की शुरुआत का संकेत हो सकता है।"
    elif a["cross"] == "down":
        mc = "MACD ने अभी-अभी नीचे की तरफ़ कटान बनाई है, यह कमज़ोरी की शुरुआत का संकेत हो सकता है।"
    elif float(a["hist"].iloc[-1]) > 0:
        mc = "MACD पॉज़िटिव है, यानी तेज़ी की ताक़त बनी हुई है।"
    else:
        mc = "MACD नेगेटिव है, यानी बेचने वालों का दबाव बना हुआ है।"

    if a["vol_x"] is None:
        vl = "इस बाज़ार का वॉल्यूम डेटा उपलब्ध नहीं है।"
    elif a["vol_x"] >= 1.5:
        vl = f"वॉल्यूम सामान्य से {a['vol_x']:.1f} गुना है, यानी इस चाल के पीछे बड़ी भागीदारी है, इसे गंभीरता से लो।"
    elif a["vol_x"] < 0.7:
        vl = f"वॉल्यूम सामान्य का सिर्फ़ {a['vol_x']:.1f} गुना है, यानी चाल के पीछे दम कम है।"
    else:
        vl = "वॉल्यूम सामान्य है।"

    up = f"अगर भाव {f(r1)} के ऊपर 4 घंटे की मोमबत्ती बंद करके टिके, तो तेज़ी आगे बढ़ सकती है"
    up += f" (अगला रुकावट वाला स्तर {f(r2)})।" if r2 else "।"
    dn = f"अगर भाव {f(s1)} के नीचे बंद हो जाए, तो कमज़ोरी बढ़ सकती है"
    dn += f" (अगला सहारा {f(s2)})।" if s2 else "।"

    txt = (
        f"📘 {name} का पूरा विश्लेषण (आसान भाषा में)\n\n"
        f"1️⃣ अभी क्या हुआ\n"
        f"भाव {f(now)} है। 1 घंटे में {a['chg1']:+.2f}% और 24 घंटे में {a['chg24']:+.2f}% बदला। "
        f"पिछले 20 दिनों की सबसे ऊँची क़ीमत {f(a['hi'])} थी और सबसे नीची {f(a['lo'])}; "
        f"ऊँचाई से अब {a['from_hi']:+.2f}% और नीचाई से {a['from_lo']:+.2f}% पर है।\n{speed}\n\n"
        f"2️⃣ रुझान (ट्रेंड)\n{trend}\n\n"
        f"3️⃣ सपोर्ट और रेज़िस्टेंस\n"
        f"सपोर्ट यानी वह भाव जहाँ पहले गिरावट रुकी थी (फ़र्श)। रेज़िस्टेंस यानी वह भाव जहाँ चढ़ाई रुकी थी (छत)।\n"
        f"🟢 नज़दीकी सपोर्ट: {f(s1)}" + (f" और {f(s2)}" if s2 else "") + "\n"
        f"🔴 नज़दीकी रेज़िस्टेंस: {f(r1)}" + (f" और {f(r2)}" if r2 else "") + "\n"
        "(चार्ट में हरी और लाल पट्टियाँ यही हैं। कोष्ठक का 2x या 3x बताता है कि इस स्तर को कितनी बार छुआ गया, जितना ज़्यादा उतना मज़बूत।)\n\n"
        f"4️⃣ RSI (ताक़त नापने वाला)\n{rs}\n\n"
        f"5️⃣ MACD (रफ़्तार नापने वाला)\n{mc}\n\n"
        f"6️⃣ वॉल्यूम (कितने लोग शामिल)\n{vl}\n\n"
        f"7️⃣ ताज़ा मोमबत्ती\n{a['pattern']}\n\n"
        f"8️⃣ आगे क्या देखें\n🔺 {up}\n🔻 {dn}\n\n"
        f"🧭 कुल संकेत: {BIAS[a['score']]} (4 में से {a['score']} संकेत तेज़ी की तरफ़)\n\n"
        "⚠️ यह सिर्फ़ शिक्षा और जानकारी के लिए है, ख़रीदने या बेचने की सलाह नहीं। "
        "बाज़ार में नुकसान हो सकता है, फ़ैसला अपनी ज़िम्मेदारी पर लें।"
    )
    return txt[:4000]


# ---------- telegram ----------
def send_photo(path, caption):
    with open(path, "rb") as fh:
        r = requests.post(f"https://api.telegram.org/bot{TOKEN}/sendPhoto",
                          data={"chat_id": CHAT, "caption": caption},
                          files={"photo": fh}, timeout=60)
    print("photo:", r.status_code, r.text[:100])
    return r.ok


def send_text(text):
    r = requests.post(f"https://api.telegram.org/bot{TOKEN}/sendMessage",
                      data={"chat_id": CHAT, "text": text}, timeout=60)
    print("text:", r.status_code, r.text[:100])
    return r.ok


def main():
    sent = 0
    for name, emoji, symbol, tag, limit, prefix, dec in MARKETS:
        try:
            d1 = get_hourly(symbol)
            d4 = to_4h(d1)
            if len(d4) < 60:
                print(name, "data kam hai")
                continue
            a = analyse(d1, d4)
            print(name, round(a["now"], 4), f"1h {a['chg1']:+.2f}%", f"24h {a['chg24']:+.2f}%")
            if MODE != "all" and abs(a["chg1"]) < limit:
                continue
            path = f"chart_{symbol.replace('^', '').replace('=', '')}.png"
            make_chart(d4, a, name, dec, path)
            if send_photo(path, build_caption(name, emoji, tag, a, prefix, dec)):
                send_text(build_explain(name, a, prefix, dec) + f"\n\n{tag}")
                sent += 1
        except Exception as e:
            print(name, "error:", type(e).__name__, e)
    print("bheje gaye alert:", sent)


if __name__ == "__main__":
    main()
