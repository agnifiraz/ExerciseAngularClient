/**
 * expense - interface for expenses
 */
export interface Expense {
  id: number;
  employeeid: number;
  categoryid: string;
  description: string;
  receipt: boolean;
  dateincurred: string;
  amount: number;
  receiptscan: string;
}
