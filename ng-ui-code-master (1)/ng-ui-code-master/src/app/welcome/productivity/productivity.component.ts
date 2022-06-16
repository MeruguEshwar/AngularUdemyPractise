import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-productivity",
  templateUrl: "./productivity.component.html",
  styleUrls: ["./productivity.component.css"],
})
export class ProductivityComponent implements OnInit {
  menuDetails: any = {
    defaultLabel: "Productivity ",
    defaulturl: "productivity",
    subMenu: [],
  };
  view3: any = {
    defaultLabel:
      "Boost Productivity. Optimize Processes. Eliminate Redundancy.  ",
    list: [
      {
        label: "Organize your goals",
        content:
          "Identify your goals, prepare a list of goals, and set the timelines per your business intelligence inputs.",
        icon: "fa fa-hourglass-start",
        iconName: "Organize_your_goals",
      },
      {
        label: "Manage your resources ",
        content:
          "Assign resources for each task or assign a team to a project to get things moving, faster.",
        icon: "fa fa-hourglass-start",
        iconName: "manage_your_resources ",
      },
      {
        label: "Create growth maps ",
        content:
          "Prepare and customize your timesheets to help keep a track of your projects and tasks. ",
        icon: "fa fa-hourglass-start",
        iconName: "create_growth_maps",
      },
      {
        label: "Improve communication  ",
        content:
          "Enable your teams and resources to collaborate for common goals and work together for optimal productivity",
        icon: "fa fa-hourglass-start",
        iconName: "improve_communication",
      },
    ],
  };
  bannerDetails: any = {
    content:
      "A productivity management platform built to help you perform and scale up ",
    HeadLine: "Help Your Employees Grow",
    img: "assets/images/productivity.jpg",
  };

  subBannerList: any[] = [
    {
      id: "",
      imgType: "right",
      content:
        "Define your project parameters, assign resources, designate supervisors, and take your projects live. Enable your teams to pick up the projects per your internal strategic management objectives. Enable accessibility permissions to help maintain confidentiality or disable the permissions for an open-source project.   ",
      headLineTag: null,
      HeadLine: "Create and Manage Projects ",
      img: "assets/images/hiring2.png",
      list: [
        "Work on multiple projects at the same time without hassles ",
        "Dynamically control the accessibilities of independent profiles  ",
        "Track the progress of every micro task to ensure attention to detail ",
        "Set up the payment processes for each resource on every project to help customize the pay-per-project approach ",
      ],
    },
    {
      id: "",
      imgType: "left",
      content:
        "Define the timelines by which you want your teams to complete certain tasks per your internal assessments and assign the resource, timeline, and project. Enable your teams and internal reviewers to supervise the timesheet from the start to the endpoint. Give your tasks and projects the attention to detail without worrying about timesheet mark-ups. ",
      headLineTag: "",
      HeadLine: "Create and Manage Timesheets",
      img: "assets/images/hiring2.png",
      list: [
        "An organized approach to timesheets",
        "Optimizes the way your teams approach collaborative projects  ",
        "Get more done in less time with a structured workflow ",
        "Helps resources perform better with no hassle",
      ],
    },
    {
      id: "",
      imgType: "right",
      content:
        "Create a list of all the objectives that you want your teams to work on and complete by a certain timeline, and assign resources to get things moving. Your resources or teams can collaborate to work on these objectives, create channels of transparent communication, exchange instructions, and check off the objectives once the task or objective has been completed. ",
      headLineTag: null,
      HeadLine: "Track Your Progress With Checklists ",
      img: "assets/images/hiring2.png",
      list: [
        "Priority-first tasks and projects ",
        "Predefined workflow to achieve timelines ",
        "View the live task status to track progress ",
        "Back-up completed task workflow to maintain a record of historic tasks",
      ],
    },
    {
      id: "",
      imgType: "left",
      content:
        "HRX is designed to help companies like you identify, manage, and achieve their productivity goals through automated timesheet processes, project management capabilities, and checklists. This way companies can organize their resources, time, and monetary capacities to get the most out of every independent segment. ",
      headLineTag: null,
      HeadLine: "Optimize Your Productivity Experiences With HRX",
      img: "assets/images/hiring2.png",
      list: [],
    },
  ];
  subBannerList2: any[] = [
    {
      id: "",
      imgType: "left",
      content:
        "With HRX, you can create an ecosystem that is driven by productivity parameters and performance experiences. This means your teams will have predefined project workflow, growth maps as a point of reference to come back to, checklists to ensure nothing is missed, and timesheets to measure the progress on a daily basis. ",
      headLineTag: null,
      HeadLine:
        "Adapt To Change Better With An Organized Performance Ecosystem",
      img: "assets/images/hiring2.png",
      list: [
        "Identify and define your goals",
        "Scale up or relax your performance parameters as necessary",
        "Manage projects and resources better with timesheets ",
        "Measure the progress, track the status of work, and do more dynamically ",
        "Automate your productivity channels for faster results ",
      ],
    },
    {
      id: "",
      imgType: "right",
      content:
        "Identify your goals, create your growth maps, and put in the work. You’re already on your way to the top ",
      headLineTag: null,
      HeadLine: "Scale Up Your Productivity Experiences With HRX Today",
      img: "assets/images/hiring2.png",
      list: [],
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
