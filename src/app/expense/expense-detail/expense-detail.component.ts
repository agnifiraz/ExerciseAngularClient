import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Expense } from '@app/expense/expense';
import { Employee } from '@app/employee/employee';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-expense-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatComponentsModule],
  templateUrl: './expense-detail.component.html',
  styles: [],
})
export class ExpenseDetailComponent implements OnInit {
  // setter
  @Input() selectedExpense: Expense = {
    id: 0,
    employeeid: 0,
    categoryid: '',
    description: '',
    amount: 0.0,
    dateincurred: '',
    receipt: false,
    receiptscan: '',
  };
  @Input() employees: Employee[] | null = null;
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter();
  @Output() deleted = new EventEmitter();
  expenseForm: FormGroup;
  employeeid: FormControl;
  categoryid: FormControl;
  description: FormControl;
  amount: FormControl;
  receipt: FormControl;
  dateincurred: FormControl;
  constructor(private builder: FormBuilder) {
    this.employeeid = new FormControl(
      '',
      Validators.compose([Validators.required])
    );
    this.categoryid = new FormControl(
      '',
      Validators.compose([Validators.required])
    );
    this.description = new FormControl(
      '',
      Validators.compose([Validators.required])
    );
    this.amount = new FormControl(
      '',
      Validators.compose([Validators.required])
    );
    this.receipt = new FormControl(
      '',
      Validators.compose([Validators.required])
    );
    this.dateincurred = new FormControl(
      '',
      Validators.compose([Validators.required])
    );
    this.expenseForm = this.builder.group({
      employeeid: this.employeeid,
      categoryid: this.categoryid,
      description: this.description,
      amount: this.amount,
      receipt: this.receipt,
      dateincurred: this.dateincurred,
    });
  } // constructor
  ngOnInit(): void {
    // patchValue doesn't care if all values are present
    this.expenseForm.patchValue({
      employeeid: this.selectedExpense.employeeid,
      categoryid: this.selectedExpense.categoryid,
      description: this.selectedExpense.description,
      amount: this.selectedExpense.amount,
      receipt: this.selectedExpense.receipt,
      dateincurred: new Date(this.selectedExpense.dateincurred),
    });
  } // ngOnInit
  updateSelectedExpense(): void {
    this.selectedExpense.employeeid = this.expenseForm.value.employeeid;
    this.selectedExpense.categoryid = this.expenseForm.value.categoryid;
    this.selectedExpense.description = this.expenseForm.value.description;
    this.selectedExpense.amount = this.expenseForm.value.amount;
    this.selectedExpense.receipt = this.expenseForm.value.receipt;
    this.selectedExpense.dateincurred = this.expenseForm.value.dateincurred;
    this.saved.emit(this.selectedExpense);
  } // updateSelectedExpense
} // ExpenseDetailComponent
