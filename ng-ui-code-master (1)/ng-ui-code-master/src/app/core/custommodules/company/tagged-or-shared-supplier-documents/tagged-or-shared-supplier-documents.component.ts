import { Component, Input, OnInit } from '@angular/core';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-tagged-or-shared-supplier-documents',
  templateUrl: './tagged-or-shared-supplier-documents.component.html',
  styleUrls: ['./tagged-or-shared-supplier-documents.component.css']
})
export class TaggedOrSharedSupplierDocumentsComponent implements OnInit {
  loading:boolean=false
  @Input() companyDocumentDetailsId: any = -1;
  projectCols = [
    { field: "projectName", header: "Project Name" },
    { field: "projectCode", header: "Project Code" },
  ];
  empCols = [
    { field: "employeeName", header: "Employee Name" },
    { field: "employeeName", header: "Employee Code" },
  ];
  documentList: any[]=[];
  employeeList: any[]=[];
  constructor(private companyService:CompanyService) { }

  ngOnInit(): void {
    if(this.companyDocumentDetailsId != -1){
      this.getTaggedWithSupplierDoc(this.companyDocumentDetailsId);
    }
  }
  getTaggedWithSupplierDoc(companyDocumentDetailsId){
    this.companyService.getTaggedWithSupplierDoc(companyDocumentDetailsId).subscribe(res=>{
      if(res.statusCode==200){
        this.documentList = res.responsePayload.taggedProjects
        this.employeeList = res.responsePayload.taggedEmployees
      }else{
        this.documentList = [];
        this.employeeList = [];
      }
    })
  }

}
