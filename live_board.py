"""LIVE BOARD: har market ke liye 2 sthaayi Telegram sandesh (chart + vishleshan).
Har 5 minute mein wahi sandesh EDIT hote hain, naya notification nahi aata.
Bada badlaav (trend badla, RSI zone, badi chaal) par alag chhota 'alert' sandesh jaata hai."""
import os, json, time, datetime as dt
import requests
import alerts_v3 as A
import news_alert as N
import pro as P
import morning as M

STATE = "live_state.json"
COOLDOWN_MIN = 180         # ek hi tarah ka alert is se jaldi dobara nahi
API = lambda m: f"https://api.telegram.org/bot{A.TOKEN}/{m}"


def load():
    try:
        return json.load(open(STATE))
    except Exception:
        return {}


def save(s):
    json.dump(s, open(STATE, "w"), ensure_ascii=False, indent=1)


# ---------- telegram ----------
def tg_send_photo(path, cap):
    with open(path, "rb") as fh:
        r = requests.post(API("sendPhoto"), data={"chat_id": A.CHAT, "caption": cap},
                          files={"photo": fh}, timeout=60)
    return r.json().get("result", {}).get("message_id") if r.ok else None


def tg_send_text(txt):
    r = requests.post(API("sendMessage"), data={"chat_id": A.CHAT, "text": txt}, timeout=60)
    return r.json().get("result", {}).get("message_id") if r.ok else None


def tg_edit_photo(mid, path, cap):
    media = json.dumps({"type": "photo", "media": "attach://f", "caption": cap})
    with open(path, "rb") as fh:
        r = requests.post(API("editMessageMedia"), data={"chat_id": A.CHAT, "message_id": mid, "media": media},
                          files={"f": fh}, timeout=60)
    return r.ok or "not modified" in r.text


def tg_edit_text(mid, txt):
    r = requests.post(API("editMessageText"), data={"chat_id": A.CHAT, "message_id": mid, "text": txt}, timeout=60)
    return r.ok or "not modified" in r.text


# ---------- analysis ----------
def icon(df):
    c = df["c"]
    if len(c) < 30:
        return None
    e20, e50 = A.ema(c, 20), A.ema(c, 50)
    now, a, b = float(c.iloc[-1]), float(e20.iloc[-1]), float(e50.iloc[-1])
    r = float(A.rsi(c).iloc[-1])
    st = "up" if (now > b and a > b) else "down" if (now < b and a < b) else "side"
    return st, r


TF_ICON = {"up": "🟢", "down": "🔴", "side": "🟡"}
TF_WORD = {"up": "तेज़ी", "down": "मंदी", "side": "साइडवेज़"}


def timeframes(symbol, d1, d4):
    """(tf-suchi, dainik df, saptahik df)"""
    jobs = [("5m", lambda: N.dl(symbol, "5d", "5m")), ("15m", lambda: N.dl(symbol, "10d", "15m")),
            ("1h", lambda: d1), ("4h", lambda: d4),
            ("1d", lambda: N.dl(symbol, "1y", "1d")), ("1w", lambda: N.dl(symbol, "5y", "1wk"))]
    out, dfs = [], {}
    for name, fn in jobs:
        try:
            df = fn()
            dfs[name] = df
            x = icon(df)
        except Exception:
            x = None
        if x:
            out.append((name, x[0], x[1]))
    return out, dfs.get("1d"), dfs.get("1w")


def structure(d4):
    """4 ghante par Higher-High/Higher-Low jaanch."""
    w = d4.tail(40)
    if len(w) < 40:
        return "side", "साइडवेज़ (रेंज)"
    h1, h2 = w["h"].iloc[:20].max(), w["h"].iloc[20:].max()
    l1, l2 = w["l"].iloc[:20].min(), w["l"].iloc[20:].min()
    if h2 > h1 and l2 > l1:
        return "up", "अपट्रेंड (ऊँचाइयाँ और नीचाइयाँ दोनों ऊपर)"
    if h2 < h1 and l2 < l1:
        return "down", "डाउनट्रेंड (ऊँचाइयाँ और नीचाइयाँ दोनों नीचे)"
    return "side", "साइडवेज़ (रेंज में घूम रहा)"


def rsi_move(a):
    r = a["rsi"]
    now, prev = float(r.iloc[-1]), float(r.iloc[-4])
    arrow = "⬆️ चढ़ रहा" if now - prev > 1.5 else "⬇️ गिर रहा" if now - prev < -1.5 else "➖ स्थिर"
    zone = "ओवरबॉट" if now > 70 else "ओवरसोल्ड" if now < 30 else "सामान्य"
    return now, arrow, zone


