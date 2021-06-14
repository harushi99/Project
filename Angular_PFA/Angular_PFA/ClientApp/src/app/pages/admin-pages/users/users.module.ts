import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { WidgetsModule } from './../../../_metronic/partials/content/widgets/widgets.module';
import { NgbTooltipModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './users-list/users-list.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {RouterModule} from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InlineSVGModule} from 'ng-inline-svg';
import {CRUDTableModule} from '../../../_metronic/shared/crud-table';
import { RolesService } from '../roles/services/roles.service';
import { EditRoleUserComponent } from './users-list/edit-role-user/edit-role-user.component';
import { DeleteUserComponent } from './users-list/delete-user/delete-user.component';
import { DropdownMenusModule } from 'src/app/_metronic/partials/content/dropdown-menus/dropdown-menus.module';
import {TranslationModule} from "../../../modules/i18n/translation.module";



@NgModule({
  declarations: [UsersListComponent, DeleteUserComponent, EditRoleUserComponent],
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        RouterModule.forChild([
            {
                path: '',
                component: UsersListComponent,
            },
        ]),
        HttpClientModule,
        CRUDTableModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        DropdownMenusModule,
        NgbTooltipModule,
        WidgetsModule,
        NgbModalModule,
        NgbDatepickerModule,
        MatChipsModule,
        MatButtonModule,
        MatRippleModule,
        MatIconModule,
        NgMultiSelectDropDownModule.forRoot(),
        NgxDropzoneModule,
        TranslationModule
    ],
  providers:[RolesService]

})
export class UsersModule { }
