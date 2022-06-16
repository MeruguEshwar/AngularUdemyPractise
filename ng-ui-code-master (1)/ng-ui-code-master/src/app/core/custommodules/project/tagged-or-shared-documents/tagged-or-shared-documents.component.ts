import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-tagged-or-shared-documents',
  templateUrl: './tagged-or-shared-documents.component.html',
  styleUrls: ['./tagged-or-shared-documents.component.css']
})
export class TaggedOrSharedDocumentsComponent implements OnInit {
  loading:boolean=false
  @Input() projectDocumentDetailsId: any = -1;
  projectCols = [
    { field: "companyName", header: "Company Name" },
    { field: "companyName", header: "Company Code" },
  ];
  empCols = [
    { field: "employeeName", header: "Employee Name" },
    { field: "employeeName", header: "Employee Code" },
  ];
  documentList: any[]=[];
  employeeList: any[]=[];
  constructor(private projectService:ProjectService) { }

  ngOnInit(): void {
    if(this.projectDocumentDetailsId != -1){
      this.getTaggedWithProjectDoc(this.projectDocumentDetailsId);
    }
  }
  getTaggedWithProjectDoc(projectDocumentDetailsId){
    this.projectService.getTaggedWithProjectDoc(projectDocumentDetailsId).subscribe(res=>{
      if(res.statusCode==200){
        this.documentList = res.responsePayload.taggedSuppliers
        this.employeeList = res.responsePayload.taggedEmployees
      }else{
        this.documentList = [];
        this.employeeList = [];
      }
    })
  }
}
