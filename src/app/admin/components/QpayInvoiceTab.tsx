"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  AlertCircle,
  Calendar,
  DollarSign,
  FileText,
  Phone,
  Hash,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { fetchQpayInvoices, QpayInvoiceData } from '../services/adminApi';

interface CheckPaymentResponse {
  success: boolean;
  message: string;
  payment_status: 'PAID' | 'UNPAID';
  tickets?: {
    [key: string]: string[];
  };
}

const QpayInvoiceTab: React.FC = () => {
  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<string>(getTodayDateString);
  const [endDate, setEndDate] = useState<string>(getTodayDateString);
  const [confirmedStartDate, setConfirmedStartDate] = useState<string>(getTodayDateString);
  const [confirmedEndDate, setConfirmedEndDate] = useState<string>(getTodayDateString);

  const [invoices, setInvoices] = useState<QpayInvoiceData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Payment check states
  const [checkingPayment, setCheckingPayment] = useState<{ [key: string]: boolean }>({});
  const [paymentResults, setPaymentResults] = useState<{ [key: string]: CheckPaymentResponse }>({});

  // Fetch data from API
  const loadInvoices = async (start: string, end: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchQpayInvoices(start, end);
      setInvoices(data.qpay_invoices);
      setTotalCount(data.total);
    } catch (err) {
      setError('Өгөгдөл татахад алдаа гарлаа. Дахин оролдоно уу.');
      console.error('Failed to fetch qpay invoices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check payment status
  const checkPaymentStatus = async (invoiceId: string) => {
    setCheckingPayment(prev => ({ ...prev, [invoiceId]: true }));
    
    try {
      const response = await fetch(`https://tumensugalaa.mn/api/invoice/${invoiceId}/check_payment`);
      const data: CheckPaymentResponse = await response.json();
      
      setPaymentResults(prev => ({ ...prev, [invoiceId]: data }));
      
      // If paid, refresh the page after showing the result
      if (data.payment_status === 'PAID') {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to check payment:', err);
      setPaymentResults(prev => ({
        ...prev,
        [invoiceId]: {
          success: false,
          message: 'Төлбөр шалгахад алдаа гарлаа',
          payment_status: 'UNPAID'
        }
      }));
    } finally {
      setCheckingPayment(prev => ({ ...prev, [invoiceId]: false }));
    }
  };

  // Initial load with today's date
  useEffect(() => {
    loadInvoices(confirmedStartDate, confirmedEndDate);
  }, [confirmedStartDate, confirmedEndDate]);

  // Filter invoices by search term
  const displayedInvoices = useMemo(() => {
    if (!searchTerm) return invoices;

    const lowerCaseSearch = searchTerm.toLowerCase();
    return invoices.filter(invoice =>
      invoice.invoice_id.toLowerCase().includes(lowerCaseSearch) ||
      invoice.description.toLowerCase().includes(lowerCaseSearch) ||
      invoice.phone_number.includes(searchTerm) ||
      invoice.amount.toString().includes(searchTerm)
    );
  }, [invoices, searchTerm]);

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

  // Get status badge
  const getStatusBadge = (status: number) => {
    if (status === 0) {
      return (
        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
          Хүлээгдэж буй
        </span>
      );
    }
    return (
      <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full font-medium">
        Статус: {status}
      </span>
    );
  };

  // Render payment result
  const renderPaymentResult = (invoiceId: string) => {
    const result = paymentResults[invoiceId];
    if (!result) return null;

    if (result.payment_status === 'PAID') {
      return (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
            <CheckCircle className="w-5 h-5" />
            <span>Төлбөр төлөгдсөн байна - Сугалаа үүссэн</span>
          </div>
          {result.tickets && (
            <div className="text-sm text-green-600">
              {Object.entries(result.tickets).map(([lotteryType, numbers]) => (
                <div key={lotteryType} className="mt-1">
                  <span className="font-semibold">{lotteryType}:</span> {numbers.join(', ')}
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-green-600 mt-2">Хуудас шинэчлэгдэж байна...</p>
        </div>
      );
    } else {
      return (
        <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-lg">
          <div className="flex items-center gap-2 text-rose-700 font-medium">
            <XCircle className="w-5 h-5" />
            <span>Төлбөр төлөгдөөгүй - Орхигдсон нэхэмжлэл</span>
          </div>
          <p className="text-sm text-rose-600 mt-1">{result.message}</p>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">QPay Нэхэмжлэлүүд</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
              Олдсон: {displayedInvoices.length}
            </span>
            <p className="text-slate-500 text-sm">Төлбөр хүлээгдэж буй нэхэмжлэлүүд (status = 0)</p>
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
            placeholder="Нэхэмжлэлийн дугаар, утас, тайлбар, дүнгээр хайлт хийх..."
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
                  Нэхэмжлэлийн дугаар
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Утас
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Дүн
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Тайлбар
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Дуусах хугацаа
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Үүсгэсэн огноо
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                      Өгөгдөл уншиж байна...
                    </div>
                  </td>
                </tr>
              ) : displayedInvoices.length > 0 ? (
                displayedInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400 font-mono">#{invoice.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700 font-medium text-xs break-all">{invoice.invoice_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="font-mono text-sm">{invoice.phone_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-amber-500" />
                        <span className="text-slate-700 font-semibold">{formatAmount(invoice.amount)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 text-sm">{invoice.description}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {formatDate(invoice.expires_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {formatDate(invoice.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => checkPaymentStatus(invoice.invoice_id)}
                        disabled={checkingPayment[invoice.invoice_id]}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 text-sm font-medium transition-colors"
                      >
                        <RefreshCw className={`w-4 h-4 ${checkingPayment[invoice.invoice_id] ? 'animate-spin' : ''}`} />
                        {checkingPayment[invoice.invoice_id] ? 'Шалгаж байна...' : 'Шалгах'}
                      </button>
                      {renderPaymentResult(invoice.invoice_id)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-slate-900">
                          {searchTerm ? "Хайлтын үр дүн олдсонгүй" : "Өгөгдөл олдсонгүй"}
                        </h3>
                        <p className="text-slate-500 mt-1">
                          {searchTerm
                            ? "Өөр хайлтын нөхцөл оруулна уу"
                            : "Сонгосон хугацаанд хүлээгдэж буй нэхэмжлэл байхгүй байна"}
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
              ? `Хайлтын үр дүнд ${displayedInvoices.length} нэхэмжлэл олдлоо`
              : `Сонгосон огноонд ${displayedInvoices.length} нэхэмжлэл харагдаж байна`
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default QpayInvoiceTab;