export class Profile {
  "profileDetailsId": number;
  "firstName": string;
  "lastName": string;
  "middleName": string;
  "gender": number;
  "dateOfBirth": string;
  "dateOfMarriage": string;
  "dateOfBirthFormate": Date;
  "maritalStatus": number;
  "religion": string = "";
  "nationality": string = "";
  "address": string = "";
  "city": string = "";
  "state": string = "";
  "country": string = "";
  "pinCode": string = "";
  "primaryContactName": string = "";
  "primaryContactRelationship": string = "";
  "primaryContactPhone": string = "";
  "primaryContactPhone2": string;
  "secondaryContactName": string = "";
  "secondaryContactRelationship": string = "";
  "secondaryContactPhone": string = "";
  "secondaryContactPhone2": string = "";
  "bankAccountName": string = "";
  "bankName": string = "Dummy";
  "bankAccountNumber": string = "";
  "ifscCode": string = "";
  "employmentOfSpouce": string;
  "noOfChildren": number;
  "telePhone": string;
  "passportNo": string = "";
  "passportExpDate": string;
  "passportExpDateFormate": Date;
  "panNo": string = "";
  "confirmssn": string = "";
  "aadharNo": string = "";
  "ssn": string = "";
  "employeeDetailsId": number;
  "phoneNumber": string = "";
  "email": string = "";
  "fullName": string = "";
  "designation": string = "";
  "department": string = "";
  "employeeId": string;
  "dateOfJoining": string;
  "dateOfJoiningFormate": Date;
  "departmentDetailsId": number;
  "departmentName": string;
  "departmentDetails": any;
  "reportingToUserName": string = "";
  "designationDetailsId": number;
  "designationDetails": any;
  "reportingToEmployeeDetailsId": number;
  "employmentDetailsId": number;
  "reportingToEmployeeName": string;
  "employeeType": string;
  "employmentType": string;
  "duration": string;
  status: number;
  photoPath: string;
  immigrationStatus: string;
  reportingDetails: any;
  educations: Education[];
  experiences: Experience[];
  directReports: DirectReport[];
  emergencyContacts: EmergContactDetails[];
  dependents: EmpDependentDetails[];
  socialNetworks: SocialNetwork[];
}
export class DepartmentDetails {
  "label": string;
  "value": string;
}
export class DirectReport {
  employeeDetailsId: number;
  fullName: string;
  employeeId: string;
  departmentDetailsId: number;
  designationDetailsId: number;
  designation: string;
  department: string;
}
export class Education {
  "educationDetailsId": number;
  "degree": string;
  "subject": string;
  "institution": string;
  "startingDate": string;
  "completionDate": string;
  "startingDateFormate": Date;
  "completionDateFormate": Date;
  "status": number;
  "grade": string;
  "employeeDetailsId": number;
  constructor() {
    this.completionDate = null;
    this.educationDetailsId = null;
    this.subject = "";
    this.institution = "";
    this.startingDate = null;
    this.completionDate = null;
    this.status = null;
    this.grade = "";
    this.degree = "";
  }
}
export class Experience {
  "experienceDetailsId": number;
  "companyName": string;
  "jobPosition": string;
  "location": string;
  "periodFrom": string;
  "periodTo": string;
  "periodFromFormate": Date;
  "periodToFormate": Date;
  "status": number;
  "employeeDetailsId": number;
  constructor() {
    this.experienceDetailsId = null;
    this.companyName = "";
    this.jobPosition = "";
    this.location = "";
    this.periodFrom = "";
    this.periodTo = "";
    this.status = null;
    this.employeeDetailsId = null;
  }
}
export class PersonalDetails {
  employeeDetailsId: number;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: number;
  maritalStatus: number;
  nationality: string;
  dateOfMarriage: string;
  profileDetailsId: number;
}
export class CommunicationDetails {
  profileDetailsId: number;
  employeeDetailsId: number;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  phoneNumber: string;
}
export class AuthorizationDetails {
  profileDetailsId: number;
  employeeDetailsId: number;
  passportNo: string;
  passportExpDate: string;
  panNo: string;
  aadharNo: string;
  ssn: string;
}
export class EmergContactDetails {
  employeeDetailsId: number;
  emergencyContactDetailsId: number;
  name: string;
  relationship: string;
  phoneNumber: string;
  email: string;
  address: string;
  status: string;
}
export class EmploymentDetails {
  profileDetailsId: number;
  employeeDetailsId: number;
  employeeId: number;
  dateOfJoining: string;
  departmentDetailsId: any;
  department: string;
  designationDetailsId: any;
  designation: string;
  employeeType: string;
  employmentType: string;
  reportingToEmployeeDetailsId: number;
  employmentDetailsId: number;
}
export class EmpDependentDetails {
  employeeDependentDetailsId: number;
  employeeDetailsId: number;
  name: string;
  relationship: string;
  dateOfBirth: string;
  gender: string;
  status: string;
}
export class BankAcountDetails {
  employeeBankAccountDetailsId: number;
  employeeDetailsId: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  otherDetails: string;
  routingNumber: string;
  ifscCode: string;
  country: number;
  status: string;
}
export class ImmigrationDetails {
  visaStatus: string;
  customeVisaStatus: string;
  visaExpiryDate: string;
  visaCountry: string;
  employeeDetailsId: number;
  immigrationDetailsId: number;
  status: string;
}

export class SocialNetwork {
  socialNetworkDetailsId: number;
  employeeDetailsId: number;
  socialNetwork: string;
  socialNetworkLink: string;
  status: string;
}
