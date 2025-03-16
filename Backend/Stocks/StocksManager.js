class StocksManager {
  static instance = null;
  
  stocks = [
    { id: '1', name: 'Reliance Industries', ticker: 'RELIANCE', quantity: 100, price: 2500, value: 250000, candlestick: [], priceHistory: [] },
    { id: '2', name: 'Tata Consultancy Services (TCS)', ticker: 'TCS', quantity: 100, price: 3400, value: 340000, candlestick: [], priceHistory: [] },
    { id: '3', name: 'Infosys', ticker: 'INFY', quantity: 100, price: 1500, value: 150000, candlestick: [], priceHistory: [] },
    { id: '4', name: 'HDFC Bank', ticker: 'HDFCBANK', quantity: 100, price: 1600, value: 160000, candlestick: [], priceHistory: [] },
    { id: '5', name: 'ICICI Bank', ticker: 'ICICIBANK', quantity: 100, price: 800, value: 80000, candlestick: [], priceHistory: [] }
  ];
  
  simulationInterval = null;
  simulationSpeed = 6000;
  
  constructor() {
    if (!StocksManager.instance) {
      StocksManager.instance = this;
    }
    return StocksManager.instance;
  }

  generateMockData(basePrice) {
    const data = [];
    const now = new Date();
    let currentPrice = basePrice;

    for (let i = 600; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const volatility = basePrice * 0.02;
      const open = currentPrice + (Math.random() - 0.5) * volatility;
      const close = open + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      currentPrice = close;
      data.push({
        time: date.toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2))
      });
    }
    return data;
  }

  generateHistoricalTickerData() {
    this.stocks.forEach(stock => {
      stock.candlestick = this.generateMockData(stock.price);
    });
  }
  getCandleStickData(symbol) {
    const stock = this.stocks.find(stock => stock.ticker === symbol);
    return stock.candlestick ? stock.candlestick : [];
  }

  getStocks() {
    return this.stocks;
  }
  
  startPriceSimulation() {
    this.stopPriceSimulation();
    this.simulationInterval = setInterval(() => {
      const timestamp = new Date().toISOString();
      
      this.stocks.forEach(stock => {
        const priceChangePercent = Math.random() * (0.2 - 0.1) + 0.2; // 1% to 2%
        const priceChange = stock.price * (priceChangePercent / 100);
        stock.price += (Math.random() > 0.5 ? priceChange : -priceChange);
        stock.value = stock.price * stock.quantity;
        stock.priceHistory.push({ timestamp, price: stock.price });
        if (stock.priceHistory.length > 100) stock.priceHistory.shift();
        
        // Update candlestick data
        const lastCandle = stock.candlestick[stock.candlestick.length - 1] || {
          close: stock.price, high: stock.price, low: stock.price
        };

        // Ensure new open price is within ±2% of last close
        const maxChange = lastCandle.close * 0.02;
        const minChange = lastCandle.close * 0.01;
        const open = Math.max(lastCandle.close - maxChange, 
                      Math.min(lastCandle.close + maxChange, stock.price));
        
        // Generate constrained high/low prices within 2% range
        const high = Math.min(lastCandle.high + maxChange, open + maxChange);
        const low = Math.max(lastCandle.low - maxChange, open - maxChange);
        
        // Ensure close is within 2% of open
        const close = Math.max(low, Math.min(high, stock.price));

        const newCandle = { time: timestamp.split('T')[0], open, high, low, close };
        stock.candlestick.push(newCandle);
        if (stock.candlestick.length > 60) stock.candlestick.shift();
      });
    }, this.simulationSpeed);
}

  
  stopPriceSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }
  
  cleanup() {
    this.stopPriceSimulation();
  }
}

const stockManager = new StocksManager();
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StocksManager, stockManager };
} else if (typeof window !== 'undefined') {
  window.StocksManager = StocksManager;
  window.stockManager = stockManager;
}
