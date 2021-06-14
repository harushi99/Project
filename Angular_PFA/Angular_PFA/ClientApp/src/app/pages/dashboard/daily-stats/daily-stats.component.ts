import { Component, OnInit, ViewChild } from '@angular/core';


import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke
} from 'ng-apexcharts';
import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutService } from 'src/app/_metronic/core';
import { LogModel } from '../models/log.model';
import { LogsService } from '../services/logs.service';
import { DatePipe } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};
@Component({
  selector: 'app-daily-stats',
  templateUrl: './daily-stats.component.html',
  styleUrls: ['./daily-stats.component.scss']
})
export class DailyStatsComponent implements OnInit {

  fontFamily = '';
  colorsGrayGray500 = '';
  colorsGrayGray200 = '';
  colorsGrayGray300 = '';
  colorsThemeBaseDanger = '';
  colorsThemeBasePrimary = '';
  colorsThemeLightPrimary = '';
  colorsThemeBaseSuccess = '';
  colorsThemeLightSuccess = '';
  logsListSubject: BehaviorSubject<LogModel[]> = new BehaviorSubject<LogModel[]>([]);
  logs: LogModel[];
  currentDate: Date;
  seventhDate: string;
  firstDate: string;
  secondDate: string;
  thirdDate: string;
  fourthDate: string;
  fifthDate: string;
  sixthDate: string;
  createdEvents = {};
  deletedEvents = {};
  validatedEvents = {};
  rejectedEvents = {};
  modifiedEvents = {};
  public chartOptionsSubject: BehaviorSubject<any> = new BehaviorSubject<any>({ });
  chartOptions: Observable<any> = this.chartOptionsSubject.asObservable();
  TotalActions = 0;

  constructor(
    private layout: LayoutService,
    private logService: LogsService,
    private datepipe: DatePipe
    ) {
    this.fontFamily = this.layout.getProp('js.fontFamily');
    this.colorsGrayGray500 = this.layout.getProp('js.colors.gray.gray500');
    this.colorsGrayGray200 = this.layout.getProp('js.colors.gray.gray200');
    this.colorsGrayGray300 = this.layout.getProp('js.colors.gray.gray300');
    this.colorsThemeBaseDanger = this.layout.getProp(
      'js.colors.theme.base.danger'
    );
    this.colorsThemeBasePrimary = this.layout.getProp(
      'js.colors.theme.base.primary'
    );
    this.colorsThemeLightPrimary = this.layout.getProp(
      'js.colors.theme.light.primary'
    );
    this.colorsThemeBaseSuccess = this.layout.getProp(
      'js.colors.theme.base.success'
    );
    this.colorsThemeLightSuccess = this.layout.getProp(
      'js.colors.theme.light.success'
    );

    this.currentDate = new Date();
    this.seventhDate = this.datepipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.sixthDate = this.datepipe.transform(this.currentDate.setDate(this.currentDate.getDate() - 1), 'yyyy-MM-dd');
    this.fifthDate = this.datepipe.transform(this.currentDate.setDate(this.currentDate.getDate() - 1), 'yyyy-MM-dd');
    this.fourthDate = this.datepipe.transform(this.currentDate.setDate(this.currentDate.getDate() - 1), 'yyyy-MM-dd');
    this.thirdDate = this.datepipe.transform(this.currentDate.setDate(this.currentDate.getDate() - 1), 'yyyy-MM-dd');
    this.secondDate = this.datepipe.transform(this.currentDate.setDate(this.currentDate.getDate() - 1), 'yyyy-MM-dd');
    this.firstDate = this.datepipe.transform(this.currentDate.setDate(this.currentDate.getDate() - 1), 'yyyy-MM-dd');
    console.log(this.sixthDate);
  }

