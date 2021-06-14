import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardsModule } from '../../_metronic/partials/content/dashboards/dashboards.module';
import { InlineSVGModule } from "ng-inline-svg";
import { LogsComponent } from './logs/logs.component';
import { StatsComponent } from './stats/stats.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { DailyStatsComponent } from './daily-stats/daily-stats.component';
import {TranslationModule} from "../../modules/i18n/translation.module";

@NgModule({
	providers: [DatePipe],
	declarations: [
		DashboardComponent,
		LogsComponent,
		StatsComponent,
		DailyStatsComponent
	],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: DashboardComponent,
            },
        ]),
        DashboardsModule,
        InlineSVGModule,
        NgApexchartsModule,
        TranslationModule
    ],
})
export class DashboardModule { }
