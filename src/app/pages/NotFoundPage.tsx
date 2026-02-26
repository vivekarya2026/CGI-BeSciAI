import React from 'react';
import { useNavigate } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ fontFamily: 'var(--font-primary)', backgroundColor: '#f8f9fb' }}>
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6">🧭</div>
        <h1 style={{ fontSize: 38, fontWeight: 700, color: '#151515' }} className="mb-3">
          Page Not Found
        </h1>
        <p style={{ fontSize: 16, lineHeight: '24px', color: '#5c5c5c' }} className="mb-8">
          Looks like you've wandered off the path. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            style={{ fontSize: 16, color: '#5c5c5c' }}
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white cursor-pointer"
            style={{
              backgroundColor: '#5236ab',
              fontSize: 16,
              fontWeight: 600,
              boxShadow: '0px 1px 5px rgba(0,0,0,0.12), 0px 2px 2px rgba(0,0,0,0.14)',
            }}
          >
            <Home size={18} />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
