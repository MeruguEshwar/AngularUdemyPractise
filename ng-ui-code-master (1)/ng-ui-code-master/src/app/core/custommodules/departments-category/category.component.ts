import { Component, OnInit } from '@angular/core';

import { ConfirmationService } from 'src/app/components/api/confirmationservice';
import { CategoryService } from './category.service';
import { Department } from '@app/shared/models/department.model';
import { SharedService } from '@app/shared/shared.service';
import { Company } from '@app/shared/models/company-module.model';
import { Project } from '@app/shared/models/project.model';
import { CompanyService } from '../company/company.service';
import { Category } from '@app/shared/models/documentcategory.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  
  
  cols: any[];
  displayDialog: boolean;
  clientErrorMsg: any;  
  categoryType: string;
  public editProjectDisplay: string = 'none';
  public addProjectDisplay: string = "none";
  documentCategory: Category;
  documentCategories: Category[];
  loading:boolean=false;
  status:number = 1;
  companyList:any[];
  isAddDocCategoryEnable: boolean = true;
  constructor(private confirmationService: ConfirmationService,private sharedService:SharedService ,private categoryService:CategoryService) {   
  }

  ngOnInit(): void {

    this.cols = [
      // { field: 'departmentDetailsId', header: 'ID' },
      { field: 'documentCategory', header: 'Document Category' },    

    ];
    this.getCategories();  
    this.sharedService.openToggleMenu('roleMenuToggleExternalContent')  
  } 
  handleChange(event){
    if(event.index==0){
      this.isAddDocCategoryEnable = true;
      this.status = 1;
      this.getCategories(1) 
    }
    else if(event.index==1){
      this.isAddDocCategoryEnable = false;
      this.status = 0;
      this.getCategories(0) 
    }
  } 
  getCategories(status:number=1){
    this.loading=true;
    this.documentCategories=[];
    this.categoryService.getAllDocumentCategory(status).subscribe(res=>{
      this.loading=false;
      this.documentCategories=[];
      if(res.statusCode==200)
      this.documentCategories=res.responsePayload as Category[];
    },error=>{
      this.loading=false;
    })
  } 
  showDialogToAdd() {
    this.categoryType='Add';    
    //this.hiddenScroll();
  }
  onDeptAddCloseClick(event){   
    if(event.type=='add'){
      this.getCategories();
    }else if(event.type=='edit'){
      this.getCategories();      
    }
    this.categoryType='';    
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
        this.displayScroll();
  }
  confirm(rowData) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Inactivate this data?',
      accept: () => {
        this.delete(rowData);
        //Actual logic to perform a confirmation
      }
    });
  }
  delete(rowData:Category) {
    if(this.status == 1){
      this.categoryService.deactivateDocumentCategory(rowData.documentCategoryDetailsId).subscribe(res=>
        {
          if(res.statusCode==200){
            this.sharedService.add({severity:'success',summary:'Success',detail:res.message})
            this.displayDialog = false;
            this.getCategories();
          }else{
            this.sharedService.add({severity:'error',summary:'Error',detail:res.message})
          }
        }) 
    }else{
      this.categoryService.activateDocumentCategory(rowData.documentCategoryDetailsId).subscribe(res=>
        {
          if(res.statusCode == 200){
            this.displayDialog = false;
            this.sharedService.add({severity:'success',summary:'Success',detail:res.message})
            this.getCategories(this.status);
          }else{
            this.sharedService.add({severity:'error',summary:'Error',detail:res.message})
          }
        }) 
    }
  }
  onAction(rowData) {
    this.documentCategory=rowData;
  }
  onRowSelect(data: Category) {
    this.documentCategory=data;
    this.categoryType='Edit';
    // this.editemployeeDisplay = "block";
    // this.newCar = false;
    // this.car = this.cloneCar(data);
    // this.displayDialog = true;
    this.hiddenScroll();
  }
  modalClose() {
    this.editProjectDisplay = "none";
    this.displayScroll();
  }

  closeAddmodal() {
    this.addProjectDisplay = "none";
    this.displayScroll();
  }
  
}
