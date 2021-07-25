import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartView, EChartsOption } from 'echarts';
import { Recommendation } from 'src/app/common/recommendationType';
import { TimelineDisplayItem } from 'src/app/common/timelineType';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})

export class DetailsComponent implements OnInit {
  
  type : string = ""
  name : string = ""  

  error : boolean = false;
  error_recommendations : Array<Recommendation> = []
  error_answer = ["It surely could. Reasons why it doesn't show up in the database include:",
      '- The tag/hashtag is too young. Because of the way our backend works, data will only update at every full hour.',
      '- The tag/hashtag wasn\'t used much. To avoid exessive clutter in our database, and because of the way that the Twitter API works, we are only storing tags/hashtags that ocurred multiple times within one hour. Statisticly speaking, a tag/hashtag will show up if used around 150 times in a short timespan.']


  data_x : Array<string> = []
  data_y : Array<number> = []
  data_y_avg_30 : Array<number> = []
  data_y_avg_1 : Array<number> = []

  echartsInstance : any = null;
  mergeOptions = {};

  items : TimelineDisplayItem[] = []

  options : EChartsOption = {
    feature: {
      dataZoom: {
          yAxisIndex: 'none',
      },
      restore: {},
      saveAsImage: {}
    },
    legend:{
      textStyle:{
        color: "#fff",
        fontSize: "30"
      },  
      padding:20,
      selected: {
        '30 Day Avg':false,
        '1 Day Avg':false
      }
    }
    ,
    tooltip : {
      show: true,
      trigger: "axis",
      backgroundColor:"#141414",
      borderColor: "#1da1f2",
      textStyle: {
        color: "#fff",
        fontFamily: "Poppins"
      }      
    },xAxis: {
      type: 'category',
      data: [],
      boundaryGap: false
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [],
        type: 'line',
        color: "#1da1f2",
        name: "Count",
        symbol: "circle"
      },
      {
        data: [],
        type: 'line',
        color: "#7A306C",
        name:"30 Day Avg",
        symbol: "circle"
      },
      {
        data: [],
        type: 'line',
        color: "#51CB20",
        name:"1 Day Avg",
        symbol: "circle",
        silent: true
      }     
    ],    
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: 100,         
    }, {
      start: 0,
      end: 100,
    }]   
  };

  constructor(private route: ActivatedRoute, private router:Router, private api: APIService) {
    route.url.subscribe(() => {
      this.load()
    })
  }

  ngOnInit(): void {
    if(this.type != "tag" && this.type != "hashtag") this.router.navigate([""])
  }

  private load() : void {
    this.name = this.route.snapshot.paramMap.get("name")!
    this.type = this.route.snapshot.paramMap.get("type")!

    this.mergeOptions = {
      xAxis: {
        type: 'category',
        data: null,
      },
      series: [
        {
          data: null,
          type: 'line',
        },
      ]
    }

    this.api.getTimeline(this.type, this.name).subscribe((ret) => {

      // If no data was found show error page         
      if(ret.length == 0){
        this.error = true
        this.error_recommendations = []
        this.api.getCloseSearch((this.type == 'tag' ? '@'  : '#') + this.name).subscribe((r) => {
          this.error_recommendations = r;          
        })
      } 
      else this.error = false

      var dayNames : Array<string> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      this.items = ret;      

      this.data_y = []
      this.data_y_avg_30 = []
      this.data_y_avg_1 = []
      this.data_x = []     

      ret.forEach((i) => {
        this.data_x.push(dayNames[i.timestamp.getUTCDay()] + " " + i.timestamp.toLocaleDateString() + " " + i.timestamp.toLocaleTimeString().replace(/=*:.*/, "") + "h")
        this.data_y.push(i.count)        
        this.data_y_avg_30.push(i.avg30)
        this.data_y_avg_1.push(i.avg1)
      })     

      // This sets the inital dataZoom. Intended behavior is that it always defaults to showing the last 30 days, or everything if smaller.
      let start = ((this.data_x.length - 24 * 30) / this.data_x.length) * 100
      // From a technical point of view this is unnessesary because ECharts will interprete negative values as 0. But I have a bad feeling that this would break something at some 
      // point in time.  
      start = Math.max(0, start)      

      this.mergeOptions = {
        xAxis: {
          type: 'category',
          data: this.data_x,
        },
        series: [
          {
            data: this.data_y,
            type: 'line',
          },
          {
            data: this.data_y_avg_30,
            type: 'line',
          },
          {
            data: this.data_y_avg_1,
            type: 'line',
          }
        ],
        dataZoom: [{
          type: 'inside',
          start: start,
          end: 100,          
        }, {
          start: start,
          end: 100
        }]
      }
    })    
  }

  onChartInit(ec : any) {    
    this.echartsInstance = ec;
  }

  onSubjectClicked() : void {
    window.open("https://twitter.com/search?q=" + (this.type == 'tag' ? '@'  : '%23') + this.name, '_blank')
  }

  error_rec_click(name : string) : void {
    const type = name.startsWith("@") ? "tag" : "hashtag"

    this.router.navigate(["details", type, name.replace("#", "").replace("@", "")])
  }

}
