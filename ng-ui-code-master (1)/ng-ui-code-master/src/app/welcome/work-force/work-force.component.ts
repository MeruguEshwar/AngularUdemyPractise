import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-work-force",
  templateUrl: "./work-force.component.html",
  styleUrls: ["./work-force.component.css"],
})
export class WorkForceComponent implements OnInit {
  menuDetails: any = {
    defaultLabel: "Workforce",
    defaulturl: "work_force",
    subMenu: [],
  };
  view3: any = {
    defaultLabel: "Power Your Employee Management Operations With Automation",
    list: [
      {
        label: "Create experiences",
        content:
          "Obtain and verify I-9, W-2, 1099-NEC, and other employer information returns with HRX and validate your internal reports prior to filing ",
        icon: "fa fa-hourglass-start",
        iconName: "create_experiences",
      },
      {
        label: "Assign responsibilities",
        content:
          "Designate supervisors to give your employees the necessary attention during complex projects and initial onboarding periods ",
        icon: "fa fa-hourglass-start",
        iconName: "assign_responsibilities",
      },
      {
        label: "Manage teams  ",
        content:
          "Create teams to compartmentalize your workflow in an organized manner. Make way for optimized performance, productivity, and deliverability ",
        icon: "fa fa-hourglass-start",
        iconName: "manage_teams",
      },
      {
        label: "Measure progress  ",
        content:
          "Monitor and measure the performance parameters of independent profiles and teams to understand the real-time and periodic progress ",
        icon: "fa fa-hourglass-start",
        iconName: "measure_progress",
      },
    ],
  };
  bannerDetails: any = {
    content:
      "Manage employees, designate roles and responsibilities, and do more with HRX Workforce  ",
    HeadLine: "Help Your Employees Grow",
    img: "assets/images/workforce.png",
  };

  subBannerList: any[] = [
    {
      id: "",
      imgType: "right",
      content:
        "Onboard your employees by logging the necessary personal details, define the employee’s role in the organization by assigning the designation, and process the required paperwork - all through HRX.",
      headLineTag: null,
      HeadLine: "Define Your Employees",
      img: "assets/images/hiring2.png",
      list: [
        "Create a unique start-point for your employee onboarding process ",
        "Create a unique start-point for your employee onboarding process ",
        "Define the roles and responsibilities of your employees",
        "Designate the organizational position per the offered promise  ",
      ],
    },
    {
      id: "",
      imgType: "left",
      content:
        "Designate your employees to supervise or manage the incoming profile’s tasks, reports, projects, and other productive and workplace parameters. ENable the approvers or the reporting profile to review the newer counterpart’s productivity constituents for a smoother transition into the team",
      headLineTag: "",
      HeadLine: "Assign Approvers ",
      img: "assets/images/hiring2.png",
      list: [
        "Create organizational hierarchies ",
        "Assign reporting managers and immediate reviewers  ",
        "Maintain an automatic record of all communications between the approver and the approvee  ",
        "Maintain an automatic record of all communications between the approver and the approvee ",
      ],
    },
    {
      id: "",
      imgType: "right",
      content:
        "Designate each employee into your organization’s inherent structure by creating a departmental workflow. Assign resources, supervisors, and group employees together for specific departments and projects. Employees can collaborate for common goals and foster rich culture   ",
      headLineTag: null,
      HeadLine: "Manage Employee Experiences  ",
      img: "assets/images/hiring2.png",
      list: [
        "Define workflow designations and roles ",
        "Create and manage internal teams ",
        "Create and manage internal teams ",
        "Optimize employee experiences with an automated approach to workflow",
      ],
    },
    {
      id: "",
      imgType: "left",
      content:
        "HRX Workforce is designed to help organizations of all sizes to scale up and adapt to change easily. When companies want to introduce new products, processes, and people, the inherent ecosystem of your company must not suffer. With HRX, you can power your employee experiences with automation, intelligence, and ease. This gives your employees the peace of mind of working in an organized ecosystem ",
      headLineTag: null,
      HeadLine: "Give Your Employees The One Thing They Least Expect - Ease ",
      img: "assets/images/hiring2.png",
      list: [],
    },
  ];
  subBannerList2: any[] = [
    {
      id: "",
      imgType: "left",
      content:
        "Workforce allows you to define, create, identify, and measure your people’s attitude, performance, progress ratio, and other parameters, which gives you insights into the growth map.  ",
      headLineTag: null,
      HeadLine:
        "Create A Culture Driven By Your Workspace Values & Performance",
      img: "assets/images/hiring2.png",
      list: [
        "Define the organizational structure easily with HRX ",
        "Manage people better with automated processes ",
        "Define teams and monitor progress with customized growth parameters ",
        "Maintain a comprehensive record of productivity ",
      ],
    },
    {
      id: "",
      imgType: "right",
      content:
        "Identify, manage, and establish the ideal employer-employee relationship with your workforce through HRX ",
      headLineTag: null,
      HeadLine: "Managing Employees Has Never Been Easier ",
      img: "assets/images/hiring2.png",
      list: [],
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
