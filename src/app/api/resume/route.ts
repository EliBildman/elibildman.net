import { NextResponse } from 'next/server';
import { getLatestResume } from '../../../lib/sanity';

export async function GET() {
  try {
    const resume = await getLatestResume();
    return NextResponse.json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}
