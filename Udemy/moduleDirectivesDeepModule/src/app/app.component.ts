import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'moduleDirectivesDeepModule';
  numbers=[1,2,3,4,5];
  onlyodd=false;
  oddnum=[1,3,5];
  evennum=[2,4];
}
