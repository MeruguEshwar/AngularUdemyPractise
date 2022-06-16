import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DepartmentService } from '../departments.service';
import { Department } from '@app/shared/models/department.model';
import { SharedService } from '@app/shared/shared.service';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.css']
})
export class EditDepartmentComponent implements OnInit {
  @Input()  departmentType: string;
  @Output() onClose=new EventEmitter<any>();
  displayDialog: boolean;
  @Input() department: Department;
  clientErrorMsg: any;
  public editemployeeDisplay: string = "none";
  errLabel: any;
    constructor(private departmentService:DepartmentService,public sharedService:SharedService) {
   
  }

  ngOnInit(): void {
      if(this.departmentType=='Edit'){
        //this.department = new Department();
        this.showDialogToAdd();
      }
   }
   checkDepartmentAlreadyExist() {
    this.departmentService
      .isDepartmentExists(this.department.department)
      .subscribe((res) => {
        if (res.statusCode != 200) {
          this.department.department = "";
          this.errLabel = res.message;
        }
      });
  }
  showDialogToAdd() {    
    //this.department = new Department;
    this.editemployeeDisplay = "block";
    this.hiddenScroll();
  }

  hiddenScroll() {
    try {
      let bodyElement = document.getElementById('modalbody') as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.add('modal-open');
      }
    }
    catch (ex) {
      this.clientErrorMsg(ex, 'hiddenScroll');
    }
  }


  displayScroll() {
    try {
      let bodyElement = document.getElementById('modalbody') as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.remove('modal-open');
      }
    }
    catch (ex) {
      this.clientErrorMsg(ex, 'displayScroll');
    }
  }

  save() {
    this.departmentService.updateDepartment(this.department).subscribe(res=>{  
    if(res.message=="Update department successful"){
    this.editemployeeDisplay = "none"
    this.displayScroll();
    this.onClose.emit({type:'add'});    
    }
  })
  }
  modalClose() {
    this.editemployeeDisplay = "none";
    this.displayScroll();
    this.onClose.emit({type:'Add'});
  }
}