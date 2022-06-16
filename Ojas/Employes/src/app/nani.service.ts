import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User{
  name : string;
  email : string;
  phonenumber : number;
}

@Injectable({
  providedIn: 'root'
})
export class NaniService {

  constructor(private http:HttpClient) { }

  getUser():Observable<User>{

    const headers = new HttpHeaders({
        'content-type':'application/json',
        'authenticationToken':'1234565'
    });

    return this.http.get<User>("https://jsonplaceholder.typicode.com/users",{headers : headers})
  }


  addUser(body: any):Observable<User>{
    return this.http.post<User>("https://jsonplaceholder.typicode.com/users",body)
  }
}
