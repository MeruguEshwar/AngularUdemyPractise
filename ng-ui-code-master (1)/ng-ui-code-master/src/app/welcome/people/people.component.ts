import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-people",
  templateUrl: "./people.component.html",
  styleUrls: ["./people.component.css"],
})
export class PeopleComponent implements OnInit {
  // menuDetails: any = {
  //   defaultLabel: "WorkHub/People/Associates/Community",
  //   defaulturl: "people",
  //   subMenu: [
  //     { label: "Employees", url: "employees" },
  //     { label: "Customers", url: "customers" },
  //     { label: "Consultants", url: "consultants" },
  //   ],
  // };
  menuDetails: any = {
    defaultLabel: "People",
    defaulturl: "people",
    subMenu: [],
  };
  view3: any = {
    defaultLabel: "How HRX Simplifies & Empowers Your People Experiences ",
    list: [
      {
        label: "Manage People",
        content:
          "Onboard people, create roles, manage teams, and streamline employee processes easily.  ",
        icon: "fa fa-hourglass-start",
        iconName: "manage_people",
      },
      {
        label: "Organize Data ",
        content:
          "Enroll, modify, and store organizational data in bulk with cloud integrations and data management extensions.  ",
        icon: "fa fa-hourglass-start",
        iconName: "organize_data",
      },
      {
        label: "Automate Processes",
        content:
          "Facilitate workflow management and enhance workspace ecosystem with custom automated processes ",
        icon: "fa fa-hourglass-start",
        iconName: "automate_processes",
      },
      {
        label: "Optimize Workspace",
        content:
          "Improve employer-employee dynamics, monitor progress, measure growth, and derive consistent results ",
        icon: "fa fa-hourglass-start",
        iconName: "optimize_workspace",
      },
    ],
  };
  bannerDetails: any = {
    content:
      "Empower your people-centric operations with sleek automation and dynamic integrations ",
    HeadLine: "Drive, manage, and scale up your people experiences",
    img: "assets/images/people1.png",
  };

  subBannerList: any[] = [
    {
      id: "employees",
      imgType: "right",
      content:
        "Recruit & Manage Employees With HRX, you can easily onboard talent and manage your employees with segmented configurations. Create employee profiles, assign projects, designate roles, approvers, managers, and more by furnishing the required information. HRX will process this information dynamically and provide unique experiences tailored to your preferences.",
      headLineTag: "Employees",
      HeadLine: "Recruit & Manage Employees",
      img: "assets/images/hiring2.png",
      list: [
        "Maintain a comprehensive record of every employee profile ",
        "Define and measure performance and productivity",
        "Manage communications, payroll, and do more, faster",
        "Drive growth by managing your resources better",
        "Create a unique ecosystem with a compliant culture ",
      ],
    },
    {
      id: "customers",
      imgType: "left",
      content:
        "Define, enroll, and manage communications with your customers with HRX. You no longer have to manually monitor the communications. HRX will record and store all your communications with customers, allowing you to find and process experiences as and when needed. ",
      headLineTag: "Customers",
      HeadLine: "Onboard & Direct Customer Experiences ",
      img: "assets/images/hiring2.png",
      list: [
        "Obtain and validate customer identities easily ",
        "Automate customer onboarding processes for a smoother workflow",
        "Designed to empower your invoice management operations ",
        "Lifecycle customer communications protocol",
      ],
    },
    {
      id: "consultants",
      imgType: "right",
      content:
        "Identify and validate your vendors, consultants, associates, and other intermediaries easily with HRX’s consultant management modules. Define and restrict the visibility of your organizational data through privacy controls. Validate consultants to expand, improve, and manage your business operations with HRX’s dynamic approach.",
      headLineTag: "Consultants",
      HeadLine: "Enroll & Engage Consultants",
      img: "assets/images/hiring2.png",
      list: [
        "Onboard consultants with defined and customized workflows",
        "Manage and define invoice processes and other transactional experiences ",
        "Scale up your operations to drive growth",
        "Improve tax and regulatory compliance",
      ],
    },
  ];
  subBannerList2: any[] = [
    {
      id: "",
      imgType: "left",
      content:
        "Improve employer-employee dynamics, monitor progress, measure growth, and derive consistent results. Power your human capital managers with an organized dashboard consisting all the essentials to create, conduct, and deliver smoother experiences. ",
      headLineTag: null,
      HeadLine: "Simplified People Experiences Means More Growth ",
      img: "assets/images/hiring2.png",
      list: [
        "Create and define your lifecycle business experiences ",
        "Define onboarding and exit procedures for your employees",
        "Establish streamlined communications with external business profiles ",
        "Identify, record, measure, communicate, compare, and export your people data in a jiffy ",
        "Give definition to your employee-payroll management experiences",
      ],
    },
    {
      id: "",
      imgType: "right",
      content:
        "Improve employer-employee dynamics, monitor progress, measure growth, and derive consistent results",
      headLineTag: null,
      HeadLine: "Power Your People Experiences With HRX ",
      img: "assets/images/hiring2.png",
      list: [],
    },
    {
      id: "",
      imgType: "left",
      content:
        "HRX is the complete workspace management platform designed to meet the people, business, and productivity requirements of every entity. The        perfect human management infrastructure, HRX helps you define, organize,        maintain, scale, and drive performance and growth to all your        organizational experiences.",
      headLineTag: null,
      HeadLine:
        "HRX - The Only Workspace Management Solution Your Modern Ecosystem Needs ",
      img: "assets/images/hiring2.png",
      list: [],
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
