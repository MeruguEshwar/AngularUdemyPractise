export class FileUploadModel {
  fileToUpload: File = null;
  documentTitle: string = "";
  documentNumber: string = "";
  documentExpiryDate: string = "";
  alertRequired: string;
  alertBeforeNoOfDays: string = "";
  checked: boolean = false;
}
