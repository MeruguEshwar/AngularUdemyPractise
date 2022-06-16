import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-inner-menu",
  templateUrl: "./inner-menu.component.html",
  styleUrls: ["./inner-menu.component.css"],
})
export class InnerMenuComponent implements OnInit {
  @Input() menuDetails: any;
  constructor() {}

  ngOnInit(): void {}
}
