import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-smart-hr",
  templateUrl: "./smart-hr.component.html",
  styleUrls: ["./smart-hr.component.css"],
})
export class SmartHrComponent implements OnInit {
  menuDetails: any = {
    defaultLabel: "Smart HR ",
    defaulturl: "smart_hr",
    subMenu: [],
  };
  view3: any = {
    defaultLabel: "The Only HR Compliance Manager Your Workspace Needs ",
    list: [
      {
        label: "Accelerate Transparency",
        content:
          "Maintain a transparent record of employee profiles and data to establish employer-employee synchronization ",
        icon: "fa fa-hourglass-start",
        iconName: "accelerate_transparency",
      },
      {
        label: "Boost Culture ",
        content:
          "Culture is the unique personality of your organization. Define it and drive it with effortless processes and employee experiences ",
        icon: "fa fa-hourglass-start",
        iconName: "boost_culture ",
      },
      {
        label: "Improve Communication",
        content:
          "Define and create a direct channel of communication between the employer and employee to conduct fair workspace dynamics",
        icon: "fa fa-hourglass-start",
        iconName: "improve_communication",
      },
      {
        label: "Humanize Ecosystem ",
        content:
          "Drive your experiences to help your teams and employees scale up their productivity factors with mindful work-life balance",
        icon: "fa fa-hourglass-start",
        iconName: "humanize_ecosystem",
      },
    ],
  };
  bannerDetails: any = {
    content:
      "Organize your employee experiences and define AN onboard-exit strategy with Smart HR ",
    HeadLine: "Drive Employee Experiences With Smart HR",
    img: "assets/images/smart-hr.jpg",
  };

  subBannerList: any[] = [
    {
      id: "",
      imgType: "right",
      content:
        "While business operations are the crux of sustainability, employees are the linchpin to your organizational structure, defining your productivity characteristics.  It is essential for every ecosystem to define, identify, and address the driving factors of workplace culture- employees. Through HRX, you can create an ecosystem driven by professionals who perform to meet your productivity, cultural, and growth values.",
      headLineTag: "",
      HeadLine: "Effortless People Management With HRX ",
      img: "assets/images/hiring2.png",
      list: [],
    },
  ];
  subBannerList2: any[] = [
    {
      id: "",
      imgType: "right",
      content:
        "HRX’s Smart HR allows your HR teams to adhere to the pressing requirements of your organization, giving them the flexibility to scale up as and when required. People management, productivity measurement, and performance assessment becomes a breeze with this universal HR management infrastructure ",
      headLineTag: null,
      HeadLine: "Designed To Help Your HR Teams Succeed",
      img: "assets/images/hiring2.png",
      list: [
        "Identify and define your people-centric goals  ",
        "Create and scale up your employee experiences ",
        "Establish bias-free work culture driven by productivity ",
        "Create and conduct transparent communication channels ",
        "Ascertain employee addressal with simplified, structured protocols ",
      ],
    },
    {
      id: "",
      imgType: "left",
      content:
        "HRX’s Smart HR is a universal people management infrastructure that is smart enough to scale and adapt to your company’s growth and flexible enough to meet your employee compliance prerequisites  ",
      headLineTag: null,
      HeadLine: "Self-Driving HR Infrastructure To Scale, Drive, and Grow ",
      img: "assets/images/hiring2.png",
      list: [],
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
