import { RoleModel } from './../../model/roles.model';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { PermissionModel } from '../../model/permission.model';
import { RolesService } from '../../services/roles.service';
import { PermissionsService } from '../../services/permissions.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit, OnDestroy {
  isLoading$;
  @Input() id: number;
  role: RoleModel;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  loading:boolean = false;
  dropdownList : PermissionModel[];
  selectedItems : PermissionModel[];
  dropdownSettings : IDropdownSettings = {};
  permissions:string[]=[];
  data: FormData;
  constructor(
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.rolesService.isLoading$;
    this.loading=true;
    this.loadRole();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.loading= true;
  }

  loadRole() {
    this.permissionsService.getPermissions().pipe(first())
      .subscribe(
          (response) => {
            this.dropdownList=response;
          },
          error => {
          }
      );
      const sb = this.rolesService.getRoleById(this.id).pipe(
        first()
      ).subscribe((response) => {
        this.role = response.role;
        this.selectedItems = response.permissions;
 
      },
       (error) => {
        this.modal.dismiss(error);
        return of();
      }
      );
      this.subscriptions.push(sb);
    
  }

  save() {
    this.prepareRole();
    this.edit();

  }

  edit() {
    const sbUpdate = this.rolesService.edit(this.role.id,this.data).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.role);
      }),
    ).subscribe(res => console.log("resultat ",res));
    this.subscriptions.push(sbUpdate);
  }


  private prepareRole() {
    this.data = new FormData();
    for(var i=0;i<this.selectedItems.length;i++){
      var name: string = "permissions["+i+"]";
      this.data.append(name,this.selectedItems[i].name);
    }
  this.data.append("_method","put");
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }


  onItemSelect(item: any) {
    //console.log(item);
  }
  onSelectAll(items: any) {
    //console.log(items);
  }
}