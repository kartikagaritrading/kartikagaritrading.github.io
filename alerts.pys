import os
import sys
import requests
import yfinance as yf
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

TOKEN = os.environ["TELEGRAM_BOT_TOKEN"]
CHAT = "@kartiktradinghindi"
MODE = os.environ.get("MODE", "auto")  # "all" = har market ka test alert

# naam, emoji, symbol, hashtag, 1 ghante ki halchal limit (%), bhav se pehle ka chinh, dasmlav ank
MARKETS = [
    ("BITCOIN", "🟠", "BTC-USD", "#Bitcoin", 1.5, "$", 0),
    ("ETHEREUM", "🔷", "ETH-USD", "#Ethereum", 2.0, "$", 0),
    ("GOLD", "🟡", "GC=F", "#Gold", 0.7, "$", 1),
    ("EUR/USD", "💶", "EURUSD=X", "#EURUSD", 0.4, "", 4),
    ("NASDAQ", "📈", "^IXIC", "#Nasdaq", 0.8, "", 0),
]


def get_close(symbol):
    df = yf.download(symbol, period="5d", interval="1h", progress=False)
    return df["Close"].squeeze().dropna()


def make_chart(close, title, path):
    plt.figure(figsize=(8, 4.5))
    plt.plot(close.index, close.values, linewidth=2)
    plt.title(title + " - last 5 days")
    plt.grid(alpha=0.3)
    plt.savefig(path, dpi=150, bbox_inches="tight")
    plt.close()


def send_photo(path, caption):
    with open(path, "rb") as f:
        r = requests.post(
            f"https://api.telegram.org/bot{TOKEN}/sendPhoto",
            data={"chat_id": CHAT, "caption": caption},
            files={"photo": f},
            timeout=60,
        )
    print("telegram:", r.status_code, r.text[:120])
    return r.ok


def main():
    sent = 0
    for name, emoji, symbol, tag, limit, prefix, dec in MARKETS:
        try:
            close = get_close(symbol)
            if len(close) < 3:
                print(name, "data kam hai")
                continue
            now = float(close.iloc[-1])
            h1 = float(close.iloc[-2])
            back = max(-len(close), -24)
            d1 = float(close.iloc[back])
            chg1 = (now - h1) / h1 * 100
            chg24 = (now - d1) / d1 * 100
            print(name, round(now, 4), f"1h {chg1:+.2f}%", f"24h {chg24:+.2f}%")

            if MODE != "all" and abs(chg1) < limit:
                continue

            word = "तेज़ी 📈" if chg1 > 0 else "गिरावट 📉"
            caption = (
                f"{emoji} {name} अलर्ट\n\n"
                f"{word}: 1 घंटे में {chg1:+.2f}%\n"
                f"24 घंटे में: {chg24:+.2f}%\n"
                f"भाव: {prefix}{now:,.{dec}f}\n\n"
                "⚠️ सिर्फ़ जानकारी के लिए, निवेश सलाह नहीं।\n\n"
                f"{tag}"
            )
            path = f"chart_{symbol.replace('^', '').replace('=', '')}.png"
            make_chart(close, name, path)
            if send_photo(path, caption):
                sent += 1
        except Exception as e:
            print(name, "error:", type(e).__name__, e)
    print("bheje gaye alert:", sent)


if __name__ == "__main__":
    main()
