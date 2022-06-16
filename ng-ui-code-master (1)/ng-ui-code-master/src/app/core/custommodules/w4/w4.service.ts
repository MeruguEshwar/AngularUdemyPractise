import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { W4 } from "@app/shared/models/w4-module.model";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class W4Service {
  private empId: number = null;
  constructor(private http: HttpClient) {}
  getW4Details(employeeDetailsId) {
    return this.http.get<ApiResponse<W4>>(`api/w4/get/${employeeDetailsId}`);
  }
  deleteW4Details(w4DetailsId: number) {
    return this.http.put<ApiResponse<any>>(
      `api/w4/delete/${w4DetailsId}`,
      null
    );
  }
  addW4(w4: any) {
    return this.http.post<ApiResponse<W4>>(`api/w4/submit`, w4);
  }
  setUserToEdit(empId) {
    this.empId = empId;
  }
  getUserToEidt() {
    return this.empId;
  }
  updateW4(w4: W4) {
    return this.http.post<ApiResponse<W4>>(`api/w4/update`, w4);
  }
  uploadW4Doc(formData: FormData) {
    return this.http.post<ApiResponse<any>>(`api/w4/document/upload`, formData);
  }
  verifyW4Details(verificationDetails: any) {
    return this.http.post<ApiResponse<any>>(
      `/api/w4/update/status`,
      verificationDetails
    );
  }
  downloadW4PDFDoc(w4DetailsId): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/w4/download/as/pdf?w4DetailsId=${w4DetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  downloadW4Doc(
    employeeDocumentUploadDetailsId
  ): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/w4/document/download?employeeDocumentUploadDetailsId=${employeeDocumentUploadDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  getSignatureConfig(employeeDetailsId) {
    return this.http.get<ApiResponse<W4>>(
      `api/settings/employee/config/${employeeDetailsId}`
    );
  }
  getDigitalSignature(employeeDetailsId: number) {
    return this.http.get<ApiResponse<any>>(
      `api/profile/signature/${employeeDetailsId}`
    );
  }
}
