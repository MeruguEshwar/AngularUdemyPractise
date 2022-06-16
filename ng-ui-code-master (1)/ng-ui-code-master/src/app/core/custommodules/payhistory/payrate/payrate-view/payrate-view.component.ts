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
import { AuthService } from '@app/core/service/auth.service';

@Component({
  selector: 'app-payrate-view',
  templateUrl: './payrate-view.component.html',
  styleUrls: ['./payrate-view.component.css'],
})
export class PayrateViewComponent implements OnInit {
  @ViewChild('minimumDate') minimumDate: ElementRef<HTMLInputElement>;
  state: any;
  employeePayRateDetailsId: any;
  details: any;
  model: string = 'none';
  errorLabel: string;
  payrateMode = [
    { label: 'Rate', value: '1' },
    { label: 'Salary', value: '2' },
  ];
  constructor(
    private cdr: ChangeDetectorRef,
    private location: Location,
    public sharedService: SharedService,
    private payHistoryService: PayHistoryService,
    private authService: AuthService
  ) {}

  organizationCurrency: string;
  ngOnInit(): void {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }
    this.state = window.history.state;
    if (this.state && this.state.details?.employeePayRateDetailsId) {
      this.employeePayRateDetailsId =
        this.state.details.employeePayRateDetailsId;
      this.details = { ...this.state.details };
    } else {
      this.location.back();
    }
  }
  savePayRate(form) {
    if (this.details.payRateType == '1') {
      this.details.rateOrSalary = this.details.rate;
    } else {
      this.details.rateOrSalary = this.details.salary;
    }
    this.payHistoryService
      .saveEmployeePayRate(this.details)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.closeModel();
          this.sharedService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
        } else {
          this.details = [...this.state.details];
        }
      });
  }
  showDialogToAdd() {
    this.model = 'block';
    this.hiddenScroll();
  }
  checkPayRateExists() {
    this.payHistoryService
      .isPayRateExists(this.details.employeeDetailsId, this.details.startDate)
      .subscribe((res) => {
        if (res.statusCode != 200) {
          this.errorLabel = res.message;
          this.details.startDate = null;
        } else {
          this.errorLabel = '';
        }
      });
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
