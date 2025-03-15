import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createChart } from "lightweight-charts";
import axios from "axios";

const StockDetail = () => {
  const { symbol } = useParams();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  // State for API data, loading, and error handling
  const [stockData, setStockData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCandleStickData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Make the request to a proxy server for free NSE data
        const response = await axios.get(`https://www.nsetools.info/api/quote/${symbol}`);

        if (response.data) {
          // Parse the response based on what data the API provides
          const data = response.data.data; // Adjust based on actual API response

          const formattedData = data.map((entry: any) => ({
            time: entry.date, // Format the date if necessary
            open: entry.open,
            high: entry.high,
            low: entry.low,
            close: entry.close,
          }));

          setStockData(formattedData.reverse()); // Reverse to show the latest data on the right
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        setError("Failed to fetch stock data.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    getCandleStickData();
  }, [symbol]);

  useEffect(() => {
    if (!chartContainerRef.current || stockData.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333333",
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        borderColor: "#D1D5DB",
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#22C55E",
      downColor: "#EF4444",
      borderVisible: false,
      wickUpColor: "#22C55E",
      wickDownColor: "#EF4444",
    });

    candlestickSeries.setData(stockData);
    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [stockData]);

  if (loading) return <p className="text-gray-600 text-center">Loading...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  const latestData = stockData[stockData.length - 1];
  const previousData = stockData[stockData.length - 2];

  const latestPrice = latestData?.close;
  const previousClose = previousData?.close;
  const priceChange = latestPrice - previousClose;
  const priceChangePercent = ((priceChange / previousClose) * 100).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{symbol}</h1>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">${latestPrice.toFixed(2)}</p>
            <p className={`text-sm ${priceChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {priceChange >= 0 ? "+" : ""}
              {priceChange.toFixed(2)} ({priceChangePercent}%)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div ref={chartContainerRef} className="w-full" />
      </div>
    </div>
  );
};

export default StockDetail;