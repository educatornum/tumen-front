import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Update this URL to your actual backend API endpoint
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3000';
    const response = await fetch(`${backendUrl}/lottery/recent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch tickets data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

