// api/stocks.js — Vercel Serverless Function
// Fetch harga saham IDX dari Yahoo Finance (server-side, no CORS issue)

export default async function handler(req, res) {
  // Allow CORS from our app
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { symbols } = req.query;
  if (!symbols) {
    return res.status(400).json({ error: "symbols query param required" });
  }

  // Convert IDX tickers to Yahoo Finance format (add .JK suffix)
  const yahooSymbols = symbols
    .split(",")
    .map(s => s.trim().toUpperCase() + ".JK")
    .join(",");

  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yahooSymbols}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketDayHigh,regularMarketDayLow,regularMarketVolume,shortName`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
      },
    });

    if (!response.ok) throw new Error(`Yahoo Finance error: ${response.status}`);

    const data = await response.json();
    const quotes = data?.quoteResponse?.result || [];

    if (quotes.length === 0) throw new Error("No quotes returned");

    const result = quotes.map(q => ({
      ticker:    q.symbol.replace(".JK", ""),
      name:      q.shortName || q.symbol.replace(".JK", ""),
      price:     Math.round(q.regularMarketPrice || 0),
      change:    parseFloat((q.regularMarketChangePercent || 0).toFixed(2)),
      changeAmt: Math.round(q.regularMarketChange || 0),
      high:      Math.round(q.regularMarketDayHigh || 0),
      low:       Math.round(q.regularMarketDayLow || 0),
      volume:    formatVolume(q.regularMarketVolume || 0),
    }));

    // Cache for 5 minutes (300 seconds)
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
    return res.status(200).json({ data: result, source: "Yahoo Finance", timestamp: new Date().toISOString() });

  } catch (error) {
    console.error("Stock fetch error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

function formatVolume(vol) {
  if (vol >= 1e9) return (vol / 1e9).toFixed(1) + "B";
  if (vol >= 1e6) return (vol / 1e6).toFixed(1) + "M";
  if (vol >= 1e3) return (vol / 1e3).toFixed(0) + "K";
  return String(vol);
}
