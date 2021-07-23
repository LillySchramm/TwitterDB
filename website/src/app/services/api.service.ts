import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Statistics } from '../common/statsType';
import { DataTopLists, RespDataTopList } from '../common/topType';
import { Recommendation, RespRecommendation } from '../common/recommendationType';
import { Timeline, TimelineDisplayItem, TimelineItem } from '../common/timelineType';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  private API_BASE = "https://api.twitterdb.com/"
  private static SearchCache : Map<String, RespRecommendation> = new Map<String, RespRecommendation>()
  private static TimelineCache : Map<String, TimelineDisplayItem[]> = new Map<String, TimelineDisplayItem[]>();

  private static statistic : Statistics = {
    count_tags: 0,
    count_hashtags: 0,
    count_retweets: 0,
    count_tweets: 0,
    unique_hashtags: 0,
    unique_tags: 0
  }

  private static TopLists : DataTopLists = {
    timestamp:0,
    hashtags:[],
    tags:[]
  }

  constructor(private http: HttpClient) { }

  public getStatistics() : Observable<Statistics>{
    return new Observable(subscriber => {
      if(APIService.statistic.count_tags == 0){
        this.apiGetStatistics().subscribe(x => {
          APIService.statistic = x

          subscriber.next(x)
          subscriber.complete()
        })    
        
      }else{
        subscriber.next(APIService.statistic)
        subscriber.complete()
      }
    })
  }

  private apiGetStatistics() : Observable<Statistics> {
    return this.http.get<Statistics>(this.API_BASE + "stats")   
  }

  public getTopLists() : Observable<DataTopLists>{
    return new Observable(subscriber => {
      if(APIService.statistic.count_tags == 0){
        this.apiGetTopLists().subscribe(x => {
          APIService.TopLists = x.data

          subscriber.next(APIService.TopLists)
          subscriber.complete()
        })    
        
      }else{
        subscriber.next(APIService.TopLists)
        subscriber.complete()
      }
    })
  }

  private apiGetTopLists() : Observable<RespDataTopList> {
    return this.http.get<RespDataTopList>(this.API_BASE + "top")   
  }

  public getSearch(search : String) : Observable<RespRecommendation>{
    return new Observable(subscriber => {
      if(!APIService.SearchCache.has(search)){
        
        let type = "undef"
        if(search.startsWith("@")) type = "tag"
        else if (search.startsWith("#")) type = "hashtag"

        this.apiGetSearch(type, search.replace("@", "").replace("#", "")).subscribe(x => {
          APIService.SearchCache.set(search, x)

          subscriber.next(x)
          subscriber.complete()
        })    
        
      }else{
        subscriber.next(APIService.SearchCache.get(search))
        subscriber.complete()
      }
    })
  }

  private apiGetSearch(type : string, search : string) : Observable<RespRecommendation> {
    return this.http.get<RespRecommendation>(this.API_BASE + "search/" + type + "/" + search)   
  }

  public getTimeline(type : string, name : string) : Observable<TimelineDisplayItem[]> {
    return new Observable(subscriber => {
      if(!APIService.TimelineCache.has(type + name)){       
        this.apiGetItem(type, name).subscribe(x => {

          let items : TimelineItem[] = x.timeline
          
          let timeline : TimelineDisplayItem[] = []
          let current_time = this.getCurrentDate() - 3600

          items.forEach((v) =>{
            let delta = current_time - v.timestamp
            
            for(let j = 0; j < (delta / 3600) - 1; j++){
              timeline.push({
                count: 0,
                timestamp: new Date((current_time - 3600 * j) * 1000)
              })
            }

            timeline.push({
              count: v.count,
              timestamp: new Date((current_time - delta) * 1000)
            })

            current_time -= delta;
          })          

          timeline = timeline.reverse()

          APIService.TimelineCache.set(type + name, timeline)

          subscriber.next(timeline)
          subscriber.complete()
        })    
        
      }else{
        subscriber.next(APIService.TimelineCache.get(type + name))
        subscriber.complete()
      }
    })
  }

  private apiGetItem(type : string, name : string) :  Observable<Timeline>{    
    return this.http.get<Timeline>(this.API_BASE + "get/" + type + "/" + name)   
  }

  public getCurrentDate() : number {
    let date = new Date()

    date.setMilliseconds(0)
    date.setSeconds(0)
    date.setMinutes(0)

    return Math.floor(date.getTime()/1000)
  }
}
