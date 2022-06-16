export class MyOrganizationDetails {
  organizationDetailsId: number;
  organizationCode: string;
  organizationName: string;
  website: string;
  phoneNumber: string;
  noOfEmployees: string;
  einNumber: string;
  logoPath: string;
  addresses: MyOrganizationDetailsAddress[];
  remittances: MyOrganizationDetailsRemittances[];
}
export class MyOrganizationDetailsAddress {
  organizationAddressDetailsId: number = null;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  status: string;
  organizationDetailsId: number;
}
export class MyOrganizationDetailsRemittances {
  organizationDetailsId: number = null;
  bankName: string;
  accountAddress: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  routingNumber: string;
  status: string;
  country: number;
  friendlyName: string;
  accountName: string;
  otherDetails: string;
  
  countryName:string
}

export class MyOrganizationDetailsDocuments {
  organizationDetailsId: any;
  organizationDocumentDetailsId: any;
  fileToUpload: any;
  documentTitle: string;
  documentNumber: string;
  documentExpiryDate: string;
  alertRequired: string;
  alertBeforeNoOfDays: any;
}
