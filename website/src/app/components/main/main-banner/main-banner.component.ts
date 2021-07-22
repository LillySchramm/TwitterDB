import { Component, OnInit } from '@angular/core';
import { Statistics } from 'src/app/common/statsType';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-main-banner',
  templateUrl: './main-banner.component.html',
  styleUrls: ['./main-banner.component.css']
})
export class MainBannerComponent implements OnInit {

  stats : Statistics = {
    count_tags: 0,
    count_hashtags: 0,
    count_retweets: 0,
    count_tweets: 0,
    unique_hashtags: 0,
    unique_tags: 0
  };

  percent_retweets : number = 0;

  avg_tags : string = "0";
  avg_hashtags : string = "0";

  constructor(private api : APIService) {}

  public genTimeDifference() : String{
    let today = new Date()
    let start = new Date(2021,3,11)

    var diff = Math.floor(today.getTime() - start.getTime());

    var day = 1000 * 60 * 60 * 24;

    var days = Math.floor(diff/day);
    var months = Math.floor(days/31);
    var years = Math.floor(months/12);

    months = months - 12 * years
    days = days - 30 * months

    var ret : String = ""

    if(years > 0) ret += years + " year(s) "
    if(months > 0) ret += months  + " month(s) and "
    if(days > 0) ret += days + " day(s) "

    return ret;
  }

  ngOnInit(): void {
    this.api.getStatistics().subscribe((stats) => {
      this.stats = stats      

      this.percent_retweets = Math.round((this.stats.count_retweets / this.stats.count_tweets) * 100)
    
      this.avg_tags = (this.stats.count_tags / (this.stats.count_tweets - this.stats.count_retweets)).toFixed(2)
      this.avg_hashtags = (this.stats.count_hashtags / (this.stats.count_tweets - this.stats.count_retweets)).toFixed(2)

    })
  }

}
