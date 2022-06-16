import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-compliance",
  templateUrl: "./compliance.component.html",
  styleUrls: ["./compliance.component.css"],
})
export class ComplianceComponent implements OnInit {
  menuDetails: any = {
    defaultLabel: "Compliance",
    defaulturl: "compliance",
    subMenu: [],
  };
  view3: any = {
    defaultLabel: "HRX Accelerates Regulatory Compliance Experiences ",
    list: [
      {
        label: "IRS Forms Management ",
        content:
          "Obtain and verify I-9, W-2, 1099-NEC, and other employer information returns with HRX and validate your internal reports prior to filing ",
        icon: "fa fa-hourglass-start",
        iconName: "irs_forms_management",
      },
      {
        label: "Civil Permission Management",
        content:
          "Validate and employ profiles that meet the civil and legal status regulations of the state or the country from which you operate/function, making way for smoother onboarding-exit processes",
        icon: "fa fa-hourglass-start",
        iconName: "civil_permission_management",
      },
      {
        label: "Workforce Classification ",
        content:
          "Identify, qualify, and validate your employees and consultants prior to issuing IRS returns. Prevent your business from misclassifying employees and prevent federal penalties ",
        icon: "fa fa-hourglass-start",
        iconName: "workforce_classification ",
      },
      {
        label: "Accounting & Payroll Data Management  ",
        content:
          "Pay stubs, invoices, and other business communications will include a brief description and identifiers of the profile, helping the payer and the payee maintain a transparent and compliant relationship.",
        icon: "fa fa-hourglass-start",
        iconName: "accounting_payroll_data_management",
      },
    ],
  };
  bannerDetails: any = {
    content:
      "Integrate tax compliance and regulatory reporting processes within your workspace framework  ",
    HeadLine: "Manage Company And People With Compliance-Driven Experiences",
    img: "assets/images/compliance1.png",
  };

  subBannerList: any[] = [
    {
      id: "",
      imgType: "right",
      content:
        "Obtain taxpayer and social security information from your vendors, employees, and consultants to validate and report to the federal agencies. Organize and prepare your state and federal returns with readily-available data, processed through the dynamic experiences of HRX. ",
      headLineTag: null,
      HeadLine: "Prioritize Tax-Centric Data ",
      img: "assets/images/hiring2.png",
      list: [
        "Retain tax-sensitized data from employees, consultants, and customers ",
        "Leverage accounting-first integrations for easier data processing",
        "Validate and verify the social security information for due diligence and tax compliance requirements",
      ],
    },
    {
      id: "",
      imgType: "left",
      content:
        "Enroll, define, and update the legal and work permits of your employees and consultants should you outsource your human capital to foreign organizations or regions. The obtained regulatory details can also be used to process your internal regulatory assessments, giving your payroll and invoice management ops much-needed transparency. ",
      headLineTag: "",
      HeadLine: "Optimize Regulatory Specifications ",
      img: "assets/images/hiring2.png",
      list: [
        "Obtain and define the visa, travel, and work permits of your workforce",
        "Maintain a comprehensive record of the legal status of your employees ",
        "Utilize the information for regulatory reporting and verification purposes  ",
      ],
    },
    {
      id: "",
      imgType: "right",
      content:
        "When you log in the tax, legal, and civil information of the employee, you are maintaining a comprehensive record of the profile, which enables you to screen and re-validate the profile for internal assessments and mandatory verification protocols. You can further upload the data of multiple profiles at once with HRX’s bulk data upload enhancements, which reduce the manual workload on your people-centric teams. ",
      headLineTag: null,
      HeadLine: "Manage Company Data    ",
      img: "assets/images/hiring2.png",
      list: [
        "Optimize internal reviews and assessment protocols",
        "Better access to the background of every incoming profile ",
        "Drive your business decision-making with fact-backed information ",
        "Eliminate the stresses of the manual workload from your KYC teams ",
      ],
    },
    {
      id: "",
      imgType: "left",
      content:
        "Bid Bye To The Complexities Of Unorganized Workspace Management ",
      headLineTag: null,
      HeadLine:
        "Bid Bye To The Complexities Of Unorganized Workspace Management  ",
      img: "assets/images/hiring2.png",
      list: [],
    },
  ];
  subBannerList2: any[] = [
    {
      id: "",
      imgType: "left",
      content:
        "Bulk data uploads, regulatory processes, and other mandatory office experiences allow your accounting, payroll, and HR departments to follow a predefined process, removing confusion, disparities, and errors.  ",
      headLineTag: null,
      HeadLine: "Simplified Practices To Eliminate Year-End Rush ",
      img: "assets/images/hiring2.png",
      list: [
        "Create and define your lifecycle business experiences  ",
        "Create and define your lifecycle business experiences ",
        "Get better access organizational and employee data within seconds ",
        "Leverage the power of automation to save time and effort ",
      ],
    },
    {
      id: "",
      imgType: "right",
      content:
        "Establish a clear path to the nexus of tax and regulatory protocols with HRX Compliance",
      headLineTag: null,
      HeadLine: "Power Your Compliance Ops With HRX ",
      img: "assets/images/hiring2.png",
      list: [],
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
