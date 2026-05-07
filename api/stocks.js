// api/stocks.js — Vercel Serverless Function
// Multi-source fallback: Yahoo Finance -> Stooq -> Static

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { symbols } = req.query;
  if (!symbols) return res.status(400).json({ error: "symbols required" });

  const tickers = symbols.split(",").map(s => s.trim().toUpperCase());

  // Try Yahoo Finance first
  try {
    const yahooSymbols = tickers.map(t => t + ".JK").join(",");
    const url = `https://query2.finance.yahoo.com/v8/finance/spark?symbols=${yahooSymbols}&range=1d&interval=5m`;
    
    const quoteUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yahooSymbols}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketDayHigh,regularMarketDayLow,regularMarketVolume`;
    
    const response = await fetch(quoteUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://finance.yahoo.com",
        "Origin": "https://finance.yahoo.com",
      },
      redirect: "follow",
    });

    if (!response.ok) throw new Error(`Yahoo status: ${response.status}`);
    const data = await response.json();
    const quotes = data?.quoteResponse?.result || [];
    if (!quotes.length) throw new Error("Empty quotes");

    const result = quotes.map(q => ({
      ticker:    q.symbol.replace(".JK", ""),
      price:     Math.round(q.regularMarketPrice || 0),
      change:    parseFloat((q.regularMarketChangePercent || 0).toFixed(2)),
      changeAmt: Math.round(q.regularMarketChange || 0),
      high:      Math.round(q.regularMarketDayHigh || 0),
      low:       Math.round(q.regularMarketDayLow || 0),
      volume:    fmtVol(q.regularMarketVolume || 0),
    }));

    res.setHeader("Cache-Control", "s-maxage=180, stale-while-revalidate=60");
    return res.status(200).json({ data: result, source: "Yahoo Finance" });

  } catch (e1) {
    console.log("Yahoo failed:", e1.message, "— trying Stooq...");
  }

  // Try Stooq (IDX data, no API key needed)
  try {
    const results = await Promise.all(tickers.map(async ticker => {
      const url = `https://stooq.com/q/l/?s=${ticker.toLowerCase()}.id&f=sd2t2ohlcv&h&e=json`;
      const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      const data = await r.json();
      const quote = data?.symbols?.[0];
      if (!quote || !quote.Close) throw new Error("No data for " + ticker);
      return {
        ticker,
        price:     Math.round(parseFloat(quote.Close)),
        change:    parseFloat(((parseFloat(quote.Close) - parseFloat(quote.Open)) / parseFloat(quote.Open) * 100).toFixed(2)),
        changeAmt: Math.round(parseFloat(quote.Close) - parseFloat(quote.Open)),
        high:      Math.round(parseFloat(quote.High)),
        low:       Math.round(parseFloat(quote.Low)),
        volume:    fmtVol(parseInt(quote.Volume || 0)),
      };
    }));

    res.setHeader("Cache-Control", "s-maxage=180, stale-while-revalidate=60");
    return res.status(200).json({ data: results, source: "Stooq" });

  } catch (e2) {
    console.log("Stooq failed:", e2.message);
  }

  // Both failed — return error so client uses its own fallback
  return res.status(503).json({ error: "All data sources unavailable" });
}

function fmtVol(vol) {
  if (vol >= 1e9) return (vol / 1e9).toFixed(1) + "B";
  if (vol >= 1e6) return (vol / 1e6).toFixed(1) + "M";
  if (vol >= 1e3) return (vol / 1e3).toFixed(0) + "K";
  return String(vol);
}
