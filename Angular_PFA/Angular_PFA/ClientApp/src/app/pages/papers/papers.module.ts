import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {InlineSVGModule} from 'ng-inline-svg';
import {NgbDatepickerModule, NgbDropdownModule, NgbModalModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {CRUDTableModule} from '../../_metronic/shared/crud-table';
import {WidgetsModule} from '../../_metronic/partials/content/widgets/widgets.module';
import {DropdownMenusModule} from '../../_metronic/partials/content/dropdown-menus/dropdown-menus.module';
import { PapersComponent } from './papers.component';
import { PapersRoutingModule } from './papers.routing.module';
import { PapersListComponent } from './papers-list/papers-list-component';
import { EditPaperModalComponent } from './papers-list/edit-paper-modal/edit-paper-modal.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from "@angular/material/icon";
import {NgxDropzoneModule} from "ngx-dropzone";
import {TranslationModule} from "../../modules/i18n/translation.module";


@NgModule({
  declarations: [
    PapersComponent,
    PapersListComponent,
    EditPaperModalComponent
  ],
    imports: [
        CommonModule,
        HttpClientModule,
        CRUDTableModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        DropdownMenusModule,
        NgbDropdownModule,
        NgbTooltipModule,
        WidgetsModule,
        NgbModalModule,
        NgbDatepickerModule,
        PapersRoutingModule,
        MatChipsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,
        MatChipsModule,
        MatIconModule,
        NgxDropzoneModule,
        TranslationModule
    ]
})
export class PapersModule {}
