import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RespRecommendation } from 'src/app/common/recommendationType';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  private wasInside = false;
  private changed = false;

  autocomplete_items : RespRecommendation = []
  searchbar_active = true;
  search : string = ""

  constructor(private api: APIService, private router: Router	) { }

  ngOnInit(): void {
  }  

  redirect(name : string){
    const type = name.startsWith("@") ? "tag" : "hashtag"
    
    this.search = name
    this.changed = true;
    this.router.navigate(["details",type,name.replace("#","").replace("@", "")])
  }

  onSearchChange() : void {

    var _search = this.search.replace(/ /g,'');

    if(_search.length >= 1 && _search.length <= 30){
      this.api.getSearch(_search).subscribe((ret) => {
        this.autocomplete_items = ret
      })
    }else{
      this.autocomplete_items = []
    }       
  }

  onLostFocus() : void {
    this.autocomplete_items = []
  }

  onGainFocus() : void {
    this.onSearchChange()
  }

  @HostListener('click')
  clickInside() {
    if(!this.changed){
      this.onGainFocus()
      this.wasInside = true;
    }else{
      this.wasInside = false;
      this.changed = false;
    }

  }
  
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.onLostFocus()
    }
    this.wasInside = false;
  }

}
