"""Badi khabar se ~2 minute pehle Telegram par chetavni + chart + vishleshan.
GitHub Actions har 30 minute chalta hai, agle ~45 minute ki badi khabrein dekhta hai,
sahi samay tak ruka rehta hai aur T-2 minute par bhejta hai."""
import os, json, time, datetime as dt
import requests
import alerts_v3 as A

FEED = "https://nfs.faireconomy.media/ff_calendar_thisweek.json"
LEAD = int(os.environ.get("LEAD_MIN", "2"))        # khabar se kitne minute pehle
LOOK = int(os.environ.get("LOOK_MIN", "45"))       # kitni der aage tak dekhna
SENT_FILE = "sent_news.json"
TEST = os.environ.get("TEST_NEWS", "")             # "1" = abhi ek namuna bhejo

# kaunsi currency ki khabar kin markets ko hilati hai
AFFECT = {
    "USD": ["BITCOIN", "ETHEREUM", "GOLD", "EUR/USD", "NASDAQ"],
    "EUR": ["EUR/USD"],
}
EXPLAIN = [
    (("cpi", "inflation"), "महँगाई का आँकड़ा। अनुमान से ज़्यादा आए तो ब्याज दर घटने की उम्मीद कम होती है, और बाज़ार अक्सर तेज़ी से हिलता है।"),
    (("non-farm", "nfp", "employment change"), "अमेरिका में नई नौकरियों का आँकड़ा। यह डॉलर, सोने और Crypto, तीनों को तेज़ी से हिला सकता है।"),
    (("federal funds", "fomc", "interest rate", "rate statement", "rate decision"), "ब्याज दर का फ़ैसला। यह सबसे बड़ी ख़बरों में से एक है, चाल बहुत तेज़ और उलटी-पुलटी हो सकती है।"),
    (("speaks", "testifies", "press conference"), "बड़े अधिकारी का बयान। एक-एक शब्द पर भाव झटके से बदल सकता है।"),
    (("unemployment", "jobless"), "बेरोज़गारी का आँकड़ा। नौकरियों की तस्वीर से डॉलर की चाल तय होती है।"),
    (("gdp",), "अर्थव्यवस्था की रफ़्तार का आँकड़ा। बाज़ार इस पर सोच बदल सकता है।"),
    (("retail sales", "ppi"), "ख़रीदारी या थोक महँगाई का आँकड़ा। अनुमान से फ़र्क़ आए तो चाल तेज़ हो सकती है।"),
]


def explain(title):
    t = title.lower()
    for keys, txt in EXPLAIN:
        if any(k in t for k in keys):
            return txt
    return "यह बड़ी ख़बर है। आँकड़ा अनुमान से अलग आए तो बाज़ार में तेज़ हलचल हो सकती है।"


def load_events():
    r = requests.get(FEED, timeout=30, headers={"User-Agent": "Mozilla/5.0"})
    r.raise_for_status()
    out = []
    for e in r.json():
        if e.get("impact") != "High" or e.get("country") not in AFFECT:
            continue
        t = dt.datetime.fromisoformat(e["date"]).astimezone(dt.timezone.utc)
        out.append(dict(id=f"{e['date']}|{e['title']}|{e['country']}", t=t, title=e["title"],
                        cur=e["country"], fc=e.get("forecast") or "—", pv=e.get("previous") or "—"))
    return out


def load_sent():
    try:
        return set(json.load(open(SENT_FILE)))
    except Exception:
        return set()


def save_sent(s):
    json.dump(sorted(s)[-300:], open(SENT_FILE, "w"))



REL = {  # khabar (USD) ka har market par aam asar
    "BITCOIN": "डॉलर मज़बूत हुआ तो Crypto अक्सर दबता है, कमज़ोर हुआ तो चढ़ता है।",
    "ETHEREUM": "Bitcoin के साथ चलता है, पर चाल उससे तेज़ और झटकेदार होती है।",
    "GOLD": "डॉलर और ब्याज दर चढ़ें तो सोना अक्सर गिरता है, घटें तो चढ़ता है।",
    "EUR/USD": "अमेरिकी आँकड़ा मज़बूत आए तो डॉलर चढ़ता है और EUR/USD गिरता है।",
    "NASDAQ": "ब्याज दर बढ़ने की आशंका से टेक शेयर अक्सर गिरते हैं।",
}


