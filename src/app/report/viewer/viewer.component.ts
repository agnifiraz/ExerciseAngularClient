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
import { PDFURL } from '@app/constants';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [CommonModule, MatComponentsModule, ReactiveFormsModule],
  templateUrl: './viewer.component.html',
})
export class ViewerComponent implements OnInit, OnDestroy {
  // form
  generatorForm: FormGroup;
  employeeid: FormControl;
  expenseid: FormControl;
  reportid: FormControl;
  // data
  formSubscription?: Subscription;
  //expenses: Expense[] = []; // everybody's expenses
  reports: Report[] = [];
  employees: Employee[] = []; // all employees
  employeeExpenses?: Expense[]; // expenses for selected employee
  reportExpenses?: Expense[]; // expenses matching report items keys

  items: ReportItem[] = []; // expense items that will be in report
  selectedExpense: Expense; // the current selected expense
  selectedReport: Report;
  selectedEmployee: Employee; // the current selected employee
  // misc
  pickedEmployee: boolean;
  pickedReport: boolean;
  generated: boolean;
  hasReport: boolean;
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
    this.pickedReport = false;
    this.generated = false;
    this.msg = '';
    this.employeeid = new FormControl('');
    this.expenseid = new FormControl('');
    this.reportid = new FormControl('');
    this.generatorForm = this.builder.group({
      expenseid: this.expenseid,
      employeeid: this.employeeid,
      reportid: this.reportid,
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
    this.selectedReport = {
      id: 0,
      employeeid: 0,
      items: [],
      datecreated: '',
    };
    this.hasReport = false;
    this.total = 0.0;
  } // constructor
  ngOnInit(): void {
    this.onPickEmployee(); // sets up subscription for dropdown click
    this.onPickReport();
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
        console.log('Report:', employees);
        this.employees = employees;
      },
      error: (err: Error) =>
        (this.msg = `Couldn't get employees - ${err.message}`),
      complete: () =>
        passedMsg ? (this.msg = passedMsg) : (this.msg = `Employees loaded!`),
    });
  } // getAllEmployees

  getAllReports(employeeId: number): void {
    console.log('Fetching reports for employeeId:', employeeId);
    this.reportService.getById(employeeId).subscribe((report) => {
      console.log('Report:', report);

      // Check if the server response is an array or a single object
      if (Array.isArray(report)) {
        this.reports = report;
      } else {
        this.reports = [report]; // Wrap the single report in an array
      }

      this.msg = 'Employees and reports loaded!';
      console.log('Complete!');
    });
  }

  /**
   * loadEmployeeExpenses - obtain a particular employee's expenses
   * we'll match the report expenses to them later
   */
  loadEmployeeExpenses(id: number): void {
    // expenses aren't part of the page, so we don't use async pipe here
    this.msg = 'loading expenses...';
    this.expenseService
      .getSome(id)
      .subscribe((expenses) => (this.employeeExpenses = expenses));
  }

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
        this.selectedReport = {
          id: 0,
          employeeid: 0,
          items: [],
          datecreated: '',
        };
        this.selectedEmployee = val;
        this.loadEmployeeExpenses(val.id);
        this.getAllReports(val.id); // Pass the employee id to load reports
        this.pickedReport = false;
        this.hasReport = false;
        this.msg = 'choose Report for employee';
        this.pickedEmployee = true;
        this.generated = false;
        this.items = []; // array for the report
        //this.selectedExpense = []; // array for the details in app html
      });
  } // onPickEmployee

  onPickReport(): void {
    const reportSubscription = this.generatorForm
      .get('reportid')
      ?.valueChanges.subscribe((val) => {
        console.log('Selected Report:', val);
        this.selectedReport = val;

        if (this.employeeExpenses !== undefined) {
          this.reportExpenses = this.employeeExpenses.filter((expense) =>
            this.selectedReport?.items.some(
              (item) => item.expenseid === expense.id
            )
          );
        }
        console.log('Report Expenses:', this.reportExpenses);

        this.hasReport = true;

        this.reportno = this.selectedReport.id;

        console.log('Length is ' + this.items.length);
        this.total = 0.0;
        this.reportExpenses?.forEach((exp) => (this.total += exp.amount));
      });

    this.formSubscription?.add(reportSubscription);
  } // onPickReport

  viewPdf(): void {
    window.open(`${PDFURL}${this.reportno}`, '');
  } // viewPdf
}
