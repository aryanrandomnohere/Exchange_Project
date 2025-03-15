const express = require("express");
const { AuthMiddleware } = require("../Middleware");

const stockRouter = express.Router();

stockRouter.get("/stock/specific/:symbol", async (req, res) => {
    const { symbol } = req.params;
  
    try {
      // Yahoo Finance symbol format for NSE (e.g., TCS.NS for TCS)
      const stockSymbol = `${symbol}.NS`;
  
      // Fetch historical data from Yahoo Finance (1 week range)
      const result = await yahooFinance.historical(
        stockSymbol,
        {
          period1: new Date(new Date().setDate(new Date().getDate() - 7)), // 1 week ago
          period2: new Date(), // today
          interval: '1d', // Daily candlestick data
        }
      );
  
      const formattedData = result.map(entry => ({
        time: entry.date.toISOString(), // Convert Date object to ISO string
        open: entry.open,
        high: entry.high,
        low: entry.low,
        close: entry.close,
      }));
  
      console.log(formattedData);
  
      res.json({ final: formattedData }); // Send the formatted data to the client
    } catch (error) {
      console.error("Error fetching stock data:", error);
      res.status(500).json({ error: "Failed to fetch stock data" });
    }
  });

  stockRouter.get("/popular", async (req, res) => {
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

  module.exports = stockRouter;