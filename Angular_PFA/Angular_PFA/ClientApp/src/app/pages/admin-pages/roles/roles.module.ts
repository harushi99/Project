import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { WidgetsModule } from './../../../_metronic/partials/content/widgets/widgets.module';
import { DropdownMenusModule } from './../../../_metronic/partials/content/dropdown-menus/dropdown-menus.module';
import { CRUDTableModule } from './../../../_metronic/shared/crud-table/crud-table.module';
import { RolesListComponent } from './roles-list/roles-list.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteRoleComponent } from './roles-list/delete-role/delete-role.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {InlineSVGModule} from 'ng-inline-svg';
import {NgbDatepickerModule, NgbDropdownModule, NgbModalModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from "@angular/material/icon";
import { CreateRoleComponent } from './roles-list/create-role/create-role.component';
import { EditRoleComponent } from './roles-list/edit-role/edit-role.component';
import { DeleteRolesComponent } from './roles-list/delete-roles/delete-roles.component';
import {TranslationModule} from "../../../modules/i18n/translation.module";


@NgModule({
  declarations: [RolesListComponent, DeleteRoleComponent, CreateRoleComponent, EditRoleComponent, DeleteRolesComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: RolesListComponent,
            },
        ]),
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
        MatChipsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,
        MatChipsModule,
        MatIconModule,
        NgMultiSelectDropDownModule.forRoot(),
        TranslationModule
    ],
  exports :[],
})
export class RolesModule { }
