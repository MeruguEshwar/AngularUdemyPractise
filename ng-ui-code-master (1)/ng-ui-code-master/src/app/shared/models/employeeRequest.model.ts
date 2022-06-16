export class EmployeeRequest {
  employeeDetailsId:number
  employeeRequestDetailsId:number
  requestType:string
  description:string
  employeeName:string
  status:string
  requestedDateTime:string
  amountRequested:string
  deductionCriteria:string
  employeeRequestMessages:EmployeeRequestMessages[]
}
export class EmployeeRequestMessages {
  employeeRequestMessageDetailsId:number
  employeeRequestDetailsId:number
  employeeDetailsId:number
  employeeName:string
  message:string
  awsS3UniqueKey:string
  savedDateTime:string
  status:string
}
