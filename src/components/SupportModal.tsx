import React from 'react';
import { X, Phone, MessageSquare, Mail, Globe, MapPin, ExternalLink, Building, Clock } from 'lucide-react';
import { EVENT_DETAILS, SUPPORT_INFO } from '../data/eventData';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold font-display">
              ISC
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                NSAI Secretariat Helpdesk
              </h3>
              <p className="text-xs text-slate-300">
                14th Indian Seed Congress 2026 Support
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-sm">
          <p className="text-xs text-slate-500 leading-relaxed">
            For any queries regarding sponsorship tiers, stall allocation, delegate passes, or payment verification, please reach out to our dedicated event team:
          </p>

          <div className="space-y-2.5">
            {/* Phone */}
            <a
              href={`tel:${SUPPORT_INFO.phone}`}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-brand-50/60 border border-slate-200/80 hover:border-brand-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white text-brand-600 flex items-center justify-center border border-slate-200 shadow-2xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Telephone Support</span>
                  <span className="font-bold text-slate-900 group-hover:text-brand-700">{SUPPORT_INFO.phone}</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
            </a>

            {/* WhatsApp */}
            <a
              href={SUPPORT_INFO.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200/80 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">WhatsApp Direct Chat</span>
                  <span className="font-bold text-slate-900 group-hover:text-emerald-800">{SUPPORT_INFO.whatsapp}</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-600" />
            </a>

            {/* Email */}
            <a
              href={`mailto:${SUPPORT_INFO.email}`}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-brand-50/60 border border-slate-200/80 hover:border-brand-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white text-brand-600 flex items-center justify-center border border-slate-200 shadow-2xs">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Official Support Email</span>
                  <span className="font-bold text-slate-900 group-hover:text-brand-700">{SUPPORT_INFO.email}</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
            </a>
          </div>

          {/* Official Websites */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <a
              href={SUPPORT_INFO.nsaiWebsite}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-600 font-semibold flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>www.nsai.co.in</span>
            </a>
            <a
              href={SUPPORT_INFO.iscWebsite}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-600 font-semibold flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>isc.nsai.co.in</span>
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
