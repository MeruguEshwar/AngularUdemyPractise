import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { Department } from "@app/shared/models/department.model";
import {
  Profile,
  Experience,
  Education,
  PersonalDetails,
  CommunicationDetails,
  AuthorizationDetails,
  EmploymentDetails,
  EmergContactDetails,
  EmpDependentDetails,
  BankAcountDetails,
  ImmigrationDetails,
} from "@app/shared/models/profile.model";
import { Designation } from "@app/shared/models/designation.model";
import { Employee } from "@app/shared/models/employee.model";
import { projectAssignment } from "@app/shared/models/project-assignment.model";
import { Project } from "@app/shared/models/project.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MyProfileService {
  constructor(private http: HttpClient) {}
  getProfile(employeeDetailsId: number) {
    return this.http.get<ApiResponse<Profile>>(
      `api/profile/${employeeDetailsId}`
    );
  }
  saveProfile(profile: Profile) {
    return this.http.post<ApiResponse<Profile>>(`api/profile/save`, profile);
  }

  getEducations(employeeDetailsId: number) {
    return this.http.get<ApiResponse<Education>>(
      `api/profile/educations/${employeeDetailsId}`
    );
  }
  getExperiences(employeeDetailsId: number) {
    return this.http.get<ApiResponse<Experience>>(
      `api/profile/experiences/${employeeDetailsId}`
    );
  }
  saveEducations(educations: Education[]) {
    return this.http.post<ApiResponse<Education>>(
      `api/profile/educations/save`,
      educations
    );
  }
  saveExperiences(experiences: Experience[]) {
    return this.http.post<ApiResponse<Experience>>(
      `api/profile/experiences/save`,
      experiences
    );
  }
  savePersonalDetails(personalDetails: PersonalDetails) {
    return this.http.post<ApiResponse<PersonalDetails>>(
      `api/profile/personal/details/save`,
      personalDetails
    );
  }
  saveCommunicationDetails(communicationDetails: CommunicationDetails) {
    return this.http.post<ApiResponse<CommunicationDetails>>(
      `api/profile/contact/details/save`,
      communicationDetails
    );
  }
  saveAuthorizationDetails(authorizationDetails: AuthorizationDetails) {
    return this.http.post<ApiResponse<AuthorizationDetails>>(
      `api/profile/authorization/details/save`,
      authorizationDetails
    );
  }
  saveContactDetails(emergContactDetails: EmergContactDetails) {
    return this.http.post<ApiResponse<EmergContactDetails>>(
      `api/profile/emergency/contact/details/save`,
      emergContactDetails
    );
  }
  saveEmploymentDetails(employmentDetails: EmploymentDetails) {
    return this.http.post<ApiResponse<EmploymentDetails>>(
      `api/profile/employment/details/save`,
      employmentDetails
    );
  }
  saveEmployeeDependentDetails(employeeDependentDetails: EmpDependentDetails) {
    return this.http.post<ApiResponse<EmpDependentDetails>>(
      `api/profile/dependent/details/save`,
      employeeDependentDetails
    );
  }
  saveBankAccountDetails(employeeBankAccountDetails: BankAcountDetails) {
    return this.http.post<ApiResponse<BankAcountDetails>>(
      `api/employee/bank/account/details/save`,
      employeeBankAccountDetails
    );
  }
  saveImmigrationDetails(immigrationDetails: ImmigrationDetails) {
    return this.http.post<ApiResponse<BankAcountDetails>>(
      `api/profile/immigration/save`,
      immigrationDetails
    );
  }
  getBankAccountDetails(employeeDetailsId) {
    return this.http.get<ApiResponse<Designation>>(
      `api/employee/bank/account/details/get?employeeDetailsId=${employeeDetailsId}`
    );
  }
  getAllDesignations() {
    return this.http.get<ApiResponse<Designation>>(
      "api/designation/all?status=1"
    );
  }
  getAllDepartments() {
    return this.http.get<ApiResponse<Department>>(
      "api/department/all?status=1"
    );
  }
  getEmployee(employeeDetailsId: string) {
    return this.http.get<ApiResponse<Employee>>(
      `api/employee/${employeeDetailsId}`
    );
  }
  getReportingToUsers() {
    return this.http.get<ApiResponse<Employee>>(
      `api/employee/reportingto/all?status=1`
    );
  }
  getAllProjectAssignment(employeeDetailsId) {
    return this.http.get<ApiResponse<projectAssignment>>(
      `api/project/assignment/all/${employeeDetailsId}?status=1`
    );
  }
  getassignedProjects(employeeDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/project/assigned/${employeeDetailsId}`
    );
  }

  getProjectAssignment(projectDetailsId: number) {
    return this.http.get<ApiResponse<Project>>(
      `api/project/${projectDetailsId}`
    );
  }
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
  getImmigrationDetails(employeeDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/profile/immigration/details/${employeeDetailsId}`
    );
  }
  getImmigrationDocuments(employeeDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/profile/immigration/documents/${employeeDetailsId}`
    );
  }
  saveProfilePicture(formData: FormData) {
    return this.http.post<ApiResponse<Project>>(
      `api/profile/photo/upload`,
      formData
    );
  }

  uploadDocument(formData: FormData) {
    return this.http.post<ApiResponse<Project>>(
      `api/document/employee/upload`,
      formData
    );
  }
  uploadImmigrationDocument(formData: FormData) {
    return this.http.post<ApiResponse<Project>>(
      `api/profile/immigration/document/upload`,
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
  getW4ApproverList() {
    return this.http.get<ApiResponse<any>>(`api/w4/for/approval/get`);
  }
  getW4Details(w4DetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/w4/details/get?w4DetailsId=${w4DetailsId}`
    );
  }
  downloadW4Doc(
    employeeDocumentUploadDetailsId
  ): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/w4/document/download?employeeDocumentUploadDetailsId=${employeeDocumentUploadDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  updateW4Status(updateStatus) {
    return this.http.post<ApiResponse<any>>(`api/w4/update`, updateStatus);
  }
  getI9ApproverList() {
    return this.http.get<ApiResponse<any>>(`api/i9/for/approval/get`);
  }
  getI9Details(i9DetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/i9/details/get?i9DetailsId=${i9DetailsId}`
    );
  }
  downloadI9Doc(
    employeeDocumentUploadDetailsId
  ): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/i9/document/download?employeeDocumentUploadDetailsId=${employeeDocumentUploadDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  updateI9Status(updateStatus) {
    return this.http.post<ApiResponse<any>>(
      `api/i9/employer/verification/submite`,
      updateStatus
    );
  }
  saveI9EmploymentAuthDetails(i9EmploymentAuthDetails) {
    return this.http.post<ApiResponse<any>>(
      `api/i9/employment/authorization/save`,
      i9EmploymentAuthDetails
    );
  }

  saveLinkDocuments(formData) {
    return this.http.post<ApiResponse<any>>(
      `api/document/employee/link`,
      formData
    );
  }

  getAllLinkDocs(employeeDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/document/employee/link/get/${employeeDetailsId}?linkedIn=${"immigration"}`
    );
  }

  getDigitalSignature(employeeDetailsId: number) {
    return this.http.get<ApiResponse<any>>(
      `api/profile/signature/${employeeDetailsId}`
    );
  }
  saveDigitalSignature(signature, signatureFont, employeeDetailsId, initials) {
    return this.http.post<ApiResponse<any>>(
      `/api/profile/signature/save?signature=${signature}&signatureFont=${signatureFont}&employeeDetailsId=${employeeDetailsId}&initials=${initials}`,
      {}
    );
  }
  deleteEmpDependentDetails(employeeDependentDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `/api/profile/dependent/details/delete/${employeeDependentDetailsId}`,
      {}
    );
  }
  deleteEmergContact(emergencyContactDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `/api/profile/emergency/contact/details/delete/${emergencyContactDetailsId}`,
      {}
    );
  }
  deleteEmployeeDocument(employeeDetailsId, employeeDocumentUploadDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/document/employee/delete?employeeDetailsId=${employeeDetailsId}&employeeDocumentUploadDetailsId=${employeeDocumentUploadDetailsId}`
    );
  }
  saveSocialNetworking(details) {
    return this.http.post<ApiResponse<any>>(
      `api/profile/socialnetworks/save`,
      details
    );
  }
}
