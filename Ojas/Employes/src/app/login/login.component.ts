import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onsignUp() {
    document.getElementById("container")?.classList.add("right-panel-active");
    
  }
  onsignIn() {
    document
      .getElementById("container")
      ?.classList.remove("right-panel-active");
   
  }

}
