import { NgxDropzoneModule } from 'ngx-dropzone';
import { AlertModule } from './../../alert/alert.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {RouterModule} from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import { StudentsListComponent } from './students-list/students-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InlineSVGModule} from 'ng-inline-svg';
import {CRUDTableModule} from '../../../_metronic/shared/crud-table';
import {MatSelectModule} from '@angular/material/select';
import { DeleteStudentComponent } from './students-list/delete-student/delete-student.component';
import {TranslationModule} from "../../../modules/i18n/translation.module";


@NgModule({
  declarations: [StudentsListComponent, DeleteStudentComponent],
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        RouterModule.forChild([
            {
                path: '',
                component: StudentsListComponent,
            },
        ]),
        MatSortModule,
        MatCardModule,
        ReactiveFormsModule,
        InlineSVGModule,
        CRUDTableModule,
        MatSelectModule,
        AlertModule,
        NgxDropzoneModule,
        TranslationModule
    ]
})
export class StudentsModule { }
