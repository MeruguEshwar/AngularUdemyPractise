import { Component, Input, OnInit } from "@angular/core";
import { AuthService } from "@app/core/service/auth.service";
import { Notes } from "@app/shared/models/notes.model";
import { SharedService } from "@app/shared/shared.service";
import { NotesServices } from "./notes.services";

@Component({
  selector: "app-notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.css"],
})
export class NotesComponent implements OnInit {
  @Input() isEmp: boolean;
  @Input() userId: number = -1;
  noteList: Notes[];
  noteDetails: Notes;
  deleteRowData: any;
  messageType = [
    { label: "No", value: "0" },
    { label: "Yes", value: "1" },
  ];
  shareWithEmployeeType: boolean = false;
  clientErrorMsg: any;
  constructor(
    public sharedService: SharedService,
    private noteService: NotesServices,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.noteDetails = new Notes();
    if (this.userId == -1) {
      this.userId = this.authService.currentUser.employeeDetailsId;
    }
    this.getNotes(this.userId);
  }
  saveNote(note) {
    if (note.notes) {
      this.noteDetails.employeeDetailsId = this.userId;
      if (this.shareWithEmployeeType) {
        this.noteDetails.shareWithEmployee = "1";
      } else {
        this.noteDetails.shareWithEmployee = "0";
      }
      if (note.employeeNotesDetailsId) {
        this.noteDetails.employeeNotesDetailsId = note.employeeNotesDetailsId;
      }
      this.noteService.saveEmployeeNotes(this.noteDetails).subscribe((res) => {
        if (res.statusCode == 200) {
          this.getNotes(this.userId);
          this.noteDetails = new Notes();
        }
      });
    }
  }
  getNotes(employeeDetailsId) {
    if (this.isEmp) {
      this.noteService.getAllNotes(employeeDetailsId).subscribe((res) => {
        if (res.statusCode == 200) {
          if (res.statusCode == 200) {
            this.noteList = res.responsePayload;
          }
        }
      });
    } else {
      this.noteService.getEmployeeNotes(employeeDetailsId).subscribe((res) => {
        if (res.statusCode == 200) {
          if (res.statusCode == 200) {
            this.noteList = res.responsePayload;
          }
        }
      });
    }
  }
  EnterSubmit(event, data) {
    if (event.which === 13 || event.keyCode === 13 || event.key === "Enter") {
      this.saveNote(data);
    }
  }
  editComment(rowData) {
    this.noteDetails = rowData;
    if (+this.noteDetails.shareWithEmployee) {
      this.shareWithEmployeeType = true;
    } else {
      this.shareWithEmployeeType = false;
    }
  }
  deleteComment(rowData) {
    this.deleteRowData = rowData;
    this.hiddenScroll();
  }
  confirm() {
    this.noteService
      .deleteEmployeeNote(this.deleteRowData.employeeNotesDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.getNotes(this.userId);
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
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
