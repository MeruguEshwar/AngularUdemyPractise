import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "@app/core/service/auth.service";
import { SharedService } from "@app/shared/shared.service";
import { BulkUploadServices } from "../bulkupload.service";

@Component({
  selector: "app-bulkupload-designations",
  templateUrl: "./bulkupload-designations.component.html",
  styleUrls: ["./bulkupload-designations.component.css"],
})
export class BulkuploadDesignationsComponent implements OnInit {
  cols: any = [
    { field: "rowNo", header: "#" },
    { field: "designation", header: "Designation Name" },
    { field: "description", header: "Description" },
  ];
  bulkUploadList: any;
  isHeaderValid: boolean = false;
  hasValidationErrors: boolean = true;
  organizationDetailsId: any;
  viewValidationError: any[] = null;
  constructor(
    private bulkuploadService: BulkUploadServices,
    private sharedService: SharedService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.organizationDetailsId =
      this.authService.currentUser.organizationDetailsId;
  }
  download() {
    this.bulkuploadService
      .downloadTemplate("Designations")
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `Designations.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
  upload(event, fileUpload) {
    this.cols = [
      { field: "rowNo", header: "#" },
      { field: "designation", header: "Designation Name" },
      { field: "description", header: "Description" },
    ];
    let input = new FormData();
    input.append("template", "Designations");
    input.append("fileToUpload", event.files[0]);
    this.bulkuploadService.uploadbulkUploadFile(input).subscribe(
      (res) => {
        if ((res.statusCode = 200)) {
          this.isHeaderValid = res.responsePayload.isHeaderValid;
          this.bulkUploadList =
            res.responsePayload.bulkUploadDesignationDetailsData;
          fileUpload.clear();
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error!",
            detail: res.message,
          });
        }
      },
      (error) => {
        this.sharedService.add({
          severity: "error",
          summary: "Error!",
          detail: error,
        });
      }
    );
  }
  validateDocument() {
    this.bulkuploadService
      .validateBulkUploadDesignationsData(this.organizationDetailsId)
      .subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.hasValidationErrors = res.responsePayload.hasValidationErrors;
            this.bulkUploadList =
              res.responsePayload.bulkUploadDesignationDetailsData;
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
          } else {
            this.cols = [
              { field: "rowNo", header: "#" },
              { field: "designation", header: "Designation Name" },
              { field: "description", header: "Description" },
              {
                field: "validationResponses",
                header: "Status",
              },
            ];
            this.hasValidationErrors = res.responsePayload.hasValidationErrors;
            this.bulkUploadList =
              res.responsePayload.bulkUploadDesignationDetailsData;
            this.sharedService.add({
              severity: "error",
              summary: "Error!",
              detail: res.message,
            });
          }
        },
        (error) => {
          this.sharedService.add({
            severity: "error",
            summary: "Error!",
            detail: error,
          });
        }
      );
  }
  saveDocument() {
    this.bulkuploadService
      .saveBulkUploadDesignationsData(this.organizationDetailsId)
      .subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.restToAllNew();
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
          } else {
            this.sharedService.add({
              severity: "error",
              summary: "Error!",
              detail: res.message,
            });
          }
        },
        (error) => {
          this.sharedService.add({
            severity: "error",
            summary: "Error!",
            detail: error,
          });
        }
      );
  }
  showError(rowData) {
    this.viewValidationError = rowData.validationResponses;
  }
  restToAllNew() {
    this.cols = [
      { field: "rowNo", header: "#" },
      { field: "designation", header: "Designation Name" },
      { field: "description", header: "Description" },
    ];
    this.bulkUploadList = undefined;
    this.isHeaderValid = false;
    this.hasValidationErrors = true;
    this.viewValidationError = null;
  }
}
