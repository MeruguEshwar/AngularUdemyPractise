import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@app/shared/models/api-response.model';
import { User } from '@app/shared/models/user.model';


@Injectable({
    providedIn: "root"
})
export class UserActivationService {

    constructor(private http: HttpClient) { }

    validateRegistration(activationCode:string) {
        return this.http.get<ApiResponse<User>>(`api/registration/registrationlink/validate?activationCode=${activationCode}`);
    }
    setPassword(activationCode:string,password:string){
        return this.http.put<ApiResponse<User>>(`api/registration/password/set?activationCode=${activationCode}&password=${password}`,{});
    }
}

