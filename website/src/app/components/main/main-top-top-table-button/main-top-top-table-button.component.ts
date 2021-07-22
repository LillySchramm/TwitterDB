import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-main-top-top-table-button',
  templateUrl: './main-top-top-table-button.component.html',
  styleUrls: ['./main-top-top-table-button.component.css']
})
export class MainTopTopTableButtonComponent implements OnInit {

  @Input() content : string = "Default Text"
  @Input() text_size : string = "5vh"

  @Output() clickEvent = new EventEmitter<any>()

  constructor() { }

  ngOnInit(): void {
  }

  onClick() : void {
    this.clickEvent.emit()     
  } 

}
