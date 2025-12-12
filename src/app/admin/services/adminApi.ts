// Types for API responses
export interface TicketData {
  id: number;
  number: string;
  phone_number: string;
  name: string;
  is_bonus: boolean;
  is_used: boolean;
  created_at: string;
  amount?: number;
}

export interface RecentTicketsResponse {
  total: number;
  tickets: TicketData[];
}

export interface TransactionResponse {
  total: number;
  bank_transactions: TransactionRecord[];
}

export interface NoLotteryRecord {
  id: number;
  record_id: string;
  tranDate: string;
  amount: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionRecord {
  id: number;
  record_id: string;
  tranDate: string;
  amount: number;
  description: string;
  created_at: string;
  updated_at: string;
  type: string;
}

// Format date to YYYY-MM-DD
const formatDateForApi = (date: string): string => {
  return date; // Already in correct format
};

// Fetch recent tickets (Winners)
export const fetchRecentTickets = async (
  startDate: string,
  endDate: string
): Promise<RecentTicketsResponse> => {

  const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  process.env.BACKEND_API_URL ||
  "https://www.tumensugalaa.mn";


  const url = `${backendUrl}/api/admin/recent?startdate=${formatDateForApi(startDate)}&enddate=${formatDateForApi(endDate)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: RecentTicketsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recent tickets:', error);
    throw error;
  }
};

// Fetch no lottery records (Failed) - ЗАСВАРЛАСАН
export const fetchNoLotteryRecords = async (
  startDate: string,
  endDate: string
): Promise<TransactionResponse> => {
  const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  process.env.BACKEND_API_URL ||
  "https://www.tumensugalaa.mn";
  const url = `${backendUrl}/api/admin/no_lottory?startdate=${formatDateForApi(startDate)}&enddate=${formatDateForApi(endDate)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TransactionResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching no lottery records:', error);
    throw error;
  }
};

// Fetch all transactions
export const fetchAllTransactions = async (
  startDate: string,
  endDate: string
): Promise<TransactionResponse> => {
  const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  process.env.BACKEND_API_URL ||
  "https://www.tumensugalaa.mn";
  const url = `${backendUrl}/api/admin/alltran?startdate=${formatDateForApi(startDate)}&enddate=${formatDateForApi(endDate)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TransactionResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    throw error;
  }
};

// Fetch transactions over 100k - ЗАСВАРЛАСАН
export const fetchRecentPlus100k = async (
  startDate: string,
  endDate: string
): Promise<TransactionResponse> => {
  const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  process.env.BACKEND_API_URL ||
  "https://www.tumensugalaa.mn";
  const url = `${backendUrl}/api/admin/plus_100k?startdate=${formatDateForApi(startDate)}&enddate=${formatDateForApi(endDate)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TransactionResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching plus 100k transactions:', error);
    throw error;
  }
};