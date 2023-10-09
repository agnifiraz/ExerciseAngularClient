import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Employee } from '../employee';
import { ValidatePhone } from '@app/validators/phoneno.validator';
import { ValidateEmail } from '@app/validators/email.validator';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
})
export class EmployeeDetailComponent implements OnInit {
  @Input() selectedEmployee: Employee = {
    id: 0,
    title: '',
    firstname: '',
    lastname: '',
    phoneno: '',
    email: '',
  };
  @Input() employees: Employee[] | null = null;
  @Output() cancelled = new EventEmitter();
  @Output() deleted = new EventEmitter();
  @Output() saved = new EventEmitter();
  employeeForm: FormGroup;
  title: FormControl;
  firstname: FormControl;
  lastname: FormControl;
  phoneno: FormControl;
  email: FormControl;
  constructor(private builder: FormBuilder) {
    this.title = new FormControl('', Validators.compose([Validators.required]));
    this.firstname = new FormControl(
      '',
      Validators.compose([Validators.required])
    );
    this.lastname = new FormControl(
      '',
      Validators.compose([Validators.required])
    );
    this.phoneno = new FormControl(
      '',
      Validators.compose([Validators.required, ValidatePhone])
    );

    this.email = new FormControl(
      '',
      Validators.compose([Validators.required, ValidateEmail])
    );
    this.employeeForm = new FormGroup({
      title: this.title,
      firstname: this.firstname,
      lastname: this.lastname,
      phoneno: this.phoneno,
      email: this.email,
    });
  } // constructor
  ngOnInit(): void {
    // patchValue doesn’t care if all values present
    this.employeeForm.patchValue({
      title: this.selectedEmployee.title,
      firstname: this.selectedEmployee.firstname,
      lastname: this.selectedEmployee.lastname,
      phoneno: this.selectedEmployee.phoneno,
      email: this.selectedEmployee.email,
    });
  } // ngOnInit
  updateSelectedEmployee(): void {
    this.selectedEmployee.title = this.employeeForm.value.title;
    this.selectedEmployee.firstname = this.employeeForm.value.firstname;
    this.selectedEmployee.lastname = this.employeeForm.value.lastname;
    this.selectedEmployee.phoneno = this.employeeForm.value.phoneno;
    this.selectedEmployee.email = this.employeeForm.value.email;
    this.saved.emit(this.selectedEmployee);
  }
} // EmployeeDetailComponent
