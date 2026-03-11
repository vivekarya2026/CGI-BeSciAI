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
import clsx from 'clsx';

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
            <div className="password-gate-loading">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="password-gate-spinner"
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
        <div className="password-gate-container">
            {/* ---- Animated Background Particles ---- */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="password-gate-particle"
                    style={{
                        width: 200 + i * 80,
                        height: 200 + i * 80,
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
                className="password-gate-card"
            >
                {/* ---- Lock Icon ---- */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="flex justify-center mb-8"
                >
                    <div className="password-gate-lock-icon">
                        <Lock size={36} className="text-white" />
                    </div>
                </motion.div>

                {/* ---- Title ---- */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="password-gate-logo-box">
                            <span className="password-gate-logo-text">B</span>
                        </div>
                        <span className="password-gate-brand-name">BeSciAI</span>
                    </div>
                    <h1 className="password-gate-title">
                        Protected Access
                    </h1>
                    <p className="password-gate-subtitle">
                        Enter the password to access this application
                    </p>
                </div>

                {/* ---- Password Form ---- */}
                <form onSubmit={handleSubmit}>
                    <div className="password-gate-form">
                        {/* Password Input Field */}
                        <div className="mb-4">
                            <label
                                htmlFor="password-input"
                                className="password-gate-label"
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
                                    className={clsx(
                                        'password-gate-input',
                                        error && 'password-gate-input-error'
                                    )}
                                    autoFocus
                                    autoComplete="off"
                                />
                                {/* Show/hide password toggle */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-gate-toggle hover:text-white/70"
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
                                className="password-gate-error"
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
                            className={clsx(
                                'password-gate-submit',
                                password ? 'password-gate-submit-active' : 'password-gate-submit-disabled'
                            )}
                        >
                            <ShieldCheck size={18} />
                            Access Application
                            <ArrowRight size={16} />
                        </motion.button>
                    </div>
                </form>

                {/* ---- Footer hint ---- */}
                <p className="password-gate-footer">
                    Contact the administrator if you need access credentials
                </p>
            </motion.div>
        </div>
    );
}
