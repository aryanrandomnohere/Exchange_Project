const express = require("express");
const { AuthMiddleware } = require("../Middleware");
const { stockManager } = require("../Stocks/StocksManager");
const stockRouter = express.Router();
stockManager.generateHistoricalTickerData();
stockManager.startPriceSimulation();
// Fetch specific stock historical data from Yahoo Finance
stockRouter.get("/specific/:symbol", async (req, res) => {
    const { symbol } = req.params;
  
    try {
        const stockSymbol = `${symbol}.NS`;
        const result = await yahooFinance.historical(
            stockSymbol,
            {
                period1: new Date(new Date().setDate(new Date().getDate() - 7)),
                period2: new Date(),
                interval: '1d',
            }
        );
  
        const formattedData = result.map(entry => ({
            time: entry.date.toISOString(),
            open: entry.open,
            high: entry.high,
            low: entry.low,
            close: entry.close,
        }));

  
        res.json({ final: formattedData });
    } catch (error) {
        console.error("Error fetching stock data:", error);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
});

// Fetch popular stocks from stockManager
stockRouter.get("/popular", async (req, res) => {
    console.log("Fetching popular stocks");
  
    try {
        // Get the list of stocks from the stockManager instance
        const stocks = stockManager.getStocks();
        console.log(stocks[1].candlestick)
        // Format stocks with price change %
        const formattedStocks = stocks.map(stock => {
            if (!stock.candlestick || stock.candlestick.length === 0) return null; // Handle empty data
            
            const lastCandle = stock.candlestick[stock.candlestick.length - 1];
            const changeValue = ((stock.price - lastCandle.open) / lastCandle.open * 100).toFixed(1);
            const changePrefix = changeValue >= 0 ? '+' : '';
            const change = `${changePrefix}${changeValue}%`;
            
            return {
                symbol: stock.ticker,
                name: stock.name,
                price: stock.price,
                change: change
            };
        }).filter(stock => stock !== null); // Remove null values
        
        console.log("Formatted stocks:", formattedStocks);
        res.json({ stocks: formattedStocks });
    } catch (error) {
        console.error("Error fetching stocks:", error);
        res.status(500).json({ error: "Failed to fetch stocks" });
    }
  });

// Fetch candlestick data from stockManager
stockRouter.get("/historicalcandlestick/:symbol", async (req, res) => {
    const { symbol } = req.params;

    try {
        // Find the stock by ticker symbol
        const stock = stockManager.getStocks().find(s => s.ticker === symbol.toUpperCase());
        
        if (!stock) {
            return res.status(404).json({ error: "Stock not found" });
        }

        // Get historical candlestick data (replace this with your actual data source)
        const candlestickData = stockManager.getCandleStickData(symbol.toUpperCase()); // Example function
        console.log("Candlestick data:", candlestickData);
        if (!candlestickData || candlestickData.length === 0) {
            return res.status(404).json({ error: "No candlestick data available" });
        }

        // Sort data to ensure it's in ascending order
        const sortedData = candlestickData.sort((a, b) => a.time - b.time);
       console.log("Sorted data:", sortedData);
        res.json(sortedData);
    } catch (error) {
        console.error("Error fetching candlestick data:", error);
        res.status(500).json({ error: "Failed to fetch candlestick data" });
    }
});
module.exports = stockRouter;
