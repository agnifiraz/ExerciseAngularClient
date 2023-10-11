import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Report } from '@app/report/report';
import { GenericHttpService } from '@app/generic-http.service';
@Injectable({
  providedIn: 'root',
})
export class ReportService extends GenericHttpService<Report> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `reports`);
  } // constructor
} // ReportService
