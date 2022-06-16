import {
  MyOrganizationDetailsAddress,
  MyOrganizationDetailsRemittances,
} from "./myOrganizationDetails.model";

export class invoiceEntries {
  invoiceEntryDetailsId: number;
  projectDetailsId: number;
  projectName: string;
  employeeDetailsId: number;
  employeeName: string;
  invoiceDetailsId: number;
  description: string;
  quantity: number = 0;
  rate: number = 0;
  amount: number;
  taxAmount: number;
  discountAmount: number;
  isDiscount: boolean = false;
  discount: number = 0.0;
  isTax: boolean = false;
  tax: number = 0.0;
  discountType: string = "1";
  taxType: string = "1";
  status: string;
  projectDetails: any;
  employeeDetails: any;
  disableQuantity: boolean = true;
  ratestypes: RateType[];
  overtimeExemption: string;
}
export class RateType {
  "Rate": number;
  "Overtime Rate": number;
  "Double Overtime Rate": number;
}
export class InvoicesDetails {
  organizationDetailsId: number;
  organizationAddressDetailsId: number;
  organizationRemittanceDetailsId: number;
  organizationName: string;
  einNumber: string;
  invoiceDetailsId: number;
  companyDetailsId: number;
  companyName: string;
  companyEinNumber: string;
  companyAddress: string;
  invoiceDate: string;
  invoiceNumber: string;
  creditDays: number;
  invoiceDueDate: string;
  poNumber: string;
  employeeDetailsId: number;
  approverEmailIds: any;
  submittedDateTime: string;
  approvedDatetime: string;
  approvedByEmailId: string;
  notes: string;
  status: string;
  invoiceEntries: invoiceEntries[];
  organizationAddressDetails: MyOrganizationDetailsAddress;
  organizationRemittanceDetails: MyOrganizationDetailsRemittances;
  entryType: string;
  action: string;
  totalAmount: any;
}
