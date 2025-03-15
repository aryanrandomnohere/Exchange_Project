/**
 * StocksManager - Singleton class to manage stock data
 * Works in both browser and Node.js environments
 */
class StocksManager {
  static instance = null; // Singleton instance
  stocks = [];
  simulationInterval = null;
  simulationSpeed = 60000; // 1 minute by default

  // Private constructor to prevent direct instantiation
  constructor(options = {}) {
    if (StocksManager.instance) {
      return StocksManager.instance; // Return the existing instance
    }
    
    StocksManager.instance = this; // Set the instance
    
    // Configure simulation speed if provided
    if (options.simulationSpeed) {
      this.simulationSpeed = options.simulationSpeed;
    }
    
    // Determine which storage to use based on environment
    this.storage = typeof localStorage !== 'undefined' ? localStorage : {
      getItem: () => null,
      setItem: () => {}
    };
    
    // Initialize stocks data
    this.initializeStocks();
    
    // Start simulating price changes
    if (options.autoStartSimulation !== false) {
      this.startPriceSimulation();
    }
  }

  // Initialize stocks from storage or default data
  initializeStocks() {
    const savedStocks = this.getSavedStocks();
    
    if (savedStocks && savedStocks.length > 0) {
      this.stocks = savedStocks;
    } else {
      // Initialize with 5 popular Indian stocks if no saved data exists
      this.stocks = [
        { 
          id: '1', 
          name: 'Reliance Industries', 
          ticker: 'RELIANCE',
          quantity: 100, 
          price: 2500, 
          value: 250000, // Initial value = price * quantity
          candlestick: this.createCandlestickData(),
          priceHistory: [] 
        },
        { 
          id: '2', 
          name: 'Tata Consultancy Services', 
          ticker: 'TCS',
          quantity: 100, 
          price: 3400, 
          value: 340000,
          candlestick: this.createCandlestickData(),
          priceHistory: [] 
        },
        { 
          id: '3', 
          name: 'Infosys', 
          ticker: 'INFY',
          quantity: 100, 
          price: 1500, 
          value: 150000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        },
        { 
          id: '4', 
          name: 'HDFC Bank', 
          ticker: 'HDFCBANK',
          quantity: 100, 
          price: 1600, 
          value: 160000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        },
        { 
          id: '5', 
          name: 'ICICI Bank', 
          ticker: 'ICICIBANK',
          quantity: 100, 
          price: 800, 
          value: 80000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        },
        // Additional 15 stocks
        {
          id: '6',
          name: 'Bharti Airtel',
          ticker: 'BHARTIARTL',
          quantity: 100,
          price: 750,
          value: 75000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        },
        {
          id: '7',
          name: 'Asian Paints',
          ticker: 'ASIANPAINT',
          quantity: 100,
          price: 3200,
          value: 320000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        },
        {
          id: '8',
          name: 'Hindustan Unilever',
          ticker: 'HINDUNILVR',
          quantity: 100,
          price: 2600,
          value: 260000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        },
        {
          id: '9',
          name: 'ITC Limited',
          ticker: 'ITC',
          quantity: 100,
          price: 420,
          value: 42000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        },
        {
          id: '10',
          name: 'State Bank of India',
          ticker: 'SBIN',
          quantity: 100,
          price: 550,
          value: 55000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        },
        {
          id: '11',
          name: 'Axis Bank',
          ticker: 'AXISBANK',
          quantity: 100,
          price: 950,
          value: 95000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        },
        {
          id: '12',
          name: 'Wipro Limited',
          ticker: 'WIPRO',
          quantity: 100,
          price: 420,
          value: 42000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        },
        {
          id: '13',
          name: 'Tech Mahindra',
          ticker: 'TECHM',
          quantity: 100,
          price: 1200,
          value: 120000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        },
        {
          id: '14',
          name: 'Tata Motors',
          ticker: 'TATAMOTORS',
          quantity: 100,
          price: 580,
          value: 58000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        },
        {
          id: '15',
          name: 'Maruti Suzuki',
          ticker: 'MARUTI',
          quantity: 100,
          price: 9800,
          value: 980000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        },
        {
          id: '16',
          name: 'Bajaj Finance',
          ticker: 'BAJFINANCE',
          quantity: 100,
          price: 6900,
          value: 690000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        },
        {
          id: '17',
          name: 'Adani Ports',
          ticker: 'ADANIPORTS',
          quantity: 100,
          price: 780,
          value: 78000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        },
        {
          id: '18',
          name: 'Sun Pharma',
          ticker: 'SUNPHARMA',
          quantity: 100,
          price: 1100,
          value: 110000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        },
        {
          id: '19',
          name: 'Dr Reddys Labs',
          ticker: 'DRREDDY',
          quantity: 100,
          price: 4800,
          value: 480000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        },
        {
          id: '20',
          name: 'Larsen & Toubro',git 
          ticker: 'LT',
          quantity: 100,
          price: 2300,
          value: 230000,
          candlestick: this.createCandlestickData(),
          priceHistory: []
        }
      ];
    }
  }
  