def dl(symbol, period, interval):
    df = A.yf.download(symbol, period=period, interval=interval, progress=False, auto_adjust=True)
    if hasattr(df.columns, "get_level_values") and getattr(df.columns, "nlevels", 1) > 1:
        df.columns = df.columns.get_level_values(0)
    df = df[["Open", "High", "Low", "Close", "Volume"]].dropna()
    df.columns = ["o", "h", "l", "c", "v"]
    return df


def tf_state(df):
    c = df["c"]
    if len(c) < 30:
        return None
    e20, e50, r = A.ema(c, 20), A.ema(c, 50), float(A.rsi(c).iloc[-1])
    now, a, b = float(c.iloc[-1]), float(e20.iloc[-1]), float(e50.iloc[-1])
    if now > b and a > b:
        st = "🟢 तेज़ी"
    elif now < b and a < b:
        st = "🔴 मंदी"
    else:
        st = "🟡 साइडवेज़"
    return f"{st} (RSI {r:.0f})"


def tf_table(symbol, d1, d4):
    rows = []
    jobs = [("5 मिनट", lambda: dl(symbol, "5d", "5m")), ("15 मिनट", lambda: dl(symbol, "10d", "15m")),
            ("1 घंटा", lambda: d1), ("4 घंटे", lambda: d4),
            ("1 दिन", lambda: dl(symbol, "1y", "1d")), ("1 हफ़्ता", lambda: dl(symbol, "5y", "1wk"))]
    for name, fn in jobs:
        try:
            st = tf_state(fn())
        except Exception as e:
            st = None
        if st:
            rows.append(f"{name}: {st}")
    return rows


def atr(d, n=14):
    pc = d["c"].shift()
    tr = (d["h"] - d["l"]).combine((d["h"] - pc).abs(), max).combine((d["l"] - pc).abs(), max)
    return float(tr.rolling(n).mean().iloc[-1])


def plan(a, d1, f):
    """Ek udaharan yojana: kis star ke upar/neeche band hone par kya sochna hai."""
    risk = 1.2 * atr(d1)
    up, dn = a["ress"][0][0], a["sups"][0][0]
    now = a["now"]
    lines = []
    lines.append(f"📈 अगर कैंडल {f(up)} के ऊपर बंद हो (तेज़ी का ब्रेकआउट):\n"
                 f"   • Entry का विचार: {f(up)} के आसपास\n"
                 f"   • Stop Loss: {f(up - risk)}\n"
                 f"   • लक्ष्य 1: {f(up + risk)} | लक्ष्य 2: {f(up + 2 * risk)}")
    lines.append(f"📉 अगर कैंडल {f(dn)} के नीचे बंद हो (मंदी का ब्रेकडाउन):\n"
                 f"   • Entry का विचार: {f(dn)} के आसपास\n"
                 f"   • Stop Loss: {f(dn + risk)}\n"
                 f"   • लक्ष्य 1: {f(dn - risk)} | लक्ष्य 2: {f(dn - 2 * risk)}")
    lines.append(f"⏸ दोनों स्तरों के बीच ({f(dn)} से {f(up)}) में बने रहें तो इंतज़ार करो।")
    return "\n\n".join(lines), risk


