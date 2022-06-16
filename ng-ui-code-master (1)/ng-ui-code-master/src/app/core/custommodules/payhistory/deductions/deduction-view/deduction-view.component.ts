import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PayHistoryService } from '../../payhistory.services';
import { SharedService } from '@app/shared/shared.service';
import { PayDeduction } from '@app/shared/models/paydeduction.model';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/service/auth.service';

@Component({
  selector: 'app-deduction-view',
  templateUrl: './deduction-view.component.html',
  styleUrls: ['./deduction-view.component.css'],
})
export class DeductionViewComponent implements OnInit {
  loading: boolean = false;
  state: any;
  employeeDeductionDetailsId: any;
  deductionPayRateDetails: any;
  deductionModel: string = 'none';
  disableAmount: boolean = true;
  clientErrorMsg: any;
  errorLabel: string;
  deductionList: any[] = [];
  deductionCols: any[] = [];
  selecteddeductionList: any;
  categorizedDeductionExpenses: any[] = [];
  deductionOptionList = [
    { label: 'Select', value: null },
    { label: 'Advance Deduction', value: 'Advance Deduction' },
    { label: 'Expense Deduction', value: 'Expense Deduction' },
    { label: 'Other', value: 'Other' },
  ];
  showDeductionOptionList: boolean = true;

  constructor(
    private cdr: ChangeDetectorRef,
    private location: Location,
    private payHistoryService: PayHistoryService,
    private sharedService: SharedService,
    private router: Router,
    private authService: AuthService
  ) {}

