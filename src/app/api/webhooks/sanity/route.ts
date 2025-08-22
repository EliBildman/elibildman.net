import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if this is a valid Sanity webhook
    if (body._type === 'resume') {
      // Revalidate the resume page
      revalidatePath('/resume');
      console.log('Resume updated, revalidating resume page');
    }

    // Revalidate the home page as well since it might show resume info
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Sanity webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
