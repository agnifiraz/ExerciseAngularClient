import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Employee } from '../employee';
@Component({
  selector: 'app-employee-list',
  template: `
    <mat-list-item
      *ngFor="let employee of employees"
      layout="row"
      class="pad-xs mat-title"
      (click)="selected.emit(employee)"
    >
      {{ employee.id }} - {{ employee.firstname }}, {{ employee.lastname }}
    </mat-list-item>
  `,
})
export class EmployeeListComponent {
  @Input() employees?: Employee[];
  @Output() selected = new EventEmitter();
} // EmployeeListComponent
