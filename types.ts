
export enum LineType {
  SEWING = 'SEWING',
  FILLING = 'FILLING',
  CUTTING = 'CUTTING',
  FINISHING = 'FINISHING'
}

export type Language = 'en' | 'hi';

export interface LineStats {
  id: string;
  name: string;
  type: LineType;
  units: number; // Number of machines/nozzles/persons
  dailyProduction: number; // Total pieces produced in a day
  avgDailySalary: number; // Salary per employee per day
  consultantPrice: number; // The reference price/budget given by the consultant
}

export interface CalculationResult {
  totalDailySalary: number;
  costPerPiece: number;
  profitPerPiece: number;
  totalDailyProfit: number;
}

export interface AIInsight {
  status: 'idle' | 'loading' | 'success' | 'error';
  content?: string;
}
