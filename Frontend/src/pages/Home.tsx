import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight } from 'lucide-react';

const Home = () => {
  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', change: '+1.2%' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', change: '+0.8%' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', change: '+2.1%' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome to Exchange</h1>
        <p className="text-gray-600 text-lg">Your gateway to smarter trading</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Popular Stocks</h2>
          <div className="space-y-4">
            {popularStocks.map((stock) => (
              <Link
                key={stock.symbol}
                to={`/stock/${stock.symbol}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{stock.symbol}</p>
                    <p className="text-sm text-gray-600">{stock.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">{stock.change}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Market Overview</h2>
          <p className="text-gray-600 mb-4">
            Stay updated with real-time market data and make informed trading decisions.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;