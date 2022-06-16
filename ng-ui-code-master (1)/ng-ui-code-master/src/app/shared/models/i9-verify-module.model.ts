export class I9VeirifyModel {
  i9DetailsId: number;

  employeeLastName: String;
  employeeFirstName: String;
  employeeMiddleName: String;
  employeeImmigrationStatus: String;

  listATypeDocumentOption: String;
  listADocumentTitle: String;
  listAIssuingAuthority: String;
  listADocumentNumber: String;
  listADocumentExpiryDate: String;

  listBTypeDocumentOption: String;
  listBDocumentTitle: String;
  listBIssuingAuthority: String;
  listBDocumentNumber: String;
  listBDocumentExpiryDate: String;

  listCTypeDocumentOption: String;
  listCDocumentTitle: String;
  listCIssuingAuthority: String;
  listCDocumentNumber: String;
  listCDocumentExpiryDate: String;

  employeeFirstDateOfEmployment: String;

  electronicSignatureOfTheEmployer: String;
  verifiedDate: String;
  titleOfTheEmployer: String;
  lastNameOfTheEmployer: String;
  firstNameOfTheEmployer: String;
  organizationNameOfTheEmployer: String;
  organizationAddressOfTheEmployer: String;
  cityOrTown: String;
  state: String;
  zipCode: String;

  additionalInformation: String;
  verificationType: String;
  rejectReason: String;
  approveOrReject: String; //status Reject=0 Approve=2
}
