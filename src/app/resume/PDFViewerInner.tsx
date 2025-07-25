'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { getCachedResume } from '../../lib/sanity-cache';

const DOWNLOAD_NAME = 'EliBildmanResume.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export default function PDFViewerInner() {
  // Suppress benign AbortException warning from react-pdf
  useEffect(() => {
    const originalWarn = console.warn;
    const originalError = console.error;
    function filterAbortException(...args: unknown[]) {
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
    function filterAbortExceptionError(...args: unknown[]) {
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
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | undefined>(
    undefined
  );
  const [pollTries, setPollTries] = useState(0);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchResume() {
      try {
        const resume = await getCachedResume();
        if (resume?.pdfUrl) {
          setResumeUrl('/api/resume/pdf');
        } else {
          setError('No resume found');
        }
      } catch {
        setError('Failed to load resume');
      }
    }
    fetchResume();
  }, []);

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const width = Math.min(containerRef.current.offsetWidth, 700);
        if (width > 0) setContainerWidth(width);
      }
    }

    // Use ResizeObserver for more reliable sizing
    let resizeObserver: ResizeObserver | undefined;
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(containerRef.current);
    }

    // Initial calculation
    handleResize();

    // Fallback polling if width is still 0
    let pollTimer: NodeJS.Timeout | undefined;
    if (containerWidth === undefined && pollTries < 10) {
      pollTimer = setTimeout(() => {
        setPollTries((t) => t + 1);
        handleResize();
      }, 50);
    }

    // Also handle window resize events
    window.addEventListener('resize', handleResize);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (pollTimer) {
        clearTimeout(pollTimer);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [containerWidth, pollTries]);

  const handleDownload = () => {
    if (resumeUrl) {
      const link = document.createElement('a');
      link.href = '/api/resume/pdf';
      link.download = DOWNLOAD_NAME;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-[700px] px-2 sm:px-0 flex flex-col items-center">
        <div className="text-red-500 my-8">{error}</div>
      </div>
    );
  }

  if (!resumeUrl) {
    return (
      <div className="w-full max-w-[700px] px-2 sm:px-0 flex flex-col items-center">
        <div
          className="mb-3 px-4 py-0.5 border border-gray-300 rounded-md bg-white text-gray-600 transition text-base font-medium"
          style={{ width: containerWidth }}
        >
          Download as PDF
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="w-full shadow border rounded overflow-hidden bg-white">
            <div className="animate-pulse">
              <div className="h-[800px] bg-gray-200 flex items-center justify-center">
                <div className="text-gray-500 text-lg">Loading PDF...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (containerWidth === undefined) {
    // Render an empty div to allow ResizeObserver to measure
    return (
      <div
        ref={containerRef}
        className="w-full max-w-[700px] px-2 sm:px-0 flex flex-col items-center"
        style={{ minHeight: 20 }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[700px] px-2 sm:px-0 flex flex-col items-center"
    >
      <button
        onClick={handleDownload}
        className="mb-3 px-4 py-0.5 border border-gray-300 rounded-md bg-white text-gray-600 hover:text-gray-900 transition text-base font-medium"
        style={{ width: containerWidth }}
        aria-label="Download resume as PDF"
      >
        Download as PDF
      </button>
      <div className="w-full flex flex-col items-center">
        <Document
          file={resumeUrl}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
          }}
          onLoadError={() => {
            setError('Failed to load PDF.');
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
