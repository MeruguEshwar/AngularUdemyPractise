import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-frt-app';

  showSecret = false;
  log = [1,2,3,4,5,6,7];

  onToggleDetails(){
    this.showSecret=!this.showSecret;
    this.log.push(this.log.length + 1);
  }
}
