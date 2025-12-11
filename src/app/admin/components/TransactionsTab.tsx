"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Calendar,
  DollarSign,
  FileText,
  TrendingUp,
  TrendingDown,
  Tag,
} from 'lucide-react';
import { fetchAllTransactions, TransactionRecord } from '../services/adminApi';

const TransactionsTab: React.FC = () => {
  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<string>(getTodayDateString);
  const [endDate, setEndDate] = useState<string>(getTodayDateString);
  const [confirmedStartDate, setConfirmedStartDate] = useState<string>(getTodayDateString);
  const [confirmedEndDate, setConfirmedEndDate] = useState<string>(getTodayDateString);

  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  const loadTransactions = async (start: string, end: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAllTransactions(start, end);
      setTransactions(data.bank_transactions);
    } catch (err) {
      setError('Өгөгдөл татахад алдаа гарлаа. Дахин оролдоно уу.');
      console.error('Failed to fetch transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load with today's date
  useEffect(() => {
    loadTransactions(confirmedStartDate, confirmedEndDate);
  }, [confirmedStartDate, confirmedEndDate]);

  // Filter transactions by search term
  const displayedTransactions = useMemo(() => {
    if (!searchTerm) return transactions;

    const lowerCaseSearch = searchTerm.toLowerCase();
    return transactions.filter(transaction =>
      transaction.record_id.toLowerCase().includes(lowerCaseSearch) ||
      transaction.description.toLowerCase().includes(lowerCaseSearch) ||
      transaction.type.toLowerCase().includes(lowerCaseSearch) ||
      transaction.amount.toString().includes(searchTerm)
    );
  }, [transactions, searchTerm]);

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return displayedTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [displayedTransactions]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('mn-MN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format amount
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('mn-MN') + '₮';
  };


  // Handle date filter button click
  const handleDateFilter = () => {
    setConfirmedStartDate(startDate);
    setConfirmedEndDate(endDate);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Нийт гүйлгээний тайлан</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
              Олдсон: {displayedTransactions.length}
            </span>
            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">
              Нийт дүн: {formatAmount(totalAmount)}
            </span>
            <p className="text-slate-500 text-sm">Санхүүгийн нэгдсэн мэдээлэл</p>
          </div>
        </div>
      </div>

      {/* DATE RANGE FILTER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Огнооны хязгаар</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="start-date" className="text-xs font-medium text-slate-500 mb-1">
              Эхлэх огноо
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="end-date" className="text-xs font-medium text-slate-500 mb-1">
              Дуусах огноо
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
          <div className="flex items-end">
            <button
              className="w-full bg-orange-600 text-white hover:bg-orange-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm h-[38px] disabled:bg-orange-300"
              disabled={!startDate || !endDate || isLoading}
              onClick={handleDateFilter}
            >
              {isLoading ? 'Уншиж байна...' : 'Огноогоор шүүх'}
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH INPUT */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center w-full">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Гүйлгээний дугаар, тайлбар, төрөл, дүнгээр хайлт хийх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-base"
          />
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-700">
          {error}
        </div>
      )}

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Гүйлгээний дугаар
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Төрөл
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Гүйлгээний огноо
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Дүн
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Тайлбар
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Үүсгэсэн огноо
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                      Өгөгдөл уншиж байна...
                    </div>
                  </td>
                </tr>
              ) : displayedTransactions.length > 0 ? (
                displayedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400 font-mono">#{transaction.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700 font-medium">{transaction.record_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          transaction.type === '1' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : transaction.type === '2'
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          <Tag className="w-3 h-3" />
                          {transaction.type === '1' ? 'Орлого' : transaction.type === '2' ? 'Зарлага' : 'Тодорхойгүй'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {formatDate(transaction.tranDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        <span className="text-slate-700 font-semibold">{formatAmount(transaction.amount)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 text-sm">{transaction.description}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-500 text-sm">{formatDate(transaction.created_at)}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-slate-900">
                          {searchTerm ? "Хайлтын үр дүн олдсонгүй" : "Өгөгдөл олдсонгүй"}
                        </h3>
                        <p className="text-slate-500 mt-1">
                          {searchTerm
                            ? "Өөр хайлтын нөхцөл оруулна уу"
                            : "Сонгосон огноонд гүйлгээ байхгүй байна"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER INFO */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            {searchTerm
              ? `Хайлтын үр дүнд ${displayedTransactions.length} өгөгдөл олдлоо`
              : `Сонгосон огноонд ${displayedTransactions.length} өгөгдөл харагдаж байна`
            }
          </span>
          <span className="text-sm font-semibold text-slate-700">
            Нийт дүн: {formatAmount(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTab;
