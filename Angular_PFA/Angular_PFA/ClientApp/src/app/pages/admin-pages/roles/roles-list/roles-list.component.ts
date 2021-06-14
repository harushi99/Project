import { EditRoleComponent } from './edit-role/edit-role.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { FetchProductsModalComponent } from './../../../../modules/e-commerce/products/components/fetch-products-modal/fetch-products-modal.component';
import { AuthService } from 'src/app/modules/auth';
import { RoleModel } from './../model/roles.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GroupingState, IDeleteSelectedAction, IFetchSelectedAction, IFilterView, IGroupingView, ISearchView, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { RolesService } from '../services/roles.service';
import { DeleteRoleComponent } from './delete-role/delete-role.component';
import { ROLESEnum } from 'src/app/modules/auth/_models/ROLES.enum';



@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements
OnInit,
OnDestroy,
IDeleteSelectedAction,
IFetchSelectedAction,
IFilterView,
IGroupingView,
ISearchView {

paginator: PaginatorState;
sorting: SortState;
grouping: GroupingState;
isLoading: boolean;
filterGroup: FormGroup;
searchGroup: FormGroup;
roles: RoleModel[];
rolesLabels: any = {};
rolesTypes =ROLESEnum;
private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
constructor(
  private fb: FormBuilder,
  private modalService: NgbModal,
  public rolesService: RolesService,
  public authService: AuthService
) { }

ngOnInit(): void {
  this.filterForm();
  this.searchForm();
  this.rolesService.fetch();
  const rolesSubscripton = this.rolesService.isLoading$.subscribe(res => { this.isLoading = res });
  this.subscriptions.push(rolesSubscripton);
  this.grouping = this.rolesService.grouping;
  this.paginator = this.rolesService.paginator;
  this.sorting = this.rolesService.sorting;
  this.rolesService.fetch();
}
ngOnDestroy() {
  this.subscriptions.forEach((sb) => sb.unsubscribe());
}

create() {
  const modalRef = this.modalService.open(CreateRoleComponent);
  modalRef.result.then(() =>
    this.rolesService.fetch(),
    () => { }
  );
}

edit(id: number) {
  const modalRef = this.modalService.open(EditRoleComponent);
  modalRef.componentInstance.id = id;
  modalRef.result.then(() =>
    this.rolesService.fetch(),
    () => { }
  );
}

filterForm() {
  this.filterGroup = this.fb.group({
    state: [''],
    role_id: [''],
    searchTerm: [''],
  });
  this.subscriptions.push(
    this.filterGroup.controls.state.valueChanges.subscribe(() =>
      this.filter()
    )
  );
  this.subscriptions.push(
    this.filterGroup.controls.role_id.valueChanges.subscribe(() => this.filter())
  );
}

filter() {
  const filter = {};
  const state = this.filterGroup.get('state').value;
  if (state) {
    filter['state'] = state;
  }


  const role_id = this.filterGroup.get('role_id').value;
  if (role_id) {
    filter['role_id'] = role_id;
  }
  this.rolesService.patchState({ filter });
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
    .subscribe((val) => { this.search(val.toLowerCase()) });
  this.subscriptions.push(searchEvent);
}

search(searchTerm: string) {
  this.rolesService.patchState({ searchTerm });
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
  this.rolesService.patchState({ sorting });
}

// pagination
paginate(paginator: PaginatorState) {
  this.rolesService.patchState({ paginator });
}
// actions
delete(id: number) {
  const modalRef = this.modalService.open(DeleteRoleComponent);
  modalRef.componentInstance.id = id;
  modalRef.result.then(
    () => this.rolesService.fetch(),
    () => { }
  );
}

deleteSelected() {
  const modalRef = this.modalService.open(DeleteRoleComponent);
  modalRef.componentInstance.ids = this.grouping.getSelectedRows();
  modalRef.result.then(
    () => this.rolesService.fetch(),
    () => { }
  );
}

updateStatusForSelected() {
  /*const modalRef = this.modalService.open(
    UpdateRolesStatusModalComponent
  );
  modalRef.componentInstance.rolesLabels = this.rolesLabels;
  modalRef.componentInstance.ids = this.grouping.getSelectedRows();
  modalRef.result.then(
    () => this.rolesService.fetch(),
    () => { }
  );*/
}

fetchSelected() {
  const modalRef = this.modalService.open(FetchProductsModalComponent);
  modalRef.componentInstance.ids = this.grouping.getSelectedRows();
  modalRef.result.then(
    () => this.rolesService.fetch(),
    () => { }
  );
}


}