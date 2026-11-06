"""Pro-level data: ADX, ATR, Bollinger, EMA200, pivots, pichhle din/hafte ke star, Fibonacci,
RSI divergence, session, agli khabar, Fear&Greed, confluence score aur trade-plan."""
import datetime as dt
import numpy as np
import pandas as pd
import requests
import alerts_v3 as A


def atr_series(d, n=14):
    pc = d["c"].shift()
    tr = pd.concat([d["h"] - d["l"], (d["h"] - pc).abs(), (d["l"] - pc).abs()], axis=1).max(axis=1)
    return tr.ewm(alpha=1 / n, adjust=False).mean()


def adx(d, n=14):
    up, dn = d["h"].diff(), -d["l"].diff()
    pdm = np.where((up > dn) & (up > 0), up, 0.0)
    mdm = np.where((dn > up) & (dn > 0), dn, 0.0)
    a = atr_series(d, n)
    pdi = 100 * pd.Series(pdm, index=d.index).ewm(alpha=1 / n, adjust=False).mean() / a
    mdi = 100 * pd.Series(mdm, index=d.index).ewm(alpha=1 / n, adjust=False).mean() / a
    dx = 100 * (pdi - mdi).abs() / (pdi + mdi).replace(0, np.nan)
    return float(dx.ewm(alpha=1 / n, adjust=False).mean().iloc[-1]), float(pdi.iloc[-1]), float(mdi.iloc[-1])


def bollinger(c, n=20, k=2):
    m, s = c.rolling(n).mean(), c.rolling(n).std()
    up, lo = m + k * s, m - k * s
    pb = float((c.iloc[-1] - lo.iloc[-1]) / (up.iloc[-1] - lo.iloc[-1]))
    bw = (up - lo) / m
    squeeze = bool(bw.iloc[-1] <= bw.dropna().tail(100).quantile(0.2))
    return float(up.iloc[-1]), float(lo.iloc[-1]), pb, squeeze


def pivots(row):
    h, l, c = float(row["h"]), float(row["l"]), float(row["c"])
    p = (h + l + c) / 3
    return dict(P=p, R1=2 * p - l, S1=2 * p - h, R2=p + (h - l), S2=p - (h - l))


def fib_levels(a):
    hi, lo = a["hi"], a["lo"]
    up_leg = a["ilo"] < a["ihi"]       # pehle neecha phir ooncha = upar ki chaal
    out = {}
    for r in (0.382, 0.5, 0.618):
        out[r] = hi - r * (hi - lo) if up_leg else lo + r * (hi - lo)
    return up_leg, out


def divergence(d4):
    w = d4.tail(40)
    if len(w) < 40:
        return None
    r = A.rsi(d4["c"]).reindex(w.index)
    a, b = w.iloc[:20], w.iloc[20:]
    ra, rb = r.iloc[:20], r.iloc[20:]
    if b["l"].min() < a["l"].min() and rb.min() > ra.min():
        return "bull"
    if b["h"].max() > a["h"].max() and rb.max() < ra.max():
        return "bear"
    return None


def session_text(now=None):
    now = now or dt.datetime.now(dt.timezone.utc)
    h = now.hour + now.minute / 60
    s = []
    if 0 <= h < 9:
        s.append("एशिया")
    if 7 <= h < 16:
        s.append("लंदन")
    if 12.5 <= h < 21:
        s.append("न्यूयॉर्क")
    if not s:
        return "सत्र: बाज़ार शांत (एशिया खुलने का इंतज़ार)"
    extra = " · दो सत्र मिल रहे हैं, चाल तेज़ रह सकती है" if len(s) > 1 else ""
    return "सत्र: " + " + ".join(s) + extra


def fear_greed():
    try:
        j = requests.get("https://api.alternative.me/fng/?limit=1", timeout=15).json()["data"][0]
        v = int(j["value"])
        return v, j["value_classification"]
    except Exception:
        return None


