import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// added imports
import { MatComponentsModule } from './mat-components/mat-components.module';
import { HomeComponent } from './home/home.component';
import { EmployeeModule } from './employee/employee.module';

@NgModule({
 declarations: [AppComponent, HomeComponent],
 imports: [
 BrowserModule,
 AppRoutingModule,
 BrowserAnimationsModule,
 HttpClientModule,
 MatComponentsModule,
 EmployeeModule,
 ],
 providers: [],
 bootstrap: [AppComponent],
})
export class AppModule {}
