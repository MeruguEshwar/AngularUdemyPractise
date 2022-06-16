import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@app/shared/models/api-response.model";

@Injectable({
  providedIn: "root",
})
export class ForgotPasswordValidationServices {
  constructor(private http: HttpClient) {}
  validateLink(activationCode) {
    return this.http.get<ApiResponse<any>>(
      `api/registration/forgot/password/link/validate?activationCode=${activationCode}`,
      {}
    );
  }
  setForgotPassword(activationCode, password) {
    return this.http.put<ApiResponse<any>>(
      `api/registration/forgot/password/set?activationCode=${activationCode}&&password=${password}`,
      {}
    );
  }
}
