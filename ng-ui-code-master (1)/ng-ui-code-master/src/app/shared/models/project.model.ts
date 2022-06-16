import { projectCompanyMappings } from "./projectCompanyMappings.model";

export class Project {
  projectDetailsId: number;
  projectName: string;
  timesheetNotificationConfig: string;
  timesheetNotificationConfigValue: string;
  description: string;
  creditDays: number;
  startDateFormat: Date;
  startDate: string;
  endDateFormat: Date;
  endDate: string;
  status: string;
  inHouse: any;
  organizationDetailsId: number;
  webProjectCompanyMappings: any;
  projectCompanyMappings: any;
}
