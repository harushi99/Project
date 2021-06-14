import { UsersService } from './../../services/users.service';
import { RolesService } from './../../../roles/services/roles.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { UserModel } from '../../model/user.model';
import { RoleModel } from '../../../roles/model/roles.model';

@Component({
  selector: 'app-edit-role-user',
  templateUrl: './edit-role-user.component.html',
  styleUrls: ['./edit-role-user.component.scss']
})
export class EditRoleUserComponent implements OnInit, OnDestroy {
  isLoading$;
  @Input() id: number;
  user: UserModel;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  loading:boolean = false;
  dropdownList : RoleModel[];
  selectedItems : RoleModel[];
  dropdownSettings : IDropdownSettings = {};
  roles:string[]=[];
  data: FormData;
  constructor(
    private rolesService: RolesService,
    private usersService: UsersService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.rolesService.isLoading$;
    this.loading=true;
    this.loadUserRoles();
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

  loadUserRoles() {
    this.rolesService.getRoles().pipe(first())
      .subscribe(
          (response) => {
            this.dropdownList=response;
          },
          error => {
          }
      );
      const sb = this.usersService.getUserById(this.id).pipe(
        first()
      ).subscribe((response) => {
        this.user = response;
        this.selectedItems = this.user.roles;
 
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
    const sbUpdate = this.usersService.editRoles(this.user.id,this.data).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.user);
      }),
    ).subscribe(res => console.log("resultat ",res));
    this.subscriptions.push(sbUpdate);
  }


  private prepareRole() {
    this.data = new FormData();
    for(var i=0;i<this.selectedItems.length;i++){
      var name: string = "roles["+i+"]";
      this.data.append(name,this.selectedItems[i].name);
    }
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