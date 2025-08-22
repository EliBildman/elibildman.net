import { NextResponse } from 'next/server';
import { getLatestResume } from '../../../lib/sanity';

export async function GET() {
  try {
    const resume = await getLatestResume();

    // Add cache control headers to prevent caching
    const response = NextResponse.json(resume);
    response.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}
