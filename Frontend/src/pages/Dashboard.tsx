import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {
  const watchlist = [
    { symbol: 'AAPL', price: '175.34', change: '+2.45', isUp: true },
    { symbol: 'TSLA', price: '245.67', change: '-1.23', isUp: false },
    { symbol: 'AMZN', price: '145.24', change: '+1.56', isUp: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Portfolio Value</h3>
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">$24,567.89</p>
          <p className="text-green-600 text-sm">+5.67% today</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Positions</h3>
            <LineChart className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">12</p>
          <p className="text-gray-600 text-sm">4 in profit</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's P/L</h3>
            <LineChart className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">+$345.67</p>
          <p className="text-gray-600 text-sm">Based on closed positions</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Watchlist</h2>
        <div className="grid gap-4">
          {watchlist.map((stock) => (
            <Link
              key={stock.symbol}
              to={`/stock/${stock.symbol}`}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <h3 className="font-semibold text-gray-900">{stock.symbol}</h3>
                <p className="text-gray-600">${stock.price}</p>
              </div>
              <div className={`flex items-center ${stock.isUp ? 'text-green-600' : 'text-red-600'}`}>
                {stock.isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span className="ml-1">{stock.change}%</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;