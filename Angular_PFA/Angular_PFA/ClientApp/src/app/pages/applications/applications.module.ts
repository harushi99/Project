import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {InlineSVGModule} from 'ng-inline-svg';
import {NgbDatepickerModule, NgbDropdownModule, NgbModalModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {CRUDTableModule} from '../../_metronic/shared/crud-table';
import {WidgetsModule} from '../../_metronic/partials/content/widgets/widgets.module';
import {DropdownMenusModule} from '../../_metronic/partials/content/dropdown-menus/dropdown-menus.module';
import { ApplicationsComponent } from './applications.component';
import { ApplicationsRoutingModule } from './applications-routing.module';
import { ApplicationsListComponent } from './applications-list/applications-list.component';
import { UpdateApplicationsStatusModalComponent } from './applications-list/update-applications-status-modal/update-applications-status-modal.component';
import { DeleteApplicationModalComponent } from './applications-list/delete-application-modal/delete-application-modal.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { ViewApplicationModalComponent } from './applications-list/view-application-modal/view-application-modal.component';
import {TranslationModule} from "../../modules/i18n/translation.module";


@NgModule({
  declarations: [
    ApplicationsComponent,
    ApplicationsListComponent,
    UpdateApplicationsStatusModalComponent,
    DeleteApplicationModalComponent,
    ViewApplicationModalComponent,
  ],
    imports: [
        CommonModule,
        HttpClientModule,
        CRUDTableModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        ApplicationsRoutingModule,
        DropdownMenusModule,
        NgbDropdownModule,
        NgbTooltipModule,
        WidgetsModule,
        NgbModalModule,
        NgbDatepickerModule,
        MatFormFieldModule,
        MatChipsModule,
        MatIconModule,
        TranslationModule
    ],
    providers: [DatePipe]
})
export class ApplicationsModule {}
