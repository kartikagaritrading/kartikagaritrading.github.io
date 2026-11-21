"""Badi khabar se ~10 minute pehle Telegram par chetavni + chart + vishleshan.
GitHub Actions har 30 minute chalta hai, agle ~50 minute ki badi khabrein dekhta hai,
sahi samay tak ruka rehta hai aur T-10 minute par bhejta hai."""
import os, json, time, datetime as dt
import html
import requests
import alerts_v3 as A

FEED = "https://nfs.faireconomy.media/ff_calendar_thisweek.json"
LEAD = int(os.environ.get("LEAD_MIN", "10"))        # khabar se kitne minute pehle
LOOK = int(os.environ.get("LOOK_MIN", "50"))       # kitni der aage tak dekhna
SENT_FILE = "sent_news.json"
TEST = os.environ.get("TEST_NEWS", "")             # "1" = abhi ek namuna bhejo

# kaunsi currency ki khabar kin markets ko hilati hai
AFFECT = {
    "USD": ["BITCOIN", "ETHEREUM", "GOLD", "EUR/USD", "NASDAQ"],
    "EUR": ["EUR/USD", "GOLD"],
    "GBP": ["EUR/USD", "GOLD"],
    "JPY": ["GOLD", "NASDAQ"],
    "CNY": ["GOLD", "BITCOIN"],
}
# kis khabar ko bheja jaye: USD ki High aur Medium, baaki mudraon ki sirf High
def wanted(impact, cur):
    return impact == "High" or (impact == "Medium" and cur == "USD")
