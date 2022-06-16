import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
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
import { AccountsRoutingModule } from "./account-routing.module";

@NgModule({
  declarations: [],
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
    AccountsRoutingModule,
  ],
  exports: [SharedServiceModule],
  providers: [ConfirmationService],
})
export class AccountsModule {}
