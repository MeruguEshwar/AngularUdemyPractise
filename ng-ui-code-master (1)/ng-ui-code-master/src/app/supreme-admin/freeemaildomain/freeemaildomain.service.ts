import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { FreeEmailDomain } from "@app/shared/models/freeemaildomain.model";

@Injectable({
  providedIn: "root",
})
export class FreeEmailDomainServices {
  constructor(private http: HttpClient) {}
  getAllFreeEmailDomain(status: number) {
    return this.http.get<ApiResponse<FreeEmailDomain>>(
      `api/freeemailproviderdomains/all?status=${status}`
    );
  }
  addFEDomain(fEDomain: any) {
    return this.http.post<ApiResponse<FreeEmailDomain>>(
      `api/freeemailproviderdomains/add?freeEmailProviderDomain=${fEDomain.domainName}`,
      {}
    );
  }
  updateFEDomain(fEDomain: FreeEmailDomain) {
    return this.http.post<ApiResponse<FreeEmailDomain>>(
      "api/freeemailproviderdomains/update",
      fEDomain
    );
  }
  activateFEDomain(freeEmailProviderDomainsDetailsId: number) {
    return this.http.put<ApiResponse<FreeEmailDomain>>(
      `api/freeemailproviderdomains/activate/${freeEmailProviderDomainsDetailsId}`,
      {}
    );
  }
  deactivateFEDomain(freeEmailProviderDomainsDetailsId: number) {
    return this.http.put<ApiResponse<FreeEmailDomain>>(
      `api/freeemailproviderdomains/deactivate/${freeEmailProviderDomainsDetailsId}`,
      {}
    );
  }
  isFEDomainExists(freeEmailDomain: string) {
    return this.http.get<ApiResponse<FreeEmailDomain>>(
      `api/freeemailproviderdomains/exists?workEmail=${freeEmailDomain}`
    );
  }
}
