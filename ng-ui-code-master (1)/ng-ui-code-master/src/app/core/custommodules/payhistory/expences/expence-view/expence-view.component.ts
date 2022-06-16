import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  ExpancesPayRate,
  ExpancesPayRateItemList,
} from '@app/shared/models/expences-pay-rate.model';
import { AuthService } from '@app/core/service/auth.service';
import { PayHistoryService } from '../../payhistory.services';
import { SharedService } from '@app/shared/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expence-view',
  templateUrl: './expence-view.component.html',
  styleUrls: ['./expence-view.component.css'],
})
export class ExpenceViewComponent implements OnInit {
  state: any;
  employeeExpenseDetailsId: any;
  expensesPayRateDetails: ExpancesPayRate;
  expensesEntries: ExpancesPayRateItemList[];
  expenseModel: string = 'none';
  organizationDetailsId: any;
  errorLabel: string;
  clientErrorMsg: any;
  descriptionOption: any = [];
  expensesOption: any = [];
  filteredDescriptions: any;
  filteredExpenses: any;
  constructor(
    private cdr: ChangeDetectorRef,
    private location: Location,
    private authService: AuthService,
    private payHistoryService: PayHistoryService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  organizationCurrency: string;
  ngOnInit(): void {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }
    this.state = window.history.state;
    this.organizationDetailsId =
      this.authService.currentUser.organizationDetailsId;
    if (this.state && this.state.details?.employeeExpenseDetailsId) {
      this.expensesPayRateDetails = new ExpancesPayRate();
      this.employeeExpenseDetailsId =
        this.state.details.employeeExpenseDetailsId;
      this.getExpenceDetails(this.employeeExpenseDetailsId);
      this.getDescriptionList(this.organizationDetailsId);
      this.getExpensesNameList(this.organizationDetailsId);
    } else {
      this.location.back();
    }
  }
  showDialogToEdit(rowData?: any) {
    this.expenseModel = 'block';
    this.hiddenScroll();
  }
  getExpenceDetails(employeeExpenseDetailsId) {
    this.payHistoryService
      .getExpenseDetailsById(employeeExpenseDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.expensesPayRateDetails = res.responsePayload;
          this.expensesEntries = res.responsePayload.expenseLineItems;
        }
      });
  }
  save(form) {
    this.expensesPayRateDetails.expenseLineItems = this.expensesEntries;
    this.payHistoryService
      .saveExpencesEmployeePayRate(this.expensesPayRateDetails)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
          this.closeUploadmodal();
          this.router.navigate(['admin/expenses']);
        } else {
          this.sharedService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message,
          });
        }
      });
  }
  getDescriptionList(organizationDetailsId) {
    this.payHistoryService
      .getExpensesDescription(organizationDetailsId)
      .subscribe(async (res) => {
        if (res.statusCode == 200) {
          this.descriptionOption = res.responsePayload;
          this.cdr.detectChanges();
        } else {
          this.descriptionOption = [];
          this.sharedService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message,
          });
        }
      });
  }
  getExpensesNameList(organizationDetailsId) {
    this.payHistoryService
      .getExpensesNames(organizationDetailsId)
      .subscribe(async (res) => {
        if (res.statusCode == 200) {
          this.expensesOption = res.responsePayload;
          this.cdr.detectChanges();
        } else {
          this.expensesOption = [];
          this.sharedService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message,
          });
        }
      });
  }
  filterDescription(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.descriptionOption.length; i++) {
      let element = this.descriptionOption[i];
      if (element.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(element);
      }
    }
    this.filteredDescriptions = filtered;
  }
  filterExpenses(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.expensesOption.length; i++) {
      let element = this.expensesOption[i];
      if (element.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(element);
      }
    }
    this.filteredExpenses = filtered;
  }
  onAddexpenseLineItem() {
    let expenseLineIteamDetails = Object.assign(
      {},
      new ExpancesPayRateItemList()
    );
    this.expensesEntries.push(expenseLineIteamDetails);
  }
  onRemoveexpenseLineItem(expense, index) {
    if (this.expensesEntries.length > 1) {
      if (expense.employeeExpenseLineItemDetailsId) {
        this.expensesEntries[index].status = '0';
      } else {
        this.expensesEntries.splice(index, 1);
      }
    }
    this.getAmount(this.expensesEntries);
    this.cdr.detectChanges();
  }
  getAmount(obj) {
    let amount = 0;
    obj.forEach((element) => {
      if (+element.status) {
        amount += +element.amount;
      }
    });
    if (amount > 0) {
      this.expensesPayRateDetails.totalAmount = amount;
    } else {
      this.expensesPayRateDetails.totalAmount = 0;
    }
  }
  onInputKeyUp(event, expensesEntries) {
    this.getAmount(expensesEntries);
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
    this.getExpenceDetails(this.employeeExpenseDetailsId);
    this.expenseModel = 'none';
    this.errorLabel = '';
    this.clientErrorMsg = '';
    this.displayScroll();
    this.cdr.detectChanges();
  }
}