  // Get saved stocks from storage with error handling
  getSavedStocks() {
    try {
      const data = this.storage.getItem('stocks');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to parse stocks from storage:', error);
      return null;
    }
  }

  // Static method to get the singleton instance with optional configuration
  static getInstance(options = {}) {
    if (!StocksManager.instance) {
      new StocksManager(options); // Create instance if it doesn't exist
    }
    return StocksManager.instance;
  }

  // Create initial candlestick data for a stock
  createCandlestickData() {
    const open = Math.random() * 100 + 100;  // Random starting price between 100 and 200
    const close = open;  // Initially, close price is the same as open
    const high = open + Math.random() * 10;  // High is a bit higher than open
    const low = open - Math.random() * 10;  // Low is a bit lower than open
    return { open, close, high, low };
  }

  // Add a stock to the stocks array
  addStock(stock) {
    // Generate a unique ID if not provided
    if (!stock.id) {
      stock.id = Date.now().toString();
    }
    
    // Ensure the stock has a ticker symbol if not provided
    if (!stock.ticker) {
      stock.ticker = stock.name.split(' ')[0].toUpperCase();
    }
    
    // Calculate the initial value
    stock.value = stock.price * stock.quantity;
    
    // Initialize price history and candlestick if not provided
    if (!stock.priceHistory) {
      stock.priceHistory = [];
    }
    
    if (!stock.candlestick) {
      stock.candlestick = this.createCandlestickData();
    }
    
    this.stocks.push(stock);
    this.saveStocksToStorage(); // Save to storage
    return stock;
  }

  // Update an existing stock
  updateStock(stockId, updatedData) {
    const stockIndex = this.stocks.findIndex(s => s.id === stockId);
    if (stockIndex !== -1) {
      // Don't override ID and ticker
      const currentStock = this.stocks[stockIndex];
      const updatedStock = {
        ...currentStock,
        ...updatedData,
        id: currentStock.id,
        ticker: updatedData.ticker || currentStock.ticker
      };
      
      // Recalculate value if price or quantity changed
      if (updatedData.price || updatedData.quantity) {
        updatedStock.value = updatedStock.price * updatedStock.quantity;
      }
      
      this.stocks[stockIndex] = updatedStock;
      this.saveStocksToStorage();
      return updatedStock;
    }
    return null;
  }

  // Update stock quantity
  updateStockQuantity(stockId, newQuantity) {
    return this.updateStock(stockId, { quantity: newQuantity });
  }

  // Remove a stock from the stocks array
  removeStock(stockId) {
    const initialLength = this.stocks.length;
    this.stocks = this.stocks.filter((s) => s.id !== stockId);
    
    if (this.stocks.length !== initialLength) {
      this.saveStocksToStorage(); // Save to storage
      return true;
    }
    return false;
  }

  // Get the list of stocks
  getStocks() {
    return this.stocks;
  }

