import { Expense } from '@app/expense/expense';
import { ReportItem } from './report-item';
/**
 * Report - interface for expense report
 */
export interface Report {
  id: number;
  employeeid: number;
  items: ReportItem[];
  datecreated?: string;
  
}