SITE = "https://kartikagaritrading.github.io"
CURN = {"USD": "डॉलर", "EUR": "यूरो", "GBP": "पाउंड", "JPY": "येन", "CNY": "युआन"}
# (खोजने के शब्द, हिंदी नाम, पूरा नाम, यह क्या है, क्यों ज़रूरी, ज़्यादा आँकड़ा = मुद्रा मज़बूत? +1 / -1 / 0)
NEWS = [
    (("adp",), "ADP निजी नौकरियाँ", "ADP Employment Change",
     "निजी कंपनियों में पिछले महीने कितनी नई नौकरियाँ बनीं, इसका अनुमान। इसे शुक्रवार की बड़ी जॉब रिपोर्ट (NFP) का पहला इशारा माना जाता है।",
     "नौकरियाँ मज़बूत हों तो अर्थव्यवस्था मज़बूत दिखती है और ब्याज दर ऊँची रहने की उम्मीद बनती है।", 1),
    (("core cpi", "cpi"), "CPI: उपभोक्ता महँगाई", "Consumer Price Index",
     "आम लोग जो सामान और सेवाएँ ख़रीदते हैं, उनके दाम पिछले महीने या साल से कितने बढ़े। यह महँगाई नापने का सबसे मशहूर पैमाना है। (Core CPI में खाना और तेल हटा दिए जाते हैं।)",
     "Fed ब्याज दर महँगाई देखकर तय करता है। और ब्याज दर से डॉलर, सोना, Crypto और शेयर, सब हिलते हैं। इसीलिए CPI सबसे तेज़ चाल वाली ख़बरों में है।", 1),
    (("ppi",), "PPI: थोक महँगाई", "Producer Price Index",
     "फ़ैक्ट्री और उत्पादक के स्तर पर दाम कितने बढ़े। दुकान तक पहुँचने से पहले की महँगाई।",
     "अक्सर आगे आने वाली CPI का इशारा देती है।", 1),
    (("pce",), "PCE: Fed की पसंदीदा महँगाई", "Personal Consumption Expenditures Price Index",
     "महँगाई नापने का वह पैमाना, जिसे Fed सबसे ज़्यादा देखता है।",
     "Fed की ब्याज दर की सोच सीधे इससे जुड़ी है।", 1),
    (("non-farm", "nfp"), "NFP: अमेरिका की नौकरी रिपोर्ट", "Non-Farm Payrolls",
     "खेती छोड़कर बाकी सभी क्षेत्रों में पिछले महीने कितनी नई नौकरियाँ बनीं।",
     "मज़बूत नौकरियों का मतलब मज़बूत अर्थव्यवस्था, यानी ब्याज दर ऊँची रह सकती है। यह हर महीने की सबसे तेज़ चाल वाली ख़बरों में से एक है।", 1),
    (("unemployment claims", "jobless"), "साप्ताहिक बेरोज़गारी दावे", "Initial Jobless Claims",
     "इस हफ़्ते कितने लोगों ने बेरोज़गारी भत्ते के लिए पहली बार अर्ज़ी दी।",
     "ज़्यादा दावे यानी नौकरी बाज़ार कमज़ोर, जो अर्थव्यवस्था की सुस्ती दिखा सकता है।", -1),
    (("unemployment rate",), "बेरोज़गारी दर", "Unemployment Rate",
     "काम चाहने वालों में कितने प्रतिशत लोगों के पास काम नहीं है।",
     "बेरोज़गारी बढ़ना अर्थव्यवस्था के लिए कमज़ोर संकेत माना जाता है।", -1),
    (("jolts",), "JOLTS: खाली नौकरियाँ", "Job Openings (JOLTS)",
     "कंपनियों में कितनी नौकरियाँ खाली पड़ी हैं।",
     "ज़्यादा खाली नौकरियाँ यानी मज़बूत माँग और टिकी हुई महँगाई का दबाव।", 1),
    (("minutes",), "FOMC बैठक का ब्योरा", "FOMC Meeting Minutes",
     "Fed की पिछली बैठक में अधिकारियों ने क्या-क्या बहस की, उसका लिखित ब्योरा।",
     "इसमें ब्याज दर की आगे की सोच के संकेत होते हैं। शब्दों से बाज़ार हिल सकता है।", 0),
    (("federal funds", "interest rate", "rate decision", "main refinancing", "bank rate", "cash rate", "official bank"), "ब्याज दर का फ़ैसला", "Central Bank Interest Rate Decision",
     "देश का केंद्रीय बैंक (अमेरिका में Fed) ब्याज दर बढ़ाता है, घटाता है या वैसी ही रखता है।",
     "यह सबसे बड़ी ख़बरों में से एक है। चाल बहुत तेज़ और उलटी-पुलटी हो सकती है, क्योंकि बाज़ार पहले से अनुमान लगा चुका होता है।", 1),
    (("fomc statement", "rate statement", "monetary policy statement"), "FOMC बयान", "FOMC Statement",
     "ब्याज दर के फ़ैसले के साथ आने वाला लिखित बयान।",
     "फ़ैसले से ज़्यादा बयान के शब्द बाज़ार को हिलाते हैं।", 0),
    (("speaks", "testifies", "press conference"), "बड़े अधिकारी का बयान", "Central Bank Speech / Press Conference",
     "केंद्रीय बैंक के बड़े अधिकारी का भाषण या प्रेस कॉन्फ्रेंस।",
     "यहाँ कोई एक आँकड़ा नहीं होता। हर वाक्य पर भाव झटके से बदल सकता है।", 0),
    (("gdp",), "GDP: अर्थव्यवस्था की रफ़्तार", "Gross Domestic Product",
     "देश में एक तिमाही में कुल कितना उत्पादन और कमाई हुई।",
     "अर्थव्यवस्था तेज़ है या सुस्त, यह इसी से दिखता है। इससे बाज़ार की सोच बदलती है।", 1),
    (("retail sales",), "खुदरा बिक्री", "Retail Sales",
     "दुकानों और ऑनलाइन में लोगों ने पिछले महीने कितनी ख़रीदारी की।",
     "अमेरिका की अर्थव्यवस्था का बड़ा हिस्सा ख़रीदारी पर टिका है, इसलिए यह आँकड़ा अहम है।", 1),
    (("ism", "pmi"), "PMI / ISM: कारोबार की सेहत", "Purchasing Managers' Index",
     "कंपनियों के मैनेजरों से पूछकर बना सूचकांक। 50 से ऊपर यानी कारोबार बढ़ रहा है, 50 से नीचे यानी घट रहा है।",
     "यह आने वाली आर्थिक चाल का शुरुआती इशारा देता है।", 1),
]
DEFAULT = ("बड़ी ख़बर", "High-impact news", "यह बड़ी आर्थिक ख़बर है।", "आँकड़ा अनुमान से अलग आए तो बाज़ार में तेज़ हलचल हो सकती है।", 1)


