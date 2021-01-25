import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'api-tester';
  data: any;
  version: string = '0.0.1';

  ngOnInit() {
    this.version = this.getVersion();
  }

  returnRequest(event: any) {
    this.data = event;
  }

  private getVersion() {
    try {
      // const version = require('../../../../package.json').version;
      return `${this.version}`;
    } catch (err) {
      console.error('version', err);
      return this.version;
    }

  }

  
}
