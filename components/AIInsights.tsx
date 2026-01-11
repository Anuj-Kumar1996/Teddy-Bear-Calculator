
import React from 'react';
import { AIInsight } from '../types';

interface AIInsightsProps {
  insight: AIInsight;
  t: any;
}

const AIInsights: React.FC<AIInsightsProps> = ({ insight, t }) => {
  if (insight.status === 'idle') return null;

  return (
    <div className={`mt-6 p-6 rounded-2xl border ${insight.status === 'error' ? 'bg-red-50 border-red-200' : 'bg-indigo-50 border-indigo-200 shadow-sm'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${insight.status === 'error' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${insight.status === 'error' ? 'text-red-800' : 'text-indigo-900'}`}>
            {insight.status === 'loading' ? t.generatingInsights : t.aiAdvisor}
          </h3>
          
          {insight.status === 'loading' && (
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-indigo-200 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-indigo-200 rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-indigo-200 rounded animate-pulse w-4/6"></div>
            </div>
          )}

          {insight.status === 'success' && insight.content && (
            <div className="mt-3 text-indigo-800 prose prose-indigo max-w-none">
              {insight.content.split('\n').map((line, i) => (
                <p key={i} className="mb-2 leading-relaxed">{line}</p>
              ))}
            </div>
          )}

          {insight.status === 'error' && (
            <p className="mt-2 text-red-700">{t.apiError}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
