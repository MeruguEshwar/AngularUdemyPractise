import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { Observable } from "rxjs";
import {
  MyOrganizationDetailsAddress,
  MyOrganizationDetailsDocuments,
  MyOrganizationDetailsRemittances,
} from "@app/shared/models/myOrganizationDetails.model";

@Injectable({
  providedIn: "root",
})
export class MyOrganizationDetailsService {
  constructor(private http: HttpClient) {}
  getOrganizationDetails() {
    return this.http.get<ApiResponse<any>>(`api/organization/details`);
  }
  saveOrganizationAddress(
    organizationAddressDetails: MyOrganizationDetailsAddress
  ) {
    return this.http.post<ApiResponse<any>>(
      `api/organization/address/save`,
      organizationAddressDetails
    );
  }
  saveOrganizationRemittance(
    organizationRemittanceDetails: MyOrganizationDetailsRemittances
  ) {
    return this.http.post<ApiResponse<any>>(
      `api/organization/remittance/save`,
      organizationRemittanceDetails
    );
  }
  updateOrganizationDetails(organizationDetails) {
    return this.http.post<ApiResponse<any>>(
      `api/organization/update`,
      organizationDetails
    );
  }
  UploadOrgFile(form) {
    return this.http.post<ApiResponse<any>>(
      `api/organization/logo/upload`,
      form
    );
  }
  getOrganizationDocsDetails(organizationDocumentCategoryDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/organization/documents/get?organizationDocumentCategoryDetailsId=${organizationDocumentCategoryDetailsId}`
    );
  }
  getInHouseProjects(statusCode) {
    return this.http.get<ApiResponse<any>>(
      `api/project/all/inhouse?status=${statusCode}`
    );
  }
  saveOrganizationDocument(organizationDocumentDetails: FormData) {
    return this.http.post<ApiResponse<any>>(
      `api/organization/document/upload`,
      organizationDocumentDetails
    );
  }
  updateOrganizationDocument(organizationDocumentDetails: FormData) {
    return this.http.post<ApiResponse<any>>(
      `api/organization/document/upload/update`,
      organizationDocumentDetails
    );
  }
  downloadOrgDocument(
    organizationDocumentDetailsId
  ): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/organization/document/download?organizationDocumentDetailsId=${organizationDocumentDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  saveOrgDocumentCategoryt(documentCategory: String) {
    return this.http.post<ApiResponse<any>>(
      `api/organization/document/category/add?documentCategory=${documentCategory}`,
      {}
    );
  }
  checkOrgDocCatAlreadyExist(documentCategory) {
    return this.http.get<ApiResponse<any>>(
      `api/organization/document/category/exists?documentCategory=${documentCategory}`
    );
  }
  getAllOrgDocCatList(statusCode) {
    return this.http.get<ApiResponse<any>>(
      `api/organization/document/categories?status=${statusCode}`
    );
  }
}
