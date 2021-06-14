import { RoleModel } from './../../model/roles.model';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Role } from 'src/app/modules/auth/_models/role.model';
import { PermissionModel } from '../../model/permission.model';
import { RolesService } from '../../services/roles.service';
import { PermissionsService } from '../../services/permissions.service';

const EMPTY_ROLE: RoleModel = {
  id: undefined,
  name: '',
};

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})
export class CreateRoleComponent implements OnInit, OnDestroy {
 // @Input() id: number;
  isLoading$;
  role: RoleModel;
  permissions: PermissionModel[];
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.rolesService.isLoading$;
    this.loadRole();
  }

  loadRole() {
      this.role = EMPTY_ROLE;
      this.loadForm();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [this.role.name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    });
  }

  save() {
    this.prepareRole();
      this.create();
  }

  create() {
    const sbCreate = this.rolesService.createRole(this.role).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.role);
      }),
    ).subscribe((res: Role) => this.role = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareRole() {
    const formData = this.formGroup.value;
    this.role.name= formData.name;

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
}
