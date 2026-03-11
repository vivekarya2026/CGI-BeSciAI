import React from 'react';
import { useNavigate } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="text-center max-w-md">
        <div className="not-found-emoji">🧭</div>
        <h1 className="not-found-title mb-3">
          Page Not Found
        </h1>
        <p className="not-found-message">
          Looks like you've wandered off the path. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="not-found-button-back"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="not-found-button-home"
          >
            <Home size={18} />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
