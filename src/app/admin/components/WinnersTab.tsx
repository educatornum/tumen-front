"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Phone,
  Calendar,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { fetchRecentTickets, TicketData } from '../services/adminApi';

const WinnersTab: React.FC = () => {
  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<string>(getTodayDateString);
  const [endDate, setEndDate] = useState<string>(getTodayDateString);
  const [confirmedStartDate, setConfirmedStartDate] = useState<string>(getTodayDateString);
  const [confirmedEndDate, setConfirmedEndDate] = useState<string>(getTodayDateString);

  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  const loadTickets = async (start: string, end: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchRecentTickets(start, end);
      setTickets(response.tickets);
      setTotalCount(response.total);
    } catch (err) {
      setError('Өгөгдөл татахад алдаа гарлаа. Дахин оролдоно уу.');
      console.error('Failed to fetch tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load with today's date
  useEffect(() => {
    loadTickets(confirmedStartDate, confirmedEndDate);
  }, [confirmedStartDate, confirmedEndDate]);

  // Filter tickets by search term
  const displayedTickets = useMemo(() => {
    if (!searchTerm) return tickets;

    const lowerCaseSearch = searchTerm.toLowerCase();
    return tickets.filter(ticket =>
      ticket.number.includes(searchTerm) ||
      ticket.phone_number.includes(searchTerm) ||
      ticket.name.toLowerCase().includes(lowerCaseSearch)
    );
  }, [tickets, searchTerm]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('mn-MN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <h2 className="text-2xl font-bold text-slate-800">Сугалаа авсан харилцагчид</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">
              Олдсон: {displayedTickets.length}
            </span>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
              Нийт: {totalCount}
            </span>
            <p className="text-slate-500 text-sm">Сугалааны оролцогчид</p>
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
            placeholder="Сугалаа, утас, нэрээр хайлт хийх..."
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
                  Сугалааны дугаар
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Утасны дугаар
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Бүтээгдэхүүн
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Төлөв
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Огноо
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                      Өгөгдөл уншиж байна...
                    </div>
                  </td>
                </tr>
              ) : displayedTickets.length > 0 ? (
                displayedTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 font-bold group-hover:bg-orange-600 group-hover:text-white transition-colors">
                          {ticket.number}
                        </div>
                        <span className="text-xs text-slate-400 font-mono">#{ticket.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {ticket.phone_number}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">{ticket.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {ticket.is_used ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Баталгаажсан
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            Хүлээгдэж буй
                          </span>
                        )}

                        {ticket.is_bonus && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                            <Star className="w-3 h-3 fill-current" />
                            Bonus
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {formatDate(ticket.created_at)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    {searchTerm
                      ? "Хайлтын үр дүн олдсонгүй."
                      : "Өгөгдөл олдсонгүй."
                    }
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
              ? `Хайлтын үр дүнд ${displayedTickets.length} өгөгдөл олдлоо (Нийт ${totalCount})`
              : `Сонгосон огноонд ${displayedTickets.length} өгөгдөл харагдаж байна (Нийт ${totalCount})`
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default WinnersTab;
