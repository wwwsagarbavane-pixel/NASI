import React from 'react';
import { Table2, Plus, Minus, CheckCircle2, Sparkles, Info } from 'lucide-react';
import { TradingTableDetails } from '../../types';
import { formatCurrency } from '../../utils/pricing';

interface Step4Props {
  tradingTable: TradingTableDetails;
  onChange: (updated: Partial<TradingTableDetails>) => void;
}

export const Step4TradingTable: React.FC<Step4Props> = ({ tradingTable, onChange }) => {
  const handleQtyChange = (delta: number) => {
    const newQty = Math.max(1, Math.min(20, (tradingTable.quantity || 1) + delta));
    onChange({ quantity: newQty });
  };

  const total = (tradingTable.quantity || 1) * 30000;

  return (
    <div className="space-y-6 step-enter">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Trading Table
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mt-1.5 font-normal">
          Would you like to book a designated B2B Trading Table in the trading lounge at ISC 2026?
        </p>
      </div>

      {/* Yes / No Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* No Option */}
        <div
          onClick={() => onChange({ enabled: false })}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            !tradingTable.enabled
              ? 'border-brand-600 bg-brand-50/40 shadow-card ring-2 ring-brand-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
              !tradingTable.enabled ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
            }`}
          >
            {!tradingTable.enabled && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">No, Skip</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              I do not require a separate trading table.
            </p>
          </div>
        </div>

        {/* Yes Option */}
        <div
          onClick={() => onChange({ enabled: true, quantity: tradingTable.quantity || 1 })}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            tradingTable.enabled
              ? 'border-brand-600 bg-brand-50/40 shadow-card ring-2 ring-brand-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
              tradingTable.enabled ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
            }`}
          >
            {tradingTable.enabled && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">Yes, Add Trading Table</h3>
              <span className="text-[11px] font-bold text-brand-700 bg-brand-100/70 px-2 py-0.5 rounded-full">
                ₹30,000 / table
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Dedicated table with 4 chairs and company signage for one-on-one trade meetings.
            </p>
          </div>
        </div>
      </div>

      {/* Expandable Quantity Selector if YES */}
      {tradingTable.enabled ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-6 step-enter">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Table2 className="w-4 h-4 text-brand-600" />
              <span>Trading Table Allocation</span>
            </h3>
            <span className="font-display font-extrabold text-sm text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-100">
              Tariff: ₹30,000 / Table
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-sm font-bold text-slate-800 block">Select Table Quantity</span>
              <p className="text-xs text-slate-500 mt-0.5">
                Tables will be allocated adjacent to each other for multi-table bookings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQtyChange(-1)}
                disabled={(tradingTable.quantity || 1) <= 1}
                className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="w-16 h-11 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center font-display font-extrabold text-lg text-slate-900">
                {tradingTable.quantity || 1}
              </div>

              <button
                type="button"
                onClick={() => handleQtyChange(1)}
                disabled={(tradingTable.quantity || 1) >= 20}
                className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subtotal preview */}
          <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 flex items-center justify-between text-sm">
            <span className="font-semibold text-brand-900">
              Trading Table Subtotal ({tradingTable.quantity || 1} table{(tradingTable.quantity || 1) > 1 ? 's' : ''} × ₹30,000):
            </span>
            <span className="font-display font-extrabold text-brand-900 text-base sm:text-lg">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-500">
          No trading table added. Click "Continue" to proceed to Exhibition Stall.
        </div>
      )}
    </div>
  );
};
