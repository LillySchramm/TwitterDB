import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  autocomplete_items : Array<String> = []
  searchbar_active = true;

  constructor() { }

  ngOnInit(): void {
  }

}
