import React from 'react';

interface FooterProps {
  onAdminToggle?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminToggle }) => {
  return (
    <footer className="no-print bg-white border-t border-[#DDE5DF] py-16 text-[#59635D] mt-20 font-sans">
      <div className="max-w-[1180px] mx-auto px-6 sm:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Col 1: Organizer Info + Official Logo */}
          <div className="md:col-span-5 space-y-3">
            <div className="inline-flex items-center">
              <img 
                src="/images/nsai_logo.png" 
                alt="National Seed Association of India" 
                className="h-10 w-auto object-contain"
              />
            </div>

            <p className="text-xs text-[#59635D] leading-relaxed max-w-sm">
              The apex body representing the Indian seed industry, working towards sustainable agricultural growth, seed quality, and farmer empowerment.
            </p>
            <p className="text-xs text-[#7A847E]">
              Secretariat: 909, Surya Kiran Building, 19, Kasturba Gandhi Marg, New Delhi – 110001
            </p>
          </div>

          {/* Col 2: Congress Venue & Dates */}
          <div className="md:col-span-4 space-y-2 text-xs">
            <h4 className="font-bold text-[#151A17] uppercase tracking-wider text-[11px]">
              Event Venue
            </h4>
            <p className="font-bold text-[#151A17] text-sm">
              Ramoji Film City
            </p>
            <p className="text-[#59635D]">
              Anaspur Village, Hayathnagar Mandal, Hyderabad, Telangana 501512, India
            </p>
            <p className="text-[#0B6B43] font-bold pt-1">
              Indian Seed Congress 2027
            </p>
          </div>

          {/* Col 3: Secretariat Contact */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <h4 className="font-bold text-[#151A17] uppercase tracking-wider text-[11px]">
              Secretariat Desk
            </h4>
            <div className="space-y-1 text-[#59635D]">
              <p>Email: <a href="mailto:isc2027@nsai.co.in" className="text-[#0B6B43] font-bold hover:underline">isc2027@nsai.co.in</a></p>
              <p>Phone: +91-11-43533241-43</p>
              <p>WhatsApp: +91-9311957851</p>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-[#DDE5DF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A847E]">
          <p>© 2027 National Seed Association of India (NSAI). All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <p className="font-semibold text-[#151A17]">Indian Seed Congress 2027 Ramoji Film City, Hyderabad</p>
            {onAdminToggle && (
              <button 
                type="button" 
                onClick={onAdminToggle}
                className="text-[#0B6B43] hover:text-[#08452F] hover:underline font-bold cursor-pointer transition-colors"
              >
                Admin Portal
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};

