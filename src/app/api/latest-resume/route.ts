import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const resumesDir = path.join(process.cwd(), 'resumes');
  let files: string[] = [];
  try {
    files = await fs.readdir(resumesDir);
  } catch (e) {
    return new NextResponse('Resume directory not found', { status: 404 });
  }
  const pdfs = files.filter((f) => f.endsWith('.pdf'));
  if (pdfs.length === 0) {
    return new NextResponse('No resumes found', { status: 404 });
  }
  // Sort by date in filename (ISO format)
  pdfs.sort((a, b) => b.localeCompare(a)); // descending
  const latest = pdfs[0];
  const filePath = path.join(resumesDir, latest);
  let fileBuffer: Buffer;
  try {
    fileBuffer = await fs.readFile(filePath);
  } catch (e) {
    return new NextResponse('Failed to read resume', { status: 500 });
  }
  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="EliBildmanResume.pdf"',
      'Cache-Control': 'no-store',
    },
  });
}
