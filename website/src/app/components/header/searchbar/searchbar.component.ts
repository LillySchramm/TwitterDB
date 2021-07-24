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

  autocomplete_items: RespRecommendation = []
  searchbar_active = false;
  search: string = ""
  error = ""
  cur_selected: number = -1;

  constructor(private api: APIService, private router: Router) { }

  ngOnInit(): void {
  }

  redirect(name: string) {
    const type = name.startsWith("@") ? "tag" : "hashtag"

    this.search = name
    this.changed = true;
    this.router.navigate(["details", type, name.replace("#", "").replace("@", "")])
  }

  onSearchChange(): void {
    var _search = this.search.replace(/ /g, '');
    this.error = ""
    this.remove_highlight()

    if (_search.length >= 1 && _search.length <= 30) {
      this.api.getSearch(_search).subscribe((ret) => {
        this.autocomplete_items = ret
        this.searchbar_active = true;
      })
    } else {
      this.autocomplete_items = []
    }
  }

  onLostFocus(): void {
    this.searchbar_active = false;
    this.autocomplete_items = []
    this.error = ""
  }

  onGainFocus(): void {
    this.searchbar_active = true;
    this.onSearchChange()
  }

  @HostListener('click')
  clickInside() {
    if (!this.changed) {
      this.onGainFocus()
      this.wasInside = true;
    } else {
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

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.searchbar_active) {
      if (event.key == "Enter") {
        this.handleSearchCommit()
      }
    };
  }

  handleSearchCommit(): void {
    var _search = this.search.replace(/ /g, '');

    if (_search.startsWith("@") || _search.startsWith("#")) {
      if (_search.length >= 2) {
        this.redirect(_search)
        this.searchbar_active = false;
        this.remove_highlight()
      } else {
        this.error = "The search must be at least 2 characters."
      }
    } else {
      this.error = "The search must start with '#' or '@'"
    }

    console.log(this.error);
    
  }


  // Move searchbar-list via keys logic

  move_highlight(n: number): void {
    this.cur_selected += n;
    this.cur_selected = Math.max(-1, this.cur_selected)
    this.cur_selected = Math.min(this.autocomplete_items.length - 1, this.cur_selected)

    if (this.cur_selected != -1) {
      this.search = this.autocomplete_items[this.cur_selected].name;
    }
  }

  set_highlight(n: number): void {
    this.cur_selected = n;
  }

  remove_highlight(): void {
    this.cur_selected = -1
  }

}
