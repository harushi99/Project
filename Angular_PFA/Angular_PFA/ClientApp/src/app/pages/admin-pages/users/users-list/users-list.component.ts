import { EditRoleUserComponent } from './edit-role-user/edit-role-user.component';
import { RolesService } from './../../roles/services/roles.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators,FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { DeleteCustomersModalComponent } from 'src/app/modules/e-commerce/customers/components/delete-customers-modal/delete-customers-modal.component';
import { FetchCustomersModalComponent } from 'src/app/modules/e-commerce/customers/components/fetch-customers-modal/fetch-customers-modal.component';
import { UpdateCustomersStatusModalComponent } from 'src/app/modules/e-commerce/customers/components/update-customers-status-modal/update-customers-status-modal.component';
import { Subscription } from 'rxjs';
import {
  GroupingState,
  ICreateAction, IDeleteAction,
  IDeleteSelectedAction, IEditAction,
  IFetchSelectedAction,
  IFilterView,
  IGroupingView, ISearchView, ISortView, IUpdateStatusForSelectedAction,
  PaginatorState,
  SortState
} from 'src/app/_metronic/shared/crud-table';

import { UsersService } from './../services/users.service';
import { ROLESEnum } from 'src/app/modules/auth/_models/ROLES.enum';
import { DeleteUserComponent } from './delete-user/delete-user.component';

