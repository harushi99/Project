import { NgxDropzoneModule } from 'ngx-dropzone';
import { AlertModule } from './../alert/alert.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StudentsModule} from './students/students.module';
import {AdminPagesRoutingModule} from './admin-pages-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StudentsModule,
    AdminPagesRoutingModule,
    FormsModule, ReactiveFormsModule,
    AlertModule,
    NgxDropzoneModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class AdminPagesModule { }
