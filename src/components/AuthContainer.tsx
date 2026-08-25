import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Mail, Phone, ArrowLeft, KeyRound, AlertTriangle } from 'lucide-react';
import { RegistrationPackageData } from '../types';

interface AuthContainerProps {
  registeredUsers: RegistrationPackageData[];
  onVerificationSuccess: (email: string, mobile: string) => void;
  onLoginSuccess: (registrationId: string) => void;
  onCancel: () => void;
  initialMode?: 'welcome' | 'login' | 'register';
}

type AuthMode = 'welcome' | 'register_email' | 'register_mobile' | 'register_complete' | 'login_input' | 'login_otp';

// For demo purposes, we will simulate OTP behavior
// We generate a secret OTP, but we let the user know what to enter or auto-fill it for them in a premium way
const DEMO_OTP = '123456';

export const AuthContainer: React.FC<AuthContainerProps> = ({
  registeredUsers,
  onVerificationSuccess,
  onLoginSuccess,
  onCancel,
  initialMode = 'welcome'
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode === 'login' ? 'login_input' : initialMode === 'register' ? 'register_email' : 'welcome');
  
  // Registration States
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);

  // OTP inputs (6 separate slots)
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  // Timers and Counts for Rate Limiting
  const [emailResendTimer, setEmailResendTimer] = useState(0);
  const [mobileResendTimer, setMobileResendTimer] = useState(0);
  const [loginResendTimer, setLoginResendTimer] = useState(0);
  
  // Validation / Error states
  const [errorMsg, setErrorMsg] = useState('');
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpRequestsCount, setOtpRequestsCount] = useState(0);

  // Login states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [matchedUser, setMatchedUser] = useState<RegistrationPackageData | null>(null);

  // Countdown timers effect
  useEffect(() => {
    let interval: any;
    if (emailResendTimer > 0) {
      interval = setInterval(() => setEmailResendTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [emailResendTimer]);

  useEffect(() => {
    let interval: any;
    if (mobileResendTimer > 0) {
      interval = setInterval(() => setMobileResendTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mobileResendTimer]);

  useEffect(() => {
    let interval: any;
    if (loginResendTimer > 0) {
      interval = setInterval(() => setLoginResendTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [loginResendTimer]);

  // Clean OTP fields when changing screens
  const resetOtpFields = () => {
    setOtpValues(Array(6).fill(''));
    setErrorMsg('');
    setOtpAttempts(0);
  };

  // Check unique details for new registration
  const isEmailRegistered = (emailStr: string) => {
    return registeredUsers.some(u => u.delegate.email.trim().toLowerCase() === emailStr.trim().toLowerCase());
  };

  const isMobileRegistered = (mobileStr: string) => {
    const cleanMobile = mobileStr.replace(/[^0-9]/g, '');
    return registeredUsers.some(u => u.delegate.mobile.replace(/[^0-9]/g, '') === cleanMobile);
  };

  // OPT handler helpers
  const handleOtpChange = (index: number, value: string) => {
    if (/[^0-9]/.test(value)) return; // Allow numbers only
    
    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const newValues = [...otpValues];
      if (newValues[index] === '' && index > 0) {
        // Clear previous input and focus it
        newValues[index - 1] = '';
        setOtpValues(newValues);
        otpInputRefs.current[index - 1]?.focus();
      } else {
        newValues[index] = '';
        setOtpValues(newValues);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const chars = pastedData.split('');
      setOtpValues(chars);
      otpInputRefs.current[5]?.focus();
    }
  };

  // Actions
  const handleSendEmailOtp = () => {
    setErrorMsg('');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (isEmailRegistered(email)) {
      setErrorMsg('This email is already registered. Please login instead.');
      return;
    }

    // Rate limit check (Max 5 requests in a session)
    if (otpRequestsCount >= 5) {
      setErrorMsg('Too many requests. Please try again later.');
      return;
    }

    setEmailOtpSent(true);
    setOtpRequestsCount(prev => prev + 1);
    setEmailResendTimer(30);
    resetOtpFields();
    // Simulate auto-focus to first digit
    setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
  };

  const handleVerifyEmailOtp = () => {
    setErrorMsg('');
    const fullOtp = otpValues.join('');
    
    if (fullOtp.length < 6) {
      setErrorMsg('Please enter the complete 6-digit OTP.');
      return;
    }

    if (fullOtp !== DEMO_OTP) {
      setOtpAttempts(prev => prev + 1);
      if (otpAttempts >= 2) {
        setErrorMsg('OTP expired or invalid. Please request a new OTP.');
      } else {
        setErrorMsg('Invalid OTP. Please try again.');
      }
      return;
    }

    setIsEmailVerified(true);
    setMode('register_mobile');
    resetOtpFields();
  };

  const handleSendMobileOtp = () => {
    setErrorMsg('');
    if (!mobile.trim() || mobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (isMobileRegistered(mobile)) {
      setErrorMsg('This mobile number is already registered. Please login instead.');
      return;
    }

    setMobileOtpSent(true);
    setMobileResendTimer(30);
    resetOtpFields();
    setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
  };

  const handleVerifyMobileOtp = () => {
    setErrorMsg('');
    const fullOtp = otpValues.join('');
    
    if (fullOtp.length < 6) {
      setErrorMsg('Please enter the complete 6-digit OTP.');
      return;
    }

    if (fullOtp !== DEMO_OTP) {
      setOtpAttempts(prev => prev + 1);
      if (otpAttempts >= 2) {
        setErrorMsg('OTP expired or invalid. Please request a new OTP.');
      } else {
        setErrorMsg('Invalid OTP. Please try again.');
      }
      return;
    }

    setIsMobileVerified(true);
    setMode('register_complete');
    resetOtpFields();
  };

  const handleLoginSubmit = () => {
    setErrorMsg('');
    if (!loginIdentifier.trim()) {
      setErrorMsg('Please enter your registered email or mobile number.');
      return;
    }

    // Match identifier in registered list
    const cleanId = loginIdentifier.trim().toLowerCase();
    const cleanMobile = loginIdentifier.replace(/[^0-9]/g, '');

    const user = registeredUsers.find(u => 
      u.delegate.email.trim().toLowerCase() === cleanId || 
      u.delegate.mobile.replace(/[^0-9]/g, '') === cleanMobile
    );

    if (!user) {
      setErrorMsg('No active registration account found matching this email or mobile.');
      return;
    }

    setMatchedUser(user);
    setLoginOtpSent(true);
    setLoginResendTimer(30);
    resetOtpFields();
    setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
  };

  const handleVerifyLoginOtp = () => {
    setErrorMsg('');
    const fullOtp = otpValues.join('');
    
    if (fullOtp.length < 6) {
      setErrorMsg('Please enter the complete 6-digit OTP.');
      return;
    }

    if (fullOtp !== DEMO_OTP) {
      setOtpAttempts(prev => prev + 1);
      if (otpAttempts >= 2) {
        setErrorMsg('OTP expired or invalid. Please request a new OTP.');
      } else {
        setErrorMsg('Invalid OTP. Please try again.');
      }
      return;
    }

    if (matchedUser) {
      onLoginSuccess(matchedUser.registrationId || matchedUser.applicationId);
    }
  };

  useEffect(() => {
    // If the mode is login_otp, update the mode directly when trigger identifier gets OTP sent
    if (loginOtpSent) {
      setMode('login_otp');
    }
  }, [loginOtpSent]);

  return (
    <div className="w-full max-w-[480px] mx-auto bg-white rounded-[12px] border border-[#DDE5DF] p-6 sm:p-8 shadow-xs my-8 space-y-6">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#151A17] tracking-tight">
          Indian Seed Congress 2027
        </h2>
        <p className="text-xs sm:text-sm text-[#7A847E]">
          {mode === 'welcome' && 'Continue to registration'}
          {mode === 'register_email' && 'Verify your email address'}
          {mode === 'register_mobile' && 'Verify your mobile number'}
          {mode === 'register_complete' && 'Verification Complete'}
          {mode === 'login_input' && 'Welcome back'}
          {mode === 'login_otp' && 'Verify Login OTP'}
        </p>
      </div>

      {/* Screen 1: Welcome Options */}
      {mode === 'welcome' && (
        <div className="space-y-4 pt-2">
          <button
            type="button"
            onClick={() => {
              setMode('register_email');
              resetOtpFields();
            }}
            className="w-full py-3 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded-[9px] text-sm tracking-wide transition-all shadow-xs"
          >
            New Registration
          </button>
          
          <button
            type="button"
            onClick={() => {
              setMode('login_input');
              resetOtpFields();
            }}
            className="w-full py-3 bg-white hover:bg-slate-50 text-[#151A17] border border-[#DDE5DF] font-bold rounded-[9px] text-sm tracking-wide transition-all"
          >
            Login
          </button>
        </div>
      )}

      {/* Screen 2a: Email Input / OTP Screen */}
      {mode === 'register_email' && (
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A847E]" />
              <input
                type="email"
                disabled={emailOtpSent}
                placeholder="rajesh@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="isc-input pl-10 text-sm"
              />
            </div>
            {errorMsg && !emailOtpSent && (
              <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>
            )}
          </div>

          {!emailOtpSent ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMode('welcome')}
                className="flex items-center justify-center gap-1 px-4 py-3 bg-white text-[#59635D] border border-[#DDE5DF] rounded-[9px] text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={handleSendEmailOtp}
                className="flex-1 py-3 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded-[9px] text-xs tracking-wide transition-all shadow-xs"
              >
                Send OTP
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-2 border-t border-[#DDE5DF]/60">
              <p className="text-[11px] text-[#0B6B43] bg-emerald-50 border border-emerald-100 p-2.5 rounded-[6px] font-medium">
                OTP sent to your email address. For demonstration, please enter: <span className="font-bold underline">{DEMO_OTP}</span>
              </p>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] text-center">
                  Enter Email OTP
                </label>
                
                {/* 6 Digit Input Slots */}
                <div className="flex justify-center gap-2">
                  {otpValues.map((val, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      className="w-10 h-12 text-center text-lg font-bold border border-[#DDE5DF] rounded-[6px] focus:outline-none focus:border-[#0B6B43] focus:ring-3 focus:ring-[#0B6B43]/10 bg-white text-[#151A17] font-mono"
                    />
                  ))}
                </div>
                {errorMsg && (
                  <p className="text-xs text-rose-600 font-semibold text-center mt-2">{errorMsg}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleVerifyEmailOtp}
                  className="w-full py-3 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded-[9px] text-sm tracking-wide transition-all"
                >
                  Verify Email
                </button>

                <div className="text-center">
                  {emailResendTimer > 0 ? (
                    <span className="text-[11px] text-[#7A847E] font-medium">
                      Resend OTP in {emailResendTimer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      className="text-[11px] text-[#0B6B43] hover:underline font-bold"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEmailOtpSent(false);
                    setErrorMsg('');
                  }}
                  className="text-xs text-[#59635D] hover:underline font-medium text-center"
                >
                  Change Email Address
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Screen 2b: Mobile Input / OTP Screen */}
      {mode === 'register_mobile' && (
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17]">
              Mobile Number
            </label>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3.5 rounded-[9px] border border-[#DDE5DF] bg-slate-50 text-xs font-bold text-[#59635D] font-mono-num">
                +91
              </span>
              <div className="relative flex-1">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A847E]" />
                <input
                  type="tel"
                  maxLength={10}
                  disabled={mobileOtpSent}
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                  className="isc-input pl-10 text-sm font-mono-num"
                />
              </div>
            </div>
            {errorMsg && !mobileOtpSent && (
              <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>
            )}
          </div>

          {!mobileOtpSent ? (
            <button
              type="button"
              onClick={handleSendMobileOtp}
              className="w-full py-3 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded-[9px] text-sm tracking-wide transition-all shadow-xs"
            >
              Send OTP
            </button>
          ) : (
            <div className="space-y-4 pt-2 border-t border-[#DDE5DF]/60">
              <p className="text-[11px] text-[#0B6B43] bg-emerald-50 border border-emerald-100 p-2.5 rounded-[6px] font-medium">
                OTP sent to your mobile number. For demonstration, please enter: <span className="font-bold underline">{DEMO_OTP}</span>
              </p>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] text-center">
                  Enter Mobile OTP
                </label>
                
                {/* 6 Digit Input Slots */}
                <div className="flex justify-center gap-2">
                  {otpValues.map((val, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      className="w-10 h-12 text-center text-lg font-bold border border-[#DDE5DF] rounded-[6px] focus:outline-none focus:border-[#0B6B43] focus:ring-3 focus:ring-[#0B6B43]/10 bg-white text-[#151A17] font-mono"
                    />
                  ))}
                </div>
                {errorMsg && (
                  <p className="text-xs text-rose-600 font-semibold text-center mt-2">{errorMsg}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleVerifyMobileOtp}
                  className="w-full py-3 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded-[9px] text-sm tracking-wide transition-all"
                >
                  Verify Mobile
                </button>

                <div className="text-center">
                  {mobileResendTimer > 0 ? (
                    <span className="text-[11px] text-[#7A847E] font-medium">
                      Resend OTP in {mobileResendTimer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendMobileOtp}
                      className="text-[11px] text-[#0B6B43] hover:underline font-bold"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMobileOtpSent(false);
                    setErrorMsg('');
                  }}
                  className="text-xs text-[#59635D] hover:underline font-medium text-center"
                >
                  Change Mobile Number
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Screen 2c: Verification Complete Confirmation */}
      {mode === 'register_complete' && (
        <div className="space-y-6 pt-2">
          <div className="p-4 rounded-[9px] bg-slate-50 border border-[#DDE5DF] space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#59635D]">Email Address</span>
              <span className="flex items-center gap-1 font-bold text-[#0B6B43]">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
            <p className="font-mono text-[#151A17] font-semibold">{email}</p>

            <div className="border-t border-[#DDE5DF]/60 my-2" />

            <div className="flex items-center justify-between">
              <span className="font-bold text-[#59635D]">Mobile Number</span>
              <span className="flex items-center gap-1 font-bold text-[#0B6B43]">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
            <p className="font-mono text-[#151A17] font-semibold">+91 {mobile}</p>
          </div>

          <button
            type="button"
            onClick={() => onVerificationSuccess(email, mobile)}
            className="w-full py-3 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded-[9px] text-sm tracking-wide transition-all shadow-xs"
          >
            Continue to Registration
          </button>
        </div>
      )}

      {/* Screen 3a: Login Username/Email Input */}
      {mode === 'login_input' && (
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17]">
              Email or Mobile Number
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A847E]" />
              <input
                type="text"
                placeholder="Email address or 10-digit mobile"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="isc-input pl-10 text-sm"
              />
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMode('welcome')}
              className="flex items-center justify-center gap-1 px-4 py-3 bg-white text-[#59635D] border border-[#DDE5DF] rounded-[9px] text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={handleLoginSubmit}
              className="flex-1 py-3 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded-[9px] text-xs tracking-wide transition-all shadow-xs"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Screen 3b: Login OTP Verification */}
      {mode === 'login_otp' && (
        <div className="space-y-5">
          <div className="space-y-4 pt-1">
            <p className="text-[11px] text-[#0B6B43] bg-emerald-50 border border-emerald-100 p-2.5 rounded-[6px] font-medium">
              OTP sent to your registered {loginIdentifier.includes('@') ? 'email address' : 'mobile number'}. Enter <span className="font-bold underline">{DEMO_OTP}</span>
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] text-center">
                Enter OTP
              </label>
              
              {/* 6 Digit Input Slots */}
              <div className="flex justify-center gap-2">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={idx === 0 ? handleOtpPaste : undefined}
                    className="w-10 h-12 text-center text-lg font-bold border border-[#DDE5DF] rounded-[6px] focus:outline-none focus:border-[#0B6B43] focus:ring-3 focus:ring-[#0B6B43]/10 bg-white text-[#151A17] font-mono"
                  />
                ))}
              </div>
              {errorMsg && (
                <p className="text-xs text-rose-600 font-semibold text-center mt-2">{errorMsg}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleVerifyLoginOtp}
                className="w-full py-3 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded-[9px] text-sm tracking-wide transition-all"
              >
                Verify & Login
              </button>

              <div className="text-center">
                {loginResendTimer > 0 ? (
                  <span className="text-[11px] text-[#7A847E] font-medium">
                    Resend OTP in {loginResendTimer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleLoginSubmit}
                    className="text-[11px] text-[#0B6B43] hover:underline font-bold"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setMode('login_input');
                  resetOtpFields();
                  setLoginOtpSent(false);
                }}
                className="text-xs text-[#59635D] hover:underline font-medium text-center"
              >
                Change Email / Mobile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
