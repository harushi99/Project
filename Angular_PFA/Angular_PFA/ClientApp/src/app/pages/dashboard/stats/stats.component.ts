import { Component, OnInit, ViewChild } from '@angular/core';

import { ChartComponent } from "ng-apexcharts";
import { StatsService } from '../services/stats.service';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { statModel } from '../models/stat.model';
import { BehaviorSubject, Observable } from 'rxjs';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptionsSubject: BehaviorSubject<any> = new BehaviorSubject<any>({ });
  chartOptions: Observable<any> = this.chartOptionsSubject.asObservable();
  
  stats: statModel = new statModel();
  constructor(
    private statsService: StatsService
  ) {
      }

  ngOnInit() {
    this.statsService.getStats().subscribe(res =>  {
      //this.chartConfig();
      if(res) {
        this.stats = res;
        console.log(this.stats)
        let chartOptions = {
          series: [this.stats.created_apps, this.stats.validated_apps, this.stats.delted_apps, this.stats.refused_apps, this.stats.modified_apps],
          chart: {
            width: 380,
            type: "pie"
          },
          labels: ["Created Apps", "Validated Apps", "Deleted Apps", "Rejected Apps", "Modified Apps"],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };
        this.chartOptionsSubject.next(chartOptions)
      }
      
    })
  }

}
