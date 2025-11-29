"use client";
import Link from "next/link";
import { Lobster, Gabriela } from "next/font/google";
import { useState, useEffect } from "react";

const lobster = Lobster({ 
  subsets: ["latin"],
  weight: "400",
  // variable: "--font-lobster"
});

const gabriela = Gabriela({ 
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gabriela"
});

// Typing animation component
const TypingText = ({ text, speed = 100, className = "" }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Modal component
const LotteryModal = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 8 digits
    if (/^\d*$/.test(value) && value.length <= 8) {
      setPhoneNumber(value);
      setIsValid(value.length === 8);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneNumber.length === 8) {
      setIsLoading(true);
      setError(null);
      
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL || 'http://localhost:3000';
        const onGhPages = !!process.env.NEXT_PUBLIC_BASE_PATH;
        const endpoint = onGhPages ? `${backendUrl}/search/${phoneNumber}` : `/api/search/${phoneNumber}`;
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error('Хайлт амжилтгүй боллоо');
        }
        
        const data = await response.json();
        
        // Check if there's an error in the response
        if (data.error) {
          throw new Error(data.error);
        }
        
        setTicketData(data);
        setIsSubmitted(true);
      } catch (err) {
        setError(err.message || 'Алдаа гарлаа. Дахин оролдоно уу.');
        console.error('API Error:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsValid(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber("");
    setIsValid(true);
    setIsSubmitted(false);
    setSelectedAmount(null);
    setTicketData(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
      <div className="relative mx-4 w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl my-auto">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal content */}
        <div className="text-center">
          <div className="mb-6">
            {/* <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div> */}
            <h3 className={`text-2xl font-bold text-gray-900 ${lobster.className}`}>
              Сугалаа шалгах
            </h3>
            <p className={`mt-2 text-sm text-gray-600 ${gabriela.className}`}>
              Утасны дугаараа оруулна уу
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-left text-sm font-medium text-gray-700 ${gabriela.className}`}>
                  Утасны дугаар (8 орон)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="_ _ _ _ _ _ _ _"
                  className={`mt-2 w-full rounded-lg border-2 px-4 py-3 text-center text-lg font-bold tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    isValid 
                      ? "border-gray-300 focus:border-red-500 bg-white text-gray-900" 
                      : "border-red-500 bg-red-50 text-gray-900"
                  }`}
                  maxLength={8}
                  disabled={isLoading}
                />
                {!isValid && (
                  <p className={`mt-1 text-sm text-red-600 ${gabriela.className}`}>
                    Утасны дугаар 8 оронтой байх ёстой
                  </p>
                )}
                {error && (
                  <p className={`mt-1 text-sm text-red-600 ${gabriela.className}`}>
                    {error}
                  </p>
                )}
                <p className={`mt-1 text-xs text-gray-500 ${gabriela.className}`}>
                  {phoneNumber.length}/8 орон
                </p>
              </div>


              <button
                type="submit"
                disabled={phoneNumber.length !== 8 || isLoading}
                className={`w-full rounded-full px-6 py-3 font-bold transition-all duration-300 ${
                  phoneNumber.length === 8 && !isLoading
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } ${gabriela.className}`}
              >
                {isLoading ? "Шалгаж байна..." : "Шалгах"}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className={`text-sm text-gray-600 ${gabriela.className}`}>
                  Утасны дугаар:
                </p>
                <p className={`text-lg font-bold text-gray-900 ${gabriela.className}`}>
                  {ticketData?.phone_number || phoneNumber}
                </p>
              </div>
              
              <div className="rounded-lg bg-blue-50 p-4">
                <p className={`text-sm text-blue-600 ${gabriela.className}`}>
                  Нийт сугалаа:
                </p>
                <p className={`text-2xl font-bold text-blue-700 ${gabriela.className}`}>
                  {ticketData?.total_tickets || 0} ширхэг
                </p>
              </div>

              {ticketData && ticketData.tickets && ticketData.tickets.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <h4 className={`text-lg font-bold text-gray-900 ${gabriela.className}`}>
                    Таны сугалаанууд:
                  </h4>
                  {ticketData.tickets.map((ticket, index) => (
                    <div 
                      key={ticket.id} 
                      className={`rounded-lg p-4 border-2 ${
                        ticket.is_bonus 
                          ? 'bg-yellow-50 border-yellow-300' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className={`text-xs text-gray-500 ${gabriela.className}`}>
                            Дугаар #{index + 1}
                          </p>
                          <p className={`text-2xl font-bold ${
                            ticket.is_bonus ? 'text-yellow-600' : 'text-gray-900'
                          } ${lobster.className}`}>
                            {ticket.number}
                          </p>
                        </div>
                        {/* <div className="text-right">
                          {ticket.is_bonus && (
                            <span className="inline-block px-2 py-1 text-xs font-bold text-yellow-700 bg-yellow-200 rounded-full mb-1">
                              🎁 Бонус
                            </span>
                          )}
                          <div>
                            <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${
                              ticket.is_used 
                                ? 'text-red-700 bg-red-100' 
                                : 'text-green-700 bg-green-100'
                            }`}>
                              {ticket.is_used ? '✓ Ашигласан' : '○ Ашиглаагүй'}
                            </span>
                          </div>
                        </div> */}
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <p className={`text-sm text-gray-700 ${gabriela.className}`}>
                          <span className="font-medium">Машин:</span> {ticket.name}
                        </p>
                        <p className={`text-xs text-gray-500 mt-1 ${gabriela.className}`}>
                          Огноо: {new Date(ticket.created_at).toLocaleDateString('mn-MN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className={`text-center text-gray-600 ${gabriela.className}`}>
                    Сугалаа олдсонгүй
                  </p>
                </div>
              )}

              <button
                onClick={handleClose}
                className={`w-full rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-white font-bold transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:scale-105 ${gabriela.className}`}
              >
                Хаах
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Lottery Purchase Modal
const LotteryPurchaseModal = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isLoadingPurchase, setIsLoadingPurchase] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [checkResult, setCheckResult] = useState<any>(null);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 8) {
      setPhoneNumber(value);
      setIsValid(value.length === 8);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(phoneNumber.length === 8 && selectedAmount)) {
      setIsValid(false);
      return;
    }

    try {
      setIsLoadingPurchase(true);
      setPurchaseError(null);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL || 'http://localhost:3000';
      const onGhPages = !!process.env.NEXT_PUBLIC_BASE_PATH;
      const endpoint = onGhPages ? `${backendUrl}/invoice/create` : '/api/invoice/create';

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedAmount, phone_number: phoneNumber })
      });

      if (!resp.ok) {
        throw new Error('Төлбөр үүсгэхэд алдаа гарлаа');
      }

      const data = await resp.json();
      setInvoiceData(data);
      setIsSubmitted(true);
    } catch (err: any) {
      setPurchaseError(err.message || 'Алдаа гарлаа');
    } finally {
      setIsLoadingPurchase(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber("");
    setIsValid(true);
    setIsSubmitted(false);
    setSelectedAmount(null);
    setInvoiceData(null);
    setPurchaseError(null);
    setIsCheckingPayment(false);
    setCheckResult(null);
    onClose();
  };

  const handleCheckPayment = async () => {
    if (!invoiceData?.invoice_id) return;
    try {
      setIsCheckingPayment(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL || 'http://localhost:3000';
      const onGhPages = !!process.env.NEXT_PUBLIC_BASE_PATH;
      const endpoint = onGhPages
        ? `${backendUrl}/invoice/${invoiceData.invoice_id}/check_payment`
        : `/api/invoice/${invoiceData.invoice_id}/check_payment`;
      const resp = await fetch(endpoint, { method: 'GET' });
      const data = await resp.json();
      console.log("data->", data)
      setCheckResult(data);
    } catch (e) {
      setCheckResult({ error: 'Шалгах үед алдаа гарлаа' });
    } finally {
      setIsCheckingPayment(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative mx-auto my-6 w-full max-w-4xl rounded-2xl bg-white p-4 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center pt-20">
          {!isSubmitted && (
            <div className="mb-6 ">
              {/* <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div> */}
              <h3 className={`text-2xl font-bold text-gray-900 ${lobster.className}`}>
                Сугалаа авах
              </h3>
              <p className={`mt-2 text-sm text-gray-600 ${gabriela.className}`}>
                Утасны дугаар болон дүн сонгоно уу
              </p>
            </div>
          )}

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-left text-sm font-medium text-gray-700 ${gabriela.className}`}>
                  Утасны дугаар (8 орон)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="_ _ _ _ _ _ _ _"
                  className={`mt-2 w-full rounded-lg border-2 px-4 py-3 text-center text-lg font-bold tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isValid 
                      ? "border-gray-300 focus:border-blue-500 bg-white text-gray-900" 
                      : "border-red-500 bg-red-50 text-gray-900"
                  }`}
                  maxLength={8}
                />
                {!isValid && (
                  <p className={`mt-1 text-sm text-red-600 ${gabriela.className}`}>
                    Утасны дугаар 8 оронтой байх ёстой
                  </p>
                )}
                <p className={`mt-1 text-xs text-gray-500 ${gabriela.className}`}>
                  {phoneNumber.length}/8 орон
                </p>
              </div>

              <div>
                <label className={`block text-left text-sm font-medium text-gray-700 ${gabriela.className}`}>
                  Сугалааны дүн сонгох
                </label>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {[
                    { amount: 20200, image: "/images/aztan/20k.png", title: "20,000₮" },
                    { amount: 40400, image: "/images/aztan/40k.png", title: "40,000₮" },
                    { amount: 60600, image: "/images/aztan/60k.png", title: "60,000₮" },
                    { amount: 101000, image: "/images/aztan/100k.png", title: "100,000₮" }
                  ].map(({ amount, image, title }) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setSelectedAmount(amount)}
                      className={`relative overflow-hidden rounded-lg border-2 shadow-sm ${
                        selectedAmount === amount
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                    >
                      <div className="relative w-full">
                        <img
                          src={image}
                          alt={title}
                          className="w-full h-auto object-contain brightness-100 contrast-125 saturate-125 drop-shadow"
                          // className="w-full h-auto object-contain drop-shadow"
                          // className="h-full w-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          {/* <span className={`text-white font-bold text-lg ${gabriela.className}`}>
                            {title}
                          </span> */}
                        </div>
                        {selectedAmount === amount && (
                          <div className="absolute top-2 right-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={phoneNumber.length !== 8 || !selectedAmount || isLoadingPurchase}
                className={`w-full rounded-full px-6 py-3 font-bold transition-all duration-300 ${
                  phoneNumber.length === 8 && selectedAmount
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } ${gabriela.className}`}
              >
                {isLoadingPurchase ? 'Үүсгэж байна...' : 'Сугалаа авах'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className={`text-xl font-bold text-gray-900 ${lobster.className}`}>
                Сугалаа амжилттай авлаа!
              </h4> */}
              <p className={`text-gray-600 ${gabriela.className}`}>
                Таны утасны дугаар: {phoneNumber}
              </p>
              {/* <p className={`text-gray-600 ${gabriela.className}`}>
                Сонгосон дүн: {selectedAmount?.toLocaleString()}₮
              </p> */}

              {/* Payment Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className={`text-lg font-bold text-gray-900 mb-4 ${gabriela.className}`}>
                  Төлбөр төлөх
                </h5>
                
                {/* QR Code (hide when paid) */}
                {(() => {
                  const msg = (checkResult?.message || '').toString();
                  const status = (checkResult?.payment_status || '').toString().toUpperCase();
                  const paid = status === 'PAID' || checkResult?.PAID === true || checkResult?.paid === true || checkResult?.success === true || /төлөгдсөн/i.test(msg);
                  if (paid) return null;
                  return (
                    <div className="flex justify-center">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        {invoiceData?.qr_image ? (
                          <img
                            src={`data:image/png;base64,${invoiceData.qr_image}`}
                            alt="QR Code"
                            className="w-32 h-32"
                          />
                        ) : (
                          <div className="w-32 h-32 flex items-center justify-center text-gray-500">
                            {isLoadingPurchase ? 'Уншиж байна...' : 'QR байхгүй'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
                <h1 className={`text-base p-4 text-gray-600 ${gabriela.className}`}>Та дараах QR код уншуулах юмуу банкны апп дээр төлөх боломжтой</h1>
                
                {(() => {
                  const msg = (checkResult?.message || '').toString();
                  const status = (checkResult?.payment_status || '').toString().toUpperCase();
                  const paid = status === 'PAID' || checkResult?.PAID === true || checkResult?.paid === true || checkResult?.success === true || /төлөгдсөн/i.test(msg);
                  return (
                    <div className="flex flex-col items-center gap-4 p-4">
                      {!paid && (
                        <button
                          onClick={handleCheckPayment}
                          disabled={!invoiceData?.invoice_id || isCheckingPayment}
                          className={`rounded-full px-8 py-3 text-base sm:text-lg font-semibold text-white transition-all ${
                            isCheckingPayment || !invoiceData?.invoice_id
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-primary hover:bg-primary/90 hover:scale-105'
                          } ${gabriela.className}`}
                        >
                          {isCheckingPayment ? 'Шалгаж байна...' : 'Төлбөр шалгах'}
                        </button>
                      )}
                      {checkResult && (() => {
                    const msg = (checkResult?.message || '').toString();
                    const status = (checkResult?.payment_status || '').toString().toUpperCase();
                    const paid =
                      status === 'PAID' ||
                      checkResult?.PAID === true ||
                      checkResult?.paid === true ||
                      checkResult?.success === true ||
                      /төлөгдсөн/i.test(msg);

                    const text = paid
                      ? (msg || 'Төлбөр төлөгдсөн байна.')
                      : (msg || 'Хүлээгдэж байна. Ахин шалгана уу');

                    const isPending = /хүлээгд/i.test(text) || status === 'PENDING';
                    const color = paid ? 'text-green-600' : (isPending ? 'text-yellow-600' : 'text-amber-600');

                    return (
                      <p className={`text-base sm:text-lg font-semibold ${color} ${gabriela.className}`}>
                        {paid ? (
                          <>
                            <span className="block">Төлбөр төлөгдсөн байна.</span>
                            <span className="block text-black">Бид таны утасны дугаарлуу мэссэж илгээсэн.</span>
                          </>
                        ) : (
                          text
                        )}
                      </p>
                    );
                      })()}
                    </div>
                  );
                })()}
                {/* Bank Payment Options (hide when paid) */}
                {(() => {
                  const msg = (checkResult?.message || '').toString();
                  const status = (checkResult?.payment_status || '').toString().toUpperCase();
                  const paid = status === 'PAID' || checkResult?.PAID === true || checkResult?.paid === true || checkResult?.success === true || /төлөгдсөн/i.test(msg);
                  if (paid) return null;
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 pt-2">
                      {(invoiceData?.urls || []).map((bank, index) => (
                        <button
                          key={index}
                          className="flex items-center p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors text-left"
                          onClick={() => window.open(bank.link, '_blank')}
                        >
                          <img src={bank.logo} alt={bank.name} className="w-8 h-8 rounded mr-3 flex-shrink-0" />
                          <div className="text-left">
                            {/* <div className={`text-sm sm:text-base font-medium text-gray-900 ${gabriela.className}`}>
                              {bank.name}
                            </div> */}
                            <div className={`text-xs sm:text-sm text-gray-500 ${gabriela.className}`}>
                              {bank.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  );
                })()}
                
                {purchaseError && (
                  <p className={`text-sm text-red-600 ${gabriela.className}`}>{purchaseError}</p>
                )}
                
                
              </div>
              
              <button
                onClick={handleClose}
                className={`rounded-full bg-gradient-to-r from-green-500 to-green-600 px-3 py-1 text-xs sm:text-sm font-medium text-white transition-colors duration-300 hover:from-green-600 hover:to-green-700 ${gabriela.className}`}
              >
                Хаах
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  return (
    <>
      <LotteryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <LotteryPurchaseModal 
        isOpen={isPurchaseModalOpen} 
        onClose={() => setIsPurchaseModalOpen(false)} 
      />

      <section
        id="home"
        className="
          relative z-10 overflow-hidden 
          bg-black 
          pt-[150px] pb-[150px]
          md:pt-[180px] md:pb-[200px]
        "
      >
        {/* Cinematic Background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/video/4.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.45) blur(4px)"
          }}
        />

        {/* Soft Spotlight Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25),transparent_70%)] opacity-40"></div>

        {/* Top/Bottom light streaks */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/20 to-transparent"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/10 to-transparent"></div>

        <div className="container relative z-20">
          <div className="flex justify-center">
            {/* GLASS CONTENT BOX */}
            <div
              className="
                max-w-[900px] text-center px-10 py-14
                rounded-3xl
                backdrop-blur-xl 
                bg-white/5 
                border border-white/10
                shadow-[0_0_120px_rgba(255,255,255,0.12)]
                animate-fade-in
              "
            >
              {/* Futuristic Title */}
              <h1
                className={`
                  text-4xl sm:text-5xl md:text-6xl
                  font-extrabold 
                  leading-tight 
                  text-white
                  drop-shadow-[0_4px_16px_rgba(255,255,255,0.2)]
                  mb-8
                  tracking-wide
                  ${lobster.className}
                `}
              >
                Монгол улсын анхны лицензтэй <br />
                автомашины сугалаа
              </h1>

              {/* Subtext with typing */}
              <p
                className={`
                  text-xl sm:text-2xl md:text-3xl 
                  text-white/80 
                  mb-14
                  leading-relaxed
                  drop-shadow
                  ${gabriela.className}
                `}
              >
                <TypingText 
                  text="Хүслийн хүлгээ, Түмэн сугалаанаас." 
                  speed={75}
                />
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                {/* PRIMARY BUTTON (glow) */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="
                    px-24 py-5 
                    text-xl font-bold text-white
                    rounded-full
                    bg-gradient-to-r from-red-500 to-red-600
                    shadow-[0_0_18px_rgba(255,45,45,0.6)]
                    hover:shadow-[0_0_25px_rgba(255,45,45,0.9)]
                    hover:scale-105 
                    active:scale-100
                    transition-all duration-300
                    tracking-wide
                  "
                >
                  🔥 Сугалаа шалгах
                </button>

                {/* SECONDARY GLASS BUTTON */}
                <button
                  onClick={() => setIsPurchaseModalOpen(true)}
                  className="
                    px-20 py-5 
                    text-xl font-bold 
                    rounded-full
                    text-white
                    bg-white/10 
                    backdrop-blur-lg
                    border border-white/20
                    hover:bg-white/20 
                    hover:border-white/40
                    hover:scale-105
                    active:scale-100
                    transition-all duration-300
                    shadow-[0_0_25px_rgba(255,255,255,0.12)]
                  "
                >
                  Сугалаа авах
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating aurora lights */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[400px] h-[400px] bg-red-500/20 blur-[120px] -top-20 -right-20 rounded-full animate-pulse-slow"></div>
          <div className="absolute w-[350px] h-[350px] bg-blue-500/20 blur-[130px] bottom-0 left-0 rounded-full animate-pulse-slower"></div>
        </div>
      </section>
    </>
  );
};


export default Hero;
