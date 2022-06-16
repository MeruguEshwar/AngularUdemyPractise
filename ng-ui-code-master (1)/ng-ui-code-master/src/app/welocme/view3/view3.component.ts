import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-view3",
  templateUrl: "./view3.component.html",
  styleUrls: ["./view3.component.css"],
})
export class View3Component implements OnInit {
  @Input() list: any;
  constructor() {}

  ngOnInit(): void {}
}
