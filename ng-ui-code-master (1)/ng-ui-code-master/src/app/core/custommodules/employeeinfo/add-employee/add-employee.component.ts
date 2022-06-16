import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmployeeService } from '../employeeinfo.service';
import { Employee } from '@app/shared/models/employee.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '@app/core/service/auth.service';
import { SharedService } from '@app/shared/shared.service';
import { Role } from '@app/shared/enums/role.enum';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {


  @Input() employeeType: string;
  @Output() onClose = new EventEmitter<any>();
  displayDialog: boolean;
  @Input() employee: Employee;
  clientErrorMsg: any;
  addEmployeeForm: FormGroup;
  selectedRole: string = '1';
  public addemployeeDisplay: string = "none";
  errLabel: string = '';
  constructor(private employeeService: EmployeeService,private authService:AuthService,
     private fb: FormBuilder,public sharedService:SharedService) {
    this.employee = new Employee();
    this.addEmployeeForm = this.fb.group({
      email: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(1), Validators.maxLength(150)]),
      firstName: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      lastName: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      userRole: new FormControl({ value: '', disabled: false }, [Validators.required]),
      phoneNumber: new FormControl({ value: '', disabled: false }, [Validators.maxLength(10)])
    });
  }
  roles = [
    // { label: 'Super Admin', value: Role.SuperAdmin },
    { label: 'Admin', value: Role.Admin },
    { label: 'Accounts', value: Role.Accounts },
    { label: 'HR', value: Role.HR },
    { label: 'Employee', value: Role.Employee }
  ];
  approvals=[
    {label:'Yes',value:1},{label:'No',value:0}
  ]
  ngOnInit(): void {
    this.showDialogToAdd();
  }
  showDialogToAdd() {
    //this.employee = new Employee;
    this.addemployeeDisplay = "block";

    this.hiddenScroll();
  }
  onFormSubmit() {

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
    this.employeeService.isEmployeeExists(this.employee.email).subscribe(res => {
      if (res.message == "Email already exists.") {
        this.sharedService.add({severity:'error',summary:'Error',detail:res.message})
      }
      else {
        this.employee.organizationDetailsId=this.authService.currentUser.employeeDetailsId;        
        this.employeeService.addEmployee(this.employee).subscribe(res => {
          if(res.message=="Employee added successfully"){
           this.closeAddmodal(this.employeeType);
           this.sharedService.add({severity:'success',summary:'Success',detail:res.message})
          }
          else if(!res.responsePayload)
          this.errLabel=res.message;
        }, error => {
          this.errLabel = error;
        })
      }
    }, error => {
      this.errLabel = error
    })
  }
  closeAddmodal(type?) {
    this.addemployeeDisplay = "none";
    this.displayScroll();
    this.onClose.emit({ type: type });
  }
}

