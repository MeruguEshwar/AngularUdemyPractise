import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { SharedService } from '@app/shared/shared.service';
import { PayHistoryService } from '../../payhistory.services';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/service/auth.service';

@Component({
  selector: 'app-view-advance',
  templateUrl: './view-advance.component.html',
  styleUrls: ['./view-advance.component.css'],
})
export class ViewAdvanceComponent implements OnInit {
  @ViewChild('minimumDate') minimumDate: ElementRef<HTMLInputElement>;
  currentDate = new Date();
  state: any;
  employeeAdvanceDetailsId: any;
  model: string = 'none';
  details: any;
  errorLabel: any;
  constructor(
    private cdr: ChangeDetectorRef,
    private location: Location,
    private sharedService: SharedService,
    private payHistoryService: PayHistoryService,
    private router: Router,
    private authService: AuthService
  ) {}

  organizationCurrency: string;
  ngOnInit(): void {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }
    this.state = window.history.state;
    if (this.state && this.state.details?.employeeAdvanceDetailsId) {
      this.employeeAdvanceDetailsId =
        this.state.details.employeeAdvanceDetailsId;
      this.details = { ...this.state.details };
    } else {
      this.location.back();
    }
  }
  save(form) {
    this.payHistoryService
      .saveAdvanceEmployeePayRate(this.details)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.closeModel();
          this.sharedService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
          this.router.navigate(['admin/advances']);
        } else {
          this.details = [...this.state.details];
        }
      });
  }
  showDialogToAdd() {
    this.model = 'block';
    this.hiddenScroll();
  }
  hiddenScroll() {
    try {
      let bodyElement = document.getElementById('modalbody') as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.add('modal-open');
      }
    } catch (ex) {
      // this.clientErrorMsg(ex, "hiddenScroll");
    }
  }
  displayScroll() {
    try {
      let bodyElement = document.getElementById('modalbody') as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.remove('modal-open');
      }
    } catch (ex) {
      // this.clientErrorMsg(ex, "displayScroll");
    }
  }
  closeModel(type?: string) {
    if (type == 'cancel') {
      this.details = { ...this.state.details };
    }
    this.model = 'none';
    this.displayScroll();
  }
}