def context_notes(a):
    notes = []
    r = float(a["rsi"].iloc[-1])
    if r < 30:
        notes.append(f"⚠️ RSI {r:.0f} है, यानी बिकवाली ज़्यादा हो चुकी (Oversold)। उछाल आ सकता है, पर मंदी के ट्रेंड में नीचे भी टिक सकता है।")
    elif r > 70:
        notes.append(f"⚠️ RSI {r:.0f} है, यानी ख़रीदारी ज़्यादा हो चुकी (Overbought)। नरमी आ सकती है।")
    if abs(a["chg24"]) >= 3:
        notes.append(f"⚠️ पिछले 24 घंटे में {a['chg24']:+.1f}% की बड़ी चाल आ चुकी है। ख़बर पर चाल और तेज़ हो सकती है।")
    if a.get("vol_x") and a["vol_x"] > 1.8:
        notes.append(f"🔊 आख़िरी 4 घंटे का वॉल्यूम औसत से {a['vol_x']:.1f} गुना है, यानी इस चाल में दम है।")
    return notes


def header(ev):
    ist = A.ist(ev["t"]).strftime("%I:%M %p")
    mins = max(0, round((ev["t"] - dt.datetime.now(dt.timezone.utc)).total_seconds() / 60))
    return (
        f"⚠️ बड़ी ख़बर {mins} मिनट में\n\n"
        f"📰 {ev['title']} ({ev['cur']})\n"
        f"🕐 समय: {ist} (भारत)\n"
        f"📊 अनुमान: {ev['fc']} | पिछला: {ev['pv']}\n\n"
        f"ℹ️ {explain(ev['title'])}\n\n"
        "🛡 ख़बर के समय क्या ध्यान रखें:\n"
        "• स्प्रेड बढ़ जाता है और भाव छलाँग मार सकता है।\n"
        "• Stop Loss अपेक्षा से दूर लग सकता है, स्लिपेज हो सकता है।\n"
        "• नया ट्रेड ख़बर के बाद पहली कुछ कैंडल देखकर ही लो।\n"
        "• लीवरेज कम रखो या ट्रेड से दूर रहो।\n\n"
        "नीचे हर मार्केट का चार्ट और सपोर्ट-रेज़िस्टेंस आ रहे हैं 👇\n"
        "⚠️ यह सिर्फ़ पढ़ाई के लिए है, ट्रेडिंग की सलाह नहीं।\n#News #Alert"
    )


def market_post(ev, name):
    for n, emoji, symbol, tag, limit, prefix, dec in A.MARKETS:
        if n != name:
            continue
        d1 = A.get_hourly(symbol)
        d4 = A.to_4h(d1)
        a = A.analyse(d1, d4)
        PRE[n] = a["now"]
        path = f"news_{symbol.replace('^', '').replace('=', '')}.png"
        A.make_chart(d4, a, n, dec, path)
        f = lambda v: f"{prefix}{v:,.{dec}f}"
        cap = (f"{emoji} {n}: ख़बर से पहले का हाल\n\n"
               f"💰 भाव: {f(a['now'])}\n"
               f"⏱ 1 घंटे में {a['chg1']:+.2f}% | 24 घंटे में {a['chg24']:+.2f}%\n"
               f"🧭 कुल संकेत: {A.BIAS[a['score']]}\n"
               f"🟢 सपोर्ट {f(a['sups'][0][0])} | 🔴 रेज़िस्टेंस {f(a['ress'][0][0])}\n\n"
               f"👇 नीचे हर टाइमफ़्रेम और ट्रेड-योजना\n{tag}")[:1020]
        A.send_photo(path, cap)
        tfr = tf_table(symbol, d1, d4)
        pl, risk = plan(a, d1, f)
        notes = context_notes(a)
        txt = (f"📋 {n} — ट्रेड की तैयारी\n\n"
               + ("🕰 हर टाइमफ़्रेम पर हाल:\n" + "\n".join(tfr) + "\n\n" if tfr else "")
               + (("\n".join(notes) + "\n\n") if notes else "")
               + f"🔗 ख़बर का असर: {REL.get(n, '')}\n\n"
               + "🎯 उदाहरण योजना (सलाह नहीं):\n\n" + pl + "\n\n"
               + f"📏 यहाँ जोखिम का आकार 1 घंटे की औसत चाल (ATR) का 1.2 गुना, यानी {f(risk)} लिया है।\n\n"
               + "✅ याद रखो:\n"
               + "• ख़बर आते ही कूदो मत। कैंडल बंद होने का इंतज़ार करो।\n"
               + "• एक ट्रेड में पूँजी का 1% से ज़्यादा जोखिम मत लो।\n"
               + "• Stop Loss ट्रेड लेने से पहले लगाओ।\n\n"
               + f"⚠️ यह सिर्फ़ पढ़ाई के लिए एक उदाहरण है, ख़रीद-बिक्री की सलाह नहीं।\n{tag}")
        A.send_text(txt[:4000])
        return


