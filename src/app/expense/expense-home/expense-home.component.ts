import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { Expense } from '@app/expense/expense';
import { ExpenseService } from '@app/expense/expense.service';
import { Employee } from '@app/employee/employee';
import { EmployeeModule } from '@app/employee/employee.module';
import { NewEmployeeService } from '@app/employee/newemployee.service';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { ExpenseDetailComponent } from '../expense-detail/expense-detail.component';
@Component({
  selector: 'app-expense-home',
  standalone: true,
  imports: [
    CommonModule,
    MatComponentsModule,
    EmployeeModule,
    ExpenseDetailComponent,
  ],
  templateUrl: './expense-home.component.html',
})
export class ExpenseHomeComponent implements OnInit {
  expenses: Expense[] = [];
  expense: Expense;
  msg: string;
  // sort stuff
  displayedColumns: string[] = ['id', 'dateincurred', 'employeeid'];
  dataSource: MatTableDataSource<Expense> = new MatTableDataSource<Expense>();
  employees: Employee[] = [];
  hideEditForm: boolean = true;
  constructor(
    public expenseService: ExpenseService,
    public employeeService: NewEmployeeService
  ) {
    this.msg = '';
    this.expense = {
      id: 0,
      employeeid: 0,
      categoryid: '',
      description: '',
      amount: 0.0,
      dateincurred: '',
      receipt: false,
      receiptscan: '',
    };
  }
  ngOnInit(): void {
    this.getAllExpenses();
    this.getAllEmployees();
  } // ngOnInit
  /**
   * getAllExpenses - retrieve everything
   */
  getAllExpenses(passedMsg: string = ''): void {
    this.expenseService.getAll().subscribe({
      // Create observer object
      next: (expenses: Expense[]) => {
        this.expenses = expenses;
        this.dataSource.data = this.expenses;
      },
      error: (err: Error) =>
        (this.msg = `Couldn't get expenses - ${err.message}`),
      complete: () =>
        passedMsg ? (this.msg = passedMsg) : (this.msg = `Expenses loaded!`),
    });
  } // getAllExpenses
  /**
   * getAllEmployees - retrieve everything
   */
  getAllEmployees(passedMsg: string = ''): void {
    this.employeeService.getAll().subscribe({
      // Create observer object
      next: (employees: Employee[]) => {
        this.employees = employees;
      },
      error: (err: Error) =>
        (this.msg = `Couldn't get employees - ${err.message}`),
      complete: () => (passedMsg ? (this.msg = passedMsg) : null),
    });
  } // getAllEmployees
  select(selectedExpense: Expense): void {
    this.expense = selectedExpense;
    this.msg = `Expense ${selectedExpense.id} selected`;
    this.hideEditForm = !this.hideEditForm;
  } // select
  /**
   * cancelled - event handler for cancel button
   */
  cancel(msg?: string): void {
    this.hideEditForm = !this.hideEditForm;
    this.msg = 'operation cancelled';
  } // cancel
  /**
   * update - send changed update to service update local array
   */
  update(selectedExpense: Expense): void {
    this.expenseService.update(selectedExpense).subscribe({
      // observer object
      next: (exp: Expense) => {
        let msg = `Expense ${exp.id} updated!`;
        this.getAllExpenses(msg);
      },
      error: (err: Error) => (this.msg = `Update failed! - ${err.message}`),
      complete: () => {
        this.hideEditForm = !this.hideEditForm;
      },
    });
  } // update
  /**
   * save - determine whether we're doing and add or an update
   */
  save(expense: Expense): void {
    expense.id ? this.update(expense) : this.add(expense);
  } // save
  /**
   * add - send expense to service, receive newid back
   */
  add(newExpense: Expense): void {
    this.msg = 'Adding expense...';
    this.expenseService.create(newExpense).subscribe({
      // observer object
      next: (exp: Expense) => {
        let msg = '';
        exp.id > 0
          ? (msg = `Expense ${exp.id} added!`)
          : (msg = `Expense ${exp.id} not added!`);
        this.getAllExpenses(msg);
      },
      error: (err: Error) => (this.msg = `Expense not added! - ${err.message}`),
      complete: () => {
        this.hideEditForm = !this.hideEditForm;
      },
    });
  } // add
  /**
   * delete - send expense id to service for deletion
   */
  delete(selectedExpense: Expense): void {
    this.expenseService.delete(selectedExpense.id).subscribe({
      // observer object
      next: (numOfExpensesDeleted: number) => {
        let msg = '';
        numOfExpensesDeleted === 1
          ? (msg = `Expense ${selectedExpense.id} deleted!`)
          : (msg = `Expense ${selectedExpense.id} not deleted!`);
        this.getAllExpenses(msg);
      },
      error: (err: Error) => (this.msg = `Delete failed! - ${err.message}`),
      complete: () => {
        this.hideEditForm = !this.hideEditForm;
      },
    });
  } // delete
  /**
   * newExpense - create new expense instance
   */
  newExpense(): void {
    this.expense = {
      id: 0,
      employeeid: 0,
      categoryid: '',
      description: '',
      amount: 0.0,
      dateincurred: '',
      receipt: false,
      receiptscan: '',
    };
    this.msg = 'New expense';
    this.hideEditForm = !this.hideEditForm;
  } // newExpense
  sortExpensesWithObjectLiterals(sort: Sort): void {
    const literals = {
      // sort on id
      id: () =>
        (this.dataSource.data = this.dataSource.data.sort(
          (a: Expense, b: Expense) =>
            sort.direction === 'asc' ? a.id - b.id : b.id - a.id // descending
        )),
      // sort on employeeid
      employeeid: () =>
        (this.dataSource.data = this.dataSource.data.sort(
          (a: Expense, b: Expense) =>
            sort.direction === 'asc'
              ? a.employeeid - b.employeeid
              : b.employeeid - a.employeeid // descending
        )),
      // sort on dateincurred
      dateincurred: () =>
        (this.dataSource.data = this.dataSource.data.sort(
          (a: Expense, b: Expense) =>
            sort.direction === 'asc'
              ? a.dateincurred < b.dateincurred
                ? -1
                : 1
              : b.dateincurred < a.dateincurred // descending
              ? -1
              : 1
        )),
    };
    literals[sort.active as keyof typeof literals]();
  } // sortExpensesWithObjectLiterals
}
