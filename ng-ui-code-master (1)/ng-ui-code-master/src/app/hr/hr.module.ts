import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HrDashboardComponent } from "./hr-dashboard/hr-dashboard.component";
import { HrRoutingModule } from "./hr-routing.module";
import { ConfirmDialogModule } from "@app/components/confirmdialog/confirmdialog";
import { ConfirmationService } from "@app/components/api/confirmationservice";
import { SharedServiceModule } from "@app/shared/shared.module";
import { RouterModule } from "@angular/router";
import {
  TableModule,
  InputTextModule,
  ButtonModule,
  DialogModule,
  DropdownModule,
  RadioButtonModule,
  ChartModule,
} from "@app/components/public_api";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [HrDashboardComponent],
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    RadioButtonModule,
    ReactiveFormsModule,
    ChartModule,
    SharedServiceModule,
    ConfirmDialogModule,
    HrRoutingModule,
  ],
  exports: [SharedServiceModule],
  providers: [ConfirmationService],
})
export class HrModule {}
