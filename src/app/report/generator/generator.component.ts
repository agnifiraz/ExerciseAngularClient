import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { Report } from '@app/report/report';
import { ReportItem } from '@app/report/report-item';
import { ReportService } from '@app/report/report.service';
import { Employee } from '@app/employee/employee';
import { NewEmployeeService } from '@app/employee/newemployee.service';
import { Expense } from '@app/expense/expense';
import { ExpenseService } from '@app/expense/expense.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [CommonModule, MatComponentsModule, ReactiveFormsModule],
  templateUrl: './generator.component.html',
})
export class GeneratorComponent implements OnInit, OnDestroy {
  // form
  generatorForm: FormGroup;
  employeeid: FormControl;
  expenseid: FormControl;
  // data
  formSubscription?: Subscription;
  expenses: Expense[] = []; // everybody's expenses
  employees: Employee[] = []; // all employees
  employeeexpenses: Expense[] = []; // all expenses for a particular employee
  items: ReportItem[] = []; // expense items that will be in report
  selectedexpenses: Expense[] = []; // expenses that being displayed currently in app
  selectedExpense: Expense; // the current selected expense
  selectedEmployee: Employee; // the current selected employee
  // misc
  pickedExpense: boolean;
  pickedEmployee: boolean;
  generated: boolean;
  hasExpenses: boolean;
  msg: string;
  total: number;
  reportno: number = 0;
  constructor(
    private builder: FormBuilder,
    private employeeService: NewEmployeeService,
    private expenseService: ExpenseService,
    private reportService: ReportService
  ) {
    this.pickedEmployee = false;
    this.pickedExpense = false;
    this.generated = false;
    this.msg = '';
    this.employeeid = new FormControl('');
    this.expenseid = new FormControl('');
    this.generatorForm = this.builder.group({
      expenseid: this.expenseid,
      employeeid: this.employeeid,
    });
    this.selectedExpense = {
      id: 0,
      employeeid: 0,
      categoryid: '',
      description: '',
      amount: 0.0,
      dateincurred: '',
      receipt: false,
      receiptscan: '',
    };
    this.selectedEmployee = {
      id: 0,
      title: '',
      firstname: '',
      lastname: '',
      phoneno: '',
      email: '',
    };
    this.hasExpenses = false;
    this.total = 0.0;
  } // constructor
  ngOnInit(): void {
    this.onPickEmployee(); // sets up subscription for dropdown click
    this.onPickExpense(); // sets up subscription for dropdown click
    this.msg = 'loading employees from server...';
    this.getAllEmployees();
  } // ngOnInit
  ngOnDestroy(): void {
    if (this.formSubscription !== undefined) {
      this.formSubscription.unsubscribe();
    }
  } // ngOnDestroy
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
      complete: () =>
        passedMsg ? (this.msg = passedMsg) : (this.msg = `Employees loaded!`),
    });
  } // getAllEmployees
  /**
   * loadEmployeeExpenses - retrieve a particular employee's expenses
   */
  loadEmployeeExpenses(): void {
    this.employeeexpenses = [];
    this.expenseService.getSome(this.selectedEmployee.id).subscribe({
      // observer object
      next: (expenses: Expense[]) => {
        this.employeeexpenses = expenses;
      },
      error: (err: Error) =>
        (this.msg = `product fetch failed! - ${err.message}`),
      complete: () => {},
    });
  } // loadEmployeeExpenses
  /**
   * onPickEmployee - Another way to use Observables, subscribe to the select change event
   * then load specific employee expenses for subsequent selection
   */
  onPickEmployee(): void {
    this.formSubscription = this.generatorForm
      .get('employeeid')
      ?.valueChanges.subscribe((val) => {
        this.selectedExpense = {
          id: 0,
          employeeid: 0,
          categoryid: '',
          description: '',
          amount: 0.0,
          dateincurred: '',
          receipt: false,
          receiptscan: '',
        };
        this.selectedEmployee = val;
        this.loadEmployeeExpenses();
        this.pickedExpense = false;
        this.hasExpenses = false;
        this.msg = 'choose expense for employee';
        this.pickedEmployee = true;
        this.generated = false;
        this.items = []; // array for the report
        this.selectedexpenses = []; // array for the details in app html
      });
  } // onPickEmployee
  /**
   * onPickExpense - subscribe to the select change event then
   * update array containing items.
   */
  onPickExpense(): void {
    const expenseSubscription = this.generatorForm
      .get('expenseid')
      ?.valueChanges.subscribe((val) => {
        this.selectedExpense = val;
        const item: ReportItem = {
          id: 0,
          reportid: 0,
          expenseid: this.selectedExpense?.id,
        };
        if (
          this.items.find((item) => item.expenseid === this.selectedExpense?.id)
        ) {
          // ignore entry
        } else {
          // add entry
          this.items.push(item);
          this.selectedexpenses.push(this.selectedExpense);
        }
        if (this.items.length > 0) {
          this.hasExpenses = true;
        }
        this.total = 0.0;
        this.selectedexpenses.forEach((exp) => (this.total += exp.amount));
      });
    this.formSubscription?.add(expenseSubscription); // add it as a child, so all can be destroyed together
  } // onPickExpense
  /**
   * createReport - create the client side report
   */
  createReport(): void {
    this.generated = false;
    const report: Report = {
      id: 0,
      items: this.items,
      employeeid: this.selectedExpense.employeeid,
    };
    this.reportService.create(report).subscribe({
      // observer object
      next: (report: Report) => {
        // server should be returning report with new id
        report.id > 0
          ? (this.msg = `Report ${report.id} added!`)
          : (this.msg = 'Report not added! - server error');
        this.reportno = report.id;
      },
      error: (err: Error) => (this.msg = `Report not added! - ${err.message}`),
      complete: () => {
        this.hasExpenses = false;
        this.pickedEmployee = false;
        this.pickedExpense = false;
        this.generated = true;
      },
    });
  } // createReport
} // GeneratorComponent