def macd_word(a):
    if a["cross"] == "up":
        return "ऊपर की कटान (तेज़ी की शुरुआत)"
    if a["cross"] == "down":
        return "नीचे की कटान (कमज़ोरी की शुरुआत)"
    return "तेज़ी की ताक़त" if float(a["hist"].iloc[-1]) > 0 else "बेचने का दबाव"


def caption(name, emoji, tag, a, tfs, st, stword, f):
    now_ist = A.ist(dt.datetime.now(dt.timezone.utc)).strftime("%d %b, %I:%M %p")
    bias = {"up": "बुलिश 🐂", "down": "बेयरिश 🐻", "side": "न्यूट्रल ⚖️"}[st]
    rv, arrow, zone = rsi_move(a)
    tfline = " ".join(f"{n} {TF_ICON[s]}" for n, s, _ in tfs)
    vol = f"\n🔊 वॉल्यूम: सामान्य का {a['vol_x']:.1f} गुना" if a.get("vol_x") else ""
    return (
        f"{emoji} {name} · LIVE\n🕐 {now_ist} (भारत)\n\n"
        f"💰 {f(a['now'])}  ({a['chg1']:+.2f}% 1घं | {a['chg24']:+.2f}% 24घं)\n"
        f"🧭 मार्केट: {bias}\n📐 ट्रेंड (4घं): {stword}\n"
        f"⏱ {tfline}\n"
        f"📊 RSI {rv:.0f} {arrow} · {zone}\n"
        f"📉 MACD: {macd_word(a)}\n"
        f"🟢 सपोर्ट {f(a['sups'][0][0])} | 🔴 रेज़िस्टेंस {f(a['ress'][0][0])}{vol}\n\n"
        f"👇 नीचे: प्रो डैशबोर्ड + ट्रेड योजना + पूरा विश्लेषण (हर 5 मिनट पर अपने आप बदलते हैं)\n{tag}"
    )[:1020]


def long_text(name, a, tfs, st, stword, prefix, dec):
    rows = "\n".join(f"• {n}: {TF_ICON[s]} {TF_WORD[s]} (RSI {r:.0f})" for n, s, r in tfs)
    rv, arrow, zone = rsi_move(a)
    head = (f"📡 {name} — LIVE विश्लेषण\n\n"
            f"🕰 सभी टाइमफ़्रेम का हाल:\n{rows}\n\n"
            f"📐 4 घंटे का ढाँचा: {stword}\n"
            f"📊 RSI की चाल: {rv:.0f}, {arrow}, ज़ोन: {zone}\n\n"
            "━━━━━━━━━━\n\n")
    return (head + A.build_explain(name, a, prefix, dec).replace("📘 " + name + " का पूरा विश्लेषण (आसान भाषा में)\n\n", ""))[:4000]


def pct(x, y):
    return abs(x - y) / y * 100 if y else 0


def context_lines(a, tfs, st, f):
    """Chart par abhi kya hai: asli sankhyaon ke saath."""
    now = a["now"]
    s1, r1 = a["sups"][0][0], a["ress"][0][0]
    e20, e50 = float(a["e20"].iloc[-1]), float(a["e50"].iloc[-1])
    tfl = " ".join(f"{n} {TF_ICON[s]}" for n, s, _ in tfs)
    ups = sum(1 for _, s_, _ in tfs if s_ == "up")
    dns = sum(1 for _, s_, _ in tfs if s_ == "down")
    if dns >= 4:
        agree = f"{len(tfs)} में से {dns} टाइमफ़्रेम नीचे की तरफ़ हैं: ज़्यादातर चार्ट एक ही बात कह रहे हैं (मंदी)।"
    elif ups >= 4:
        agree = f"{len(tfs)} में से {ups} टाइमफ़्रेम ऊपर की तरफ़ हैं: ज़्यादातर चार्ट एक ही बात कह रहे हैं (तेज़ी)।"
    else:
        agree = "टाइमफ़्रेम आपस में सहमत नहीं हैं (कोई ऊपर, कोई नीचे): तस्वीर मिली-जुली है, इसलिए जल्दबाज़ी ठीक नहीं।"
    pos = "EMA50 के ऊपर" if now > e50 else "EMA50 के नीचे"
    vol = ""
    if a.get("vol_x"):
        vol = f"\n• वॉल्यूम: सामान्य का {a['vol_x']:.1f} गुना"
    return (
        "📍 इस वक़्त चार्ट पर (असली आँकड़े):\n"
        f"• भाव {f(now)}, {pos} (EMA50 = {f(e50)})\n"
        f"• सबसे पास का सहारा (सपोर्ट) {f(s1)}, यानी भाव से {pct(now, s1):.2f}% नीचे\n"
        f"• सबसे पास की रुकावट (रेज़िस्टेंस) {f(r1)}, यानी भाव से {pct(now, r1):.2f}% ऊपर\n"
        f"• टाइमफ़्रेम: {tfl}\n"
        f"• {agree}{vol}"
    )


