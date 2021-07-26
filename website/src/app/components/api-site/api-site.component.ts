import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-api-site',
  templateUrl: './api-site.component.html',
  styleUrls: ['./api-site.component.css']
})
export class ApiSiteComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  exampleRequest(endpoint : string) : void {
    window.open("https://api.twitterdb.com" + endpoint, '_blank')
  }
}
