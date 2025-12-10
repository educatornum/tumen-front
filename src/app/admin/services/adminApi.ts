const API_BASE_URL = 'https://tumensugalaa.mn/api/admin';

// Types for API responses
export interface TicketData {
  id: number;
  number: string;
  phone_number: string;
  name: string;
  is_bonus: boolean;
  is_used: boolean;
  created_at: string;
}

export interface RecentTicketsResponse {
  total: number;
  tickets: TicketData[];
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
  const url = `${API_BASE_URL}/recent?startdate=${formatDateForApi(startDate)}&enddate=${formatDateForApi(endDate)}`;

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

// Fetch no lottery records (Failed)
export const fetchNoLotteryRecords = async (
  startDate: string,
  endDate: string
): Promise<NoLotteryRecord[]> => {
  const url = `${API_BASE_URL}/no_lottory?startdate=${formatDateForApi(startDate)}&enddate=${formatDateForApi(endDate)}`;

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

    const data: NoLotteryRecord[] = await response.json();
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
): Promise<TransactionRecord[]> => {
  const url = `${API_BASE_URL}/alltran?startdate=${formatDateForApi(startDate)}&enddate=${formatDateForApi(endDate)}`;

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

    const data: TransactionRecord[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    throw error;
  }
};
