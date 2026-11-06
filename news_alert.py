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
        path = f"news_{symbol.replace('^', '').replace('=', '')}.png"
        A.make_chart(d4, a, n, dec, path)
        f = lambda v: f"{prefix}{v:,.{dec}f}"
        cap = (f"{emoji} {n}: ख़बर से पहले का हाल\n\n"
               f"💰 भाव: {f(a['now'])}\n"
               f"⏱ 1 घंटे में {a['chg1']:+.2f}% | 24 घंटे में {a['chg24']:+.2f}%\n"
               f"🧭 कुल संकेत: {A.BIAS[a['score']]}\n"
               f"🟢 सपोर्ट {f(a['sups'][0][0])} | 🔴 रेज़िस्टेंस {f(a['ress'][0][0])}\n"
               f"📈 RSI: {float(a['rsi'].iloc[-1]):.0f}\n\n"
               f"👉 ख़बर के बाद भाव इन दो स्तरों में से किसी एक को तोड़े तो चाल तेज़ हो सकती है।\n{tag}")[:1020]
        A.send_photo(path, cap)
        return


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


if __name__ == "__main__":
    main()
