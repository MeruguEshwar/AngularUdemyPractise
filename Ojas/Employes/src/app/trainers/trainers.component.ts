import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NaniService } from '../nani.service';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.css']
})
export class TrainersComponent implements OnInit {

  empnum : any;
  mail: string = "";
  name: string = "";

  constructor(private nani:NaniService) { }

  ngOnInit(): void {
  }

  addCustomer(formvalue: NgForm){
            
      const postbody={
        title: formvalue.value.name
      }
   
      this.nani.addUser(postbody).subscribe(data=>{
        console.log(data);
      })
  }

}
