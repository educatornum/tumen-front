'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, ChevronRight, Zap, TrendingUp, Trophy, Shield } from 'lucide-react';

// ✅ Typing animation hook
const useTypingAnimation = (text, speed = 100) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayed;
};

// ✅ Modal Wrapper - X товч ажиллана
const Modal = ({ isOpen, onClose, children }) =>
  !isOpen ? null : (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-xl border border-white/20 bg-gradient-to-br from-gray-900 to-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl transition-all duration-200 hover:scale-110 active:scale-95"
        >
          ✕
        </button>
        <div className="relative p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );

// ✅ Сугалаа шалгах Modal - Backend холбогдсон
const CheckLotteryModal = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handlePhoneChange = (val) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length <= 8) {
      setPhone(digits);
      setError(null);
    }
  };

  const handleCheck = async () => {
    if (phone.length !== 8) {
      setError("Утасны дугаар 8 оронтой байх ёстой");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';
      const onGhPages = !!process.env.NEXT_PUBLIC_BASE_PATH;
      const endpoint = onGhPages ? `${backendUrl}/search/${phone}` : `/api/search/${phone}`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Хайлт амжилтгүй боллоо');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setTicketData(data);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Алдаа гарлаа. Дахин оролдоно уу.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPhone("");
    setError(null);
    setTicketData(null);
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {!submitted ? (
        <>
          <h2 className="text-2xl font-black text-white text-center mb-6">🔍 Сугалаа шалгах</h2>
          <input
            type="tel"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="8888 8888"
            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-center text-xl font-bold placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <p className="text-xs text-white/60 text-center mt-2">{phone.length}/8 орон</p>
          {error && <p className="text-sm text-red-400 text-center mt-2">{error}</p>}
          <button
            onClick={handleCheck}
            disabled={phone.length !== 8 || loading}
            className="mt-6 w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-100 transition-all"
          >
            {loading ? "Шалгаж байна..." : "Шалгах"}
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white text-center mb-4">✅ Таны сугалаанууд</h2>
          
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-sm text-white/60">Утасны дугаар:</p>
            <p className="text-xl font-bold text-white">{ticketData?.phone_number || phone}</p>
          </div>

          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-400/30">
            <p className="text-sm text-blue-300">Нийт сугалаа:</p>
            <p className="text-3xl font-black text-white">{ticketData?.total_tickets || 0} ширхэг</p>
          </div>

          {ticketData?.tickets && ticketData.tickets.length > 0 ? (
            <div className="max-h-64 overflow-y-auto space-y-3">
              {ticketData.tickets.map((ticket, i) => (
                <div key={ticket.id} className={`p-4 rounded-xl border-2 ${ticket.is_bonus ? 'bg-yellow-500/20 border-yellow-400' : 'bg-white/5 border-white/20'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-white/60">Дугаар #{i + 1}</p>
                      <p className={`text-2xl font-black ${ticket.is_bonus ? 'text-yellow-300' : 'text-white'}`}>
                         {String(ticket.number).padStart(6, '0')}
                      </p>

                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-sm text-white/80"><span className="font-bold">Машин:</span> {ticket.name}</p>
                    <p className="text-xs text-white/50 mt-1">Огноо: {new Date(ticket.created_at).toLocaleDateString('mn-MN')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
              <p className="text-white/60">Сугалаа олдсонгүй</p>
            </div>
          )}

          <button
            onClick={handleClose}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl font-black hover:scale-105 active:scale-100 transition-all"
          >
            Хаах
          </button>
        </div>
      )}
    </Modal>
  );
};

// ✅ Кодоор сугалаа шалгах Modal - Backend холбогдсон
const CheckLotteryByCodeModal = ({ isOpen, onClose }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleCodeChange = (val) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length <= 6) {
      setCode(digits);
      setError(null);
    }
  };

  const handleCheck = async () => {
    if (code.length !== 6) {
      setError("Код 6 оронтой байх ёстой");
      return;
    }

    const codea = parseInt(code, 10);
    

    setLoading(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';
      const onGhPages = !!process.env.NEXT_PUBLIC_BASE_PATH;
      const endpoint = onGhPages ? `${backendUrl}/search/lottery/${codea}` : `/api/search/lottery/${codea}`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Хайлт амжилтгүй боллоо');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setTicketData(data);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Алдаа гарлаа. Дахин оролдоно уу.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCode("");
    setError(null);
    setTicketData(null);
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {!submitted ? (
        <>
          <h2 className="text-2xl font-black text-white text-center mb-6">🔍 Кодоор шалгах</h2>
          <input
            type="tel"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="123456"
            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-center text-xl font-bold placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-white/60 text-center mt-2">{code.length}/6 орон</p>
          {error && <p className="text-sm text-red-400 text-center mt-2">{error}</p>}
          <button
            onClick={handleCheck}
            disabled={code.length !== 6 || loading}
            className="mt-6 w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-100 transition-all"
          >
            {loading ? "Шалгаж байна..." : "Шалгах"}
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white text-center mb-4">✅ Сугалааны мэдээлэл</h2>

          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-4 border border-purple-400/30">
            <p className="text-sm text-purple-300">Сугалааны дугаар:</p>
            <p className="text-3xl font-black text-white">{String(ticketData?.number || code).padStart(6, '0')}</p>
          </div>

          {ticketData?.phone && (
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <p className="text-sm text-white/60">Утасны дугаар:</p>
              <p className="text-xl font-bold text-white">{ticketData.phone}</p>
            </div>
          )}

          {ticketData?.created_at && (
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <p className="text-sm text-white/60">Огноо:</p>
              <p className="text-xl font-bold text-white">
                {new Date(ticketData.created_at).toLocaleDateString('en-GB').split('/').reverse().join('-')} {new Date(ticketData.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )}

          <button
            onClick={handleClose}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black hover:scale-105 active:scale-100 transition-all"
          >
            Хаах
          </button>
        </div>
      )}
    </Modal>
  );
};

// ✅ Сугалаа авах Modal - Payment шалгалттай
const BuyLotteryModal = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  const packages = [
    { amount: 20202, label: "20K", tickets: "1 сугалаа" },
    { amount: 40404, label: "40K", tickets: "2 сугалаа" },
    { amount: 60606, label: "60K", tickets: "3 сугалаа" },
    { amount: 101010, label: "100K", tickets: "5 сугалаа", popular: true },
  ];

  const handlePhoneChange = (val) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length <= 8) {
      setPhone(digits);
      setError(null);
    }
  };

  const handleBuy = async () => {
    if (phone.length !== 8 || !selected) {
      setError("Утасны дугаар болон дүн сонгоно уу");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';
      const onGhPages = !!process.env.NEXT_PUBLIC_BASE_PATH;
      const endpoint = onGhPages ? `${backendUrl}/invoice/create` : '/api/invoice/create';

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selected, phone_number: phone })
      });

      if (!resp.ok) {
        throw new Error('Төлбөр үүсгэхэд алдаа гарлаа');
      }

      const data = await resp.json();
      setInvoiceData(data);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckPayment = async () => {
    if (!invoiceData?.invoice_id) return;
    
    setChecking(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';
      const onGhPages = !!process.env.NEXT_PUBLIC_BASE_PATH;
      const endpoint = onGhPages
        ? `${backendUrl}/invoice/${invoiceData.invoice_id}/check_payment`
        : `/api/invoice/${invoiceData.invoice_id}/check_payment`;
      
      const resp = await fetch(endpoint);
      const data = await resp.json();
      setCheckResult(data);
    } catch (e) {
      setCheckResult({ error: 'Шалгах үед алдаа гарлаа' });
    } finally {
      setChecking(false);
    }
  };

  const handleClose = () => {
    setPhone("");
    setSelected(null);
    setError(null);
    setInvoiceData(null);
    setSubmitted(false);
    setCheckResult(null);
    onClose();
  };

  const isPaid = () => {
    const msg = (checkResult?.message || '').toString();
    const status = (checkResult?.payment_status || '').toString().toUpperCase();
    return status === 'PAID' || checkResult?.PAID === true || checkResult?.paid === true || checkResult?.success === true || /төлөгдсөн/i.test(msg);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {!submitted ? (
        <>
          <h2 className="text-2xl font-black text-white text-center mb-6">💎 Сугалаа авах</h2>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {packages.map((pkg) => (
              <button
                key={pkg.amount}
                onClick={() => setSelected(pkg.amount)}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  selected === pkg.amount 
                    ? "border-purple-400 bg-purple-500/30 scale-105" 
                    : "border-white/20 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="text-2xl font-black text-white">{pkg.label}</div>
                <div className="text-sm text-white/70">{pkg.tickets}</div>
                {pkg.popular && <div className="text-xs text-yellow-400 mt-1">⭐ Аялалын эрх</div>}
              </button>
            ))}
          </div>

          <input
            type="tel"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="8888 8888"
            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-center text-xl font-bold placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-white/60 text-center mt-2">{phone.length}/8 орон</p>
          
          {error && <p className="text-sm text-red-400 text-center mt-2">{error}</p>}
          
          <button
            onClick={handleBuy}
            disabled={phone.length !== 8 || !selected || loading}
            className="mt-6 w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-100 transition-all"
          >
            {loading ? "Худалдаж авч байна..." : "Худалдаж авах"}
          </button>
        </>
      ) : (
        <div className="space-y-3 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-black text-white text-center mb-3">💳 Төлбөр төлөх</h2>
          
          <div className="bg-white/10 rounded-xl p-3 border border-white/20">
            <p className="text-sm text-white/60">Утасны дугаар: {phone}</p>
            <p className="text-sm text-white/60">Дүн: {selected?.toLocaleString()}₮</p>
          </div>

          {!isPaid() && invoiceData?.qr_image && (
            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-xl">
                <img
                  src={`data:image/png;base64,${invoiceData.qr_image}`}
                  alt="QR Code"
                  className="w-40 h-40"
                />
              </div>
            </div>
          )}

          {!isPaid() && (
            <>
              <p className="text-xs text-white/70 text-center">QR код уншуулах эсвэл банкны апп ашиглана уу</p>
              
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {(invoiceData?.urls || []).map((bank, i) => (
                  <button
                    key={i}
                    onClick={() => window.open(bank.link, '_blank')}
                    className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <img src={bank.logo} alt={bank.name} className="w-6 h-6 rounded flex-shrink-0" />
                    <span className="text-xs text-white/80 truncate">{bank.description}</span>
                  </button>
                ))}
              </div>

<p className="text-center text-sm text-white-600 mt-4">
  Гүйлгээ амжилттай хийгдсэн бол 1-2 минутын дараа сугалаагаа шалгана уу
</p>
            </>
          )}

          {checkResult && (
            <div className={`p-3 rounded-xl ${isPaid() ? 'bg-green-500/20 border-2 border-green-400' : 'bg-yellow-500/20 border-2 border-yellow-400'}`}>
              <p className={`text-center font-bold text-sm ${isPaid() ? 'text-green-300' : 'text-yellow-300'}`}>
                {isPaid() ? '✅ Төлбөр төлөгдсөн!' : '⏳ ' + (checkResult.message || 'Хүлээгдэж байна')}
              </p>
              {isPaid() && (
                <p className="text-xs text-white/80 text-center mt-1">Таны утасны дугаар руу мэссэж илгээсэн</p>
              )}
            </div>
          )}

          <button
            onClick={handleClose}
            className="w-full py-2.5 bg-white/10 border border-white/20 text-white rounded-xl font-bold hover:bg-white/20 transition-all"
          >
            Хаах
          </button>
        </div>
      )}
    </Modal>
  );
};

export default function Hero() {
  const [checkModal, setCheckModal] = useState(false);
  const [checkCodeModal, setCheckCodeModal] = useState(false);
  const [buyModal, setBuyModal] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [counts,setCounts] = useState<number | null>(null);
  const [loading,setIsLoading] = useState(false);
  


  const TOTAL_LOTTERY = 7999;

   const fetchCounts = async () => {
    try {
      setIsLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL || 'http://localhost:3000';
      const onGhPages = !!process.env.NEXT_PUBLIC_BASE_PATH;
      const endpoint = onGhPages ? `${backendUrl}/lottery/counts` : '/api/lottery/counts';
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setCounts(data.total);
    } catch (err: any) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);

    fetchCounts();
    
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <CheckLotteryModal isOpen={checkModal} onClose={() => setCheckModal(false)} />
      <CheckLotteryByCodeModal isOpen={checkCodeModal} onClose={() => setCheckCodeModal(false)} />
      <BuyLotteryModal isOpen={buyModal} onClose={() => setBuyModal(false)} />

      <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
        
        {/* --- Зөвхөн энэ CSS болон Гэрлийг л нэмлээ --- */}
        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.4; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 20px currentColor; }
          }
          .christmas-light {
            animation: twinkle 2s infinite ease-in-out;
          }
        `}</style>

        {/* --- Hanging Christmas Lights --- */}
        <div className="absolute top-0 left-0 right-0 z-30 flex justify-center space-x-8 sm:space-x-12 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="relative">
              {/* Wire */}
              <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-gray-700 -translate-x-1/2"></div>
              {/* Bulb */}
              <div 
                className={`christmas-light w-4 h-6 rounded-full mt-8 ${
                  ['bg-red-500', 'bg-yellow-400', 'bg-green-500', 'bg-blue-500'][i % 4]
                }`}
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            </div>
          ))}
        </div>
        {/* ------------------------------------------- */}

        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
          style={{ 
            backgroundImage: "url('images/hero/prado150.jpg')",
            transform: `translate(${mousePos.x * 0.009}px, ${mousePos.y * 0.009}px) scale(1.05)`,
            filter: "brightness(0.35)"
          }}
        />

       <div className="relative z-10 text-center px-4 max-w-[90%] lg:max-w-none mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-500/30 via-orange-500/30 to-red-500/30 backdrop-blur-2xl border-2 border-yellow-400/50 rounded-full mb-8 animate-fade-in shadow-[0_0_30px_rgba(251,191,36,0.25)]">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span className="text-sm font-black text-transparent bg-gradient-to-r from-yellow-100 via-orange-100 to-yellow-100 bg-clip-text tracking-wide">
              Монгол улсын хамгийн анхны Автомашины тусгай зөвшөөрөлтэй сугалаа
            </span>
          </div>

          
            <h1 className="text-4xl lg:text-6xl font-black text-white mb-4">
            Автомашины <span className="text-red-500">Сугалаа</span>
          </h1>
          
          <p className="text-xl text-gray-100 mb-6">
            {'Хүслийн хүлгээ, Түмэн сугалаанаас'}<span className="text-red-400 animate-pulse">|</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
              onClick={() => setCheckCodeModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Camera className="w-5 h-5" /> Кодоор шалгах <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCheckModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Camera className="w-5 h-5" /> Сугалаа шалгах <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setBuyModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Zap className="w-5 h-5" /> Сугалаа авах <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Сугалааны дүүргэлт Progress Bar */}
          <div className="max-w-2xl mx-auto mb-8 px-2 sm:px-0">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
              <div className="flex  sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
                <span className="text-xs sm:text-sm lg:text-base font-bold text-white">🎯Дүүргэлт PRADO-150</span>
                <span className="text-xl sm:text-2xl lg:text-3xl font-black text-red-500">{ counts != null ? (counts / TOTAL_LOTTERY * 100).toFixed(2) + '%' : '0%'}</span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-4 sm:h-5 lg:h-6 bg-black/40 rounded-full overflow-hidden border sm:border-2 border-white/20 shadow-inner">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full transition-all duration-1000 ease-out animate-pulse shadow-lg"
                  style={{ width: counts != null ? (counts / TOTAL_LOTTERY * 100).toFixed(2) + '%' : '0%', boxShadow: '0 0 20px rgba(249, 115, 22, 0.8)' }}
                />
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: TrendingUp, number: counts, label: "Зарагдсан", color: "from-red-400 to-orange-500" },
              { icon: Trophy, number: TOTAL_LOTTERY, label: "Нийт сугалаа", color: "from-purple-400 to-pink-500" },
              { icon: Shield, number: TOTAL_LOTTERY - counts, label: "Үлдсэн", color: "from-blue-400 to-cyan-500" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="p-4 bg-black/50 rounded-2xl border border-white/20 backdrop-blur-sm">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-white opacity-70" />
                  <div className={`text-2xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  <div className="text-xs text-gray-300 uppercase font-bold">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}