  ngOnInit(): void {
    this.logService.getLogs().subscribe(res => {
      this.logs = res.data;
      console.log(this.logs);
      const createdLogs = this.logs.filter(el => el.event === 'créée');
      const modifiedLogs = this.logs.filter(el => el.event === 'modifié');
      const validatedLogs = this.logs.filter(el => el.event === 'validé');
      const rejectedLogs = this.logs.filter(el => el.event === 'refusé');
      const deletedLogs = this.logs.filter(el => el.event === 'supprimée');
      console.log(this.createdEvents);
      this.createdEvents = this.getCategorizedAppLogs(createdLogs);

      this.modifiedEvents = this.getCategorizedAppLogs(modifiedLogs);
      this.validatedEvents = this.getCategorizedAppLogs(validatedLogs);
      this.deletedEvents = this.getCategorizedAppLogs(deletedLogs);
      this.rejectedEvents = this.getCategorizedAppLogs(rejectedLogs);
      console.log(this.validatedEvents);
      const chart = this.getChartOptions();
      this.chartOptionsSubject.next(chart);

    });
  }

  getCategorizedAppLogs(EventLog) {
    const tempLogs = {};
    tempLogs[this.seventhDate] = tempLogs[this.firstDate] = tempLogs[this.secondDate] =
    tempLogs[this.thirdDate] = tempLogs[this.fourthDate] = tempLogs[this.fifthDate] = tempLogs[this.sixthDate] = 0;
    EventLog.forEach(el =>  {
      const formatedDate = this.datepipe.transform(Date.parse(el.created_at), 'yyyy-MM-dd');
      if (this.seventhDate === formatedDate) {
        tempLogs[this.seventhDate] += 1;
        this.TotalActions ++;
      }
      else if (this.sixthDate === formatedDate) {
        tempLogs[this.sixthDate] += 1;
        this.TotalActions ++;
      }
      else if (this.fifthDate === formatedDate) {
        tempLogs[this.fifthDate] += 1;
        this.TotalActions ++;
      }
      else if (this.fourthDate === formatedDate) {
        tempLogs[this.fourthDate] += 1;
        this.TotalActions ++;
      }
      else if (this.thirdDate === formatedDate) {
        tempLogs[this.thirdDate] += 1;
        this.TotalActions ++;
      }
      else if (this.secondDate === formatedDate) {
        tempLogs[this.secondDate] += 1;
        this.TotalActions ++;
      }
      else if (this.firstDate === formatedDate) {
        tempLogs[this.firstDate] += 1;
        this.TotalActions ++;
      }
    });
    return tempLogs;
  }

  getChartOptions() {
    return {
      series: [
        {
          name: 'Created Apps',
          data: Object.values(this.createdEvents)
        },
        {
          name: 'Validated Apps',
          data: Object.values(this.validatedEvents),
        },
        {
          name: 'Deleted Apps',
          data: Object.values(this.deletedEvents),
        },
        {
          name: 'Rejected Apps',
          data: Object.values(this.rejectedEvents),
        },
        {
          name: 'Modified Apps',
          data: Object.values(this.modifiedEvents),
        },
      ],
      chart: {
        type: 'area',
        height: 150,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {},
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
      },
      xaxis: {
        categories: [
          this.datepipe.transform(Date.parse(this.firstDate), 'yyyy-MM-dd'),
          this.datepipe.transform(Date.parse(this.secondDate), 'yyyy-MM-dd'),
          this.datepipe.transform(Date.parse(this.thirdDate), 'yyyy-MM-dd'),
          this.datepipe.transform(Date.parse(this.fourthDate), 'yyyy-MM-dd'),
          this.datepipe.transform(Date.parse(this.fifthDate), 'yyyy-MM-dd'),
          this.datepipe.transform(Date.parse(this.sixthDate), 'yyyy-MM-dd'),
          this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
        ],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
        crosshairs: {
          show: false,
          position: 'front',
        },
        tooltip: {
          enabled: true,
          formatter: undefined,
          offsetY: 0,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
      },
      options: {
        colors: ['#008000', '#FF0000']
      }
,
      tooltip: {
        style: {
          fontSize: '12px',
          fontFamily: this.fontFamily,
        },
        y: {
          // tslint:disable-next-line
          formatter: function (val) {
            return val + ' Applications';
          },
        },
      },
    };
  }

}
