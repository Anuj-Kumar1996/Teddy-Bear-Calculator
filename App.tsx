
import React, { useState, useEffect } from 'react';
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
    apkGuide: "APK Installation Guide",
    apkStep1: "1. Extract the ZIP file you downloaded.",
    apkStep2: "2. Open the 'android' folder.",
    apkStep3: "3. Find the file ending in '.apk' and install it on your phone.",
    browserInstall: "Browser Installation",
    browserStep: "Tap the 3 dots (⋮) and select 'Install App' or 'Add to Home Screen'."
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
    variance: "भिन्नता",
    perPiece: "प्रति पीस",
    analyzeProfitability: "लाभप्रदता का विश्लेषण करें",
    generatingInsights: "स्मार्ट सुझाव तैयार किए जा रहे हैं...",
    aiAdvisor: "AI अनुकूलन सलाहकार",
    apiError: "सुझाव लोड करने में विफल। कृपया अपने API कॉन्फ़िगरेशन की जांच करें।",
    installApp: "Android ऐप इंस्टॉल करें",
    installDesc: "समर्पित होम स्क्रीन आइकन और ऑफलाइन एक्सेस के साथ पूर्ण अनुभव प्राप्त करें।",
    appReady: "ऐप तैयार है",
    apkGuide: "APK इंस्टॉलेशन गाइड",
    apkStep1: "1. आपके द्वारा डाउनलोड की गई ZIP फ़ाइल को एक्सट्रैक्ट करें।",
    apkStep2: "2. 'android' फ़ोल्डर खोलें।",
    apkStep3: "3. '.apk' पर समाप्त होने वाली फ़ाइल ढूंढें और उसे अपने फ़ोन पर इंस्टॉल करें।",
    browserInstall: "ब्राउज़र इंस्टॉलेशन",
    browserStep: "3 डॉट्स (⋮) पर टैप करें और 'ऐप इंस्टॉल करें' या 'होम स्क्रीन पर जोड़ें' चुनें।"
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isSwReady, setIsSwReady] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => setIsSwReady(true));
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const [sewingStats, setSewingStats] = useState<LineStats>({
    id: 'sewing-1',
    name: t.sewingLine,
    type: LineType.SEWING,
    units: 20,
    dailyProduction: 300,
    avgDailySalary: 45,
    consultantPrice: 5.50
  });

  const [fillingStats, setFillingStats] = useState<LineStats>({
    id: 'filling-1',
    name: t.fillingLine,
    type: LineType.FILLING,
    units: 5,
    dailyProduction: 2500,
    avgDailySalary: 60,
    consultantPrice: 0.25
  });

  const [cuttingStats, setCuttingStats] = useState<LineStats>({
    id: 'cutting-1',
    name: t.cuttingLine,
    type: LineType.CUTTING,
    units: 8,
    dailyProduction: 1000,
    avgDailySalary: 55,
    consultantPrice: 1.20
  });

  const [finishingStats, setFinishingStats] = useState<LineStats>({
    id: 'finishing-1',
    name: t.finishingLine,
    type: LineType.FINISHING,
    units: 12,
    dailyProduction: 800,
    avgDailySalary: 50,
    consultantPrice: 1.80
  });

  const [insights, setInsights] = useState<Record<string, AIInsight>>({
    sewing: { status: 'idle' },
    filling: { status: 'idle' },
    cutting: { status: 'idle' },
    finishing: { status: 'idle' }
  });

  const calculateResults = (stats: LineStats): CalculationResult => {
    const totalDailySalary = stats.units * stats.avgDailySalary;
    const costPerPiece = stats.dailyProduction > 0 ? totalDailySalary / stats.dailyProduction : 0;
    const profitPerPiece = stats.consultantPrice - costPerPiece;
    const totalDailyProfit = profitPerPiece * stats.dailyProduction;
    return { totalDailySalary, costPerPiece, profitPerPiece, totalDailyProfit };
  };

  const handleGetInsights = async (type: LineType, key: string) => {
    const statsMap: Record<string, LineStats> = {
      sewing: sewingStats,
      filling: fillingStats,
      cutting: cuttingStats,
      finishing: finishingStats
    };
    const stats = statsMap[key];
    const results = calculateResults(stats);

    setInsights(prev => ({ ...prev, [key]: { status: 'loading' } }));
    try {
      const content = await getProductionInsights(stats, results, lang);
      setInsights(prev => ({ ...prev, [key]: { status: 'success', content } }));
    } catch (error) {
      setInsights(prev => ({ ...prev, [key]: { status: 'error' } }));
    }
  };

  const sewingRes = calculateResults(sewingStats);
  const fillingRes = calculateResults(fillingStats);
  const cuttingRes = calculateResults(cuttingStats);
  const finishingRes = calculateResults(finishingStats);
  
  const totalGlobalProfit = sewingRes.totalDailyProfit + fillingRes.totalDailyProfit + cuttingRes.totalDailyProfit + finishingRes.totalDailyProfit;
  const totalLabor = sewingRes.totalDailySalary + fillingRes.totalDailySalary + cuttingRes.totalDailySalary + finishingRes.totalDailySalary;
  const totalRevenue = (sewingStats.dailyProduction * sewingStats.consultantPrice) + 
                       (fillingStats.dailyProduction * fillingStats.consultantPrice) +
                       (cuttingStats.dailyProduction * cuttingStats.consultantPrice) +
                       (finishingStats.dailyProduction * finishingStats.consultantPrice);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">ProTrack</h1>
              {isSwReady && <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">{t.appReady}</span>}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowGuide(!showGuide)}
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
              title="Help"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'en' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('hi')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'hi' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </header>

      {showGuide && (
        <div className="bg-indigo-900 text-white py-8 px-4 border-b border-indigo-800">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.523 15.3414L20.355 18.1734L18.941 19.5874L16.109 16.7554C15.021 17.5404 13.682 18.0004 12.238 18.0004C8.924 18.0004 6.238 15.3144 6.238 12.0004C6.238 8.6864 8.924 6.0004 12.238 6.0004C15.552 6.0004 18.238 8.6864 18.238 12.0004C18.238 13.4444 17.778 14.7834 16.993 15.8714L19.825 18.7034L18.411 20.1174L15.579 17.2854C14.619 17.7444 13.535 18.0004 12.388 18.0004C8.924 18.0004 6.238 15.3144 6.238 12.0004C6.238 8.6864 8.924 6.0004 12.238 6.0004C15.552 6.0004 18.238 8.6864 18.238 12.0004C18.238 13.1474 17.982 14.2314 17.523 15.1914L17.523 15.3414Z"/></svg>
                {t.apkGuide}
              </h3>
              <ul className="space-y-2 text-indigo-100 font-medium">
                <li>{t.apkStep1}</li>
                <li>{t.apkStep2}</li>
                <li>{t.apkStep3}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                {t.browserInstall}
              </h3>
              <p className="text-indigo-100 font-medium">{t.browserStep}</p>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {deferredPrompt && (
          <div className="mb-8 bg-indigo-600 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between text-white shadow-xl shadow-indigo-200 border-2 border-white/20">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="bg-white/20 p-2 rounded-xl">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg">{t.installApp}</h4>
                <p className="text-indigo-100 text-sm">{t.installDesc}</p>
              </div>
            </div>
            <button 
              onClick={handleInstallClick}
              className="w-full md:w-auto px-8 py-3 bg-white text-indigo-600 font-black rounded-xl hover:bg-indigo-50 transition-all shadow-lg active:scale-95"
            >
              {t.installApp}
            </button>
          </div>
        )}

        <div className="mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3 text-center md:text-left">{t.dashboardTitle}</h2>
          <p className="text-slate-500 text-lg text-center md:text-left max-w-2xl">{t.dashboardDesc}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <section className="space-y-6">
            <LineCalculator 
              stats={sewingStats} 
              onUpdate={setSewingStats} 
              onGetAIInsights={() => handleGetInsights(LineType.SEWING, 'sewing')}
              isAiLoading={insights.sewing.status === 'loading'}
              t={t}
            />
            <AIInsights insight={insights.sewing} t={t} />
          </section>

          <section className="space-y-6">
            <LineCalculator 
              stats={fillingStats} 
              onUpdate={setFillingStats} 
              onGetAIInsights={() => handleGetInsights(LineType.FILLING, 'filling')}
              isAiLoading={insights.filling.status === 'loading'}
              t={t}
            />
            <AIInsights insight={insights.filling} t={t} />
          </section>

          <section className="space-y-6">
            <LineCalculator 
              stats={cuttingStats} 
              onUpdate={setCuttingStats} 
              onGetAIInsights={() => handleGetInsights(LineType.CUTTING, 'cutting')}
              isAiLoading={insights.cutting.status === 'loading'}
              t={t}
            />
            <AIInsights insight={insights.cutting} t={t} />
          </section>

          <section className="space-y-6">
            <LineCalculator 
              stats={finishingStats} 
              onUpdate={setFinishingStats} 
              onGetAIInsights={() => handleGetInsights(LineType.FINISHING, 'finishing')}
              isAiLoading={insights.finishing.status === 'loading'}
              t={t}
            />
            <AIInsights insight={insights.finishing} t={t} />
          </section>
        </div>

        <div className="mt-16 bg-white rounded-3xl p-10 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">{t.factoryProfitability}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.totalLaborExpenditure}</p>
                <p className="text-4xl font-black text-slate-900">
                  ₹{totalLabor.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.aggregateTargetRevenue}</p>
                <p className="text-4xl font-black text-indigo-600">
                  ₹{totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className={`p-6 rounded-2xl text-white shadow-lg ${totalGlobalProfit >= 0 ? 'bg-emerald-600 shadow-emerald-200' : 'bg-rose-600 shadow-rose-200'}`}>
                <p className="text-xs font-bold text-white/80 uppercase tracking-widest mb-2">{t.totalNetProfitLoss}</p>
                <p className="text-4xl font-black">
                  {totalGlobalProfit < 0 ? '-' : ''}₹{Math.abs(totalGlobalProfit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-200 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm gap-4">
          <p className="font-medium">&copy; {new Date().getFullYear()} {t.footerText}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
