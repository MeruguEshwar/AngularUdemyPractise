import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyService {

  constructor(private http:HttpClient) { }

  getProducts(){
    return this.http.get("https://my-json-server.typicode.com/TeluguTechSteps/Products/info");
  }
}
