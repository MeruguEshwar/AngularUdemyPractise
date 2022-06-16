import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { W4 } from "@app/shared/models/w4-module.model";
import { BehaviorSubject, Observable } from "rxjs";
import { Employee } from "@app/shared/models/employee.model";
@Injectable({
  providedIn: "root",
})
export class PaystubsServices {
  constructor(private http: HttpClient) {}

  private messageSource = new BehaviorSubject({});
  currentMessage = this.messageSource.asObservable();
  changeMessage(message: string) {
    this.messageSource.next(message);
  }
  getAllEmployees(status: number) {
    return this.http.get<ApiResponse<Employee>>(
      `api/employee/all?status=${status}`
    );
  }
  getPaystubsDetails(employeeDetailsId, year) {
    return this.http.get<ApiResponse<W4>>(
      `api/paystub/all/get/${employeeDetailsId}?year=${year}`
    );
  }
  getYears(employeeDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/paystub/years/get/${employeeDetailsId}`
    );
  }
  getPaystubDetails(paystubDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/paystub/details/get/${paystubDetailsId}`
    );
  }
  getPayPeriods(employeeDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/paystub/periods/get/${employeeDetailsId}`
    );
  }
  getByPayPeriods(employeeDetailsId, payPeriod) {
    return this.http.get<ApiResponse<any>>(
      `api/paystub/details/get/by/payperiod?employeeDetailsId=${employeeDetailsId}&payPeriod=${payPeriod}`
    );
  }
  getHoldingNames(organizationDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/paystub/withholding/names?organizationDetailsId=${organizationDetailsId}`
    );
  }
  getOtherNames(organizationDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/paystub/other/names?organizationDetailsId=${organizationDetailsId}`
    );
  }
  getGrossEarningNames(organizationDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/paystub/gross/earning/names?organizationDetailsId=${organizationDetailsId}`
    );
  }
  getDeductionNames(organizationDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/paystub/deduction/names?organizationDetailsId=${organizationDetailsId}`
    );
  }
  addPaystub(paystub: any) {
    return this.http.post<ApiResponse<W4>>(`api/paystub/save`, paystub);
  }
  uploadPaystubs(formdata: FormData) {
    return this.http.post<any>(`api/paystub/upload`, formdata);
  }
  downloadPaystub(paystubDetailsId): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/paystub/download?paystubDetailsId=${paystubDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  downloadPaystubPDF(paystubDetailsId): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/paystub/download/as/pdf?paystubDetailsId=${paystubDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  deletePaystubAttachment(paystubDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/paystub/attachment/delete/${paystubDetailsId}`
    );
  }
  getOnBoardedEmployees() {
    return this.http.get<ApiResponse<any>>(
      `api/employee/onboarded/all?checkEmployeeType=1`
    );
  }
}
