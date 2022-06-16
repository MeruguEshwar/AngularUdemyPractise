export class Company {
  companyDetailsId: number;
  invoiceNotificationConfig: string;
  invoiceNotificationConfigValue: string;
  companyName: string;
  description: String;
  einNumber: String;
  creditDays: number;
  companyWebsite: String;
  companyAddress: string;
  notes: String;
  organizationDetailsId: number;
  companyContacts: CompanyContacts[];
}
export class CompanyContacts {
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  contactLandline: string;
  contactLandlineExtn: string;
  companyDetailsId: number;
  companyContactDetailsId: number;
}
