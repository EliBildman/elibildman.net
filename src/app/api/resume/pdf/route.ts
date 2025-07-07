import { NextRequest } from 'next/server';
import { getLatestResume } from '../../../../lib/sanity';

export async function GET(_: NextRequest) {
  const resume = await getLatestResume();
  const pdfUrl = resume?.pdfUrl;
  if (!pdfUrl) {
    return new Response('Resume PDF not found', { status: 404 });
  }
  const pdfRes = await fetch(pdfUrl);
  if (!pdfRes.ok) {
    return new Response('Failed to fetch PDF', { status: 502 });
  }
  const headers = new Headers(pdfRes.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Content-Disposition', 'inline; filename="resume.pdf"');
  return new Response(pdfRes.body, {
    status: pdfRes.status,
    headers,
  });
}