def next_news(events, cur_list):
    now = dt.datetime.now(dt.timezone.utc)
    fut = sorted([e for e in events if e["t"] > now and e["cur"] in cur_list], key=lambda e: e["t"])
    if not fut:
        return None
    e = fut[0]
    mins = int((e["t"] - now).total_seconds() // 60)
    left = f"{mins // 60} घंटे {mins % 60} मिनट" if mins >= 60 else f"{mins} मिनट"
    return f"{e['title']} ({e['cur']}) — {A.ist(e['t']).strftime('%d %b, %I:%M %p')} भारत, {left} बाद"


def confluence(a, tfs, d4, adx_v, pdi, mdi):
    """Kitne sanket tezi / mandi ki taraf. Har ek -1, 0, +1."""
    sig = []
    ups = sum(1 for _, s, _ in tfs if s == "up")
    dns = sum(1 for _, s, _ in tfs if s == "down")
    sig.append(("टाइमफ़्रेम की सहमति", 1 if ups > dns else -1 if dns > ups else 0))
    c = float(d4["c"].iloc[-1])
    e200 = float(A.ema(d4["c"], 200).iloc[-1])
    sig.append(("भाव EMA200 के " + ("ऊपर" if c > e200 else "नीचे"), 1 if c > e200 else -1))
    sig.append(("EMA20 बनाम EMA50", 1 if float(a["e20"].iloc[-1]) > float(a["e50"].iloc[-1]) else -1))
    sig.append(("MACD हिस्टोग्राम", 1 if float(a["hist"].iloc[-1]) > 0 else -1))
    rv = float(a["rsi"].iloc[-1])
    sig.append(("RSI " + f"{rv:.0f}", 1 if rv > 55 else -1 if rv < 45 else 0))
    sig.append(("ADX दिशा (+DI/-DI)", (1 if pdi > mdi else -1) if adx_v >= 20 else 0))
    return sig


def trade_plan(a, d1, bias, f, prefix, dec):
    """Tezi ya mandi ki ek poori yojana: entry / SL / lakshya / RR / matra."""
    atr1 = float(atr_series(d1).iloc[-1])
    now = a["now"]
    s1 = a["sups"][0][0]
    r1 = a["ress"][0][0]
    s2 = a["sups"][1][0] if len(a["sups"]) > 1 else s1 - 2 * atr1
    r2 = a["ress"][1][0] if len(a["ress"]) > 1 else r1 + 2 * atr1
    pad = 0.5 * atr1
    out = []

    def block(title, entry, sl, t1, t2):
        risk = abs(entry - sl)
        if risk <= 0:
            return None
        rr1, rr2 = abs(t1 - entry) / risk, abs(t2 - entry) / risk
        qty = 1000 / risk
        verdict = "✅ अच्छा अनुपात" if rr1 >= 1.5 else "⚠️ अनुपात कम, ऐसा ट्रेड छोड़ना बेहतर"
        return (f"{title}\n   Entry: {f(entry)}\n   Stop Loss: {f(sl)}  (जोखिम {f(risk)})\n"
                f"   लक्ष्य 1: {f(t1)}  (1:{rr1:.1f})\n   लक्ष्य 2: {f(t2)}  (1:{rr2:.1f})\n"
                f"   {verdict}\n   मात्रा का हिसाब: 1,000 जोखिम पर {qty:,.2f} इकाई")

    long_entry = max(r1, now)
    short_entry = min(s1, now)
    lg = block("📈 तेज़ी की योजना (ब्रेकआउट: कैंडल बंद हो तब)", long_entry, s1 - pad if now - s1 < 3 * atr1 else long_entry - 1.5 * atr1, r2, r2 + (r2 - r1))
    sh = block("📉 मंदी की योजना (ब्रेकडाउन: कैंडल बंद हो तब)", short_entry, r1 + pad if r1 - now < 3 * atr1 else short_entry + 1.5 * atr1, s2, s2 - (s1 - s2))
    pu = block("🔁 पुलबैक वाली तेज़ी (सपोर्ट पर टिकने पर)", s1, s1 - pad, r1, r2)
    pd_ = block("🔁 पुलबैक वाली मंदी (रेज़िस्टेंस पर रुकने पर)", r1, r1 + pad, s1, s2)
    if bias > 0:
        order = [pu, lg, sh]
        head = "झुकाव तेज़ी की तरफ़, इसलिए पुलबैक पर ख़रीदना पहले सोचो।"
    elif bias < 0:
        order = [pd_, sh, lg]
        head = "झुकाव मंदी की तरफ़, इसलिए उछाल पर बेचना पहले सोचो।"
    else:
        order = [lg, sh]
        head = "बाज़ार असमंजस में है, ब्रेकआउट का इंतज़ार करो।"
    return head + "\n\n" + "\n\n".join(x for x in order if x), atr1


def dashboard(name, emoji, tag, a, d1, d4, dday, dweek, tfs, f, prefix, dec, news, is_crypto, fg):
    now = a["now"]
    adx_v, pdi, mdi = adx(d4)
    atr1 = float(atr_series(d1).iloc[-1])
    atr4 = float(atr_series(d4).iloc[-1])
    bu, bl, pb, sq = bollinger(d4["c"])
    e200 = float(A.ema(d4["c"], 200).iloc[-1])
    sig = confluence(a, tfs, d4, adx_v, pdi, mdi)
    score = sum(v for _, v in sig)
    n_up = sum(1 for _, v in sig if v > 0)
    n_dn = sum(1 for _, v in sig if v < 0)
    bias = 1 if score >= 2 else -1 if score <= -2 else 0
    meter = "🟩" * n_up + "⬜" * (len(sig) - n_up - n_dn) + "🟥" * n_dn

    strength = ("कमज़ोर / रेंज" if adx_v < 20 else "बन रहा है" if adx_v < 25 else "मज़बूत" if adx_v < 40 else "बहुत मज़बूत")
    regime = ("🔸 सिकुड़न: बॉलिंजर बैंड तंग हैं, जल्द बड़ी चाल आ सकती है, दिशा अभी पता नहीं" if sq
              else "🔸 ट्रेंडिंग बाज़ार: ट्रेंड के साथ चलना आसान" if adx_v >= 25 else "🔸 रेंज बाज़ार: सपोर्ट पर लेना, रेज़िस्टेंस पर निकलना बेहतर")
    bbpos = "ऊपरी बैंड के पास" if pb > 0.85 else "निचले बैंड के पास" if pb < 0.15 else "बीच में"

    lines = [f"🧪 {name} — प्रो डैशबोर्ड\n"]
    lines.append(f"🎯 सहमति मीटर: {meter}  ({n_up} तेज़ी · {n_dn} मंदी · {len(sig) - n_up - n_dn} तटस्थ)")
    lines.append("\n".join(("   " + ("🟢" if v > 0 else "🔴" if v < 0 else "⚪") + " " + t) for t, v in sig))
    lines.append(f"\n📐 ट्रेंड की ताक़त (ADX {adx_v:.0f}): {strength}\n   +DI {pdi:.0f} | -DI {mdi:.0f}")
    lines.append(regime)
    lines.append(f"\n🌊 उतार-चढ़ाव: 1 घंटे की औसत चाल {f(atr1)} ({atr1 / now * 100:.2f}%), 4 घंटे की {f(atr4)}")
    lines.append(f"🎢 बॉलिंजर: {f(bl)} से {f(bu)}, भाव {bbpos}")
    lines.append(f"📏 EMA200 (4घं): {f(e200)}, भाव {'ऊपर' if now > e200 else 'नीचे'} ({(now - e200) / e200 * 100:+.1f}%)")
    dv = divergence(d4)
    if dv == "bull":
        lines.append("🔔 RSI डाइवर्जेंस: भाव नई नीचाई पर पर RSI ऊँची नीचाई पर, मंदी की ताक़त घट रही है (तेज़ी का संकेत)")
    elif dv == "bear":
        lines.append("🔔 RSI डाइवर्जेंस: भाव नई ऊँचाई पर पर RSI नीची ऊँचाई पर, तेज़ी की ताक़त घट रही है (मंदी का संकेत)")

    # key levels
    lv = ["\n🗺 ज़रूरी स्तर"]
    try:
        pv = pivots(dday.iloc[-2])
        lv.append(f"   कल: ऊँचा {f(float(dday['h'].iloc[-2]))} | नीचा {f(float(dday['l'].iloc[-2]))} | बंद {f(float(dday['c'].iloc[-2]))}")
        lv.append(f"   पिवट: R2 {f(pv['R2'])} · R1 {f(pv['R1'])} · P {f(pv['P'])} · S1 {f(pv['S1'])} · S2 {f(pv['S2'])}")
    except Exception:
        pass
    try:
        lv.append(f"   पिछला हफ़्ता: ऊँचा {f(float(dweek['h'].iloc[-2]))} | नीचा {f(float(dweek['l'].iloc[-2]))}")
    except Exception:
        pass
    up_leg, fb = fib_levels(a)
    lv.append("   फ़िबोनाची (" + ("ऊपर की चाल की वापसी" if up_leg else "नीचे की चाल की वापसी") + "): "
              + " · ".join(f"{int(r * 1000) / 10}% {f(v)}" for r, v in fb.items()))
    lines.append("\n".join(lv))

    if is_crypto and fg:
        lines.append(f"\n😱 Fear & Greed: {fg[0]}/100 ({fg[1]})")
    lines.append("\n🕐 " + session_text())
    if news:
        lines.append("📰 अगली बड़ी खबर: " + news)

    plan, _ = trade_plan(a, d1, bias, f, prefix, dec)
    lines.append("\n━━━━━━━━━━\n🎯 ट्रेड की योजना (उदाहरण, सलाह नहीं)\n\n" + plan)
    lines.append("\n✅ नियम: एक ट्रेड में पूँजी का 1% से ज़्यादा जोखिम नहीं। Stop Loss पहले। अनुपात 1:2 से कम हो तो छोड़ दो।\n"
                 "⚠️ यह सिर्फ़ पढ़ाई के लिए है। नुकसान हो सकता है, फ़ैसला अपनी ज़िम्मेदारी पर।\n" + tag)
    return "\n".join(lines)[:4000], bias
