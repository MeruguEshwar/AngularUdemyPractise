import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@app/shared/models/api-response.model';
import { Department } from '@app/shared/models/department.model';
import { Organization } from '@app/shared/models/organization.model';
import { SendMessage } from '@app/shared/models/sendmessage.model';

@Injectable({
    providedIn:'root'
})
export class OrganizationService
{
    constructor(private http:HttpClient){

    }
    getAllOrganizations(status:number){
        return this.http.get<ApiResponse<Organization>>(`api/sadmin/organizations/get?status=${status}`);
    }    
    activateOrganization(organizationDetailsId:number){
        return this.http.put<ApiResponse<Organization>>(`api/sadmin/organization/activate/${organizationDetailsId}`,{})
    }
    deactivateOrganization(organizationDetailsId:number){
        return this.http.put<ApiResponse<Organization>>(`api/sadmin/organization/deactivate/${organizationDetailsId}?reason='reason'`,{})
    }
    sendMessage(sendMessage:SendMessage){
        return this.http.post<ApiResponse<any>>(`api/sadmin/organization/communication/send`,sendMessage)
    }
}