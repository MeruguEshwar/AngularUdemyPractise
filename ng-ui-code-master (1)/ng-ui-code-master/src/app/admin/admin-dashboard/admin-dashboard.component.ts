import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "@app/core/service/auth.service";
import { InvoiceStatus } from "@app/shared/enums/invoiceStatus.enum";
import { AdminDashBoard } from "@app/shared/models/adminDashboard-module.model";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { SharedService } from "@app/shared/shared.service";
import { UserActionServices } from "@app/shared/userAction.services";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  data: any;
  data2: any;
  dashboardDetails: AdminDashBoard;
  get InvoiceStatus() {
    return InvoiceStatus;
  }
  constructor(
    private sharedService: SharedService,
    private http: HttpClient,
    public authService: AuthService,
    private userAction: UserActionServices
  ) {
    this.data = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "AR Invoices",
          backgroundColor: "#013893 ",
          borderColor: "#013893 ",
          data: [65, 59, 80, 81, 56, 55, 40],
        },
        {
          label: "AP Invoices",
          backgroundColor: "#00a2e3",
          borderColor: "#00a2e3",
          data: [28, 48, 40, 19, 86, 1, 0],
        },
      ],
    };
    this.data2 = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "First Dataset",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: "#013893",
        },
        {
          label: "Second Dataset",
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: "#00a2e3",
        },
      ],
    };
  }

  ngOnInit(): void {
    this.dashboardDetails = new AdminDashBoard();
    this.http
      .get<ApiResponse<any>>("api/dashboard/admin/get")
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.dashboardDetails = res.responsePayload;
          this.userAction.adminDashBoard.next(res.responsePayload);
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
}
