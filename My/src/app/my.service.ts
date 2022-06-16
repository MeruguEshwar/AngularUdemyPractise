import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyService {

  products = [
      {"id":1,"company":"Apple","price":75000,"Model":"iphn-x"},
      {"id":2,"company":"Samsung","price":65000,"Model":"J7"},
      {"id":3,"company":"One plus","price":55000,"Model":"Nord"},
      {"id":4,"company":"Vivo","price":45000,"Model":"v21"}
  ]

  constructor() { }
}