def esc(x):
    return html.escape(str(x), quote=False)


def send_html(txt):
    r = requests.post(f"https://api.telegram.org/bot{A.TOKEN}/sendMessage",
                      data={"chat_id": A.CHAT, "text": txt[:4090], "parse_mode": "HTML",
                            "disable_web_page_preview": "true"}, timeout=60)
    print("html:", r.status_code, r.text[:100])
    if not r.ok:
        A.send_text(html.unescape(txt.replace("<blockquote expandable>", "").replace("</blockquote>", "").replace("<b>", "").replace("</b>", ""))[:4000])
    return r.ok


SHORTS = {
    "ADP Employment Change": "शुक्रवार की जॉब रिपोर्ट का पहला इशारा।",
    "Consumer Price Index": "महँगाई नापने का पैमाना। Fed की ब्याज दर इसी पर टिकी है।",
    "Producer Price Index": "थोक की महँगाई। आगे की CPI का इशारा।",
    "Personal Consumption Expenditures Price Index": "Fed की पसंदीदा महँगाई।",
    "Non-Farm Payrolls": "अमेरिका में कितनी नई नौकरियाँ बनीं।",
    "Initial Jobless Claims": "इस हफ़्ते कितनों ने बेरोज़गारी भत्ता माँगा।",
    "Unemployment Rate": "कितने प्रतिशत लोगों के पास काम नहीं।",
    "Job Openings (JOLTS)": "कंपनियों में कितनी नौकरियाँ खाली हैं।",
    "FOMC Meeting Minutes": "Fed की पिछली बैठक का लिखित ब्योरा।",
    "Central Bank Interest Rate Decision": "ब्याज दर बढ़ी, घटी या वैसी ही रही।",
    "FOMC Statement": "फ़ैसले के साथ आने वाला बयान।",
    "Central Bank Speech / Press Conference": "बड़े अधिकारी का भाषण।",
    "Gross Domestic Product": "देश की कमाई की रफ़्तार।",
    "Retail Sales": "लोगों ने कितनी ख़रीदारी की।",
    "Purchasing Managers' Index": "कारोबार की सेहत (50 से ऊपर = बढ़त)।",
}


def short_scen(cur, sg):
    n = CURN.get(cur, cur)
    if sg == 0:
        return f"🗣 सख़्त लहजा: {n} ऊपर ⬆️\n🗣 नरम लहजा: {n} नीचे ⬇️"
    up, dn = ("ज़्यादा", "कम") if sg > 0 else ("कम", "ज़्यादा")
    if cur == "USD":
        a, b = f"{n} ऊपर ⬆️, सोना और Crypto नीचे ⬇️", f"{n} नीचे ⬇️, सोना और Crypto ऊपर ⬆️"
    else:
        a, b = f"{n} ऊपर ⬆️", f"{n} नीचे ⬇️"
    return f"📈 अनुमान से {up} आए: {a}\n📉 अनुमान से {dn} आए: {b}"


def info(title):
    t = title.lower()
    for keys, hn, en, what, why, sg in NEWS:
        if any(k in t for k in keys):
            return hn, en, what, why, sg
    return DEFAULT


def period_note(title):
    t = title.lower()
    if "y/y" in t:
        return "y/y = पिछले साल की उसी अवधि से तुलना"
    if "m/m" in t:
        return "m/m = पिछले महीने से तुलना"
    if "q/q" in t:
        return "q/q = पिछली तिमाही से तुलना"
    return ""


def explain(title):
    return info(title)[2]


