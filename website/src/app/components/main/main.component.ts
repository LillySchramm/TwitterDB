import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  cur_table_items : number = 10

  constructor() { }

  onTopMore() : void{
    this.cur_table_items += 20;
    this.cur_table_items = Math.min(this.cur_table_items, 100)

  }

  ngOnInit(): void {
  }

}
