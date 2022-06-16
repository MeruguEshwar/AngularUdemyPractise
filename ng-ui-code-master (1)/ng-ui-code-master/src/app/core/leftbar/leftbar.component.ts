import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "../service/auth.service";
import { Role } from "@app/shared/enums/role.enum";
import { Modules } from "@app/shared/enums/modules.enum";
import { UserActionServices } from "@app/shared/userAction.services";
import { Router } from "@angular/router";
import { SharedService } from "@app/shared/shared.service";
import { environment } from "@env/environment";

@Component({
  selector: "app-leftbar",
  templateUrl: "./leftbar.component.html",
  styleUrls: ["./leftbar.component.css"],
})
export class LeftbarComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userAction: UserActionServices,
    private router: Router,
    private sharedService: SharedService
  ) {}
  lstMenus: any[] = [];
  enforcement: any[] = [];
  roleMenu: any[] = [];
  user: any;
  switchedView: boolean = false;
  megaMenu: number = null;
  pictureUrl: string = environment.pictureUrl;
  ngOnInit(): void {
    //this.fillNavMenus(this.authService.currentUser.role);
    this.user = this.authService.currentUser;
    console.log(this.user);
    this.lstMenus.push({
      routeName: `Dashboard`,
      iconColor: "icon-color",
      routeUrl: `${Role[this.user.roleId].toLowerCase()}/dashboard`,
      iconName: "fa fa-tachometer",
      children: [],
      disabled: false,
    });
    if (this.user.roleId == 1) {
      this.lstMenus.push(
        {
          routeName: `Organization`,
          iconColor: "icon-color",
          routeUrl: "supremeadmin/organization",
          iconName: "la la-dashboard",
          children: [],
          disabled: false,
        },
        {
          routeName: `Free Email Domain`,
          iconColor: "icon-color",
          routeUrl: "supremeadmin/freeemaildomain",
          iconName: "la la-dashboard",
          children: [],
          disabled: false,
        }
      );
    } else if (this.user.roleId == 3) {
      this.roleMenu.push({
        routeName: `Document Category`,
        iconColor: "icon-color",
        routeUrl: "admin/category",
        iconName: "fa fa-folder-open-o",
        children: [],
        disabled: false,
      });
    }
    if (this.user.accessibleModules) {
      for (const module of this.user.accessibleModules) {
        if (module != "PROFILE") {
          if (module == "I9" || module == "W4") {
            this.enforcement.push({
              routeName: Modules[module],
              iconColor: "icon-color",
              routeUrl: `${Role[this.user.roleId].toLowerCase()}/${Modules[
                module
              ].toLowerCase()}`,
              iconName: this.getMenuIcon(module),
              children: [],
              disabled: false,
            });
          } else if (
            module == "EMPLOYEES" ||
            module == "DEPARTMENTS" ||
            module == "DESIGNATIONS" ||
            module == "COMPANY" ||
            module == "PROJECTS" ||
            module == "DOCUMENTS" ||
            module == "APPROVERS" ||
            module == "INVOICES" ||
            module == "PAYMENTS" ||
            module == "CHECKLIST"
          ) {
            if (Modules[module]) {
              this.roleMenu.push({
                routeName: Modules[module],
                iconColor: "icon-color",
                routeUrl: `${Role[this.user.roleId].toLowerCase()}/${Modules[
                  module
                ].toLowerCase()}`,
                iconName: this.getMenuIcon(module),
                children: [],
                disabled: false,
              });
            }
          } else {
            let menu = module.replace(" ", "");
            if (Modules[menu]) {
              this.lstMenus.push({
                routeName: Modules[menu],
                iconColor: "icon-color",
                routeUrl: `${Role[this.user.roleId].toLowerCase()}/${Modules[
                  menu
                ]
                  .toLowerCase()
                  .replace(" ", "_")}`,
                iconName: this.getMenuIcon(menu),
                children: [],
                disabled: false,
              });
            }
          }
        }
      }
    }
    this.switchedView = this.sharedService.getUserViewType();
    this.megaMenu = this.sharedService.getAdminMenuType();
    this.userAction.switcheddView.subscribe((res: boolean) => {
      this.switchedView = res;
    });
    this.userAction.megaMenuClicked.subscribe((res: number) => {
      this.megaMenu = res;
    });
    this.userAction.logochanges.subscribe((res) => {
      this.user.logoPath = res;
    });
  }
  getMenuIcon(module) {
    switch (module) {
      case Modules.COMPANY.toUpperCase():
        return "fa fa-university";
      case Modules.DEPARTMENTS.toUpperCase():
        return "fa fa-sitemap";
      case Modules.DESIGNATIONS.toUpperCase():
        return "la la-user-plus";
      case Modules.EMPLOYEES.toUpperCase():
        return "fa fa-users";
      case Modules.ORGANIZATIONS.toUpperCase():
        return "la la-dashboard";
      case Modules.DOCUMENTS.toUpperCase():
        return "fa fa-file-text-o";
      case Modules.MYDOCUMENTS.toUpperCase().replace(" ", ""):
        return "fa fa-file-text-o";
      case Modules.FEEDBACK.toUpperCase():
        return "la la-school";
      case Modules.I9.toUpperCase():
        return "fa fa-id-card";
      case Modules.NOTES.toUpperCase():
        return "fa fa-pencil-square-o";
      case Modules.PAYSTUBS.toUpperCase():
        return "fa fa-balance-scale";
      case Modules.PROFILE.toUpperCase():
        return "fa fa-user";
      case Modules.PROJECTS.toUpperCase():
        return "fa fa-tasks";
      case Modules.TIMESHEETS.toUpperCase():
        return "fa fa-calendar";
      case Modules.W4.toUpperCase():
        return "fa fa-file-word-o";
      case Modules.INVOICES.toUpperCase():
        return "fa fa-briefcase";
      case Modules.PAYMENTS.toUpperCase():
        return "fa fa-money";
      case Modules.APPROVERS.toUpperCase():
        return "fa fa-check-square-o";
      case Modules.CHECKLIST.toUpperCase():
        return "fa fa-sitemap";
    }
  }
  fillNavMenus(role) {
    switch (role) {
      case Role[Role.Admin].toUpperCase(): {
        this.lstMenus = [
          {
            routeName: "Admin Dashboard",
            iconColor: "icon-color",
            routeUrl: "admin",
            iconName: "la la-dashboard",
            children: [],
            disabled: false,
          },
          {
            routeName: "Employees",
            routeUrl: "admin/employees",
            iconColor: "icon-color",
            iconName: "la la-user",
            children: [],
            disabled: false,
          },

          {
            routeName: "Departments",
            iconColor: "icon-color",
            routeUrl: "admin/departments",
            iconName: "la la-building",
            disabled: false,
          },

          {
            routeName: "Designations",
            routeUrl: "admin/designations",
            iconColor: "icon-color",
            iconName: "la la-user-plus",
            disabled: false,
          },
        ];
        break;
      }
      case Role[Role.User].toUpperCase(): {
        this.lstMenus = [
          {
            routeName: "User Dashboard",
            iconColor: "icon-color",
            routeUrl: "user",
            iconName: "la la-dashboard",
            disabled: false,
          },
        ];
        break;
      }
    }
  }
}
