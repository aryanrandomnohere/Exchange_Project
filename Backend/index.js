const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const stockRouter = require("./routes/stockRouter");
const { stockManager } = require("./Stocks/StocksManager");

const app = express();
const PORT = 5001;
app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/stock", stockRouter);
app.get("/popular", async (req, res) => {
  console.log("Fetching popular stocks");
  try {
      // Get the list of stocks from the stockManager instance
      const stocks = stockManager.getStocks();
      
      // Format the stocks in the required structure
      const formattedStocks = stocks.map(stock => {
          // Calculate a random change percentage for demonstration
          // In a real app, you would calculate this based on previous price
          const changeValue = ((stock.price - stock.candlestick.open) / stock.candlestick.open * 100).toFixed(1);
          const changePrefix = changeValue >= 0 ? '+' : '';
          const change = `${changePrefix}${changeValue}%`;
          
          return {
              symbol: stock.ticker,
              name: stock.name,
              change: change
          };
      });
      
      console.log("Formatted stocks:", formattedStocks);
      res.json({ stocks: formattedStocks });
  } catch (error) {
      console.error("Error fetching stocks:", error);
      res.status(500).json({ error: "Failed to fetch stocks" });
  }
});
// API to fetch stock price (candlestick data) for NSE


// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));