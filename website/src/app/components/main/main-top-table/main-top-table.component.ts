import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TopList } from 'src/app/common/topType';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-main-top-table',
  templateUrl: './main-top-table.component.html',
  styleUrls: ['./main-top-table.component.css']
})
export class MainTopTableComponent implements OnInit {

  @Input() type : string = "tag";
  @Input() num : number = 10;

  TopList : TopList = []  

  constructor(private api : APIService, private router:Router) {}

  ngOnInit(): void {
    this.api.getTopLists().subscribe((resp) => {
      this.TopList = this.type == "tag" ? resp.tags : resp.hashtags;      
    })    
  }

  showDetails(type : String, name : String) : void{
    this.router.navigate(["details", type, name])
  }
}
