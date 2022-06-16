import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EmployeeDashboardComponent } from "./employee-dashboard/employee-dashboard.component";
import { EmployeeRoutingModule } from "./employee-routing.module";

@NgModule({
  declarations: [EmployeeDashboardComponent],
  imports: [CommonModule, EmployeeRoutingModule],
})
export class EmployeeModule {}
