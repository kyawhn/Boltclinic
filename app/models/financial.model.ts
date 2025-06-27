export interface FinancialRecord {
  id: string;
  date: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  description: string;
  patientId?: string;
  appointmentId?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}