"use client";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Gabriela } from "next/font/google";

const gabriela = Gabriela({
  subsets: ["latin"],
  weight: "400",
});

// Fake data (10 rows)
const fakeData = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  number: `F-${1000 + i}`,
  phone_number: "9999-0000",
  name: "Жишээ машин",
  is_bonus: false,
  is_used: false,
  created_at: new Date().toISOString(),
}));

interface Ticket {
  id: number;
  number: string;
  phone_number: string;
  name: string;
  is_bonus: boolean;
  is_used: boolean;
  created_at: string;
}

interface TicketsData {
  total: number;
  tickets: Ticket[];
}

const TicketsTable = () => {
  const [ticketsData, setTicketsData] = useState<TicketsData | null>(null);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [usingFakeData, setUsingFakeData] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  // Search filter
  useEffect(() => {
    if (!ticketsData) return;

    const term = searchTerm.toLowerCase();
    setFilteredTickets(
      ticketsData.tickets.filter((t) =>
        t.number.toLowerCase().includes(term) ||
        t.phone_number.toLowerCase().includes(term) ||
        t.name.toLowerCase().includes(term) ||
        t.created_at.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, ticketsData]);

  // Fetch tickets
  const fetchTickets = async () => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_API_URL ||
        process.env.BACKEND_API_URL ||
        "http://localhost:3000";

      const onGhPages = !!process.env.NEXT_PUBLIC_BASE_PATH;
      const endpoint = onGhPages
        ? `${backendUrl}/lottery/recent`
        : "/api/lottery/recent";

      const response = await fetch(endpoint);

      if (!response.ok) throw new Error();

      const data = await response.json();

      if (!data || !Array.isArray(data.tickets)) throw new Error();

      setTicketsData(data);
      setFilteredTickets(data.tickets);
    } catch (err) {
      setUsingFakeData(true);
      const fake = { total: 10, tickets: fakeData };
      setTicketsData(fake);
      setFilteredTickets(fake.tickets);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("mn-MN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  // COMPACT COLUMNS
  const columns = [
    {
      name: "#",
      selector: (_row: Ticket, index: number) => index + 1,
      width: "50px",
      compact: true,
    },
    {
      name: "Сугалаа",
      selector: (row: Ticket) => row.number,
      sortable: true,
      compact: true,
      wrap: true,
    },
    {
      name: "Утас",
      selector: (row: Ticket) => row.phone_number,
      compact: true,
      width: "100px",
    },
    {
      name: "Машин",
      selector: (row: Ticket) => row.name,
      sortable: true,
      compact: true,
      wrap: true,
    },
    {
      name: "Огноо",
      selector: (row: Ticket) => formatDate(row.created_at),
      compact: true,
      width: "150px",
    },
  ];

  return (
    <div className="container py-8">
      <div className="bg-white dark:bg-gray-dark p-4 rounded-lg shadow-lg">

        <h2 className={`text-xl font-bold text-primary mb-4 ${gabriela.className}`}>
          🎫 Сүүлийн 20 сугалаа
        </h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Хайх..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-full mb-4 px-3 py-2 rounded-lg border border-gray-300 
            dark:bg-gray-800 dark:text-white
            focus:ring-2 focus:ring-primary
            text-sm
          "
        />

        {usingFakeData && (
          <p className="text-yellow-600 text-sm mb-3">
            ⚠️ Серверээс дата татсангүй, жишээ дата ашиглав.
          </p>
        )}

        {/* Scrollable container */}
        <div className="max-h-[65vh] overflow-y-auto border rounded-lg">
          <DataTable
            columns={columns}
            data={filteredTickets}
            pagination={false}   // ❌ Хуудаслалт байхгүй
            dense              // ✔ Үсэг, padding багатай compact mode
            responsive
            highlightOnHover
            customStyles={{
              table: {
                style: {
                  minWidth: "100%",   // table эхлээд бага өргөн авна
                  width: "max-content",
                },
              },
              headCells: {
                style: {
                  padding: "4px 6px",   // багана бүрийн padding багасгав
                  fontFamily: gabriela.style.fontFamily,
                  fontSize: "12px",
                },
              },
              cells: {
                style: {
                  padding: "4px 6px",
                  fontFamily: gabriela.style.fontFamily,
                  fontSize: "13px",
                  whiteSpace: "nowrap", // шахаж багтаана
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketsTable;
