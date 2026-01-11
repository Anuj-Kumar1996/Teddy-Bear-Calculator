
import React, { useState, useMemo, useEffect } from 'react';
import { LineStats, LineType, AIInsight, CalculationResult, Language } from './types';
import LineCalculator from './components/LineCalculator';
import AIInsights from './components/AIInsights';
import { getProductionInsights } from './services/gemini';

const translations = {
  en: {
    enterprise: "Enterprise",
    globalStatus: "Global Status",
    netPerformance: "Net Performance",
    dashboardTitle: "Production Profit Analyzer",
    dashboardDesc: "Compare your production costs against consultant-provided target prices across all factory departments.",
    totalLaborExpenditure: "Total Labor Expenditure",
    aggregateTargetRevenue: "Aggregate Target Revenue",
    totalNetProfitLoss: "Total Daily Net Profit/Loss",
    factoryProfitability: "Combined Factory Profitability",
    footerText: "ProTrack Enterprise. Professional Manufacturing Analytics.",
    sewingLine: "Sewing Line",
    fillingLine: "Teddy Stuffing Line",
    cuttingLine: "Cutting Material Line",
    finishingLine: "Product Finishing Line",
    sewing: "Sewing",
    filling: "Filling",
    cutting: "Cutting",
    finishing: "Finishing",
    machines: "Machines",
    persons: "Persons",
    cutters: "Cutters",
    finishers: "Finishers",
    employees: "Employees",
    totalDailyProduction: "Total Daily Production (Pieces)",
    dailySalaryPerEmp: "Daily Salary per Employee",
    consultantPrice: "Price given by consultant",
    actualCostPerPiece: "Actual Cost / Piece",
    totalLabor: "Total Labor",
    daily: "Daily",
    profit: "Profit",
    loss: "Loss",
    variance: "Variance",
    perPiece: "per piece",
    analyzeProfitability: "Analyze Profitability",
    generatingInsights: "Generating Smart Insights...",
    aiAdvisor: "AI Optimization Advisor",
    apiError: "Failed to load insights. Please verify your API configuration.",
    installApp: "Install Android App",
    installDesc: "Get the full experience with a dedicated home screen icon and offline access.",
    appReady: "App Ready",
    apkGuide: "Installation Guide",
    apkStep1: "1. If you used PWABuilder, extract the ZIP file on your device.",
    apkStep2: "2. Open the 'android' folder.",
    apkStep3: "3. Install the '.apk' file (e.g., 'app-release.apk').",
    browserInstall: "Browser Installation",
    browserStep: "Tap the 3 dots (⋮) in Chrome and select 'Install app'.",
    helpTitle: "Installation Help"
  },
  hi: {
    enterprise: "एंटरप्राइज़",
    globalStatus: "वैश्विक स्थिति",
    netPerformance: "कुल प्रदर्शन",
    dashboardTitle: "उत्पादन लाभ विश्लेषक",
    dashboardDesc: "सभी फैक्ट्री विभागों में सलाहकार द्वारा प्रदान की गई लक्षित कीमतों के खिलाफ अपनी उत्पादन लागत की तुलना करें।",
    totalLaborExpenditure: "कुल श्रम व्यय",
    aggregateTargetRevenue: "कुल लक्षित राजस्व",
    totalNetProfitLoss: "कुल दैनिक शुद्ध लाभ/हानि",
    factoryProfitability: "संयुक्त फैक्ट्री लाभप्रदता",
    footerText: "ProTrack एंटरप्राइज़। पेशेवर विनिर्माण विश्लेषिकी।",
    sewingLine: "सिलाई लाइन",
    fillingLine: "Teddy भरने की लाइन",
    cuttingLine: "सामग्री काटने की लाइन",
    finishingLine: "उत्पाद फिनिशिंग लाइन",
    sewing: "सिलाई",
    filling: "फिलिंग",
    cutting: "कटिंग",
    finishing: "फिनिशिंग",
    machines: "मशीनें",
    persons: "व्यक्ति",
    cutters: "कटर",
    finishers: "फिनिशर",
    employees: "कर्मचारी",
    totalDailyProduction: "कुल दैनिक उत्पादन (पीस)",
    dailySalaryPerEmp: "प्रति कर्मचारी दैनिक वेतन",
    consultantPrice: "सलाहकार द्वारा दी गई कीमत",
    actualCostPerPiece: "वास्तविक लागत / पीस",
    totalLabor: "कुल श्रम",
    daily: "दैनिक",
    profit: "लाभ",
    loss: "हानि",
    variance: "अंतर",
    perPiece: "प्रति पीस",
    analyzeProfitability: "लाभप्रदता का विश्लेषण करें",
    generatingInsights: "स्मार्ट अंतर्दृष्टि उत्पन्न की जा रही है...",
    aiAdvisor: "AI अनुकूलन सलाहकार",
    apiError: "अंतर्दृष्टि लोड करने में विफल।",
    installApp: "Android ऐप इंस्टॉल करें",
    installDesc: "होम स्क्रीन आइकन के साथ पूर्ण अनुभव प्राप्त करें।",
    appReady: "ऐप तैयार है",
    apkGuide: "स्थापना मार्गदर्शिका",
    apkStep1: "1. ZIP फ़ाइल निकालें।",
    apkStep2: "2. 'android' फ़ोल्डर खोलें।",
    apkStep3: "3. '.apk' फ़ाइल इंस्टॉल करें।",
    browserInstall: "ब्राउज़र इंस्टालेशन",
    browserStep: "Chrome में 3 डॉट्स (⋮) पर टैप करें और 'Install app' चुनें।",
    helpTitle: "सहायता"
  }
};

