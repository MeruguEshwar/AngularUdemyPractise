export class FeatureRequest {
  employeeDetailsId: number;
  featureRequestDetailsId: number;
  summary: string;
  description: string;
  employeeName: string;
  status: string;
  requestedDateTime: string;
  amountRequested: string;
  deductionCriteria: string;
  employeeRequestMessages: FeatureRequestMessages[];
}
export class FeatureRequestMessages {
  featureRequestMessageDetailsId: number;
  featureRequestDetailsId: number;
  employeeDetailsId: number;
  employeeName: string;
  orgnizationName: string;
  message: string;
  awsS3UniqueKey: string;
  savedDateTime: string;
  status: string;
}