def scen(cur, sg):
    n = CURN.get(cur, cur)
    if sg == 0:
        return (f"🔀 यहाँ शब्द मायने रखते हैं, आँकड़ा नहीं:\n"
                f"• सख़्त (ब्याज दर ऊँची रखने वाला) लहजा हो तो {n} अक्सर मज़बूत\n"
                f"• नरम (ब्याज दर घटाने वाला) लहजा हो तो {n} अक्सर कमज़ोर")
    up, dn = ("ज़्यादा", "कम") if sg > 0 else ("कम", "ज़्यादा")
    if cur == "USD":
        eff_s = "सोना, Crypto, EUR/USD और Nasdaq पर अक्सर दबाव"
        eff_w = "सोना, Crypto, EUR/USD और Nasdaq को अक्सर सहारा"
    else:
        eff_s = f"{n} से जुड़े जोड़े (जैसे EUR/USD) अक्सर चढ़ते हैं" if cur in ("EUR", "GBP") else f"{n} से जुड़े बाज़ार अक्सर चढ़ते हैं"
        eff_w = f"{n} से जुड़े बाज़ार अक्सर गिरते हैं"
    return (f"🔀 अलग-अलग नतीजे:\n"
            f"📈 आँकड़ा अनुमान से {up} आया तो {n} मज़बूत होता है, और {eff_s}\n"
            f"📉 आँकड़ा अनुमान से {dn} आया तो {n} कमज़ोर होता है, और {eff_w}\n"
            f"⚖️ अनुमान के बराबर आया तो चाल अक्सर छोटी रहती है।")


