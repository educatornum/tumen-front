"use client";
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  AlertCircle, 
  FileText, 
  LayoutDashboard, 
  Bell, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet,
  Ticket,
  Calendar,
  Phone,
  CheckCircle2,
  Star,
  MoreHorizontal,
  Download
} from 'lucide-react';

// Types definition
type TabType = 'winners' | 'failed' | 'transactions';

interface TicketData {
  id: number;
  number: string;
  phone_number: string;
  name: string;
  is_bonus: boolean;
  is_used: boolean;
  created_at: string;
}

// Утасны дугаар болон бүтээгдэхүүний нэрээр хайлт хийх функц
// Том өгөгдлийн сангийн хувьд энэ хэсэг нь ихэвчлэн API руу хийгдэх ёстой.
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('winners');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); 

  // Өнөөдрийн огноог 'YYYY-MM-DD' форматтай авах функц
  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  // 1. Огнооны оролтын утга (UI-д харагдах, түр зуурын төлөв)
  const [startDate, setStartDate] = useState<string>(getTodayDateString);
  const [endDate, setEndDate] = useState<string>(getTodayDateString);

  // 2. Баталгаажсан огнооны төлөв (Filtering логикийг ажиллуулах үндсэн төлөв)
  const [confirmedStartDate, setConfirmedStartDate] = useState<string>(getTodayDateString);
  const [confirmedEndDate, setConfirmedEndDate] = useState<string>(getTodayDateString);


  // MOCK DATA: Өнөөдөр болон өчигдрийн өгөгдлийг загварчилж үүсгэв.
  const todayString = new Date().toISOString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString();
  
  const mockTickets: TicketData[] = useMemo(() => ([
    // Өнөөдрийн өгөгдөл (Энэ нь анхдагчаар харагдах ёстой)
    { "id": 104764, "number": "1473", "phone_number": "83160121", "name": "PRADO 150", "is_bonus": false, "is_used": true, "created_at": todayString },
    { "id": 104763, "number": "1472", "phone_number": "95885189", "name": "PRADO 150", "is_bonus": false, "is_used": true, "created_at": todayString },
    { "id": 104761, "number": "1470", "phone_number": "95732897", "name": "IPHONE 15", "is_bonus": false, "is_used": true, "created_at": todayString },
    { "id": 104760, "number": "1469", "phone_number": "99833053", "name": "PRADO 150", "is_bonus": false, "is_used": true, "created_at": todayString },
    // Өчигдрийн өгөгдөл (Огноог өөрчлөхөд харагдах ёстой)
    { "id": 104762, "number": "1471", "phone_number": "88567149", "name": "PRIUS 30", "is_bonus": false, "is_used": true, "created_at": yesterdayString },
    { "id": 104759, "number": "1468", "phone_number": "99112233", "name": "PRADO 150", "is_bonus": true, "is_used": true, "created_at": yesterdayString },
    { "id": 104758, "number": "1467", "phone_number": "96655443", "name": "PRIUS 30", "is_bonus": false, "is_used": true, "created_at": yesterdayString },
    { "id": 104757, "number": "1466", "phone_number": "89876543", "name": "PRADO 150", "is_bonus": false, "is_used": false, "created_at": yesterdayString },
  ]), [todayString, yesterdayString]);

  // Хайлтын үр дүн (Огноо + Утга)
  const displayedTickets = useMemo(() => {
    // Шүүлтүүрийг ЗӨВХӨН confirmedStartDate болон confirmedEndDate ашиглан хийнэ.
    // 1. Огноогоор шүүх (Date Filtering)
    // Огноог TimeStamp болгон хөрвүүлэх (эхлэх огнооны 00:00:00 - дуусах огнооны 23:59:59)
    const startTimestamp = confirmedStartDate ? new Date(confirmedStartDate).setHours(0, 0, 0, 0) : 0;
    const endTimestamp = confirmedEndDate ? new Date(confirmedEndDate).setHours(23, 59, 59, 999) : Infinity;

    // Өгөгдлийг огнооны хязгаарт багтааж шүүх
    const dateFiltered = mockTickets.filter(ticket => {
        const ticketDate = new Date(ticket.created_at).getTime();
        return ticketDate >= startTimestamp && ticketDate <= endTimestamp;
    });

    // 2. Утгаар хайх (Text Search Filtering)
    if (!searchTerm) return dateFiltered;
    
    const lowerCaseSearch = searchTerm.toLowerCase();

    return dateFiltered.filter(ticket =>
      // Сугалааны дугаар
      ticket.number.includes(searchTerm) ||
      // Утасны дугаар
      ticket.phone_number.includes(searchTerm) ||
      // Бүтээгдэхүүний нэр
      ticket.name.toLowerCase().includes(lowerCaseSearch)
    );
  }, [mockTickets, confirmedStartDate, confirmedEndDate, searchTerm]);


  // Огноо хөрвүүлэх функц
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('mn-MN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const menuItems = [
    { 
      id: 'winners', 
      label: 'Нийт сугалаа авсан харилцагчид', 
      icon: Ticket,
      description: 'Сугалаанд оролцох эрхтэй хэрэглэгчид'
    },
    { 
      id: 'failed', 
      label: 'Сугалаа олгож чадаагүй', 
      icon: AlertCircle,
      description: 'Алдаа гарсан болон цуцлагдсан'
    },
    
    { 
      id: 'transactions', 
      label: 'Нийт гүйлгээний тайлан', 
      icon: FileText,
      description: 'Санхүүгийн нэгдсэн мэдээлэл'
    },
  ];

  // ----------------------------------------------------------------------
  // RENDER CONTENT
  // ----------------------------------------------------------------------

  const renderContent = () => {
    switch (activeTab) {
      case 'winners':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Сугалаа авсан харилцагчид</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    Олдсон: {displayedTickets.length}
                  </span>
                  <p className="text-slate-500 text-sm">PRADO 150 сугалааны оролцогчид</p>
                </div>
              </div>
              <div className="flex gap-3">
                 <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  <Download className="w-4 h-4" />
                  Excel татах
                </button>
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-orange-200">
                  Шинэ сугалаа нэмэх
                </button>
              </div>
            </div>
            
            {/* 2. ОГНООНЫ ХЯЗГААРТ ХАЙХ ТАЛБАР */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Огнооны хязгаар</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="start-date" className="text-xs font-medium text-slate-500 mb-1">Эхлэх огноо</label>
                        <input 
                            type="date" 
                            id="start-date"
                            // Энэ нь зөвхөн UI-ийн утга байна
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="end-date" className="text-xs font-medium text-slate-500 mb-1">Дуусах огноо</label>
                        <input 
                            type="date" 
                            id="end-date"
                            // Энэ нь зөвхөн UI-ийн утга байна
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        />
                    </div>
                    <div className="flex items-end">
                        {/* Огноогоор шүүх товчлуур: Энэ нь шүүлтүүрийн төлөвийг (confirmed dates) баталгаажуулна */}
                        <button 
                            className="w-full bg-orange-600 text-white hover:bg-orange-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm h-[38px] disabled:bg-orange-300"
                            disabled={!startDate || !endDate}
                            onClick={() => {
                                // Товчлуур дарагдахад, UI-ийн утгыг баталгаажуулж, filtering-ийг эхлүүлнэ
                                setConfirmedStartDate(startDate);
                                setConfirmedEndDate(endDate);
                                console.log('Filtering data for date range:', startDate, 'to', endDate);
                            }}
                        >
                            Огноогоор шүүх
                        </button>
                    </div>
                </div>
            </div>

            {/* DATA TABLE TEXT SEARCH INPUT */}
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

            {/* DATA TABLE */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Сугалааны дугаар</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Утасны дугаар</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Бүтээгдэхүүн</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Төлөв</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Огноо</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedTickets.length > 0 ? (
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
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                          {searchTerm || confirmedStartDate !== getTodayDateString() || confirmedEndDate !== getTodayDateString()
                            ? "Хайлтын үр дүн олдсонгүй."
                            : "Өнөөдрийн өгөгдөл олдсонгүй."
                          }
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Хуудаслалтгүй жагсаалтын мэдээлэл */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {searchTerm 
                    ? `Хайлтын үр дүнд ${displayedTickets.length} өгөгдөл олдлоо (Нийт ${mockTickets.length})` 
                    : `Сонгосон огноонд ${displayedTickets.length} өгөгдөл харагдаж байна (Нийт ${mockTickets.length})`
                  }
                </span>
              </div>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Сугалаа олгож чадаагүй</h2>
                <p className="text-slate-500 mt-1">Системийн алдаа эсвэл буцаалт хийгдсэн жагсаалт</p>
              </div>
              <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Асуудлыг шийдвэрлэх
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Алдааны тайлан одоогоор хоосон байна</h3>
              <p className="text-slate-500 max-w-md mt-2">
                Алдаа гарсан тохиолдолд энд жагсаалт үүсэх болно.
              </p>
            </div>
          </div>
        );

      case 'transactions':
        return (
           <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Сугалаа олгож чадаагүй</h2>
                <p className="text-slate-500 mt-1">Системийн алдаа эсвэл буцаалт хийгдсэн жагсаалт</p>
              </div>
              <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Асуудлыг шийдвэрлэх
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Алдааны тайлан одоогоор хоосон байна</h3>
              <p className="text-slate-500 max-w-md mt-2">
                Алдаа гарсан тохиолдолд энд жагсаалт үүсэх болно.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-20'
        } bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col fixed md:relative h-full z-20 shadow-xl`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-wide">ADMIN</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
                <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                
                {isSidebarOpen && (
                  <div className="text-left animate-fadeIn">
                    <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                      {item.label}
                    </p>
                  </div>
                )}
                
                {!isSidebarOpen && isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-slate-800">
              AD
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-slate-500 truncate">admin@system.mn</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            >
              {isSidebarOpen ? <Menu className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            
            <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 w-64 lg:w-96 border border-transparent focus-within:border-orange-300 focus-within:bg-white focus-within:shadow-sm transition-all">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Утасны дугаар, сугалаагаар хайх..." 
                className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;