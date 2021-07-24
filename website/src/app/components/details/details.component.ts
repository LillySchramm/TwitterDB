import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartView, EChartsOption } from 'echarts';
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

  data_x : Array<string> = []
  data_y : Array<number> = []

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
        color: "#1da1f2"
      },
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
      var dayNames : Array<string> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      this.items = ret;      

      this.data_y = []
      this.data_x = []

      ret.forEach((i) => {
        this.data_x.push(dayNames[i.timestamp.getUTCDay()] + " " + i.timestamp.toLocaleDateString() + " " + i.timestamp.toLocaleTimeString().replace(/=*:.*/, "") + "h")
        this.data_y.push(i.count)        
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

}