const INITIAL_LINES: LineStats[] = [
  { id: '1', name: 'Sewing Line 1', type: LineType.SEWING, units: 15, dailyProduction: 500, avgDailySalary: 600, consultantPrice: 20 },
  { id: '2', name: 'Stuffing Line 2', type: LineType.FILLING, units: 10, dailyProduction: 1000, avgDailySalary: 550, consultantPrice: 6 },
  { id: '3', name: 'Cutting Line 3', type: LineType.CUTTING, units: 5, dailyProduction: 2000, avgDailySalary: 700, consultantPrice: 2 },
  { id: '4', name: 'Finishing Line 4', type: LineType.FINISHING, units: 8, dailyProduction: 1200, avgDailySalary: 500, consultantPrice: 4 },
];

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [lines, setLines] = useState<LineStats[]>(INITIAL_LINES);
  const [insights, setInsights] = useState<Record<string, AIInsight>>({});
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showHelp, setShowHelp] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    }
  };

  const updateLine = (id: string, newStats: LineStats) => {
    setLines(prev => prev.map(line => line.id === id ? newStats : line));
  };

  const fetchInsights = async (id: string) => {
    const line = lines.find(l => l.id === id);
    if (!line) return;

    const totalDailySalary = line.units * line.avgDailySalary;
    const costPerPiece = line.dailyProduction > 0 ? totalDailySalary / line.dailyProduction : 0;
    const profitPerPiece = line.consultantPrice - costPerPiece;
    const totalDailyProfit = profitPerPiece * line.dailyProduction;
    const result: CalculationResult = { totalDailySalary, costPerPiece, profitPerPiece, totalDailyProfit };

    setInsights(prev => ({ ...prev, [id]: { status: 'loading' } }));
    try {
      const content = await getProductionInsights(line, result, lang);
      setInsights(prev => ({ ...prev, [id]: { status: 'success', content } }));
    } catch (error) {
      setInsights(prev => ({ ...prev, [id]: { status: 'error' } }));
    }
  };

  const totals = useMemo(() => {
    return lines.reduce((acc, line) => {
      const labor = line.units * line.avgDailySalary;
      const targetRevenue = line.dailyProduction * line.consultantPrice;
      const profit = targetRevenue - labor;
      return { labor: acc.labor + labor, targetRevenue: acc.targetRevenue + targetRevenue, profit: acc.profit + profit };
    }, { labor: 0, targetRevenue: 0, profit: 0 });
  }, [lines]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <span className="font-black text-xl tracking-tight text-slate-800">ProTrack</span>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={() => setShowHelp(!showHelp)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </button>
             <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold">
               {lang === 'en' ? 'हिंदी' : 'English'}
             </button>
          </div>
        </div>
      </nav>

      {showHelp && (
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{t.apkGuide}</h3>
              <ul className="space-y-2 text-slate-300">
                <li>{t.apkStep1}</li>
                <li>{t.apkStep2}</li>
                <li>{t.apkStep3}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">{t.browserInstall}</h3>
              <p className="text-slate-300">{t.browserStep}</p>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 pt-8">
        {deferredPrompt && (
          <div className="mb-8 bg-indigo-600 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between text-white shadow-xl shadow-indigo-200">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="bg-white/20 p-2 rounded-xl">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h4 className="font-bold text-lg">{t.installApp}</h4>
                <p className="text-indigo-100 text-sm">{t.installDesc}</p>
              </div>
            </div>
            <button onClick={handleInstall} className="px-8 py-3 bg-white text-indigo-600 font-black rounded-xl hover:bg-indigo-50 transition-all">
              {t.installApp}
            </button>
          </div>
        )}

        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">{t.dashboardTitle}</h1>
          <p className="text-slate-500 max-w-2xl font-medium">{t.dashboardDesc}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.totalLaborExpenditure}</p>
            <p className="text-3xl font-black text-slate-800">₹{totals.labor.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.aggregateTargetRevenue}</p>
            <p className="text-3xl font-black text-indigo-600">₹{totals.targetRevenue.toLocaleString()}</p>
          </div>
          <div className={`p-6 rounded-2xl border-2 shadow-sm ${totals.profit >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${totals.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{t.totalNetProfitLoss}</p>
            <p className={`text-3xl font-black ${totals.profit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {totals.profit >= 0 ? '+' : ''}₹{totals.profit.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-12">
          {lines.map((line) => (
            <div key={line.id} className="space-y-4">
              <LineCalculator 
                stats={line} 
                onUpdate={(newStats) => updateLine(line.id, newStats)} 
                onGetAIInsights={() => fetchInsights(line.id)}
                isAiLoading={insights[line.id]?.status === 'loading'}
                t={t}
              />
              <AIInsights insight={insights[line.id] || { status: 'idle' }} t={t} />
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-200 pt-8 pb-12 text-center">
        <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">{t.footerText}</p>
      </footer>
    </div>
  );
}
