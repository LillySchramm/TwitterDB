import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  redirectToRoute(path : Array<string>) : void {
    this.router.navigate(path)
  }

  openInNewTab(url : string){
    window.open(url, '_blank')
  }

}
