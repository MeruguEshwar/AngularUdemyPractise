import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { Project } from "@app/shared/models/project.model";
import { Observable } from "rxjs";
import { Company } from "@app/shared/models/company-module.model";

@Injectable({
  providedIn: "root",
})
export class DocumentService {
  constructor(private http: HttpClient) {}
  getAllDocumentCategory(employeeDetailsId) {
    return this.http.get<ApiResponse<Project>>(
      `api/document/categories/${employeeDetailsId}`
    );
  }
  getDocumentCategory(employeeDetailsId, documentCategoryDetailsId) {
    return this.http.get<ApiResponse<Project>>(
      `api/document/employee/category/${employeeDetailsId}?documentCategoryDetailsId=${documentCategoryDetailsId}`
    );
  }
  uploadDocument(formData: FormData) {
    return this.http.post<ApiResponse<Project>>(
      `api/document/employee/upload`,
      formData
    );
  }
  updateDocument(formData: FormData) {
    return this.http.post<ApiResponse<Project>>(
      `api/document/employee/upload/update`,
      formData
    );
  }
  downloadDocument(
    employeeDetailsId,
    employeeDocumentUploadDetailsId
  ): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/document/employee/download?employeeDetailsId=${employeeDetailsId}&employeeDocumentUploadDetailsId=${employeeDocumentUploadDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  getAllProject(status: number, employeeDetailsId: number) {
    return this.http.get<ApiResponse<Project>>(
      `api/project/assignment/all/${employeeDetailsId}?status=${status}`
      // `api/project/all/contains/documents/${employeeDetailsId}?status=${status}`
    );
  }
  getProject(employeeDetailsId, projectDetailsId) {
    return this.http.get<ApiResponse<Project>>(
      `api/project/documents/get?employeeDetailsId=${employeeDetailsId}&projectDetailsId=${projectDetailsId}`
    );
  }
  getProjectAndTaggedProject(employeeDetailsId, projectDetailsId) {
    return this.http.get<ApiResponse<Project>>(
      `api/project/documents/all/get?employeeDetailsId=${employeeDetailsId}&projectDetailsId=${projectDetailsId}`
    );
  }
  getTaggedProject(employeeDetailsId, projectDetailsId) {
    return this.http.get<ApiResponse<Project>>(
      `api/employee/tagged/project/documents?employeeDetailsId=${employeeDetailsId}&projectDetailsId=${projectDetailsId}`
    );
  }
  getTaggedSupplier(employeeDetailsId, companyDetailsId) {
    return this.http.get<ApiResponse<Project>>(
      `api/employee/tagged/supplier/documents?employeeDetailsId=${employeeDetailsId}&companyDetailsId=${companyDetailsId}`
    );
  }
  getSupplier(employeeDetailsId, companyDetailsId) {
    return this.http.get<ApiResponse<Project>>(
      `api/company/documents/get?employeeDetailsId=${employeeDetailsId}&companyDetailsId=${companyDetailsId}`
    );
  }
  getSupplierAndTaggedProject(employeeDetailsId, companyDetailsId) {
    return this.http.get<ApiResponse<Project>>(
      `api/company/documents/all/get?employeeDetailsId=${employeeDetailsId}&companyDetailsId=${companyDetailsId}`
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
  uploadSupplierDocument(formData: FormData) {
    return this.http.post<ApiResponse<Project>>(
      `api/company/document/upload`,
      formData
    );
  }
  updateSupplierDocument(formData: FormData) {
    return this.http.post<ApiResponse<Project>>(
      `api/company/document/upload/update`,
      formData
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
  getAllCompanies(status: number, employeeDetailsId: number) {
    return this.http.get<ApiResponse<Company>>(
      `/api/company/all/contains/documents/${employeeDetailsId}?status=${status}`
    );
  }

  getCompany(employeeDetailsId, companyDetailsId) {
    return this.http.get<ApiResponse<Project>>(
      `api/company/documents/get?employeeDetailsId=${employeeDetailsId}&companyDetailsId=${companyDetailsId}`
    );
  }
  uploadCompanyDocument(formData: FormData) {
    return this.http.post<ApiResponse<Project>>(
      `api/company/document/upload`,
      formData
    );
  }
  updateCompanyDocument(formData: FormData) {
    return this.http.post<ApiResponse<Project>>(
      `api/company/document/upload/update`,
      formData
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
}
