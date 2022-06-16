export class Paystubs {
  "paystubDetailsId": number;
  "checkDate": string;
  "checkDateFormat": Date;
  "startDate": string;
  "endDate": string;
  "payType": string;
  "checkNumber": string;
  "employeeDetailsId": number;
  "organizationDetailsId": number;
  "employeeDocumentUploadDetailsId": number;
  "netAmount": number;
  "grossEarnings": number = 0.00;
  "deductions": number = 0.00;
  "withHoldings": number = 0.00;
  "totalHours": number = 0.00;
  "grossEarningsList": any[] = [];
  "withholdingsList": any[] = [];
  "deductionsList": any[] = [];
  "othersList": any[] = [];
}
