// api/stocks.js — Vercel Serverless Function
// Source: Financial Modeling Prep (FMP) — reliable server-to-server API

const FMP_API_KEY = process.env.FMP_API_KEY || "iHomKB78bzBa8GmogxHBxfDNScPlfN7b";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { symbols } = req.query;
  if (!symbols) return res.status(400).json({ error: "symbols required" });

  const tickers = symbols.split(",").map(s => s.trim().toUpperCase());

  try {
    const fmpSymbols = tickers.map(t => `${t}.JK`).join(",");
    const url = `https://financialmodelingprep.com/stable/quote?symbol=${fmpSymbols}&apikey=${FMP_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`FMP error: ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error("No data from FMP");

    const result = data.map(q => ({
      ticker:    q.symbol?.replace(".JK", "") || q.symbol,
      price:     Math.round(q.price || 0),
      change:    parseFloat((q.changesPercentage || 0).toFixed(2)),
      changeAmt: Math.round(q.change || 0),
      high:      Math.round(q.dayHigh || 0),
      low:       Math.round(q.dayLow || 0),
      volume:    fmtVol(q.volume || 0),
    }));

    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=60");
    return res.status(200).json({
      data: result,
      source: "Financial Modeling Prep",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("FMP error:", error.message);
    return res.status(503).json({ error: error.message });
  }
}

function fmtVol(vol) {
  if (vol >= 1e9) return (vol / 1e9).toFixed(1) + "B";
  if (vol >= 1e6) return (vol / 1e6).toFixed(1) + "M";
  if (vol >= 1e3) return (vol / 1e3).toFixed(0) + "K";
  return String(vol);
}
