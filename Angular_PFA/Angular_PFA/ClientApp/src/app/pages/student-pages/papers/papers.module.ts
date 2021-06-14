import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PapersListComponent } from './papers-list/papers-list.component';
import {RouterModule} from '@angular/router';
import {InlineSVGModule} from 'ng-inline-svg';
import { PaperInfoComponent } from './paper-info/paper-info.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AddAplicationModalComponent } from './paper-info/add-aplication-modal/add-aplication-modal.component';
import { DeletePaperModalComponent } from './papers-list/delete-paper-modal/delete-paper-modal.component';
import {NgxDropzoneModule} from "ngx-dropzone";
import {TranslationModule} from "../../../modules/i18n/translation.module";



@NgModule({
  declarations: [PapersListComponent, PaperInfoComponent, AddAplicationModalComponent, DeletePaperModalComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: PapersListComponent,
            },
            {
                path: ':paper-id',
                component: PaperInfoComponent,
            },
        ]),
        InlineSVGModule,
        ReactiveFormsModule,
        FormsModule,
        NgxDropzoneModule,
        TranslationModule
    ]
})
export class PapersModule { }