  organizationCurrency: string;
  async ngOnInit(): Promise<void> {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }
    this.state = window.history.state;
    this.deductionPayRateDetails = new PayDeduction();
    if (this.state && this.state.details?.employeeDeductionDetailsId) {
      this.employeeDeductionDetailsId = this.state.employeeDeductionDetailsId;
      await this.getExpenseDeductionDetails(this.state.details);
    } else {
      this.location.back();
    }
  }
  async showDialogToEdit(rowData) {
    this.deductionModel = 'block';
    this.hiddenScroll();
  }
  getExpenseDeductionDetails(rowData) {
    return new Promise<void>((resolve, reject) => {
      this.payHistoryService
        .getExpenseDeductionDetails(rowData.employeeDeductionDetailsId)
        .subscribe(async (res) => {
          if (res.statusCode == 200) {
            this.categorizedDeductionExpenses =
              res.responsePayload.categorizedDeductionExpenses;
            let details = res.responsePayload;
            this.deductionPayRateDetails = details;
            await this.onDeductionType(details.deductionType);
            resolve();
          } else {
            this.sharedService.add({
              severity: 'error',
              summary: 'Error',
              detail: res.message,
            });
          }
        });
    });
  }
  async onDeductionType(event) {
    this.deductionList = [];
    if (event == 'Expense Deduction' || event == 'Advance Deduction') {
      this.showDeductionOptionList = true;
      this.disableAmount = true;
      this.deductionPayRateDetails.totalDeductionAmount = undefined;
    } else {
      this.showDeductionOptionList = false;
      this.disableAmount = false;
    }
    this.errorLabel = '';
    if (event == 'Other') {
      this.deductionPayRateDetails.totalDeductionAmount = undefined;
    }
    if (event == 'Advance Deduction') {
      this.deductionCols = [
        { field: 'advanceRequestedDate', header: 'Requested Date' },
        { field: 'advancePaidDate', header: 'Paid Date' },
        { field: 'advanceAmount', header: 'Amount' },
        { field: 'description', header: 'Description' },
        { field: 'status', header: 'Status' },
      ];
      await this.getAdvanses(this.deductionPayRateDetails.employeeDetailsId);
      this.selecteddeductionList = await this.getSelectedList(
        this.deductionPayRateDetails.employeeDeductionAdvances,
        this.deductionList,
        'employeeAdvanceDetailsId'
      );
      this.onAllRowSelect(this.selecteddeductionList);
    }
    if (event == 'Expense Deduction') {
      this.deductionCols = [
        { field: 'expenseName', header: 'Expense Name' },
        { field: 'expenseDate', header: 'Expense Date' },
        { field: 'amount', header: 'Amount ' },
        { field: 'description', header: 'Description ' },
      ];
      await this.getExpenses(this.deductionPayRateDetails.employeeDetailsId);
      this.selecteddeductionList = await this.getSelectedList(
        this.deductionPayRateDetails.employeeDeductionExpenses,
        this.deductionList,
        'employeeExpenseLineItemDetailsId'
      );
      this.onAllRowSelect(this.selecteddeductionList);
    }
    this.cdr.detectChanges();
  }
  getSelectedList(actualList, fullList, compairId) {
    return new Promise((resolve, reject) => {
      if (actualList) {
        let abc = [];
        actualList.filter((a) => {
          fullList.forEach((element) => {
            if (element[compairId] == a[compairId]) {
              abc.push(element);
            }
          });
          resolve(abc);
        });
      }
    });
  }
  getAdvanses(employeeDetailsId) {
    return new Promise<void>((result, reject) => {
      this.payHistoryService.getAdvances(employeeDetailsId).subscribe((res) => {
        if (res.statusCode == 200) {
          this.deductionList = res.responsePayload;
          result();
        } else {
          this.sharedService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message,
          });
          this.deductionList = [];
          result();
        }
      });
    });
  }
  getExpenses(employeeDetailsId) {
    return new Promise<void>((result, reject) => {
      this.payHistoryService
        .getExpencesLineitem(employeeDetailsId)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.deductionList = res.responsePayload;
            result();
          } else {
            this.sharedService.add({
              severity: 'error',
              summary: 'Error',
              detail: res.message,
            });
            this.deductionList = [];
            result();
          }
        });
    });
  }
  resetType() {
    this.showDeductionOptionList = true;
    this.disableAmount = true;
  }
  onRowSelect(event) {
    this.deductionPayRateDetails.totalDeductionAmount =
      this.getTotalDeductionAmount(this.selecteddeductionList);
  }
  onRowUnselect(event) {
    this.deductionPayRateDetails.totalDeductionAmount =
      this.getTotalDeductionAmount(this.selecteddeductionList);
  }
  onAllRowSelect(selecteddeductionList) {
    this.deductionPayRateDetails.totalDeductionAmount =
      this.getTotalDeductionAmount(selecteddeductionList);
    this.cdr.detectChanges();
  }
  getTotalDeductionAmount(obj) {
    let amount = 0;
    obj.forEach((element) => {
      if (element.advanceAmount) {
        amount += element.advanceAmount;
      } else if (element.amount) {
        amount += element.amount;
      }
    });
    return amount;
  }
  saveDeduction(form) {
    let deduction: any = [];
    if (this.deductionPayRateDetails.deductionType.toLowerCase() == 'other') {
      this.deductionPayRateDetails.deductionType =
        this.deductionPayRateDetails.customeDeductionType;
    }
    if (this.deductionPayRateDetails.deductionType == 'Advance Deduction') {
      this.selecteddeductionList.forEach((element) => {
        if (element.employeeDeductionAdvanceDetailsId) {
          deduction.push({
            employeeAdvanceDetailsId: element.employeeAdvanceDetailsId,
            status: '1',
            employeeDeductionAdvanceDetailsId:
              element.employeeDeductionAdvanceDetailsId,
          });
        } else {
          deduction.push({
            employeeAdvanceDetailsId: element.employeeAdvanceDetailsId,
            status: '1',
          });
        }
      });
      this.deductionPayRateDetails.deductionAdvances = deduction;
      this.deductionPayRateDetails.deductionExpenses = undefined;
    }
    if (this.deductionPayRateDetails.deductionType == 'Expense Deduction') {
      this.selecteddeductionList.forEach((element) => {
        if (element.employeeDeductionAdvanceDetailsId) {
          deduction.push({
            employeeExpenseLineItemDetailsId:
              element.employeeExpenseLineItemDetailsId,
            status: '1',
            employeeDeductionExpenseDetailsId:
              element.employeeDeductionExpenseDetailsId,
          });
        } else {
          deduction.push({
            employeeExpenseLineItemDetailsId:
              element.employeeExpenseLineItemDetailsId,
            status: '1',
          });
        }
      });
      this.deductionPayRateDetails.deductionExpenses = deduction;
      this.deductionPayRateDetails.deductionAdvances = undefined;
    }
    this.payHistoryService
      .saveDeductionEmployeePayRate(this.deductionPayRateDetails)
      .subscribe(async (res) => {
        if (res.statusCode == 200) {
          // await  this.getExpenseDeductionDetails(this.state.details)
          this.closeUploadmodal();
          form.reset();
          this.sharedService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
          this.router.navigate(['admin/deductions']);
        } else {
          this.sharedService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message,
          });
        }
      });
  }
  getStatus(status) {
    if (status == 'Active') {
      return '1';
    } else {
      return '0';
    }
  }
  hiddenScroll() {
    try {
      let bodyElement = document.getElementById('modalbody') as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.add('modal-open');
      }
    } catch (ex) {
      this.clientErrorMsg(ex, 'hiddenScroll');
    }
  }
  displayScroll() {
    try {
      let bodyElement = document.getElementById('modalbody') as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.remove('modal-open');
      }
    } catch (ex) {
      this.clientErrorMsg(ex, 'displayScroll');
    }
  }
  closeUploadmodal(type?: string) {
    if (type == 'cancel') {
      this.getExpenseDeductionDetails(this.state.details);
    }
    this.deductionModel = 'none';
    this.errorLabel = '';
    this.clientErrorMsg = '';
    this.displayScroll();
  }
}
