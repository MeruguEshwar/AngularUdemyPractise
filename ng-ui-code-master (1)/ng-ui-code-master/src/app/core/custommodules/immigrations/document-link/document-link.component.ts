import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";

@Component({
  selector: "app-document-link",
  templateUrl: "./document-link.component.html",
  styleUrls: ["./document-link.component.css"],
})
export class DocumentLinkComponent implements OnInit {
  @Output() onClose = new EventEmitter<any>();
  public linkDocumentmodel: string = "none";
  @Input() selectedPhase:string
  linkDocList: any[];
  selectedDocumentList:any

  clientErrorMsg: any;
  loading: boolean = false;
  cols: any[];

  fileToUpload: any
  uploadedFileTitle: string;
  uploadFileInfo: string = "none";
  @ViewChild("fileInput")
  myInputVariable: ElementRef;
  errorLabel: any;
  constructor() {}

  ngOnInit(): void {
    console.log(this.selectedPhase)
    this.cols = [
      // { field: 'designationDetailsId', header: 'ID' },
      { field: "type", header: "Document Type" },
      { field: "category", header: "Document Category" },
      { field: "title", header: "Document Title" },
    ];
    this.showDialogToAdd();
    this.linkDocList = [
      {
        type: "My Documents",
        category: "Biography Documents",
        title: "Birth Certification",
        details:'some details Birth Certification'
      },
      {
        type: "Project Documents",
        category: "SuperMaxApp",
        title: "SuperMaxApp XYZ",
        details: "some details SuperMaxApp XYZ",
      },
      {
        type: "Client/vendor Documents",
        category: "SEIM Technologies",
        title: "SEIM Technologies XYZ",
        details: " some details SEIM Technologies XYZ",
      },
    ];
  }
  showDialogToAdd() {
    //this.designation = new Designation;
    this.linkDocumentmodel = "block";

    this.hiddenScroll();
  }
  uploadDocument(){
    this.uploadFileInfo = "block";
    this.hiddenScroll();
  }
  save(){
    // console.log(this.selectedDocumentList)
     this.closeAddmodal('save',this.selectedDocumentList)
  }
  handleChange(event){

  }
  saveUploadFile(){

  }
  onFileChange(event){

  }
  hiddenScroll() {
    try {
      let bodyElement = document.getElementById("modalbody") as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.add("modal-open");
      }
    } catch (ex) {
      this.clientErrorMsg(ex, "hiddenScroll");
    }
  }

  displayScroll() {
    try {
      let bodyElement = document.getElementById("modalbody") as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.remove("modal-open");
      }
    } catch (ex) {
      this.clientErrorMsg(ex, "displayScroll");
    }
  }
  closeAddmodal(type?: any,documentList?:any) {
    this.linkDocumentmodel = "none";
    this.displayScroll();
    this.onClose.emit({ type: type,details:documentList });
  }
  closeUploadmodal() {
    this.uploadFileInfo = "none";
    this.displayScroll();
  }
}
