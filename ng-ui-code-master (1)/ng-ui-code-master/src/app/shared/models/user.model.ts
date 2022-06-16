export class User {
  employeeDetailsId: number;
  fistName: string;
  lastName: string;
  roleId: number;
  authCode: string;
  role: string;
  photoPath: string;
  organizationDetailsId: number;
  orgnizationName: string;
  accessibleModules: string[];
  logoPath: string;
  defaultOrgLogo: boolean;
  orgnizationCurrency: string;
  orgnizationCountry: string;
  organizationCountryDetailsId: number;
  employeeAccounts: any;
  hasMultipleAccounts: boolean;
  showTAQRCode: boolean;
  employeeType: string;
}
export class UserHasMultipleAccounts {
  employeeAccounts: LoggedInEmployeeAccounts[];
  hasMultipleAccounts: boolean;
}
export class LoggedInEmployeeAccounts {
  orgnizationName: number;
  employeeDetailsId: number;
  organizationDetailsId: number;
}
