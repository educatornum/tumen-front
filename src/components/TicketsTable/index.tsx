"use client";
import { useState, useEffect } from "react";
import { Search, Trophy, Calendar, Tag } from "lucide-react";

interface Ticket {
  id: number;
  number: string;
  phone_number: string;
  name: string;
  is_bonus: boolean;
  is_used: boolean;
  created_at: string;
}

interface GroupedTicket {
  phone_number: string;
  tickets: Ticket[];
}

interface TicketsData {
  total: number;
  tickets: Ticket[];
}


export default function TicketsTable() {
  const [ticketsData, setTicketsData] = useState<TicketsData | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error,setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const itemsPerPage = 10;

   useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL || 'http://localhost:3000';
      const onGhPages = !!process.env.NEXT_PUBLIC_BASE_PATH;
      const endpoint = onGhPages ? `${backendUrl}/lottery/recent` : '/api/lottery/recent';
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setTicketsData(data);
    } catch (err: any) {
      setError(err.message || 'Алдаа гарлаа');
      console.error('Error fetching tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Group tickets by phone number
  const groupedData: GroupedTicket[] = ticketsData?.tickets.reduce((acc, ticket) => {
    const existing = acc.find(g => g.phone_number === ticket.phone_number);
    if (existing) {
      existing.tickets.push(ticket);
    } else {
      acc.push({ phone_number: ticket.phone_number, tickets: [ticket] });
    }
    return acc;
  }, [] as GroupedTicket[]) || [];

  // Filter grouped data
  const filtered = groupedData.filter(
    g => g.phone_number.includes(search) || g.tickets.some(
      t => t.number.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const toggleRow = (phoneNumber: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(phoneNumber)) {
        newSet.delete(phoneNumber);
      } else {
        newSet.add(phoneNumber);
      }
      return newSet;
    });
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  if(loading) return (
    <div className="min-h-[40vh] w-full px-4 py-8 bg-gradient-to-b from-white to-orange-50 flex justify-center items-center">
      <div className="max-w-4xl mx-auto rounded-2xl p-6 border border-orange-200 bg-white shadow-sm text-center">
        <p className="text-orange-500 text-sm">Уншиж байна...</p>
      </div>
    </div>
  );

  return (
    <div className="w-full px-4 py-10 bg-gradient-to-b from-white via-orange-50 to-white">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-orange-600">
            Сүүлийн гүйлгээ
          </h2>
          <div className="mt-4 mx-auto bg-yellow-50 border border-yellow-300 rounded-lg p-3 shadow-md">
            <p className="text-sm font-medium text-yellow-800 flex items-start justify-center text-left">
             ⚠️ АНХААРУУЛГА: Манай систем шинэчлэгдсэнтэй холбоотойгоор мессежээр сугалааны код илгээгдэхгүй.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border border-orange-200 rounded-xl bg-white shadow mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
            <input 
              type="text" 
              value={search} 
              onChange={(e)=>{setSearch(e.target.value); setCurrentPage(1);}} 
              placeholder="Утас, дугаар, гүйлгээний утга..." 
              className={`w-full pl-10 pr-8 py-3 border border-orange-200 rounded-xl text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 ${search ? "font-bold text-black" : "text-slate-700"}`} 
            />
            {search && (
              <button onClick={()=>setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 hover:text-orange-600 text-sm">✕</button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="bg-white border border-orange-200 rounded-2xl shadow">
          {currentItems.length===0 ? (
            <div className="py-12 text-center text-orange-400">Илэрц олдсонгүй</div>
          ) : (
            currentItems.map((group, idx)=>{
              const isExpanded = expandedRows.has(group.phone_number);
              return (
                <div key={`${group.phone_number}-${idx}`} className="border-b border-orange-100 last:border-0">
                  {/* Clickable header */}
                  <div
                    onClick={() => toggleRow(group.phone_number)}
                    className="p-4 cursor-pointer hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="text-orange-700 font-mono font-bold text-lg">{group.phone_number}</div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 border border-orange-300 rounded-full">
                          <Tag className="w-3.5 h-3.5 text-orange-600" />
                          <span className="text-orange-700 font-bold text-xs">{group.tickets.length} сугалаа</span>
                        </div>
                      </div>
                      <div className="text-orange-500 text-xl">
                        {isExpanded ? "▼" : "▶"}
                      </div>
                    </div>
                  </div>

                  {/* Expandable content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-4 pb-4 space-y-2">
                      {group.tickets.map((ticket, tidx)=>(
                        <div
                          key={tidx}
                          className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200 transform transition-all duration-200"
                          style={{
                            transitionDelay: `${tidx * 50}ms`
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-orange-700 font-mono font-bold text-sm">{ String(ticket.number).padStart(6, '0')}</span>
                            <span className="text-orange-300">•</span>
                            <div className="flex items-center gap-1.5">
                              <Trophy className="w-3.5 h-3.5 text-orange-500" />
                              <span className="text-orange-900 text-sm">{ticket.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-orange-500 text-xs">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(ticket.created_at)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages>1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({length: totalPages}, (_, i)=>(
              <button 
                key={i} 
                onClick={()=>setCurrentPage(i+1)} 
                className={`px-3 py-1 rounded-md border ${currentPage===i+1 ? "bg-orange-600 text-white border-orange-600" : "bg-white text-orange-700 border-orange-300 hover:bg-orange-50"}`}
              >
                {i+1}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
