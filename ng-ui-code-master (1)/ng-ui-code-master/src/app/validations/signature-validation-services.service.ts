import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@app/shared/models/api-response.model";

@Injectable({
  providedIn: "root",
})
export class SignatureValidationServices {
  constructor(private http: HttpClient) {}
  validateSignature(verificationCode) {
    return this.http.post<ApiResponse<any>>(
      `api/profile/signature/verify?verificationCode=${verificationCode}`,
      {}
    );
  }
}
