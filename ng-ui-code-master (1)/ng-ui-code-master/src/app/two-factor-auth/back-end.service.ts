import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@app/shared/models/api-response.model';
import { User } from '@app/shared/models/user.model';


@Injectable({
    providedIn: "root"
})
export class BackEndService {

    expUrl = "http://104.183.242.32:8765/authenticate/";
    constructor(private http: HttpClient) { }
    put(url) {
        return this.http.put(url, {});
    }
    getAuth() {
        return this.http.get(this.expUrl + "setup", { observe: 'response' });
    }
    setupAuth() {
        let name = sessionStorage.getItem("authinfo") ? JSON.parse(sessionStorage.getItem("authinfo")) : {};
        return this.http.post(this.expUrl + "setup?name=" + name.fistName, {}, { observe: 'response' })
    }
    verifyAuth(token: any, tempSecret: any) {
        return this.http.post(this.expUrl + "verify?tempSecret=" + tempSecret, { token }, { observe: 'response' });
    }
}