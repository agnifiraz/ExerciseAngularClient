import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EmployeeHomeComponent } from './employee/employee-home/employee-home.component';
import { ExpenseHomeComponent } from '@app/expense/expense-home/expense-home.component';
import { GeneratorComponent } from '@app/report/generator/generator.component';
import { ViewerComponent } from '@app/report/viewer/viewer.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, title: 'Exercises - Home' },
  {
    path: 'employees',
    component: EmployeeHomeComponent,
    title: 'Exercises - Employees',
  },
  {
    path: 'expenses',
    component: ExpenseHomeComponent,
    title: 'Exercises - Expenses',
  },
  { path: 'generator', component: GeneratorComponent },
  { path: 'viewer', component: ViewerComponent },

  { path: '', component: HomeComponent, title: 'Exercises - Home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
