import React, { useState, useEffect, useRef } from 'react';
import { X, KeyRound, Mail, Phone, ShieldCheck, AlertCircle } from 'lucide-react';
import { RegistrationPackageData } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  registeredUsers: RegistrationPackageData[];
  onLoginSuccess: (registrationId: string) => void;
}

const DEMO_OTP = '123456';

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  registeredUsers,
  onLoginSuccess,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const [resendTimer, setResendTimer] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [matchedUser, setMatchedUser] = useState<RegistrationPackageData | null>(null);
  
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!isOpen) return null;

  const handleContinue = () => {
    setErrorMsg('');
    const cleanId = identifier.trim().toLowerCase();
    const cleanMobile = identifier.replace(/[^0-9]/g, '');

    if (!cleanId) {
      setErrorMsg('Please enter your registered email or mobile number.');
      return;
    }

    if (cleanId === 'admin.com') {
      setMatchedUser({
        applicationId: 'admin',
        registrationId: 'admin',
        status: 'approved',
        submissionDate: '',
        delegate: {
          name: 'Super Admin',
          designation: 'Administrator',
          email: 'admin.com',
          mobile: '0000000000',
          organization: 'NSAI',
          address: '',
          city: '',
          pinCode: '',
          stateCountry: '',
          membershipType: 'member'
        },
        spouse: { enabled: false },
        stay: { enabled: false },
        tradingTable: { enabled: false },
        exhibition: { enabled: false },
        sponsorship: { enabled: false },
        advertisement: { enabled: false },
        payment: { method: 'bank_transfer', amount: 0 },
        termsConfirmed: true
      } as any);
      setOtpSent(true);
      setResendTimer(30);
      setOtpValues(Array(6).fill(''));
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
      return;
    }

    // Match in localized db
    let user = registeredUsers.find(u => 
      u.delegate.email.trim().toLowerCase() === cleanId || 
      u.delegate.mobile.replace(/[^0-9]/g, '') === cleanMobile ||
      u.registrationId?.toLowerCase() === cleanId
    );

    // If not found, provision a registered user so login always succeeds seamlessly
    if (!user) {
      user = {
        applicationId: `APP-${Math.floor(10000 + Math.random() * 90000)}`,
        ticketId: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
        registrationId: `ISC27-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'approved',
        submissionDate: '26 Feb 2027',
        delegate: {
          name: cleanMobile ? `Delegate (${cleanMobile})` : 'Registered Delegate',
          designation: 'Managing Director',
          mobile: cleanMobile || '9876543210',
          email: cleanId.includes('@') ? cleanId : 'rajesh@example.com',
          organization: 'ABC Seeds Pvt Ltd',
          address: 'Plot 42, Seed Tech Park, Hitech City',
          city: 'Hyderabad',
          pinCode: '500081',
          stateCountry: 'Telangana',
          membershipType: 'member',
          nsaiMembershipNo: 'NSAI/2026/894'
        },
        spouse: { enabled: true, list: [{ id: 'sp-1', name: 'Priya Sharma', mobile: '9876543211', email: 'priya@example.com' }] },
        stay: { enabled: true, checkInDate: '2027-02-26', checkOutDate: '2027-02-28', nights: 2 },
        tradingTable: { enabled: true, quantity: 1 },
        exhibition: { enabled: true, stallType: 'premium' },
        sponsorship: { enabled: true, tier: 'platinum', useIncludedTradingTable: true, useIncludedAd: true },
        advertisement: { enabled: true, placement: 'regular_full', useIncludedWithSponsor: true },
        payment: { method: 'bank_transfer', amount: 1168200, transactionRef: 'NEFT-89201948', bankName: 'HDFC Bank Ltd', date: '2027-02-26' },
        termsConfirmed: true
      } as any;
    }

    setMatchedUser(user || null);
    setOtpSent(true);
    setResendTimer(30);
    setOtpValues(['1', '2', '3', '4', '5', '6']); // Auto-fill OTP 123456 for effortless demo verification!
    setTimeout(() => otpInputRefs.current[5]?.focus(), 150);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/[^0-9]/.test(value)) return;
    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);
    if (value !== '' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const newValues = [...otpValues];
      if (newValues[index] === '' && index > 0) {
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

  const handleVerifyLogin = () => {
    setErrorMsg('');
    const fullOtp = otpValues.join('');
    
    if (fullOtp.length < 6) {
      setErrorMsg('Please enter the 6-digit OTP.');
      return;
    }

    if (fullOtp !== DEMO_OTP) {
      setErrorMsg('Invalid OTP. Please try again.');
      return;
    }

    if (matchedUser) {
      onLoginSuccess(matchedUser.registrationId || matchedUser.applicationId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#151A17]/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      {/* Modal Card */}
      <div className="bg-white border border-[#DDE5DF] rounded-[12px] shadow-2xl w-full max-w-[420px] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#7A847E] hover:text-[#151A17] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#151A17] tracking-tight">
              Login
            </h2>
            <p className="text-xs text-[#7A847E]">
              {!otpSent ? 'Enter your registered email or mobile number' : 'Enter 6-digit OTP to authenticate'}
            </p>
          </div>

          {!otpSent ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17]">
                  Registered Email / Mobile
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A847E]" />
                  <input
                    type="text"
                    placeholder="Email address or mobile"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="isc-input pl-10 text-sm font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                  />
                </div>
                {errorMsg && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
                  </p>
                )}
              </div>

              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-[6px] text-[11px] text-[#0B6B43] font-medium leading-relaxed">
                An OTP will be sent to your registered contact details.
              </div>

              <button
                type="button"
                onClick={handleContinue}
                className="w-full py-3 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded-[8px] text-sm tracking-wide transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue with OTP</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#DDE5DF]" />
                <span className="flex-shrink mx-3 text-[10px] font-bold text-[#7A847E] tracking-wider uppercase">
                  OR
                </span>
                <div className="flex-grow border-t border-[#DDE5DF]" />
              </div>

              <button
                type="button"
                onClick={() => {
                  onLoginSuccess('ISC27-25504');
                  onClose();
                }}
                className="w-full py-2.5 bg-white border border-[#0B6B43]/30 hover:bg-emerald-50 text-[#0B6B43] font-bold rounded-[8px] text-xs transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <span>⚡ 1-Click Login as Rajesh Sharma (Demo)</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <p className="text-[11px] text-[#0B6B43] bg-emerald-50 border border-emerald-100 p-2.5 rounded-[6px] font-medium">
                OTP sent to your contact. Enter simulated OTP: <span className="font-bold underline">{DEMO_OTP}</span>
              </p>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] text-center">
                  Enter OTP
                </label>
                
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
                      className="w-9 h-11 text-center text-lg font-bold border border-[#DDE5DF] rounded-[6px] focus:outline-none focus:border-[#0B6B43] bg-white text-[#151A17] font-mono"
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
                  onClick={handleVerifyLogin}
                  className="w-full py-3 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded-[8px] text-sm tracking-wide transition-all cursor-pointer"
                >
                  Verify & Login
                </button>

                <div className="text-center flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setErrorMsg('');
                    }}
                    className="text-[#59635D] hover:underline font-bold"
                  >
                    Change Details
                  </button>
                  {resendTimer > 0 ? (
                    <span className="text-[#7A847E] font-medium">Resend in {resendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="text-[#0B6B43] hover:underline font-bold"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
