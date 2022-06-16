import { Subject } from "rxjs";
import { AdminDashBoard } from "./models/adminDashboard-module.model";

export class UserActionServices {
  switcheddView = new Subject();
  megaMenuClicked = new Subject();
  logochanges = new Subject();
  payHistoryEmployeeSelected: any;
  nevigateRouter: Subject<boolean> = new Subject<boolean>();
  adminDashBoard: Subject<AdminDashBoard> = new Subject<AdminDashBoard>();
}
