import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, LogOut, FileText, CreditCard, Ticket } from 'lucide-react';

interface HeaderProps {
  onOpenHelp: () => void;
  isLoggedIn: boolean;
  userName: string;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onDropdownAction: (action: 'dashboard' | 'details' | 'payment' | 'ticket') => void;
  isApproved: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHelp,
  isLoggedIn,
  userName,
  onLoginClick,
  onLogoutClick,
  onDropdownAction,
  isApproved,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="relative w-full h-[64px] sm:h-[72px] bg-white border-b border-[#DDE5DF] z-40 font-sans">
      <div className="max-w-[1280px] h-full mx-auto px-6 sm:px-8 flex items-center justify-between">
        
        {/* Left Branding with Official NSAI Logo */}
        <div className="flex items-center gap-3.5">
          <img 
            src="/images/nsai_logo.png" 
            alt="National Seed Association of India Logo" 
            className="h-8 sm:h-9 w-auto object-contain"
          />
          
          <div className="h-5 w-px bg-[#DDE5DF]" />

          <span className="text-sm sm:text-base font-bold text-[#151A17] tracking-tight">
            Indian Seed Congress 2027
          </span>
        </div>

        {/* Right Navigation / Support Links */}
        <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold text-[#151A17]">
          
          <button
            type="button"
            onClick={onOpenHelp}
            className="text-[#151A17] hover:text-[#0B6B43] transition-colors cursor-pointer font-medium"
          >
            Help
          </button>
          
          <button
            type="button"
            onClick={onOpenHelp}
            className="text-[#151A17] hover:text-[#0B6B43] transition-colors cursor-pointer font-medium"
          >
            Contact
          </button>

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 hover:text-[#0B6B43] transition-colors cursor-pointer font-bold text-sm text-[#151A17] py-2"
              >
                <span>{userName || 'User'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white border border-[#DDE5DF] rounded-[8px] shadow-lg py-1.5 z-50 text-xs text-[#151A17]">
                  <button
                    type="button"
                    onClick={() => {
                      onDropdownAction('dashboard');
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#0B6B43] font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" /> My Registration
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      onDropdownAction('details');
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#0B6B43] font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" /> Registration Details
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onDropdownAction('payment');
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#0B6B43] font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Payment
                  </button>

                  {isApproved && (
                    <button
                      type="button"
                      onClick={() => {
                        onDropdownAction('ticket');
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#0B6B43] font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5" /> Event Ticket
                    </button>
                  )}

                  <div className="border-t border-[#DDE5DF] my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      onLogoutClick();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onLoginClick}
              className="text-[#151A17] hover:text-[#0B6B43] transition-colors cursor-pointer font-bold text-sm"
            >
              Login
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