LEARN_RSI_OS = (
    "📖 RSI क्या है?\n"
    "RSI 0 से 100 के बीच का एक नंबर है जो बताता है कि हाल की गिरावट या चढ़ाई कितनी तेज़ रही। "
    "30 से नीचे = \"ओवरसोल्ड\" यानी हाल में बहुत ज़्यादा बिकवाली हुई।\n\n"
    "🧠 इससे क्या सीखें?\n"
    "• ओवरसोल्ड का मतलब \"सस्ता है, ख़रीद लो\" नहीं होता। इसका मतलब सिर्फ़ इतना है कि गिरावट तेज़ रही।\n"
    "• मज़बूत डाउनट्रेंड में RSI कई दिन 30 से नीचे रह सकता है और भाव और गिरता रहता है।\n"
    "• रेंज वाले (साइडवेज़) बाज़ार में यही संकेत ज़्यादा काम का होता है, ट्रेंड वाले बाज़ार में कम।\n\n"
    "❌ नए ट्रेडर की आम गलती\n"
    "सिर्फ़ \"RSI 30\" देखकर ख़रीद लेना। इसमें न स्टॉप लॉस सोचा जाता है, न ट्रेंड देखा जाता है।\n\n"
    "✅ समझदार ट्रेडर क्या जाँचते हैं\n"
    "1) बड़ा ट्रेंड (4घं, 1दिन) किधर है?\n"
    "2) भाव किसी सहारे (सपोर्ट) के पास है या नहीं?\n"
    "3) क्या कैंडल पलटने का सबूत दे रही है (जैसे हरी कैंडल बंद होना)?\n"
    "4) स्टॉप लॉस कहाँ रखूँगा, और नुकसान पूँजी का 1% से कम है?"
)

LEARN_RSI_OB = (
    "📖 RSI क्या है?\n"
    "RSI 0 से 100 के बीच का एक नंबर है जो बताता है कि हाल की चढ़ाई या गिरावट कितनी तेज़ रही। "
    "70 से ऊपर = \"ओवरबॉट\" यानी हाल में बहुत ज़्यादा ख़रीदारी हुई।\n\n"
    "🧠 इससे क्या सीखें?\n"
    "• ओवरबॉट का मतलब \"अब गिरेगा, बेच दो\" नहीं होता। इसका मतलब सिर्फ़ इतना है कि चढ़ाई तेज़ रही।\n"
    "• मज़बूत अपट्रेंड में RSI कई दिन 70 से ऊपर रह सकता है और भाव और चढ़ता रहता है।\n"
    "• रेंज वाले बाज़ार में यह संकेत ज़्यादा काम का होता है, ट्रेंड वाले बाज़ार में कम।\n\n"
    "❌ नए ट्रेडर की आम गलती\n"
    "सिर्फ़ \"RSI 70\" देखकर उल्टा सौदा कर देना, यानी तेज़ ट्रेंड के सामने खड़े हो जाना।\n\n"
    "✅ समझदार ट्रेडर क्या जाँचते हैं\n"
    "1) बड़ा ट्रेंड (4घं, 1दिन) किधर है?\n"
    "2) भाव किसी रुकावट (रेज़िस्टेंस) के पास है या नहीं?\n"
    "3) क्या कैंडल पलटने का सबूत दे रही है (जैसे लाल कैंडल बंद होना)?\n"
    "4) स्टॉप लॉस कहाँ रखूँगा, और नुकसान पूँजी का 1% से कम है?"
)

