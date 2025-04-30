import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Journal = () => {
  const [recentTrades, setRecentTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddRow, setShowAddRow] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  const [newTrade, setNewTrade] = useState({
    date: '',
    symbol: '',
    tradeType: 'Buy',
    optionType: 'CE',
    entryPrice: '',
    entryTime:'',
    exitPrice: '',
    exitTime:'',
    quantity:'',
    strategy:'',
    pnl: '',
    note:''
    
  });


  const calculatePNL = (trade) => {
    if (!trade.entryPrice || !trade.exitPrice || !trade.quantity) return 0;
    
    const entry = trade.entryPrice ? parseFloat(trade.entryPrice) : 0;
    const exit = trade.exitPrice ? parseFloat(trade.exitPrice) : 0;
    const qty = trade.quantity ? parseFloat(trade.quantity) : 0;
    
   
      return (exit - entry) * qty;
   
  };
  
  const handleTradeChange = (field, value) => {
    const updatedTrade = { ...newTrade, [field]: value };
    
    // Auto-calculate P&L when relevant fields change
    if (['entryPrice', 'exitPrice', 'quantity', 'tradeType'].includes(field)) {
      updatedTrade.pnl = calculatePNL(updatedTrade).toFixed(2);
    }
    
    setNewTrade(updatedTrade);
  };
  

  // add trade
  const handleSaveTrade = async () => {
    try {
      const tokenObject = JSON.parse(localStorage.getItem('token'));
      const token = tokenObject ? tokenObject.token : null;
  
      if (!token) {
        console.error('No authentication token found');
        return;
      }
      const tradeToSend = {
        ...newTrade,
        pnl: calculatePNL(newTrade) // Add this line
      };
  
  
      await axios.post('http://localhost:8080/api/journal/add', tradeToSend, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      // After adding, fetch updated trades
      const response = await axios.get('http://localhost:8080/api/journal/all', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setRecentTrades(response.data);
  
      setShowAddRow(false);
      setNewTrade({
        date: '',
        symbol: '',
        tradeType: 'Buy',
        optionType: 'CE',
        entryPrice: '',
        entryTime:'',
        exitPrice: '',
        exitTime:'',
        quantity:'',
        strategy:'',
        pnl: '',
        note:''
      });
    } catch (error) {
      console.error('Error adding trade:', error);
    }
  };
  

  // Fetch trades data
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const tokenObject = JSON.parse(localStorage.getItem('token'));
        const token = tokenObject ? tokenObject.token : null;

        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }
        
        const response = await axios.get('http://localhost:8080/api/journal/all', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setRecentTrades(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching trades. Please try again later.');
        setLoading(false);
        console.error(error);
      }
    };
    fetchTrades();
  }, []);

  //delete trade
  const handleDelete = async (tradeId) => {
    try {
      const tokenObject = JSON.parse(localStorage.getItem('token'));
      const token = tokenObject ? tokenObject.token : null;
  
      if (!token) {
        console.error('No authentication token found');
        return;
      }
  
      await axios.delete(`http://localhost:8080/api/journal/delete/${tradeId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      // After deleting, fetch updated trades
      const response = await axios.get('http://localhost:8080/api/journal/all', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setRecentTrades(response.data);
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  };
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-600 text-white fixed h-full p-6">
        <h1 className="text-2xl font-bold mb-10 tracking-wide">TradeSaaS</h1>
        <nav className="flex flex-col gap-2">
          <Link to="/dashboard" className="p-3 rounded-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-200 font-medium tracking-wide">
            Dashboard
          </Link>
          <Link to="/journal" className="p-3 rounded-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-200 font-medium tracking-wide">
            Journal
          </Link>
          <Link to="/analytics" className="p-3 rounded-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-200 font-medium tracking-wide">
            Analytics
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-indigo-400">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="w-full p-3 text-left rounded-lg hover:bg-indigo-400 bg-indigo-500 transition-colors font-medium tracking-wide"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 pl-72">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Trading Journal</h2>
          <p className="text-gray-600">Review and analyze your trading history</p>
        </div>

        {/* Filter Section */}
        <div className="mb-6 flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="Search by Symbol"
            className="p-2 border border-gray-300 rounded-md w-full md:w-48 flex-grow"
          />
          <div className="flex gap-4 flex-grow">
            <input
              type="date"
              className="p-2 border border-gray-300 rounded-md w-full"
            />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition duration-200 whitespace-nowrap">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 p-4 rounded-lg mb-4 border border-red-200">
            <p className="text-red-600 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              {error}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading trades...</span>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden relative">
          <div className="p4 overflow-x-auto">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-indigo-50">
                  <tr>
                    {['Date', 'Symbol', 'Side','Option', 'Entry','Entry time', 'Exit','Exit time','quantity','strategy', 'P&L',  'Actions'].map((header) => (
                      <th 
                        key={header}
                        className="px-6 py-4 text-left text-sm font-semibold text-indigo-800 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Add Trade Row */}
                  {showAddRow && (
                    <tr className="bg-blue-50">
                      {/* Date */}
                      <td className="px-6 py-4">
                        <input
                          type="date"
                          value={newTrade.date}
                          onChange={(e) => setNewTrade({...newTrade, date: e.target.value})}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      
                      {/* Symbol */}
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={newTrade.symbol}
                          onChange={(e) => setNewTrade({...newTrade, symbol: e.target.value})}
                          className="w-full p-1 border rounded"
                          placeholder="Symbol"
                        />
                      </td>
                      
                      {/* Side (Trade Type) */}
                      <td className="px-6 py-4">
                        <select
                          value={newTrade.tradeType}
                          onChange={(e) => setNewTrade({...newTrade, tradeType: e.target.value})}
                          className="w-full p-1 border rounded"
                        >
                          <option>Buy</option>
                          <option>Sell</option>
                        </select>
                      </td>
                      
                      {/* Option Type */}
                      <td className="px-6 py-4">
                        <select
                          value={newTrade.optionType}
                          onChange={(e) => setNewTrade({...newTrade, optionType: e.target.value})}
                          className="w-full p-1 border rounded"
                        >
                          <option>CE</option>
                          <option>PE</option>
                        </select>
                      </td>
                      
                      {/* Entry Price */}
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={newTrade.entryPrice}
                          onChange={(e) => setNewTrade({...newTrade, entryPrice: e.target.value})}
                          className="w-full p-1 border rounded"
                          placeholder="Entry"
                        />
                      </td>
                      
                      {/* Entry Time */}
                      <td className="px-6 py-4">
                        <input
                          type="time"
                          value={newTrade.entryTime}
                          onChange={(e) => setNewTrade({...newTrade, entryTime: e.target.value})}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      
                      {/* Exit Price */}
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={newTrade.exitPrice}
                          onChange={(e) => setNewTrade({...newTrade, exitPrice: e.target.value})}
                          className="w-full p-1 border rounded"
                          placeholder="Exit"
                        />
                      </td>
                      
                      {/* Exit Time */}
                      <td className="px-6 py-4">
                        <input
                          type="time"
                          value={newTrade.exitTime}
                          onChange={(e) => setNewTrade({...newTrade, exitTime: e.target.value})}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      
                      {/* Quantity */}
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={newTrade.quantity}
                          onChange={(e) => setNewTrade({...newTrade, quantity: e.target.value})}
                          className="w-full p-1 border rounded"
                          placeholder="Qty"
                        />
                      </td>
                      
                      {/* Strategy */}
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={newTrade.strategy}
                          onChange={(e) => setNewTrade({...newTrade, strategy: e.target.value})}
                          className="w-full p-1 border rounded"
                          placeholder="Strategy"
                        />
                      </td>
                      
                      {/* P&L */}
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={newTrade.pnl}
                          // onChange={(e) => setNewTrade({...newTrade, pnl: e.target.value})}
                          readOnly
                          className="w-full p-1 border rounded"
                          placeholder="P&L"
                        />
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={handleSaveTrade}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setShowAddRow(false)}
                          className="bg-gray-600 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  )}
                  {/* Existing Trades */}
                  {Array.isArray(recentTrades) && recentTrades.length > 0 ? (
                      recentTrades.map((trade, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          {/* Date */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {new Date(trade.date).toLocaleDateString()}
                          </td>
                          
                          {/* Symbol */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {trade.symbol}
                          </td>
                          
                          {/* Side (Trade Type) */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              trade.tradeType.toLowerCase() === 'buy' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {trade.tradeType}
                            </span>
                          </td>
                          
                          {/* Option Type */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {trade.optionType}
                          </td>
                          
                          {/* Entry Price */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            ₹{trade.entryPrice}
                          </td>
                          
                          {/* Entry Time */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {trade.entryTime || '-'}
                          </td>
                          
                          {/* Exit Price */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            ₹{trade.exitPrice}
                          </td>
                          
                          {/* Exit Time */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {trade.exitTime || '-'}
                          </td>
                          
                          {/* Quantity */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {trade.quantity || '-'}
                          </td>
                          
                          {/* Strategy */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {trade.strategy || '-'}
                          </td>
                          
                          {/* P&L */}
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            // trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                            calculatePNL(trade) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {/* ₹{trade.pnl?.toFixed(2) || '0.00'} */}
                            ₹{calculatePNL(trade).toFixed(2)}
                          </td>
                          
                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex gap-2">
                            <button 
                              onClick={() => setEditingRow(index)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(trade.id)} disabled={!trade.id}
                              className="text-red-600 hover:text-red-900"
                            >
                              🗑️
                            </button>
                            <button
                              onClick={() => setSelectedNote(trade.notes || 'No notes available')}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              📝
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="px-6 py-8 text-center text-gray-500">
                          No trades recorded yet
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            {/* Add Trade Floating Button */}
            <div className="sticky bottom-4 right-4 float-right mr-4 mb-4 z-10">
              <button
                onClick={() => setShowAddRow(true)}
                className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-500 transition-transform duration-200 hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

          </div>
        )}

        {/* Note Modal */}
        {selectedNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Trade Notes</h3>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-wrap">{selectedNote}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;