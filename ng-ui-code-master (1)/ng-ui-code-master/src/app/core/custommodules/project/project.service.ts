import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";

import { Project } from "@app/shared/models/project.model";
import { projectAssignment } from "@app/shared/models/project-assignment.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  constructor(private http: HttpClient) {}
  getAllProject(status: number) {
    return this.http.get<ApiResponse<Project>>(
      `api/project/all?status=${status}`
    );
  }
  getProject(projectDetailsId: number) {
    return this.http.get<ApiResponse<Project>>(
      `api/project/${projectDetailsId}`
    );
  }
  addProject(project: any) {
    return this.http.post<ApiResponse<Project>>(`api/project/add`, project);
  }
  updateProject(project: Project) {
    return this.http.post<ApiResponse<Project>>("api/project/update", project);
  }
  activateProject(projectDetailsId: number) {
    return this.http.put<ApiResponse<Project>>(
      `api/project/activate/${projectDetailsId}`,
      {}
    );
  }
  deactivateProject(projectDetailsId: number) {
    return this.http.put<ApiResponse<Project>>(
      `api/project/deactivate/${projectDetailsId}`,
      {}
    );
  }
  isProjectExists(projectName: string) {
    return this.http.get<ApiResponse<Project>>(
      `api/project/exists?projectName=${projectName}`
    );
  }

  getProjectAssignMent(employeeDetailsId) {
    return this.http.get<ApiResponse<projectAssignment>>(
      `api/project/assignment/all/${employeeDetailsId}?status=1`
    );
  }
  updateProjectAssignMent(projectAssignment: projectAssignment) {
    return this.http.post<ApiResponse<projectAssignment>>(
      "api/project/assignment/update",
      projectAssignment
    );
  }

  saveProjectAssignMent(projectAssignment: projectAssignment) {
    return this.http.post<ApiResponse<projectAssignment>>(
      "api/project/assignment/save",
      projectAssignment
    );
  }
  projectMappingRemove(projectCompanyMappingDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/project/company/mapping/remove/${projectCompanyMappingDetailsId}`,
      {}
    );
  }
  getAllApprovers(status, timesheetApprover) {
    return this.http.get<ApiResponse<any>>(
      `api/approver/all?status=${status}&&timesheetApprover=${timesheetApprover}`
    );
  }
  getProjectTimesheetApprover(status, projectDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/timesheet/approver/project?status=${status}&&projectDetailsId=${projectDetailsId}`
    );
  }
  getProjectDocuments(employeeDetailsId, projectDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/project/documents/get?employeeDetailsId=${employeeDetailsId}&&projectDetailsId=${projectDetailsId}`
    );
  }
  getProjectAndTaggedDocuments(employeeDetailsId, projectDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/project/documents/all/get?employeeDetailsId=${employeeDetailsId}&&projectDetailsId=${projectDetailsId}`
    );
  }
  downloadProjectDocument(
    projectDocumentDetailsId
  ): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/project/document/download?projectDocumentDetailsId=${projectDocumentDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  downloadCompanyDocument(
    companyDocumentDetailsId
  ): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/company/document/download?companyDocumentDetailsId=${companyDocumentDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  assignProjectTimesheetApprovers(formData) {
    return this.http.post<ApiResponse<projectAssignment>>(
      "api/timesheet/approver/project/assign",
      formData
    );
  }
  unasignProjectTimesheetApprovers(projectTimesheetApproverDetailsId) {
    return this.http.put<ApiResponse<projectAssignment>>(
      `api/timesheet/approver/project/unassign/${projectTimesheetApproverDetailsId}`,
      {}
    );
  }
  getProjectResources(projectDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `/api/project/assigned/resources/${projectDetailsId}`
    );
  }
  uploadProjectDocument(formData: FormData) {
    return this.http.post<ApiResponse<Project>>(
      `api/project/document/upload`,
      formData
    );
  }
  updateProjectDocument(formData: FormData) {
    return this.http.post<ApiResponse<Project>>(
      `api/project/document/upload/update`,
      formData
    );
  }
  getProjectComments(projectDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/project/comments/${projectDetailsId}`
    );
  }
  saveProjectcomment(comment) {
    return this.http.post<ApiResponse<Project>>(
      `api/project/comment/save`,
      comment
    );
  }
  deleteProjectComment(projectCommentDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/project/comment/delete/${projectCommentDetailsId}`,
      {}
    );
  }

  getSupplierOfProject(projectDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/project/supplier/${projectDetailsId}`
    );
  }
  getEmployeesOfProject(projectDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/project/assigned/resources/${projectDetailsId}`
    );
  }
  getEmployeesOfSupplierBySupplier(projectDetailsId, projectCodes) {
    return this.http.get<ApiResponse<any>>(
      `api/project//customer/mapped/resources?companyCodes=${projectCodes}&&projectDetailsId=${projectDetailsId}`
    );
  }
  getTaggedDocuments(projectDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/project/tagged/documents/${projectDetailsId}`
    );
  }
  getTaggedWithProjectDoc(projectDocumentDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/project/document/tagged/with/details/${projectDocumentDetailsId}`
    );
  }
  getCurrentOrgAsCompanyDetails() {
    return this.http.get<ApiResponse<any>>(`api/project/org/as/company/get`);
  }
  deleteProjectDocument(projectDocumentDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/project/document/delete/${projectDocumentDetailsId}`
    );
  }
  updateProjectAssignmentShowInInvoiceStatus(
    projectAssignmentDetailsId,
    showInInvoice
  ) {
    return this.http.put<ApiResponse<any>>(
      `api/project/assignment/invoice/status/update/${projectAssignmentDetailsId}?showInInvoice=${showInInvoice}`,
      {}
    );
  }
  updateProjectAssignmentStatus(projectAssignmentDetailsId, status) {
    return this.http.put<ApiResponse<any>>(
      `api/project/assignment/status/update/${projectAssignmentDetailsId}?status=${status}`,
      {}
    );
  }
  getProjectCustomers(projectDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/project/companies/${projectDetailsId}`
    );
  }
  getOnBoardedEmployees() {
    return this.http.get<ApiResponse<any>>(`api/employee/onboarded/all`);
  }
}