LEARN_MOVE = (
    "📖 बड़ी चाल का मतलब\n"
    "जब भाव 1 घंटे में सामान्य से बहुत ज़्यादा हिले, तो आम तौर पर कोई ख़बर या बड़ा ऑर्डर होता है। "
    "ऐसे वक़्त स्प्रेड बढ़ जाता है और स्टॉप लॉस अपने भाव पर नहीं, उससे बदतर भाव पर लग सकता है (इसे स्लिपेज कहते हैं)।\n\n"
    "🧠 इससे क्या सीखें?\n"
    "• चाल के पीछे भागना सबसे महँगी आदत है: जब तक आप देखते हैं, चाल आधी हो चुकी होती है।\n"
    "• तेज़ चाल के बाद अक्सर थोड़ी वापसी (पुलबैक) आती है।\n\n"
    "❌ नए ट्रेडर की आम गलती\n"
    "बड़ी हरी कैंडल देखकर \"छूट गया\" वाला डर (FOMO) और बिना योजना के घुस जाना।\n\n"
    "✅ समझदार ट्रेडर क्या करते हैं\n"
    "1) पहले ख़बर देखते हैं: चाल क्यों आई?\n"
    "2) कैंडल बंद होने का इंतज़ार करते हैं।\n"
    "3) भाव सहारे/रुकावट के कितने पास है, यह देखते हैं।\n"
    "4) जोखिम पूँजी का 1% से कम रखते हैं।"
)

LEARN_TF = (
    "📖 टाइमफ़्रेम का ट्रेंड क्यों मायने रखता है?\n"
    "छोटे चार्ट (5 मिनट) पर शोर बहुत होता है, बड़े चार्ट (4 घंटे, 1 दिन) की दिशा ज़्यादा भरोसेमंद होती है। "
    "जब बड़ा ट्रेंड बदलता है, तो ट्रेडर अपनी सोच दोबारा जाँचते हैं।\n\n"
    "🧠 इससे क्या सीखें?\n"
    "• एक बदलाव का मतलब पक्का उलटफेर नहीं। कई बार भाव थोड़ी देर बाद वापस पुराने ट्रेंड में लौट आता है।\n"
    "• पक्का तब मानो जब कई टाइमफ़्रेम एक ही तरफ़ दिखाएँ।\n\n"
    "❌ आम गलती\n"
    "एक चार्ट का बदलाव देखकर तुरंत उल्टा सौदा कर देना।\n\n"
    "✅ समझदार ट्रेडर क्या जाँचते हैं\n"
    "1) बाकी टाइमफ़्रेम क्या कह रहे हैं?\n"
    "2) क्या भाव ने कोई सहारा/रुकावट तोड़ी?\n"
    "3) स्टॉप लॉस और जोखिम पहले से तय है या नहीं?"
)


def alert_events(name, a, tfs, st, prev):
    """(chabi, shirshak, shiksha-text) ki suchi: sirf bade badlaav par."""
    ev = []
    tf4 = {n: s for n, s, _ in tfs}
    for k in ("4h", "1d"):
        if k in tf4 and prev.get("tf", {}).get(k) and prev["tf"][k] != tf4[k]:
            ev.append((f"tf_{k}", f"{k} का ट्रेंड {TF_WORD[prev['tf'][k]]} से {TF_WORD[tf4[k]]} में बदला", LEARN_TF))
    rv = float(a["rsi"].iloc[-1])
    z = "ob" if rv > 70 else "os" if rv < 30 else "n"
    if prev.get("rz") and prev["rz"] != z:
        if z == "ob":
            ev.append(("rsi", f"RSI {rv:.0f}: ओवरबॉट ज़ोन (70 से ऊपर) में पहुँचा", LEARN_RSI_OB))
        elif z == "os":
            ev.append(("rsi", f"RSI {rv:.0f}: ओवरसोल्ड ज़ोन (30 से नीचे) में पहुँचा", LEARN_RSI_OS))
    return ev, {"tf": tf4, "rz": z}


EVENTS, FG = [], None


def news_for(name):
    cur = ["USD"] + (["EUR"] if name == "EUR/USD" else [])
    try:
        return P.next_news(EVENTS, cur)
    except Exception:
        return None


