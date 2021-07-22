import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Statistics } from '../common/statsType';
import { DataTopLists, RespDataTopList } from '../common/topType';
@Injectable({
  providedIn: 'root'
})
export class APIService {

  private API_BASE = "https://api.twitterdb.com/"

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
}
