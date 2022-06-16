import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { W4 } from "@app/shared/models/w4-module.model";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class I9Service {
  constructor(private http: HttpClient) {}
  getI9Details(employeeDetailsId) {
    return this.http.get<ApiResponse<W4>>(`api/i9/get/${employeeDetailsId}`);
  }
  addI9(i9: any) {
    return this.http.post<ApiResponse<W4>>(`api/i9/submit`, i9);
  }
  updateI9(i9: any) {
    return this.http.post<ApiResponse<W4>>(`api/i9/update`, i9);
  }
  uploadI9Doc(formData: FormData) {
    return this.http.post<ApiResponse<any>>(`api/i9/document/upload`, formData);
  }
  downloadI9Doc(
    employeeDocumentUploadDetailsId
  ): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/i9/document/download?employeeDocumentUploadDetailsId=${employeeDocumentUploadDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  downloadI9PDFDoc(i9DetailsId): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/i9/download/as/pdf?i9DetailsId=${i9DetailsId}`,
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
  verifyI9Details(verificationDetails: any) {
    return this.http.post<ApiResponse<any>>(
      `api/i9/employer/verification/submit`,
      verificationDetails
    );
  }
  getDigitalSignature(employeeDetailsId: number) {
    return this.http.get<ApiResponse<any>>(
      `api/profile/signature/${employeeDetailsId}`
    );
  }
  uploadI9ValidationDocument(params) {
    return this.http.post<ApiResponse<any>>(
      `api/i9/verification/document/upload`,
      params
    );
  }
  deleteI9ValidationDocument(i9VerificationDocumentDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `/api/i9/verification/document/delete?i9VerificationDocumentDetailsId=${i9VerificationDocumentDetailsId}`
    );
  }
  getI9ValidationDocument(i9DetailsId: number) {
    return this.http.get<ApiResponse<any>>(
      `api/i9/verification/documents/get/${i9DetailsId}`
    );
  }
  deleteI9Details(i9DetailsId) {
    return this.http.put<ApiResponse<any>>(`/api/i9/delete/${i9DetailsId}`, {});
  }
}