def load_events():
    r = requests.get(FEED, timeout=30, headers={"User-Agent": "Mozilla/5.0"})
    r.raise_for_status()
    out = []
    for e in r.json():
        if e.get("country") not in AFFECT or not wanted(e.get("impact"), e.get("country")):
            continue
        t = dt.datetime.fromisoformat(e["date"]).astimezone(dt.timezone.utc)
        out.append(dict(id=f"{e['date']}|{e['title']}|{e['country']}", t=t, title=e["title"],
                        cur=e["country"], imp=e.get("impact", "High"),
                        fc=e.get("forecast") or "—", pv=e.get("previous") or "—"))
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
    hn, en, what, why, sg = info(ev["title"])
    pn = period_note(ev["title"])
    tag = SHORTS.get(en, "बड़ी आर्थिक ख़बर।")
    parts = [f"{en}" + ("" if ev["title"] == en else f" ({ev['title']})") + (f"\n{pn}" if pn else ""),
             f"📖 यह क्या है: {what}",
             f"🎯 क्यों ज़रूरी: {why}"]
    if sg != 0:
        parts.append("⚖️ अनुमान के बराबर आए तो चाल अक्सर छोटी रहती है।")
        parts.append("💡 बाज़ार आँकड़े के अच्छे या बुरे होने पर नहीं, अनुमान से फ़र्क़ पर चलता है।")
    parts.append("🛡 ख़बर के समय:\n"
                 "• स्प्रेड बढ़ जाता है, भाव छलाँग मार सकता है।\n"
                 "• स्टॉप लॉस दूर लग सकता है, स्लिपेज हो सकता है।\n"
                 "• नया ट्रेड पहली कुछ कैंडल बंद होने के बाद ही लो।\n"
                 "• लीवरेज कम रखो या ट्रेड से दूर रहो।")
    parts.append(f"📚 पूरा पाठ: {SITE}/learn/news-and-calendar/")
    detail = "\n\n".join(parts)
    return (
        f"⚠️ <b>बड़ी ख़बर {mins} मिनट में</b>\n\n"
        f"📰 <b>{esc(hn)}</b> ({esc(ev['cur'])})\n"
        f"🕐 {esc(ist)} (भारत)\n"
        f"📊 अनुमान: {esc(ev['fc'])} | पिछला: {esc(ev['pv'])}\n\n"
        f"💬 {esc(tag)}\n\n"
        f"{esc(short_scen(ev['cur'], sg))}\n\n"
        "🛡 कूदो मत। कैंडल बंद होने का इंतज़ार करो।\n\n"
        "👇 पूरी समझ के लिए \"और पढ़ो\" दबाओ\n"
        f"<blockquote expandable>{esc(detail)}</blockquote>\n"
        "⚠️ सिर्फ़ पढ़ाई के लिए, सलाह नहीं।\n#News #Alert"
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
        body = (("🕰 हर टाइमफ़्रेम पर हाल:\n" + "\n".join(tfr) + "\n\n" if tfr else "")
                + (("\n".join(notes) + "\n\n") if notes else "")
                + f"🔗 ख़बर का असर: {REL.get(n, '')}\n\n"
                + "🎯 उदाहरण योजना (सलाह नहीं):\n\n" + pl + "\n\n"
                + f"📏 जोखिम का आकार: 1 घंटे की औसत चाल (ATR) का 1.2 गुना, यानी {f(risk)}।\n\n"
                + "✅ याद रखो:\n"
                + "• ख़बर आते ही कूदो मत, कैंडल बंद होने का इंतज़ार करो।\n"
                + "• एक ट्रेड में पूँजी का 1% से ज़्यादा जोखिम मत लो।\n"
                + "• Stop Loss ट्रेड लेने से पहले लगाओ।")
        txt = (f"📋 <b>{esc(n)} — ट्रेड की तैयारी</b>\n\n"
               f"🧭 {esc(A.BIAS[a['score']])}\n"
               "👇 हर टाइमफ़्रेम और उदाहरण योजना देखने के लिए \"और पढ़ो\" दबाओ\n"
               f"<blockquote expandable>{esc(body)}</blockquote>\n"
               f"⚠️ सिर्फ़ पढ़ाई के लिए, ख़रीद-बिक्री की सलाह नहीं।\n{esc(tag)}")
        send_html(txt)
        return


PRE = {}


def num(x):
    try:
        t = str(x).replace("%", "").replace(",", "").strip()
        m = 1.0
        if t[-1:] in "KMBT" and t[-1:]:
            m = {"K": 1e3, "M": 1e6, "B": 1e9, "T": 1e12}[t[-1]]
            t = t[:-1]
        return float(t) * m
    except Exception:
        return None


def surprise(ev, actual, sg):
    a, f = num(actual), num(ev.get("fc"))
    if a is None or f is None:
        return ""
    n = CURN.get(ev["cur"], ev["cur"])
    if abs(a - f) < 1e-9:
        return "⚖️ आँकड़ा अनुमान के बराबर आया। ऐसे में चाल अक्सर छोटी रहती है।\n\n"
    hi = a > f
    w = "ज़्यादा" if hi else "कम"
    if sg == 0:
        return f"⚖️ आँकड़ा अनुमान से {w} आया।\n\n"
    strong = (hi and sg > 0) or ((not hi) and sg < 0)
    return (f"⚖️ आँकड़ा अनुमान से {w} आया। आमतौर पर इसे {n} के लिए {'मज़बूत' if strong else 'कमज़ोर'} संकेत माना जाता है। "
            "पर असली चाल इसके उलट भी हो सकती है, क्योंकि बाज़ार और भी बातें देखता है।\n\n")


def after_text(ev, actual, lines):
    sg = info(ev["title"])[4]
    return (f"📣 ख़बर आ गई: {info(ev['title'])[0]} ({ev['cur']})\n\n"
            f"🔢 असली आँकड़ा: {actual}\n📊 अनुमान: {ev['fc']} | पिछला: {ev['pv']}\n\n"
            + surprise(ev, actual, sg)
            + ("ख़बर से पहले के भाव से अब तक:\n" + "\n".join(lines) + "\n\n" if lines else "")
            + "⏳ पहली चाल अक्सर झूठी निकलती है। कुछ कैंडल बंद होने दो और ऊपर की योजना के स्तर देखो।\n"
            "⚠️ सिर्फ़ पढ़ाई के लिए, सलाह नहीं।\n#News")


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
    txt = after_text(ev, actual, lines)
    A.send_text(txt)


def fire(ev):
    send_html(header(ev))
    for n in AFFECT[ev["cur"]]:
        try:
            market_post(ev, n)
        except Exception as e:
            print(n, "error:", type(e).__name__, e)


def main():
    if TEST:
        ev = dict(id="test", t=dt.datetime.now(dt.timezone.utc) + dt.timedelta(minutes=LEAD),
                  title="CPI y/y (नमूना)", cur="USD", fc="3.1%", pv="3.2%")
        fire(ev)
        A.send_text("🧪 नीचे ख़बर आने के बाद वाला संदेश कैसा दिखेगा, उसका नमूना (आँकड़ा काल्पनिक):\n\n" + after_text(ev, "3.4%", ["🟠 BITCOIN: -0.35% (गिरावट)", "🟡 GOLD: -0.20% (गिरावट)"]))
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
