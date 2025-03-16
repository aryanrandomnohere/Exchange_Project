import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createChart } from 'lightweight-charts';
import axios from 'axios';

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface StockSummary {
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
}

const StockDetail = () => {
  const { symbol } = useParams();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  const [candlestickData, setCandlestickData] = useState<CandleData[]>([]);
  const [stockSummary, setStockSummary] = useState<StockSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getCandleStickData() {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5001/api/v1/stock/historicalcandlestick/${symbol}`);
        let candleData: CandleData[] = response.data;

        // Ensure `time` is a UNIX timestamp (seconds) and remove duplicates
        const uniqueSortedData = Array.from(
          new Map(
            candleData
              .map(candle => ({
                ...candle,
                time: Math.floor(new Date(candle.time).getTime() / 1000), // Convert time to UNIX seconds
              }))
              .sort((a, b) => a.time - b.time) // Sort by time
              .map(candle => [candle.time, candle]) // Create a Map to remove duplicates
          ).values()
        );

        setCandlestickData(uniqueSortedData);
        
        // Calculate stock summary from the candlestick data
        if (uniqueSortedData.length > 0) {
          const lastCandle = uniqueSortedData[uniqueSortedData.length - 1];
          const previousCandle = uniqueSortedData.length > 1 
            ? uniqueSortedData[uniqueSortedData.length - 2] 
            : uniqueSortedData[0];
          
          const highPrices = uniqueSortedData.map(candle => candle.high);
          const lowPrices = uniqueSortedData.map(candle => candle.low);
          
          setStockSummary({
            currentPrice: lastCandle.close,
            previousClose: previousCandle.close,
            change: lastCandle.close - previousCandle.close,
            changePercent: ((lastCandle.close - previousCandle.close) / previousCandle.close) * 100,
            high: Math.max(...highPrices),
            low: Math.min(...lowPrices),
            volume: 0 // This would come from your API if available
          });
        }
      } catch (error) {
        console.error('Error fetching candlestick data:', error);
      } finally {
        setLoading(false);
      }
    }

    getCandleStickData();
  }, [symbol]);
  useEffect(() => {
    if (chartContainerRef.current && candlestickData.length > 0) {
      // Clear previous chart if it exists
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null; // Set to null after removing
      }
      
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333333',
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
      
      // @ts-ignore
      candlestickSeries.setData(candlestickData);
      
      // Add SMA line
      const smaData = calculateSMA(candlestickData, 20);
      const smaLine = chart.addLineSeries({
        color: '#2962FF',
        lineWidth: 2,
      });
      // @ts-ignore
      smaLine.setData(smaData);
  
      chart.timeScale().fitContent();
      chartRef.current = chart;
  
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };
  
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        // Only remove if chartRef.current exists
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null; // Set to null after removing
        }
      };
    }
  }, [candlestickData]);
  // Calculate Simple Moving Average
  const calculateSMA = (data: CandleData[], period: number) => {
    const result = [];
    
    for (let i = period - 1; i < data.length; i++) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      result.push({
        time: data[i].time,
        value: sum / period
      });
    }
    
    return result;
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Stock Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{symbol}</h1>
        
        {stockSummary && (
          <div className="text-right mt-2 md:mt-0">
            <p className="text-2xl font-bold">{formatCurrency(stockSummary.currentPrice)}</p>
            <p className={`text-sm ${stockSummary.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stockSummary.change >= 0 ? '+' : ''}{formatCurrency(stockSummary.change)} 
              ({stockSummary.changePercent >= 0 ? '+' : ''}{stockSummary.changePercent.toFixed(2)}%)
            </p>
          </div>
        )}
      </div>
      
      {/* Main Chart */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <p>Loading chart data...</p>
          </div>
        ) : (
          <div ref={chartContainerRef} className="w-full h-96" />
        )}
      </div>
      
      {/* Stock Summary */}
      {stockSummary && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Previous Close</p>
              <p className="text-lg font-medium">{formatCurrency(stockSummary.previousClose)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Day's Range</p>
              <p className="text-lg font-medium">
                {formatCurrency(stockSummary.low)} - {formatCurrency(stockSummary.high)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Period High</p>
              <p className="text-lg font-medium">{formatCurrency(stockSummary.high)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Period Low</p>
              <p className="text-lg font-medium">{formatCurrency(stockSummary.low)}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Technical Indicators */}
      {candlestickData.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Technical Analysis</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <TechnicalIndicator 
              title="SMA (20)" 
              value={calculateSMA(candlestickData, 20).slice(-1)[0]?.value} 
              currentPrice={candlestickData.slice(-1)[0].close}
            />
            <TechnicalIndicator 
              title="SMA (50)" 
              value={calculateSMA(candlestickData, 50).slice(-1)[0]?.value} 
              currentPrice={candlestickData.slice(-1)[0].close}
            />
            <TechnicalIndicator 
              title="RSI (14)" 
              value={calculateRSI(candlestickData, 14)} 
              isPercentage={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface TechnicalIndicatorProps {
  title: string;
  value: number | undefined;
  currentPrice?: number;
  isPercentage?: boolean;
}

const TechnicalIndicator = ({ title, value, currentPrice, isPercentage = false }: TechnicalIndicatorProps) => {
  if (value === undefined) return null;
  
  let signal = '';
  let colorClass = 'text-gray-700';
  
  if (currentPrice !== undefined) {
    if (currentPrice > value) {
      signal = 'BULLISH';
      colorClass = 'text-green-600';
    } else if (currentPrice < value) {
      signal = 'BEARISH';
      colorClass = 'text-red-600';
    } else {
      signal = 'NEUTRAL';
    }
  } else if (isPercentage) {
    if (value >= 70) {
      signal = 'OVERBOUGHT';
      colorClass = 'text-red-600';
    } else if (value <= 30) {
      signal = 'OVERSOLD';
      colorClass = 'text-green-600';
    } else {
      signal = 'NEUTRAL';
    }
  }
  
  const formattedValue = isPercentage 
    ? `${value.toFixed(2)}%` 
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
  
  return (
    <div className="border rounded p-3">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-medium">{formattedValue}</p>
      <p className={`text-sm font-medium ${colorClass}`}>{signal}</p>
    </div>
  );
};

// Calculate RSI (Relative Strength Index)
const calculateRSI = (data: CandleData[], period: number): number => {
  if (data.length <= period) {
    return 50; // Not enough data, return neutral value
  }
  
  let gains = 0;
  let losses = 0;
  
  // Calculate initial average gain/loss
  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i-1].close;
    if (change >= 0) {
      gains += change;
    } else {
      losses -= change; // Make loss positive
    }
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  // Calculate RSI using smoothed method
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i-1].close;
    let currentGain = 0;
    let currentLoss = 0;
    
    if (change >= 0) {
      currentGain = change;
    } else {
      currentLoss = -change;
    }
    
    avgGain = ((avgGain * (period - 1)) + currentGain) / period;
    avgLoss = ((avgLoss * (period - 1)) + currentLoss) / period;
  }
  
  if (avgLoss === 0) {
    return 100; // No losses, RSI is 100
  }
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

export default StockDetail;