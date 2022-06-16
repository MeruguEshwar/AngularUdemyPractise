import { Component, OnInit, Input } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { Paystubs } from "@app/shared/models/paystubs.model";
import { PaystubsServices } from "@app/core/custommodules/paystubs/paystubs.services";
import { SharedService } from "@app/shared/shared.service";

@Component({
  selector: "app-profile-paystubs",
  templateUrl: "./profile-paystubs.component.html",
  styleUrls: ["./profile-paystubs.component.css"],
})
export class ProfilePaystubsComponent implements OnInit {
  @Input() userId: any;
  lstPaystubs;
  yearLst: any;
  cols: any[];
  selectedYear;
  paystubType;
  paystub: Paystubs;
  loading: boolean = false;
  userName: string;
  constructor(
    private paystubService: PaystubsServices,
    private sharedService: SharedService
  ) {}

  async ngOnInit() {
    this.cols = [
      // { field: 'departmentDetailsId', header: 'ID' },
      { field: "checkDate", header: "Check Date" },
      { field: "payType", header: "Pay Type" },
      { field: "checkNumber", header: "Check / VCR" },
      { field: "netAmount", header: "Net Amount" },
    ];
    await this.getYears(this.userId);
    this.userName = "";
    this.selectedYear = this.yearLst[0].value;
    this.getPaystubs(this.selectedYear);
  }
  getPaystubs(year) {
    this.paystubService
      .getPaystubsDetails(this.userId, year)
      .subscribe((res) => {
        if (res && res.statusCode == 200) {
          this.lstPaystubs = res.responsePayload;
        } else {
          this.lstPaystubs = [];
        }
      });
  }
  showDialogToAdd() {
    this.paystubType = "Add";
  }
  showDialogToEdit(rowData) {
    this.paystubType = "Edit";
    this.paystub = rowData;
  }
  onPaystubAddCloseClick(event) {
    this.getPaystubs(this.selectedYear);
    this.paystubType = "";
  }
  getyear(event) {
    this.getPaystubs(event.value);
  }
  async getYears(employeeDetailsId) {
    return new Promise((resolve, reject) => {
      this.paystubService.getYears(employeeDetailsId).subscribe((res) => {
        this.yearLst = [];
        if (res.statusCode == 200) {
          res.responsePayload.forEach((element, index) => {
            this.yearLst.push({ label: element, value: parseInt(element) });
          });
          resolve();
        } else {
          var currYear = new Date().getFullYear();
          this.yearLst.push({
            label: currYear.toString(),
            value: currYear,
          });
        }
      });
    });
  }
  downloadFile(data) {
    this.sharedService.add({
      severity: "info",
      summary: "Info!",
      detail: "File is preparing to download please wait",
    });
    this.paystubService
      .downloadPaystub(data.employeeDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `paystub_${data.employeeDetailsId}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
}
