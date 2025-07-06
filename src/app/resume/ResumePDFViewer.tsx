'use client';

import dynamic from 'next/dynamic';

const PDFViewerInner = dynamic(() => import('./PDFViewerInner'), {
  ssr: false,
});

export default function ResumePDFViewer() {
  return <PDFViewerInner />;
}
