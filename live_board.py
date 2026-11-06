"""LIVE BOARD: har market ke liye 2 sthaayi Telegram sandesh (chart + vishleshan).
Har 5 minute mein wahi sandesh EDIT hote hain, naya notification nahi aata.
Bada badlaav (trend badla, RSI zone, badi chaal) par alag chhota 'alert' sandesh jaata hai."""
import os, json, time, datetime as dt
import requests
import alerts_v3 as A
import news_alert as N
import pro as P

STATE = "live_state.json"
COOLDOWN_MIN = 60          # ek hi tarah ka alert is se jaldi dobara nahi
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
    arrow = "↗ चढ़ रहा" if now - prev > 1.5 else "↘ गिर रहा" if now - prev < -1.5 else "→ स्थिर"
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


def alert_events(name, a, tfs, st, prev):
    """(chabi, sandesh) ki suchi: sirf badlaav par."""
    ev = []
    tf4 = {n: s for n, s, _ in tfs}
    for k in ("1h", "4h", "1d"):
        if k in tf4 and prev.get("tf", {}).get(k) and prev["tf"][k] != tf4[k]:
            ev.append((f"tf_{k}", f"{k} का ट्रेंड बदला: {TF_WORD[prev['tf'][k]]} → {TF_WORD[tf4[k]]}"))
    rv = float(a["rsi"].iloc[-1])
    z = "ob" if rv > 70 else "os" if rv < 30 else "n"
    if prev.get("rz") and prev["rz"] != z:
        if z == "ob":
            ev.append(("rsi", f"RSI {rv:.0f}: ओवरबॉट ज़ोन में पहुँचा, नरमी आ सकती है"))
        elif z == "os":
            ev.append(("rsi", f"RSI {rv:.0f}: ओवरसोल्ड ज़ोन में पहुँचा, उछाल आ सकता है"))
        else:
            ev.append(("rsi", f"RSI {rv:.0f}: ओवरबॉट/ओवरसोल्ड ज़ोन से बाहर आया"))
    if a["cross"]:
        ev.append(("macd", "MACD ने " + ("ऊपर" if a["cross"] == "up" else "नीचे") + " की कटान बनाई"))
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
                ev.append(("move", f"1 घंटे में {a['chg1']:+.2f}% की बड़ी चाल"))
            cd = m.setdefault("cd", {})
            fresh = [(k, t) for k, t in ev if now_ts - cd.get(k, 0) > COOLDOWN_MIN * 60]
            if fresh and m.get("tf"):       # pehli baar sirf snapshot lo
                body = "\n".join("• " + t for _, t in fresh)
                tg_send_text(f"🔔 {emoji} {name} — नया बदलाव\n\n💰 {f(a['now'])}\n{body}\n\n"
                             "👆 ऊपर वाला LIVE चार्ट और विश्लेषण अभी अपडेट हो चुका है।\n⚠️ सिर्फ़ पढ़ाई के लिए।\n" + tag)
                for k, _ in fresh:
                    cd[k] = now_ts
            m.update(snap)
            print(name, "ok", f(a["now"]), stword)
        except Exception as e:
            print(name, "error:", type(e).__name__, e)
    save(s)


if __name__ == "__main__":
    main()
