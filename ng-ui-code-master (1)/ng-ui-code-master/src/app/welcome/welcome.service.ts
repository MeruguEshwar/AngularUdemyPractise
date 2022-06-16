import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";

@Injectable({
  providedIn: "root",
})
export class WelcomeService {
  constructor(private http: HttpClient) {}

  basicSetUp(request: any) {
    return this.http.post(`api/registration/basic/setup`, request);
  }

  validateDomain(workEmail: string) {
    return this.http.get<ApiResponse<any>>(
      `api/registration/domain/validate?workEmail=${workEmail}`
    );
  }
}
