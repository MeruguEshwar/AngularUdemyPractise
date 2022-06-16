export class W4 {
  w4FormType: number = 1;
  w4DetailsId: number;
  firstNameAndMiddileInitial: string;
  firstName: string;
  lastName: string;
  socialSecurityNumber: string;
  address: string;
  cityOrTown: string;
  cityOrTownStateZipCode: string;
  state: string;
  zipCode: string;
  maritalStatus: string = "0";
  nameSSNStatus: string = "1";

  lastNameDiffers: string;
  hasLastNameDiffers: boolean;
  totalNumberOfAllowances: number;
  additionalAmount: number;
  taxExempt: number;

  multipleJobsOrSpouseWorks: string;
  hasMultipleJobsOrSpouseWorks: boolean;
  claimDependents1: number;
  claimDependents2: number;
  claimDependentsTotal: number;
  otherAdjustmentsOtherIncome: number;
  otherAdjustmentsDeductions: number;
  otherAdjustmentsExtraWithholding: number;

  taxability: number = 1;
  taxWithheld: string = "1";
  residency: number;
  fillingStatus: number;

  multipleJobs: number;
  dependents: number;
  otherIncome: number;
  deductions: number;
  extraAmount: number;

  additionalPercentage: number;
  overrideAmount: number;
  overridePercentage: number;

  socialSecurityTaxability: number = 1;
  sstExemptReason: string;
  medicareSecurityTaxability: number = 1;
  medicareExemptReason: string;
  federalUnemploymentSecurityTaxability: number = 1;
  federalUnemploymentExemptReason: string;

  employeeDocumentUploadDetailsId: number;
  employeeDetailsId: number;
  signatureOfTheEmployee: string;
  signatureFontOfTheEmployee: string = "inherit";
  dateSubmitted: string;
  status: string;
  w4Status: string;
  action: string;
}
