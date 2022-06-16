import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from "@angular/core";
import { SharedService } from "@app/shared/shared.service";
import { AuthService } from "@app/core/service/auth.service";
import { Project } from "@app/shared/models/project.model";
import { CategoryService } from "../category.service";
import { Company } from "@app/shared/models/company-module.model";

import { DocumentCategory } from "@app/shared/models/document-category.model";
import { Role } from "@app/shared/enums/role.enum";
import { Category } from "@app/shared/models/documentcategory.model";

@Component({
  selector: "app-add-category",
  templateUrl: "./add-category.component.html",
  styleUrls: ["./add-category.component.css"],
})
export class AddCategoryComponent implements OnInit {
  @Input() categoryType: string;
  lstDocumentCategory: DocumentCategory[] = [];
  @Output() onClose = new EventEmitter<any>();
  displayDialog: boolean;
  @Input() category: Category;
  clientErrorMsg: any;
  public addemployeeDisplay: string = "none";
  errLabel: any;
  roles = [
    // { label: 'Super Admin', value: 'superAdminAccessType' },
    { label: "Admin", value: "adminAccessType" },
    { label: "Accounts", value: "accountsAccessType" },
    { label: "HR", value: "hrAccessType" },
    { label: "Employee", value: "employeeAccessType" },
  ];

  constructor(
    private categoryService: CategoryService,
    public sharedService: SharedService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.categoryType == "Add") {
      this.category = new Category();
    }
    for (let index = 0; index < this.roles.length; index++) {
      const element: any = this.roles[index];
      let categoryItem = new DocumentCategory();
      categoryItem.documentCategory = element.label;
      categoryItem.value = element.value;
      this.lstDocumentCategory.push(categoryItem);
    }
    if (this.categoryType == "Edit") {
      for (var key in this.category) {
        for (let index = 0; index < this.lstDocumentCategory.length; index++) {
          const element = this.lstDocumentCategory[index];
          if (element.value == key) {
            if (this.category[key] == 3) {
              element.delete = true;
              element.write = true;
              element.read = true;
            } else if (this.category[key] == 2) {
              element.write = true;
              element.read = true;
            } else {
              element.read = true;
            }
          }
        }
      }
    }
    this.showDialogToAdd();
  }
  showDialogToAdd() {
    //this.department = new Department;
    this.addemployeeDisplay = "block";
    this.hiddenScroll();
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

  checkProjectAlreadyExist() {
    this.categoryService
      .isDocumentCategoryExists(this.category.documentCategory)
      .subscribe(
        (res) => {
          if (res.statusCode != 200) {
            this.errLabel = res.message;
            this.category.documentCategory = "";
          }
        },
        (error) => {
          this.errLabel = error;
        }
      );
  }

  save() {
    for (let index = 0; index < this.lstDocumentCategory.length; index++) {
      const element: any = this.lstDocumentCategory[index];
      console.log(element);
      if (element.delete) {
        this.category[element.value] = 3;
      } else if (element.write) {
        this.category[element.value] = 2;
      } else {
        this.category[element.value] = 1;
      }
    }
    if (this.categoryType == "Add") {
      this.categoryService.addDocumentCategory(this.category).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.addemployeeDisplay = "none";
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.displayScroll();
            this.onClose.emit({ type: "add" });
          } else {
            this.errLabel = res.message;
          }
        },
        (error) => {
          this.errLabel = error;
        }
      );
    } else {
      this.categoryService.updateDocumentCategory(this.category).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.addemployeeDisplay = "none";
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.displayScroll();
            this.onClose.emit({ type: "edit", project: this.category });
          } else {
            this.errLabel = res.message;
          }
        },
        (error) => {
          this.errLabel = error;
        }
      );
    }
  }
  closeAddmodal() {
    this.addemployeeDisplay = "none";
    this.displayScroll();
    this.onClose.emit({ type: "cancel" });
  }

  documentCategoryChange(document: DocumentCategory, accessType, event) {
    this.cdr.detectChanges();
    switch (accessType) {
      case "read":
        document.read = true;
        document.write = false;
        document.delete = false;
        break;
      case "write":
        document.read = true;
        document.write = true;
        document.delete = false;
        break;
      case "delete":
        document.read = true;
        document.write = true;
        document.delete = true;
        break;

      default:
        document.read = false;
        document.write = false;
        document.delete = false;
        break;
    }
  }
}
