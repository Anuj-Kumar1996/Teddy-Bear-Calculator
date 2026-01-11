
import React, { useMemo } from 'react';
import { LineStats, LineType, CalculationResult, Language } from '../types';

interface LineCalculatorProps {
  stats: LineStats;
  onUpdate: (newStats: LineStats) => void;
  onGetAIInsights: () => void;
  isAiLoading: boolean;
  t: any;
}

const LineCalculator: React.FC<LineCalculatorProps> = ({ stats, onUpdate, onGetAIInsights, isAiLoading, t }) => {
  const results = useMemo((): CalculationResult => {
    const totalDailySalary = stats.units * stats.avgDailySalary;
    const costPerPiece = stats.dailyProduction > 0 ? totalDailySalary / stats.dailyProduction : 0;
    const profitPerPiece = stats.consultantPrice - costPerPiece;
    const totalDailyProfit = profitPerPiece * stats.dailyProduction;
    
    return {
      totalDailySalary,
      costPerPiece,
      profitPerPiece,
      totalDailyProfit
    };
  }, [stats]);

  const handleChange = (field: keyof LineStats, value: number) => {
    onUpdate({ ...stats, [field]: value });
  };

  const getUnitLabel = () => {
    switch (stats.type) {
      case LineType.SEWING: return t.machines;
      case LineType.FILLING: return t.persons;
      case LineType.CUTTING: return t.cutters;
      case LineType.FINISHING: return t.finishers;
      default: return t.employees;
    }
  };

  const getLineColor = () => {
    switch (stats.type) {
      case LineType.SEWING: return 'bg-indigo-500';
      case LineType.FILLING: return 'bg-orange-500';
      case LineType.CUTTING: return 'bg-emerald-500';
      case LineType.FINISHING: return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  const getIcon = () => {
    switch (stats.type) {
      case LineType.SEWING:
        return <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
      case LineType.FILLING:
        return <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
      case LineType.CUTTING:
        return <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 11-4.243 4.243 3 3 0 014.243-4.243zm0-11.516a3 3 0 11-4.243 4.243 3 3 0 014.243-4.243z" /></svg>;
      case LineType.FINISHING:
        return <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>;
    }
  };

  const unitLabel = getUnitLabel();
  const isProfitable = results.totalDailyProfit >= 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className={`h-2 w-full ${getLineColor()}`} />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {getIcon()}
            {stats.name}
          </h2>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold uppercase tracking-wider">
            {stats.type}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {unitLabel} & {t.employees}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={stats.units} 
                  onChange={(e) => handleChange('units', Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {t.totalDailyProduction}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={stats.dailyProduction} 
                  onChange={(e) => handleChange('dailyProduction', Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {t.dailySalaryPerEmp}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                <input 
                  type="number" 
                  value={stats.avgDailySalary} 
                  onChange={(e) => handleChange('avgDailySalary', Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-bold text-emerald-700 mb-1.5">
                {t.consultantPrice}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">₹</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={stats.consultantPrice} 
                  onChange={(e) => handleChange('consultantPrice', Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-emerald-900 placeholder-emerald-300"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-between border border-slate-100">
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-200 pb-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t.actualCostPerPiece}</p>
                  <p className="text-xl font-bold text-slate-900">₹{results.costPerPiece.toFixed(3)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t.totalLabor}</p>
                  <p className="text-xl font-bold text-slate-600">₹{results.totalDailySalary.toLocaleString()}</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border-2 ${isProfitable ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isProfitable ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.daily} {isProfitable ? t.profit : t.loss}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className={`text-4xl font-black ${isProfitable ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {isProfitable ? '' : '-'}₹{Math.abs(results.totalDailyProfit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <p className={`text-[10px] font-medium mt-1 ${isProfitable ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {t.variance}: ₹{results.profitPerPiece.toFixed(3)} {t.perPiece}
                </p>
              </div>
            </div>

            <button 
              onClick={onGetAIInsights}
              disabled={isAiLoading || stats.dailyProduction === 0}
              className="mt-6 w-full py-4 bg-slate-900 hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isAiLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {t.analyzeProfitability}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineCalculator;
