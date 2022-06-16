export class AdminDashBoard {
  "employmentDetailsId": number;
  "projectsCount": number;
  "suppliersCount": number;
  "requestsCount": number;
  "employeesCount": number;
  "outstandingI9Approvals": number;
  "outstandingW4Approvals": number;
  "noofTimesheetsNotSubmitted": number;
  "noofSubmittedTimesheetsNotApproved": number;
  "noofInvoicesNotSubmitted": number;
  "noofInvoicesDue": number;
  "recentJoineesCount": number;
  "earnings": number;
  "previousEarnings": number;
  "expenses": number;
  "previousExpenses": number;
  "salaries": number;
  "previousSalaries": number;
  "recentARInvoices": RecentInvoices[];
  "recentAPInvoices": RecentInvoices[];
  "recentCreditPayments": RecentPayments[];
  "recentDebitPayments": RecentPayments[];
  "recentProjects": RecentProjects[];
  "recentCompanies": RecentCompanies[];
  anniversaries: anniversariesAndBirthdays[];
  birthDays: anniversariesAndBirthdays[];
}
export class RecentInvoices {
  "invoiceDetailsId": number;
  "companyDetailsId": number;
  "companyName": string;
  "invoiceDate": string;
  "invoiceNumber": string;
  "invoiceDueDate": string;
  "amount": number;
  "amountPaid": number;
  "balanceAmount": number;
  "paymentStatus": string;
  "status": string;
  "dueDatePassed": boolean;
}
export class RecentPayments {
  "paymentDetailsId": number;
  "companyDetailsId": number;
  "companyName": string;
  "paymentType": string;
  "dateReceived": string;
  "amount": number;
  "description": string;
  "invoiceNumber": string;
  "employeeDetailsId": number;
  "employeeName": string;
  "status": string;
}
export class RecentProjects {
  "projectDetailsId": number;
  "projectName": string;
  "projectCode": string;
  "description": string;
  "startDate": string;
  "endDate": string;
  "status": string;
  "inHouse": string;
  "organizationDetailsId": number;
}
export class RecentCompanies {
  "companyDetailsId": number;
  "companyName": string;
  "description": string;
  "einNumber": string;
  "phoneNumber": string;
  "companyWebsite": string;
  "companyAddress": string;
  "notes": string;
  "organizationDetailsId": number;
  "status": string;
}
export class anniversariesAndBirthdays {
  "employeeDetailsId": number;
  "employeeName": string;
  "date": string;
  "photoPath": string;
}
