import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { SharedService } from "@app/shared/shared.service";

@Component({
  selector: "app-imageviwer",
  templateUrl: "./imageviwer.component.html",
  styleUrls: ["./imageviwer.component.css"],
})
export class ImageviwerComponent implements OnInit {
  clientErrorMsg: any;
  imageViewer: string = "none";
  @Input() imageBlob: HttpResponse<Blob>;
  blob: Blob;
  imageURL: any;
  imageType: any;
  @Output() onClose = new EventEmitter<any>();
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.imageViewer = "block";
    console.log(this.imageBlob)
    this.blob = new Blob([this.imageBlob.body], {
      type: this.imageBlob.body.type,
    });
    this.imageURL = window.URL.createObjectURL(this.blob).toString();
    this.imageType = this.imageBlob.body.type.toLowerCase();
    this.imageType = this.imageBlob.body.type.substring(
      this.imageBlob.body.type.lastIndexOf("/") + 1
    );
    this.imageType = this.imageType.toLowerCase();
    console.log(this.imageType);
    this.hiddenScroll();
  }
  downloadFile() {
    var link = document.createElement("a");
    link.href = this.imageURL;
    link.download = `document.${this.imageType}`;
    link.click();
    link.remove();
    this.sharedService.add({
      severity: "success",
      summary: "Success",
      detail: "File downloaded",
    });
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
  closeAddmodal() {
    this.imageViewer = "none";
    this.displayScroll();
    this.onClose.emit({ type: "cancel" });
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
}