PRE = {}


def after(ev):
    """Khabar ke baad: asli aankda aur bhav ki pratikriya."""
    for wait_min in (3, 7):
        t = ev["t"] + dt.timedelta(minutes=wait_min)
        w = (t - dt.datetime.now(dt.timezone.utc)).total_seconds()
        if w > 0:
            time.sleep(w)
        try:
            r = requests.get(FEED, timeout=30, headers={"User-Agent": "Mozilla/5.0"})
            cur = [e for e in r.json() if e["title"] == ev["title"] and e["country"] == ev["cur"]
                   and e["date"] == ev["id"].split("|")[0]]
            actual = (cur[0].get("actual") or "").strip() if cur else ""
        except Exception:
            actual = ""
        if actual:
            break
    if not actual:
        return
    lines = []
    for n in AFFECT[ev["cur"]]:
        try:
            for nm, emoji, symbol, tag, limit, prefix, dec in A.MARKETS:
                if nm == n and n in PRE:
                    d1 = A.get_hourly(symbol)
                    now = float(d1["c"].iloc[-1])
                    ch = (now - PRE[n]) / PRE[n] * 100
                    lines.append(f"{emoji} {n}: {ch:+.2f}% ({'तेज़ी' if ch > 0.005 else 'गिरावट' if ch < -0.005 else 'लगभग स्थिर'})")
        except Exception as e:
            print(n, "after error:", e)
    txt = (f"📣 ख़बर आ गई: {ev['title']} ({ev['cur']})\n\n"
           f"🔢 असली आँकड़ा: {actual}\n📊 अनुमान: {ev['fc']} | पिछला: {ev['pv']}\n\n"
           + ("ख़बर से पहले के भाव से अब तक:\n" + "\n".join(lines) + "\n\n" if lines else "")
           + "⏳ पहली चाल अक्सर झूठी निकलती है। कुछ कैंडल बंद होने दो और ऊपर की योजना के स्तर देखो।\n"
           "⚠️ सिर्फ़ पढ़ाई के लिए, सलाह नहीं।\n#News")
    A.send_text(txt)


def fire(ev):
    A.send_text(header(ev))
    for n in AFFECT[ev["cur"]]:
        try:
            market_post(ev, n)
        except Exception as e:
            print(n, "error:", type(e).__name__, e)


def main():
    if TEST:
        ev = dict(id="test", t=dt.datetime.now(dt.timezone.utc) + dt.timedelta(minutes=2),
                  title="CPI y/y (नमूना)", cur="USD", fc="3.1%", pv="3.2%")
        fire(ev)
        return
    now = dt.datetime.now(dt.timezone.utc)
    sent = load_sent()
    todo = [e for e in load_events()
            if e["id"] not in sent and
            now - dt.timedelta(minutes=1) <= e["t"] - dt.timedelta(minutes=LEAD) <= now + dt.timedelta(minutes=LOOK)]
    todo.sort(key=lambda e: e["t"])
    print("aane wali badi khabrein:", [(e["title"], e["t"].isoformat()) for e in todo])
    for ev in todo:
        wait = (ev["t"] - dt.timedelta(minutes=LEAD) - dt.datetime.now(dt.timezone.utc)).total_seconds()
        if wait > 0:
            print("ruk raha hoon", int(wait), "second")
            time.sleep(wait)
        fire(ev)
        sent.add(ev["id"])
        save_sent(sent)
        try:
            after(ev)
        except Exception as e:
            print("after error:", e)


if __name__ == "__main__":
    main()
