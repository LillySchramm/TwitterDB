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
    tooltip : {
      show: true,
      trigger: "axis"
    },xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [],
        type: 'line',
        color: "#1da1f2"
      },
    ],

    
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
      this.items = ret;      

      this.data_y = []
      this.data_x = []

      ret.forEach((i) => {
        this.data_x.push(i.timestamp.toUTCString())
        this.data_y.push(i.count)        
      })     

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
        ]
      }
    })    
  }

  onChartInit(ec : any) {    
    this.echartsInstance = ec;
  }

}
