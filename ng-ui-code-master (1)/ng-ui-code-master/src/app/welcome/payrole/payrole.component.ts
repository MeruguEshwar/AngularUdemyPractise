import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-payrole",
  templateUrl: "./payrole.component.html",
  styleUrls: ["./payrole.component.css"],
})
export class PayroleComponent implements OnInit {
  menuDetails: any = {
    defaultLabel: "Payroll & Expenses",
    defaulturl: "payrole",
    subMenu: [
      { label: "Hiring", url: "hiring" },
      { label: "Application Tracking", url: "application_tracking" },
      { label: "Offer Management", url: "offer_managment" },
      { label: "Employee Onboarding", url: "emloyee_onboarding" },
    ],
  };
  bannerDetails: any = {
    content:
      "HRX has all the HR tools that make managing your people easy, from streamlined onboarding and easy PTO tracking to org charts, performance reviews, and so much more.",
    HeadLine: "Manage your Employee Time Sheets with ease.",
    img: "assets/images/hiring1.jpg",
  };

  subBannerList: any[] = [
    {
      id: "hiring",
      imgType: "right",
      content:
        "HRX has all the HR tools that make managing your people easy, from streamlined onboarding and easy PTO tracking to org charts, performance reviews, and so much more.",
      headLineTag: "HR.",
      HeadLine: "Manage your people with ease.",
      img: "assets/images/hiring2.png",
      list: ["list1", "list2", "list3"],
    },
    {
      id: "emloyee_onboarding",
      imgType: "left",
      content:
        "HRX has all the HR tools that make managing your people easy, from streamlined onboarding and easy PTO tracking to org charts, performance reviews, and so much more.",
      headLineTag: "HR.",
      HeadLine: "Manage your Employee Time Sheets with ease.",
      img: "assets/images/hiring2.png",
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
