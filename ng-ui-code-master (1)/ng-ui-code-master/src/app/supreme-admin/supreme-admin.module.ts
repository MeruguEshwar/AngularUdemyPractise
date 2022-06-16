import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TableModule } from "../components/table/table";
import { InputTextModule } from "../components/inputtext/inputtext";
import { ButtonModule } from "../components/button/button";
import { DialogModule } from "../components/dialog/dialog";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropdownModule } from "../components/dropdown/dropdown";
import { ConfirmDialogModule } from "../components/confirmdialog/confirmdialog";
import { ConfirmationService } from "../components/api/confirmationservice";
import { ChartModule } from "../components/chart/chart";
import { SharedServiceModule } from "@app/shared/shared.module";
import { RadioButtonModule } from "@app/components/public_api";
import { SupremeAdminRoutingModule } from "./supreme-admin-routing.module";
import { OrganizationComponent } from "./organization/organization.component";
import { FreeemaildomainComponent } from "./freeemaildomain/freeemaildomain.component";
import { EditFreeemaildomainComponent } from "./freeemaildomain/edit-freeemaildomain/edit-freeemaildomain.component";

@NgModule({
  declarations: [
    OrganizationComponent,
    FreeemaildomainComponent,
    EditFreeemaildomainComponent,
  ],
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
    SupremeAdminRoutingModule,
    ConfirmDialogModule,
  ],
  exports: [SharedServiceModule],
  providers: [ConfirmationService],
})
export class SupremeAdminModule {}
