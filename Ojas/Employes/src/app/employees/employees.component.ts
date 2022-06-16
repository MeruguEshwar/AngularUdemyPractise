import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup } from '@angular/forms';
import { EmployeeModal } from '../employee.modal';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

//   firstName : any;
//   lastName : any;
//   email : any;
//   mobile : any;
//   salery: any;

//   employData = [];
//   formValue! : FormGroup;
//   employeemodalObj: EmployeeModal = new EmployeeModal();
//   res: any;
//   constructor(private formBuilder:FormBuilder,private api:ApiService) { } 
  
//   ngOnInit(): void {
//     this.formValue = this.formBuilder.group({
//     firstName : [''],
//     lastName : [''],
//     email : [''],
//     mobile : [''],
//     salery : ['']
//     })
    
//     this.api.getEmployee().subscribe(res=>{
//     console.log(res);
//     this.employData = this.res;
//     console.log( this.employData);
//     // alert("employee added successfully")
//     })
// }

//   postEmployeeDetails(){
//       this.employeemodalObj.firstName = this.formValue.value.firstName;
//       this.employeemodalObj.lastName = this.formValue.value.lastName;
//       this.employeemodalObj.email = this.formValue.value.email;
//       this.employeemodalObj.mobile = this.formValue.value.mobile;
//       this.employeemodalObj.salery = this.formValue.value.salery; this.api.postEmployee(this.employeemodalObj).subscribe(res=>{
//       // alert("employee added successfully")
//       })
//   }

//   getAllEmployessDetails(){
//     this.api.getEmployee().subscribe(res=>{
//     console.log(res);
//     this.employData = this.res;
//     // alert("employee added successfully")
//   })
// }





}
