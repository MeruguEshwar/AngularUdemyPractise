import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Employee } from '@app/shared/models/employee.model';
import { ApiResponse } from '@app/shared/models/api-response.model';
import { Checklist } from '@app/shared/models/checklist.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    constructor(private http: HttpClient) {

    }
    getAllEmployees(status:number) {
        return this.http.get<ApiResponse<Employee>>(`api/employee/all?status=${status}`);
    }
    getEmployee(employeeDetailsId: string) {
        return this.http.get<ApiResponse<Employee>>(`api/employee/${employeeDetailsId}`);
    }
    addEmployee(employee: any) {
        return this.http.post<ApiResponse<Employee>>(`api/employee/add`, employee);
    }
    updateEmployee(employee: any) {
        return this.http.put<ApiResponse<Employee>>('api/employee/update', employee)
    }
    activateEmployee(employee) {
        return this.http.post<ApiResponse<Employee>>(`api/employee/rehire`, employee)
    }
    deactivateEmployee(employee) {
        return this.http.post<ApiResponse<Employee>>(`api/employee/terminate`, employee)
    }
    resetPasswordEmployee(employeeDetailsId: number) {
        return this.http.put<ApiResponse<Employee>>(`api/employee/password/reset/${employeeDetailsId}`, {})
    }
    sendRegistrationLink(employeeDetailsId: number) {
        return this.http.put<ApiResponse<Employee>>(`api/employee/registrationlink/send/${employeeDetailsId}`, {})
    }
    isEmployeeExists(email: string) {
        return this.http.get<ApiResponse<Employee>>(`api/employee/email/exists?email=${email}`)
    }

    getManageAccess(employeeDetailsId: number) {
        return this.http.get<ApiResponse<any>>(`api/manage/access/get/${employeeDetailsId}`)
    }
    saveManageAccess(accessibleModules: any) {
        return this.http.post<ApiResponse<any>>(`api/manage/access/update`,accessibleModules);
    }

    getChecklistMappings(employeeDetailsId, checklistDetailsId) {
        return this.http.get<ApiResponse<any>>(`api/checklist/employee/mapping/get?employeeDetailsId=${employeeDetailsId}&checklistDetailsId=${checklistDetailsId}`)
    }
    saveMappings(accessibleModules: any) {
        return this.http.post<ApiResponse<any>>(`api/checklist/employee/mapping/save`,accessibleModules);
    }
    
    uploadDocs(accessibleModules: any) {
        return this.http.post<ApiResponse<any>>(`api/checklist/employee/document/upload`,accessibleModules);
    }
    getAllChecklists(){
        return this.http.get<ApiResponse<Checklist>>(`api/checklist/all?status=1`);
    }
    getChecklist(checklistDetailsId:any){
        return this.http.get<ApiResponse<Checklist>>(`api/checklist/${checklistDetailsId}`);
    }
    downloadDocument(
        employeeChecklistDocumentUploadDetailsId
      ): Observable<HttpResponse<Blob>> {
        return this.http.get<Blob>(
          `api/checklist/employee/document/download?employeeChecklistDocumentUploadDetailsId=${employeeChecklistDocumentUploadDetailsId}`,
          {
            observe: "response",
            responseType: "blob" as "json",
          }
        );
      }
}