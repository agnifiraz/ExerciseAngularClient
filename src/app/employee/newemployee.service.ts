import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '@app/employee/employee';
import { GenericHttpService } from '@app/generic-http.service';
@Injectable({
  providedIn: 'root',
})
export class NewEmployeeService extends GenericHttpService<Employee> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `employees`);
  } // constructor
} // NewEmployeeService
