import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@app/shared/models/api-response.model";

@Injectable({
  providedIn: "root",
})
export class PayHistoryService {
  constructor(private http: HttpClient) {}
  getAllEmployees() {
    return this.http.get<ApiResponse<any>>(`api/employee/all?status=1`);
  }
  isPayRateExists(employeeDetailsId, startDate) {
    return this.http.get<ApiResponse<any>>(
      `api/payhistory/payrate/exists?employeeDetailsId=${employeeDetailsId}&&startDate=${startDate}`
    );
  }
  saveEmployeePayRate(payrateDetails) {
    return this.http.post<ApiResponse<any>>(
      `api/payhistory/payrate/save`,
      payrateDetails
    );
  }
  getPayRate(employeeDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `/api/payhistory/payrate/all?employeeDetailsId=${employeeDetailsId}`
    );
  }
  deactivatePayRate(employeePayRateDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `/api/payhistory/payrate/deactivate/${employeePayRateDetailsId}`,
      {}
    );
  }
  activatePayRate(employeePayRateDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `/api/payhistory/payrate/activate/${employeePayRateDetailsId}`,
      {}
    );
  }
  // advances services

  getAdvances(employeeDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/payhistory/advance/all?employeeDetailsId=${employeeDetailsId}`
    );
  }
  saveAdvanceEmployeePayRate(advancePayRateDetails) {
    return this.http.post<ApiResponse<any>>(
      `api/payhistory/advance/save`,
      advancePayRateDetails
    );
  }
  advanceStatusUpdate(employeeAdvanceDetailsId, status) {
    return this.http.put<ApiResponse<any>>(
      `api/payhistory/advance/status/update/${employeeAdvanceDetailsId}?status=${status}`,
      {}
    );
  }

  // expenses services
  getExpenses(employeeDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `/api/payhistory/expense/all?employeeDetailsId=${employeeDetailsId}`
    );
  }
  deleteExpenceLineItem(employeeExpenseLineItemDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `employeeExpenseLineItemDetailsId=${employeeExpenseLineItemDetailsId}`
    );
  }
  saveExpencesEmployeePayRate(advancePayRateDetails) {
    return this.http.post<ApiResponse<any>>(
      `api/payhistory/expense/save`,
      advancePayRateDetails
    );
  }
  getExpensesDescription(organizationDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/payhistory/expense/lineitem/descriptions?organizationDetailsId=${organizationDetailsId}`
    );
  }
  getExpensesNames(organizationDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/payhistory/expense/names?organizationDetailsId=${organizationDetailsId}`
    );
  }
  deactivateExpensePayRate(employeeExpenseDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `/api/payhistory/expense/deactivate/${employeeExpenseDetailsId}`,
      {}
    );
  }
  activateExpensePayRate(employeeExpenseDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `/api/payhistory/expense/activate/${employeeExpenseDetailsId}`,
      {}
    );
  }
  // Deduction services
  getDeduction(employeeDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `/api/payhistory/deduction/all?employeeDetailsId=${employeeDetailsId}`
    );
  }
  saveDeductionEmployeePayRate(advancePayRateDetails) {
    return this.http.post<ApiResponse<any>>(
      `api/payhistory/deduction/save`,
      advancePayRateDetails
    );
  }
  statusUpdateDeductionPayRate(employeeDeductionDetailsId, status) {
    return this.http.put<ApiResponse<any>>(
      `/api/payhistory/deduction/status/update/${employeeDeductionDetailsId}?status=${status}`,
      {}
    );
  }
  getExpenseDeductionDetails(employeeDeductionDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/payhistory/deduction/details?employeeDeductionDetailsId=${employeeDeductionDetailsId}`
    );
  }
  getExpenseDetailsById(employeeExpenseDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/payhistory/expense/details?employeeExpenseDetailsId=${employeeExpenseDetailsId}`
    );
  }
  getExpencesLineitem(employeeDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/payhistory/expense/lineitem/all?employeeDetailsId=${employeeDetailsId}`
    );
  }
  getOnBoardedEmployees() {
    return this.http.get<ApiResponse<any>>(`api/employee/onboarded/all`);
  }
}