  // Get a specific stock by id
  getStockById(stockId) {
    return this.stocks.find(stock => stock.id === stockId);
  }

  // Get a specific stock by ticker
  getStockByTicker(ticker) {
    return this.stocks.find(stock => stock.ticker.toUpperCase() === ticker.toUpperCase());
  }

  // Calculate total portfolio value
  getTotalPortfolioValue() {
    return this.stocks.reduce((total, stock) => total + stock.value, 0);
  }

  // Save the stocks data to storage
  saveStocksToStorage() {
    try {
      this.storage.setItem('stocks', JSON.stringify(this.stocks));
    } catch (error) {
      console.error('Failed to save stocks to storage:', error);
    }
  }

  // Get price change for a stock (in percentage)
  getStockPriceChange(stockId) {
    const stock = this.getStockById(stockId);
    if (!stock || !stock.candlestick) return null;
    
    const change = ((stock.price - stock.candlestick.open) / stock.candlestick.open) * 100;
    return parseFloat(change.toFixed(2));
  }

  // Format price change with +/- sign
  formatPriceChange(changeValue) {
    const prefix = changeValue >= 0 ? '+' : '';
    return `${prefix}${changeValue}%`;
  }

  // Get formatted stocks for display
  getFormattedStocks() {
    return this.stocks.map(stock => {
      const changeValue = this.getStockPriceChange(stock.id);
      
      return {
        id: stock.id,
        symbol: stock.ticker,
        name: stock.name,
        price: parseFloat(stock.price.toFixed(2)),
        change: this.formatPriceChange(changeValue),
        changeValue: changeValue,
        quantity: stock.quantity,
        value: parseFloat(stock.value.toFixed(2))
      };
    });
  }

  // Simulate price changes of each stock
  startPriceSimulation() {
    // Clear any existing interval to prevent duplicates
    this.stopPriceSimulation();
    
    // Set new interval
    this.simulationInterval = setInterval(() => {
      const timestamp = new Date().toISOString();
      
      this.stocks.forEach(stock => {
        // Randomly adjust the stock price by 1-2%
        const priceChangePercent = Math.random() * (2 - 1) + 1;  // 1-2%
        const priceChange = stock.price * (priceChangePercent / 100);
        const oldPrice = stock.price;
        stock.price += (Math.random() > 0.5 ? priceChange : -priceChange);  // Increase or decrease price
        
        // Ensure price doesn't go negative
        if (stock.price < 0) stock.price = oldPrice / 2;
        
        // Update the stock value based on new price
        stock.value = stock.price * stock.quantity;

        // Save price to history (keep last 100 points)
        stock.priceHistory.push({
          timestamp,
          price: stock.price
        });
        
        // Limit history size
        if (stock.priceHistory.length > 100) {
          stock.priceHistory.shift();
        }

        // Update the candlestick data (based on the new stock price)
        const lastCandlestick = stock.candlestick;
        lastCandlestick.open = stock.price;
        lastCandlestick.close = stock.price + (Math.random() * (2 - 1) + 1);  // Random close price variation
        lastCandlestick.high = Math.max(lastCandlestick.open, lastCandlestick.close) + Math.random() * 5;
        lastCandlestick.low = Math.min(lastCandlestick.open, lastCandlestick.close) - Math.random() * 5;
      });

      // Save updated stocks to storage
      this.saveStocksToStorage();

      // Optional event emission for UI updates
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('stocksUpdated', { 
          detail: { stocks: this.getFormattedStocks() } 
        }));
      }
    }, this.simulationSpeed);
    
    return this.simulationInterval;
  }
  
  // Stop price simulation
  stopPriceSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }
  
  // Clean up resources
  cleanup() {
    this.stopPriceSimulation();
  }
}

// Create and export the singleton instance
const stockManager = StocksManager.getInstance();

// Export for both CommonJS and ES modules environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StocksManager, stockManager };
} else if (typeof window !== 'undefined') {
  window.StocksManager = StocksManager;
  window.stockManager = stockManager;
}