def main():
    global EVENTS, FG
    try:
        EVENTS = N.load_events()
    except Exception as e:
        print("khabar suchi nahi mili:", e)
    FG = P.fear_greed()
    s = load()
    now_ts = time.time()
    force = os.environ.get("FORCE_NEW") == "1"
    rows = []
    for name, emoji, symbol, tag, limit, prefix, dec in A.MARKETS:
        try:
            d1 = A.get_hourly(symbol)
            d4 = A.to_4h(d1)
            if len(d4) < 60:
                continue
            a = A.analyse(d1, d4)
            f = lambda v: f"{prefix}{v:,.{dec}f}"
            tfs, dday, dweek = timeframes(symbol, d1, d4)
            st, stword = structure(d4)
            rows.append((emoji, name, f(a['now']), a['chg24'], st))
            path = f"live_{symbol.replace('^', '').replace('=', '')}.png"
            A.make_chart(d4, a, name, dec, path)
            cap = caption(name, emoji, tag, a, tfs, st, stword, f)
            txt = long_text(name, a, tfs, st, stword, prefix, dec)
            m = s.setdefault(name, {})
            # chart sandesh
            if force or not m.get("photo") or not tg_edit_photo(m["photo"], path, cap):
                m["photo"] = tg_send_photo(path, cap)
            if force or not m.get("text") or not tg_edit_text(m["text"], txt):
                m["text"] = tg_send_text(txt)
            try:
                dash, _b = P.dashboard(name, emoji, tag, a, d1, d4, dday, dweek, tfs, f, prefix, dec,
                                       news_for(name), name in ("BITCOIN", "ETHEREUM"), FG)
                if force or not m.get("dash") or not tg_edit_text(m["dash"], dash):
                    m["dash"] = tg_send_text(dash)
            except Exception as e:
                print(name, "dash error:", type(e).__name__, e)
            # alert sandesh
            ev, snap = alert_events(name, a, tfs, st, m)
            big = abs(a["chg1"]) >= limit
            if big:
                ev.append(("move", f"1 घंटे में {a['chg1']:+.2f}% की बड़ी चाल", LEARN_MOVE))
            if os.environ.get("FORCE_NEW") == "a" and name == "EUR/USD":     # jaanch: namuna alert turant
                tg_send_text((f"🧪 यह सिर्फ़ टेस्ट अलर्ट है (असली नहीं)\n\n🔔 {emoji} {name} — नया बदलाव\n\n💰 {f(a['now'])}\n"
                              f"⚡ क्या हुआ: RSI {float(a['rsi'].iloc[-1]):.0f}: ओवरसोल्ड ज़ोन (30 से नीचे) में पहुँचा\n\n"
                              f"{context_lines(a, tfs, st, f)}\n\n{LEARN_RSI_OS}\n\n"
                              "🤖 और सवाल? वेबसाइट पर गुरु से पूछो: kartikagaritrading.github.io\n"
                              "⚠️ सिर्फ़ पढ़ाई के लिए, ख़रीद-बिक्री की सलाह नहीं।\n" + tag)[:4000])
            cd = m.setdefault("cd", {})
            fresh = [(k, t, mt) for k, t, mt in ev if now_ts - cd.get(k, 0) > COOLDOWN_MIN * 60]
            if fresh and m.get("tf"):       # pehli baar sirf snapshot lo
                ctx = context_lines(a, tfs, st, f)
                for k, t, mt in fresh:
                    msg = (f"🔔 {emoji} {name} — नया बदलाव\n\n💰 {f(a['now'])}\n"
                           f"⚡ क्या हुआ: {t}\n\n{ctx}\n\n{mt}\n\n"
                           "🤖 और सवाल? वेबसाइट पर गुरु से पूछो: kartikagaritrading.github.io\n"
                           "⚠️ सिर्फ़ पढ़ाई के लिए, ख़रीद-बिक्री की सलाह नहीं।\n" + tag)
                    tg_send_text(msg[:4000])
                    cd[k] = now_ts
                m.update(snap)
                save(s)                      # turant yaad rakho, taaki dobara na jaaye
            m.update(snap)
            print(name, "ok", f(a["now"]), stword)
        except Exception as e:
            print(name, "error:", type(e).__name__, e)
    try:      # subah ka saaransh (~8 baje IST, roz ek baar). FORCE_NEW=m likhne par turant (jaanch)
        n = M.ist_now()
        today = n.strftime("%Y-%m-%d")
        test = os.environ.get("FORCE_NEW") == "m"
        if test or (s.get("_morning") != today and (8, 0) <= (n.hour, n.minute) < (8, 45)):
            use = [r for r in rows if n.weekday() < 5 or r[1] in ("BITCOIN", "ETHEREUM")]
            if use and tg_send_text(M.build(use, EVENTS, FG, n)) and not test:
                s["_morning"] = today
    except Exception as e:
        print("subah saaransh error:", type(e).__name__, e)
    save(s)


if __name__ == "__main__":
    main()
