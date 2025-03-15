import  { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { createChart } from 'lightweight-charts';
import axios from 'axios';

// Generate realistic mock data for the past 30 days
const generateMockData = (basePrice: number) => {
  const data = [];
  const now = new Date();
  let currentPrice = basePrice;

  for (let i = 60; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate realistic price movements
    const volatility = basePrice * 0.02; // 2% volatility
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
};

const stockData = {
  AAPL: { price: 175, name: 'Apple Inc.' },
  GOOGL: { price: 142, name: 'Alphabet Inc.' },
  MSFT: { price: 338, name: 'Microsoft Corporation' },
  AMZN: { price: 127, name: 'Amazon.com Inc.' },
  TSLA: { price: 245, name: 'Tesla, Inc.' },
};

const StockDetail = () => {
  const { symbol } = useParams();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  const stockInfo = stockData[symbol as keyof typeof stockData] || { price: 100, name: 'Unknown Stock' };
  const mockData = generateMockData(stockInfo.price);
  const latestPrice = mockData[mockData.length - 1].close;
  const previousClose = mockData[mockData.length - 2].close;
  const priceChange = parseFloat((latestPrice - previousClose).toFixed(2));
  const priceChangePercent = parseFloat(((priceChange / previousClose) * 100).toFixed(2));

  useEffect(() => {
   async function getCandleStickData() {
      const response =   await axios.get(`https://api.marketstack.com/v1/eod?access_key=e382156ddbee048c16b46c4be6ae51a2&symbols=$%7Bsymbol%7D&exchange=${symbol}`)
      console.log(response)

   }
   getCandleStickData();
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333333',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
        timeScale: {
          timeVisible: true,
          borderColor: '#D1D5DB',
        },
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#22C55E',
        downColor: '#EF4444',
        borderVisible: false,
        wickUpColor: '#22C55E',
        wickDownColor: '#EF4444',
      });

      candlestickSeries.setData(mockData);
      chartRef.current = chart;

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, [mockData]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1 text-gray-900">{symbol}</h1>
            <p className="text-gray-600">{stockInfo.name}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">${latestPrice.toFixed(2)}</p>
            <p className={`text-sm ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange} ({priceChangePercent}%)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div ref={chartContainerRef} className="w-full" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Market Data</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Open</span>
              <span className="text-gray-900">${mockData[mockData.length - 1].open.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">High</span>
              <span className="text-gray-900">${mockData[mockData.length - 1].high.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Low</span>
              <span className="text-gray-900">${mockData[mockData.length - 1].low.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Previous Close</span>
              <span className="text-gray-900">${previousClose.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Technical Indicators</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">RSI (14)</span>
              <span className="text-gray-900">{(Math.random() * 30 + 40).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">MACD</span>
              <span className="text-gray-900">{(Math.random() * 4 - 2).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">50 MA</span>
              <span className="text-gray-900">${(latestPrice * (1 + (Math.random() * 0.1 - 0.05))).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">200 MA</span>
              <span className="text-gray-900">${(latestPrice * (1 + (Math.random() * 0.2 - 0.1))).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
