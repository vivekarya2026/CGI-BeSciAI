/**
 * ============================================
 * 🔒 PASSWORD GATE — PasswordGate.tsx
 * ============================================
 *
 * This component protects the entire app with a password.
 * Users must enter the correct password before they can
 * access any page.
 *
 * HOW IT WORKS:
 * 1. Checks if the user has already entered the password
 *    (saved in sessionStorage so it lasts until the tab closes).
 * 2. If NOT authenticated → shows a beautiful lock screen.
 * 3. If authenticated → renders the children (the actual app).
 *
 * TO CHANGE THE PASSWORD:
 * Update the `SITE_PASSWORD` constant below.
 *
 * HINT: This is a client-side gate for demo/presentation
 * purposes. For production security, use server-side auth.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

// ============================================
// 🔑 CHANGE YOUR PASSWORD HERE
// ============================================
const SITE_PASSWORD = 'BeSciAI2026';

interface PasswordGateProps {
    children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
    // ---- State ----
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isChecking, setIsChecking] = useState(true);

    // ---- Check if already authenticated (on mount) ----
    useEffect(() => {
        const saved = sessionStorage.getItem('besciai_auth');
        if (saved === 'true') {
            setIsAuthenticated(true);
        }
        setIsChecking(false);
    }, []);

    // ---- Handle password submission ----
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password === SITE_PASSWORD) {
            // Correct! Save to sessionStorage and grant access
            sessionStorage.setItem('besciai_auth', 'true');
            setIsAuthenticated(true);
        } else {
            // Wrong password — shake animation is handled by the error state
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };

    // ---- Loading state (checking sessionStorage) ----
    if (isChecking) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #200a58 0%, #5236ab 40%, #a82465 70%, #e31937 100%)' }}
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full"
                />
            </div>
        );
    }

    // ---- If authenticated, render the actual app ----
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // ---- Password Entry Screen ----
    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                background: 'linear-gradient(135deg, #200a58 0%, #5236ab 40%, #a82465 70%, #e31937 100%)',
                fontFamily: 'var(--font-primary)',
            }}
        >
            {/* ---- Animated Background Particles ---- */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: 200 + i * 80,
                        height: 200 + i * 80,
                        border: '1px solid rgba(255,255,255,0.06)',
                        left: `${10 + i * 15}%`,
                        top: `${5 + i * 12}%`,
                    }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* ---- Lock Icon ---- */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="flex justify-center mb-8"
                >
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center"
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                        }}
                    >
                        <Lock size={36} className="text-white" />
                    </div>
                </motion.div>

                {/* ---- Title ---- */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                            <span className="text-white font-bold text-sm">B</span>
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">BeSciAI</span>
                    </div>
                    <h1
                        className="text-white mb-2"
                        style={{ fontSize: 24, fontWeight: 700, lineHeight: '1.3' }}
                    >
                        Protected Access
                    </h1>
                    <p className="text-white/60" style={{ fontSize: 14, lineHeight: '20px' }}>
                        Enter the password to access this application
                    </p>
                </div>

                {/* ---- Password Form ---- */}
                <form onSubmit={handleSubmit}>
                    <div
                        className="rounded-2xl p-6"
                        style={{
                            background: 'rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.15)',
                        }}
                    >
                        {/* Password Input Field */}
                        <div className="mb-4">
                            <label
                                htmlFor="password-input"
                                className="block text-white/70 mb-2"
                                style={{ fontSize: 13, fontWeight: 500 }}
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password-input"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="Enter access password"
                                    className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 outline-none transition-all"
                                    style={{
                                        background: 'rgba(255,255,255,0.08)',
                                        border: error
                                            ? '1.5px solid #ef4444'
                                            : '1.5px solid rgba(255,255,255,0.15)',
                                        fontSize: 15,
                                    }}
                                    autoFocus
                                    autoComplete="off"
                                />
                                {/* Show/hide password toggle */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-red-400 mb-4"
                                style={{ fontSize: 13 }}
                            >
                                {error}
                            </motion.p>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={!password}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{
                                background: password
                                    ? 'linear-gradient(135deg, #e31937, #a82465)'
                                    : 'rgba(255,255,255,0.1)',
                                fontSize: 15,
                                fontWeight: 600,
                                boxShadow: password ? '0 4px 15px rgba(227,25,55,0.3)' : 'none',
                            }}
                        >
                            <ShieldCheck size={18} />
                            Access Application
                            <ArrowRight size={16} />
                        </motion.button>
                    </div>
                </form>

                {/* ---- Footer hint ---- */}
                <p className="text-center text-white/30 mt-6" style={{ fontSize: 12 }}>
                    Contact the administrator if you need access credentials
                </p>
            </motion.div>
        </div>
    );
}
