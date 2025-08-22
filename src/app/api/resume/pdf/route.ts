import { getLatestResume } from '../../../../lib/sanity';

export async function GET() {
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

  // Add cache control headers to prevent caching
  headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');

  return new Response(pdfRes.body, {
    status: pdfRes.status,
    headers,
  });
}
