'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

const RESUME_URL = '/api/latest-resume';
const DOWNLOAD_NAME = 'EliBildmanResume.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export default function PDFViewerInner() {
  // Suppress benign AbortException warning from react-pdf
  useEffect(() => {
    const originalWarn = console.warn;
    const originalError = console.error;
    function filterAbortException(...args: any[]) {
      if (
        args.some(
          (arg) =>
            typeof arg === 'string' &&
            arg.includes('AbortException: TextLayer task cancelled')
        )
      ) {
        return;
      }
      return originalWarn.apply(console, args);
    }
    function filterAbortExceptionError(...args: any[]) {
      if (
        args.some(
          (arg) =>
            typeof arg === 'string' &&
            arg.includes('AbortException: TextLayer task cancelled')
        )
      ) {
        return;
      }
      return originalError.apply(console, args);
    }
    console.warn = filterAbortException;
    console.error = filterAbortExceptionError;
    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(700);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        setContainerWidth(Math.min(containerRef.current.offsetWidth, 700));
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = RESUME_URL;
    link.download = DOWNLOAD_NAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[700px] px-2 sm:px-0 flex flex-col items-center"
    >
      <button
        onClick={handleDownload}
        className="w-full max-w-[700px] mb-3 px-4 py-0.5 border border-gray-300 rounded-md bg-white text-gray-600 hover:text-gray-900 transition text-base font-medium"
        aria-label="Download resume as PDF"
      >
        Download as PDF
      </button>
      <div className="w-full flex flex-col items-center">
        <Document
          file={RESUME_URL}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setLoading(false);
            setError(null);
          }}
          onLoadError={(err) => {
            setError('Failed to load PDF.');
            setLoading(false);
          }}
          loading={<div className="text-gray-500 my-8">Loading PDF…</div>}
          error={<div className="text-red-500 my-8">Failed to load PDF.</div>}
        >
          {Array.from(new Array(numPages || 0), (el, idx) => (
            <div
              key={`page_wrapper_${idx + 1}`}
              className={
                idx === 0
                  ? 'mb-4 shadow border rounded overflow-hidden w-full'
                  : 'my-4 shadow border rounded overflow-hidden w-full'
              }
            >
              <Page pageNumber={idx + 1} width={containerWidth} />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}
