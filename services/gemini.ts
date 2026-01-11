
import { GoogleGenAI } from "@google/genai";
import { LineStats, CalculationResult, Language } from "../types";

export const getProductionInsights = async (
  stats: LineStats,
  result: CalculationResult,
  lang: Language
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `
    Act as a senior production and financial consultant. I am managing a ${stats.type} production line.
    
    Current Daily Metrics:
    - Number of Machines & Employees: ${stats.units}
    - Total Pieces Produced Today: ${stats.dailyProduction}
    - Individual Daily Salary: ₹${stats.avgDailySalary}
    - Price Given by Consultant (Target): ₹${stats.consultantPrice}
    
    Calculated Results:
    - Actual Labor Cost Per Piece: ₹${result.costPerPiece.toFixed(4)}
    - Daily Profit/Loss Against Target: ₹${result.totalDailyProfit.toFixed(2)}
    - Variance Per Piece: ₹${result.profitPerPiece.toFixed(4)}
    
    IMPORTANT: Provide the response in ${lang === 'hi' ? 'Hindi' : 'English'}.
    Please provide 3-4 specific recommendations to improve the profitability of this line compared to the consultant's target. 
    If the line is currently losing money (actual cost > consultant price), suggest urgent operational changes. 
    If it is profitable, suggest ways to scale or optimize the margin further.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI advisor. Please check your connection and try again.";
  }
};
