import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { User } from "@app/shared/models/user.model";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(user: any) {
    return this.http.post<ApiResponse<User>>(`api/employee/login`, user);
  }
  forgotPassword(email: string) {
    return this.http.put<ApiResponse<User>>(
      `api/registration/forgot/password/link/send?email=${email}`,
      {}
    );
  }
}
