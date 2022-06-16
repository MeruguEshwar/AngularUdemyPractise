import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-work-desk",
  templateUrl: "./work-desk.component.html",
  styleUrls: ["./work-desk.component.css"],
})
export class WorkDeskComponent implements OnInit {
  // menuDetails: any = {
  //   defaultLabel: "Organization/Company/Work Desk ",
  //   defaulturl: "work_desk",
  //   subMenu: [
  //     { label: "Employee Pay Details", url: "employee_pay_details" },
  //     { label: "Invoices", url: "invoices" },
  //     { label: "Payments ", url: "digital_paper_work" },
  //     { label: "Paystubs ", url: "digital_paper_work" },
  //     { label: "Document Category ", url: "digital_paper_work" },
  //   ],
  // };
  menuDetails: any = {
    defaultLabel: "Work Desk ",
    defaulturl: "work_desk",
    subMenu: [],
  };
  view3: any = {
    defaultLabel: "How HRX Simplifies & Empowers Your People Experiences ",
    list: [
      {
        label: "Organize paperwork ",
        content:
          "Enroll, create, store, and validate legal and business documentation easily  ",
        icon: "fa fa-hourglass-start",
        iconName: "organize_paperwork",
      },
      {
        label: "Simplify accounting processes ",
        content:
          "Maintain a transparent record of all transactions to help drive your process-oriented decisions  ",
        icon: "fa fa-hourglass-start",
        iconName: "simplify_accounting_processes",
      },
      {
        label: "Record & process company data",
        content:
          "Manage company data with in-built integrations to smoothen out your invoice and payroll processes  ",
        icon: "fa fa-hourglass-start",
        iconName: "record_process_company_data",
      },
      {
        label: "Automate employee processes",
        content:
          "Identify, enroll, and create employee profiles with payroll details. Boost sustainability with a virtual dashboard of dynamic employee data ",
        icon: "fa fa-hourglass-start",
        iconName: "automate_employee_processes",
      },
    ],
  };
  bannerDetails: any = {
    content:
      "Organize and define your unique payroll, invoice, and accounting processes with our AI-driven solutions ",
    HeadLine: "Operate Company Processes With Minimal Intervention ",
    img: "assets/images/workdesk.jpg",
  };

  subBannerList: any[] = [
    {
      id: "employee_pay_details",
      imgType: "right",
      content:
        "Enroll and manage advances, deductions, expenses, pay rates, and other defined employee pay experiences with HRX. Automate debit and credit payments, maintain a comprehensive record of employee compensations, and process paystubs effortlessly.",
      headLineTag: "Employee Pay Details",
      HeadLine: "Lifecycle Employee Payroll ",
      img: "assets/images/hiring2.png",
      list: [
        "Maintain virtual records of employee pay details with AI-driven integrations ",
        "Enroll and process employee data with comprehensive data segments ",
        "Process salaries, payments, compensations, and other benefits effortlessly ",
        "Automate payroll processes, maintain tax-compliant records, and do more, faster  ",
      ],
    },
    {
      id: "invoices",
      imgType: "left",
      content:
        "Maintaining a clear record of all internal and external transactions is no longer a hassle. With HRX’s smart invoice management, you enroll, record, process, and define payments due to and from external parties easily. Onboard your customers or consultants, furnish the tax-sensitized details, and process the invoices prior to approvals. ",
      headLineTag: "Invoices",
      HeadLine: "Smart Invoice Management ",
      img: "assets/images/hiring2.png",
      list: [
        "View and modify a comprehensive record of all accounts receivables and accounts payable with dynamic accounting dashboards ",
        "Pre-define your payment cycles so you never miss a payment due",
        "Maintain tax complaint records by obtaining the tax-sensitized details from vendors ",
        "Accelerate accuracy with transparent records",
      ],
    },
    {
      id: "digital_paper_work",
      imgType: "right",
      content:
        "Be it a new recruit or onboarding a new vendor, it is essential for businesses to maintain a record of all activities from start to exit. Do this with HRX’s digital paperwork manager, which allows you to upload, modify, and view the relevant paperwork. Letter of appointment, project instructions, SLAs, work permits, visa paperwork, and any other document that your organization might need can be created and stored here. ",
      headLineTag: null,
      HeadLine: "Organize Digital Paperwork ",
      img: "assets/images/hiring2.png",
      list: [
        "A virtual record of all the relevant paperwork pertaining to specific projects and profiles ",
        "Accessibility enhancements to drive privacy and data confidentiality  ",
        "Establish better communication within your ecosystem with documented thoughts, ideas, and instructions",
        "Obtain, record, identify, edit, and delete the documents per your workplace experiences ",
      ],
    },
  ];
  subBannerList2: any[] = [
    {
      id: "",
      imgType: "left",
      content:
        "HRX is the complete workspace management platform designed to meet the people, business, and productivity requirements of every entity. The perfect human management infrastructure, HRX helps you define, organize, maintain, scale, and drive performance and growth to all your organizational experiences.  ",
      headLineTag: null,
      HeadLine:
        "HRX - The Only Workspace Management Solution Your Modern Ecosystem Needs",
      img: "assets/images/hiring2.png",
      list: [],
    },
    {
      id: "",
      imgType: "right",
      content:
        "Most ecosystems base their business operations on their payroll experiences. However, with HRX, you take away the hold of payroll on every other operation and make it an independent component that drives itself with minimal intervention from your teams. ",
      headLineTag: null,
      HeadLine: "Defined Payroll Experiences Means Less To Worry ",
      img: "assets/images/hiring2.png",
      list: [
        "Create and define your payroll cycles and accounting processes ",
        "Create and define your payroll cycles and accounting processes ",
        "Boost accuracy and accelerate transparency with defined data",
        "Have better control over your payment-related operations ",
        "Give definition to your ecosystem with an organized accounting suite ",
      ],
    },
    {
      id: "",
      imgType: "left",
      content:
        "Improve accounting processes, monitor progress, measure growth, and derive consistent results",
      headLineTag: null,
      HeadLine: "Enable Auto-Productive Payroll Experiences With HRX ",
      img: "assets/images/hiring2.png",
      list: [],
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
