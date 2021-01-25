import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'api-tester';
  data: any;

  returnRequest(event: any) {
    this.data = event;
  }
}