class Filter {
  role: string;
}

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit,
OnDestroy,
ICreateAction,
IEditAction,
IDeleteAction,
IDeleteSelectedAction,
IFetchSelectedAction,
IUpdateStatusForSelectedAction,
ISortView,
IFilterView,
IGroupingView,
ISearchView,
IFilterView {
paginator: PaginatorState;
sorting: SortState;
grouping: GroupingState;
isLoading: boolean;
filterGroup: FormGroup;
searchGroup: FormGroup;
private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

addLoading = false;

createUserFormGroup: FormGroup;
updateUserFormGroup: FormGroup;

error = false;
errorMessage: Object;
file = new FormControl(null, Validators.required);

roles;
values;

constructor(
  private fb: FormBuilder,
  private modalService: NgbModal,
  public usersService: UsersService,
  public rolesService: RolesService
) { }

// angular lifecircle hooks
ngOnInit(): void {
this.filterForm();
this.searchForm();
this.values = Object.values;
this.usersService.fetch();
this.grouping = this.usersService.grouping;
this.paginator = this.usersService.paginator;
this.sorting = this.usersService.sorting;
const sb = this.usersService.isLoading$.subscribe(res => this.isLoading = res);
this.subscriptions.push(sb);
this.rolesService.getRoles() .pipe(first())
.subscribe(
    (response) => {
      this.roles=response;
    },
    error => {

    }
);
this.createUserFormGroup = this.fb.group(
    {
      cin: ['', [Validators.required,Validators.pattern("^[0-9]*$"), Validators.maxLength(8), Validators.minLength(8)]],
      lname: ['', Validators.required],
      fname: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['admin', Validators.required],
    }
);

this.updateUserFormGroup=this.fb.group(
  {
    cin: ['', [Validators.required,Validators.pattern("^[0-9]*$"), Validators.maxLength(8), Validators.minLength(8)]],
    lname: ['', Validators.required],
    fname: ['', Validators.required],
    password: ['', Validators.minLength(8)],
    email: ['', [Validators.required, Validators.email]],
  }
);
}

ngOnDestroy() {
this.subscriptions.forEach((sb) => sb.unsubscribe());
}

//to change filter by role
// filtration
filterForm() {
this.filterGroup = this.fb.group({
  level: [''],
  searchTerm: [''],
});
this.subscriptions.push(
    this.filterGroup.controls.level.valueChanges.subscribe(() =>
        this.filter()
    )
);
}

filter() {
const filter: Filter = new this.filter();
const level = this.filterGroup.get('level').value;
if (level) {
  filter.role = level;
}
this.usersService.patchState({ filter });
}

// search
searchForm() {
this.searchGroup = this.fb.group({
  searchTerm: [''],
});
const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
    .pipe(
        /*
      The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
      we are limiting the amount of server requests emitted to a maximum of one every 150ms
      */
        debounceTime(150),
        distinctUntilChanged()
    )
    .subscribe((val) => this.search(val.toLowerCase()));
this.subscriptions.push(searchEvent);
}

search(searchTerm: string) {
this.usersService.patchState({ searchTerm });
}

// sorting
sort(column: string) {
const sorting = this.sorting;
const isActiveColumn = sorting.column === column;
if (!isActiveColumn) {
  sorting.column = column;
  sorting.direction = 'asc';
} else {
  sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
}
this.usersService.patchState({ sorting });
}

// pagination
paginate(paginator: PaginatorState) {
this.usersService.patchState({ paginator });
}

// form actions
create() {
this.edit(undefined);
}

edit(content: any) {
const modalRef = this.modalService.open(content);
modalRef.result.then((result: any) =>
        console.log(result),
    () => { }
);

}

reset(id) {
  this.usersService.getUserById(id)
    .pipe(first())
    .subscribe(user => {
      this.updateUserFormGroup.controls.fname.setValue(user.fname);
      this.updateUserFormGroup.controls.lname.setValue(user.lname);
      this.updateUserFormGroup.controls.cin.setValue(user.cin);
      this.updateUserFormGroup.controls.email.setValue(user.email);
      this.updateUserFormGroup.controls.password.setValue('');
    });

}

editUser(id: number,content: any){
  this.edit(content);
  this.reset(id);

}

delete(cin: number) {
const modalRef = this.modalService.open(DeleteUserComponent);
modalRef.componentInstance.cin = cin;
modalRef.result.then(() => this.usersService.fetch(), () => { });
}

deleteSelected() {
const modalRef = this.modalService.open(DeleteCustomersModalComponent);
modalRef.componentInstance.ids = this.grouping.getSelectedRows();
modalRef.result.then(() => this.usersService.fetch(), () => { });
}

editRoles(id: number) {
  const modalRef = this.modalService.open(EditRoleUserComponent);
  modalRef.componentInstance.id = id;
  modalRef.result.then(() => this.usersService.fetch(), () => { });
}

updateStatusForSelected() {
const modalRef = this.modalService.open(UpdateCustomersStatusModalComponent);
modalRef.componentInstance.ids = this.grouping.getSelectedRows();
modalRef.result.then(() => this.usersService.fetch(), () => { });
}

fetchSelected() {
const modalRef = this.modalService.open(FetchCustomersModalComponent);
modalRef.componentInstance.ids = this.grouping.getSelectedRows();
modalRef.result.then(() => this.usersService.fetch(), () => { });
}

addUserByForm(callBack) {
this.error = false;
const data = this.createUserFormGroup.value;
this.addLoading = true;
if (this.createUserFormGroup.valid) {
  this.usersService.addByForm(data)
      .pipe(first())
      .subscribe(
          (response) => {
            this.usersService.fetch();
            callBack();
            this.addLoading=false;
          },
          error => {
            this.error = true;
            //to fix
            //this.errorMessage=error.error;
            //console.log(error.error);
            this.addLoading=false;
          }
      );
}

}

    fileSelected(e) {
        console.log(e);
        if(e.addedFiles.length > 0)
        {
            this.file.setValue(e.addedFiles[0]);
        }
    }

    onRemove() {
        this.file.reset();
    }

updateUserByForm(callBack){



}


addUsersByExelFile(callback) {

}

changeFileHandler(target) {
this.error = false;
const acceptedExtensions = ['xlsx', 'csv', 'xls'];
const file: File = target.files[0];
console.log(file);
const fileSplit = file.name.split('.');
const extension = fileSplit[fileSplit.length - 1];
console.log(extension);
if (acceptedExtensions.indexOf(extension) < 0) {
  this.error = true;
} else {
  this.file.setValue(file);
}
}
}
