import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@app/shared/models/api-response.model";

@Injectable({
  providedIn: "root",
})
export class ImmigrationsServices{
  constructor(private http: HttpClient) {}
  getAllEmployees() {
    return this.http.get<ApiResponse<any>>(
      `api/employee/all?status=1`
    );
  }
}