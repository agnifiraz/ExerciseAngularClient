import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { NewEmployeeService } from '../newemployee.service';
@Component({
  templateUrl: 'employee-home.component.html',
})
export class EmployeeHomeComponent implements OnInit {
  msg: string;
  employee: Employee;
  employees: Employee[] = [];
  hideEditForm: boolean;
  todo: string;
  constructor(public newemployeeService: NewEmployeeService) {
    this.employee = {
      id: 0,
      title: '',
      firstname: '',
      lastname: '',
      phoneno: '',
      email: '',
    };
    this.msg = '';
    this.hideEditForm = true;
    this.todo = '';
  } // constructor
  ngOnInit(): void {
    this.getAll();
  } // ngOnInit
  select(employee: Employee): void {
    this.todo = 'update';
    this.employee = employee;
    this.msg = `${employee.lastname} selected`;
    this.hideEditForm = !this.hideEditForm;
  } // select
  /**
   * cancelled - event handler for cancel button
   */
  cancel(msg?: string): void {
    msg ? (this.msg = 'Operation cancelled') : null;
    this.hideEditForm = !this.hideEditForm;
  } // cancel
  /**
   * update - send changed update to service
   */
  update(employee: Employee): void {
    this.newemployeeService.update(employee).subscribe({
      // Create observer object
      next: (emp: Employee) => {
        this.msg = `Employee ${emp.id} updated!`;
      },
      error: (err: Error) => (this.msg = `Update failed! - ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm),
    });
  } // update
  /**
   * getAll - retrieve everything
   */
  getAll(passedMsg: string = ''): void {
    this.newemployeeService.getAll().subscribe({
      // Create observer object
      next: (emps: Employee[]) => {
        this.employees = emps;
      },
      error: (err: Error) =>
        (this.msg = `Couldn't get employees - ${err.message}`),
      complete: () =>
        passedMsg ? (this.msg = passedMsg) : (this.msg = `Employees loaded!`),
    });
  } // getAll
  /**
   * save - determine whether we're doing and add or an update
   */
  save(employee: Employee): void {
    employee.id ? this.update(employee) : this.add(employee);
  } // save
  /**
   * add - send employee to service, receive new employee back
   */
  add(employee: Employee): void {
    employee.id = 0;
    this.newemployeeService.create(employee).subscribe({
      // Create observer object
      next: (emp: Employee) => {
        this.getAll(`Employee ${emp.id} added!`);
      },
      error: (err: Error) =>
        (this.msg = `Employee not added! - ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm), // this calls unsubscribe
    });
  } // add
  /**
   * delete - send employee id to service for deletion
   */
  delete(employee: Employee): void {
    this.newemployeeService.delete(employee.id).subscribe({
      // Create observer object
      next: (numOfEmployeesDeleted: number) => {
        let msg: string = '';
        numOfEmployeesDeleted === 1
          ? (msg = `Employee ${employee.lastname} deleted!`)
          : (msg = `Employee ${employee.lastname} not deleted!`);
        this.getAll(msg);
      },
      error: (err: Error) => (this.msg = `Delete failed! - ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm),
    });
  } // delete
  /**
   * newEmployee - create new employee instance
   */
  newEmployee(): void {
    this.employee = {
      id: 0,
      title: '',
      firstname: '',
      lastname: '',
      phoneno: '',
      email: '',
    };
    this.hideEditForm = !this.hideEditForm;
    this.msg = 'New Employee';
  } // newEmployee
} // EmployeeHomeComponent
