import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Expense } from '@app/expense/expense';
import { GenericHttpService } from '@app/generic-http.service';
@Injectable({
  providedIn: 'root',
})
export class ExpenseService extends GenericHttpService<Expense> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `expenses`);
  } // constructor
} // ExpenseService
