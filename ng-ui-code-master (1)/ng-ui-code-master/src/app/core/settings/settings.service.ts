import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { IDsConfig } from "@app/shared/models/idsConfig.model";
import { EmailDetails } from "@app/shared/models/SettingsEmailDetails.model";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  constructor(private http: HttpClient) {}
  saveOrganizationCurrency(country, currency, countryDetailsId) {
    return this.http.post<ApiResponse<any>>(
      `api/settings/currency/save?country=${country}&currency=${currency}&countryDetailsId=${countryDetailsId}`,
      {}
    );
  }

  getOrganizationCurrency() {
    return this.http.get<ApiResponse<any>>(`api/settings/currency/get`);
  }

  getEmailDetails() {
    return this.http.get<ApiResponse<any>>(
      `/api/settings/email/configuration/get`
    );
  }

  updateEmailDetails(formData: EmailDetails) {
    return this.http.post<ApiResponse<any>>(
      `/api/settings/email/configuration/save`,
      formData
    );
  }

  getEmployeeConfigurations() {
    return this.http.get<ApiResponse<any>>(`/api/settings/employee/configs`);
  }

  getInvoiceConfigurations() {
    return this.http.get<ApiResponse<any>>(`/api/settings/invoice/configs`);
  }

  updateInvoiceConfigurations(
    invoiceNotificationConfig: string,
    applyToAll: boolean,
    companyDetailsId: number
  ) {
    if (companyDetailsId) {
      return this.http.post<ApiResponse<any>>(
        `/api/settings/invoice/config/update?companyDetailsId=${companyDetailsId}&applyToAll=${applyToAll}&invoiceNotificationConfig=${invoiceNotificationConfig}`,
        {}
      );
    } else {
      return this.http.post<ApiResponse<any>>(
        `/api/settings/invoice/config/update?applyToAll=${applyToAll}&invoiceNotificationConfig=${invoiceNotificationConfig}`,
        {}
      );
    }
  }

  getTimesheetConfigurations() {
    return this.http.get<ApiResponse<any>>(`/api/settings/timesheet/configs`);
  }
  getEmployeeIdConfig() {
    return this.http.get<ApiResponse<IDsConfig>>(
      `api/settings/empid/config/get`
    );
  }
  saveEmployeeIdConfig(empIdConfiguration) {
    return this.http.post<ApiResponse<any>>(
      `api/settings/empid/config/save?empIdConfiguration=${empIdConfiguration}`,
      {}
    );
  }

  updateTimesheetConfigurations(
    timesheetNotificationConfig: string,
    applyToAll: boolean,
    projectDetailsId: number
  ) {
    if (projectDetailsId) {
      return this.http.post<ApiResponse<any>>(
        `/api/settings/timesheet/config/update?projectDetailsId=${projectDetailsId}&applyToAll=${applyToAll}&timesheetNotificationConfig=${timesheetNotificationConfig}`,
        {}
      );
    } else {
      return this.http.post<ApiResponse<any>>(
        `/api/settings/timesheet/config/update?applyToAll=${applyToAll}&timesheetNotificationConfig=${timesheetNotificationConfig}`,
        {}
      );
    }
  }
  // getW4Configurations() {
  //   return this.http.get<ApiResponse<any>>(`/api/settings/w4/configs`);
  // }

  updateW4Configurations(
    w4Config: string,
    applyToAll: boolean,
    employeeConfigsDetailsId: number
  ) {
    return this.http.post<ApiResponse<any>>(
      `/api/settings/w4/config/update?w4Config=${w4Config}&applyToAll=${applyToAll}&employeeConfigsDetailsId=${employeeConfigsDetailsId}`,
      {}
    );
  }
  // getI9Configurations() {
  //   return this.http.get<ApiResponse<any>>(`/api/settings/i9/configs`);
  // }

  updateI9Configurations(
    i9Config: string,
    applyToAll: boolean,
    employeeConfigsDetailsId: number
  ) {
    return this.http.post<ApiResponse<any>>(
      `/api/settings/i9/config/update?i9Config=${i9Config}&applyToAll=${applyToAll}&employeeConfigsDetailsId=${employeeConfigsDetailsId}`,
      {}
    );
  }
  updateEmployeeConfigurations(employeeConfigDetails) {
    return this.http.post<ApiResponse<any>>(
      `/api/settings/employee/configs/update`,
      employeeConfigDetails
    );
  }
  UpdateNotificationConfig(
    employeeConfigsDetailsId: number,
    timesheetNotification
  ) {
    return this.http.post<ApiResponse<any>>(
      `/api/settings/timesheet/notification/config/update?timesheetNotification=${timesheetNotification}&employeeConfigsDetailsId=${employeeConfigsDetailsId}`,
      {}
    );
  }
}
