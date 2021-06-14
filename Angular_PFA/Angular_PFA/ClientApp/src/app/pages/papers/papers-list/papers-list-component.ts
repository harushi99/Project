import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth';
import { ROLESEnum } from 'src/app/modules/auth/_models/ROLES.enum';
import { DeleteProductsModalComponent } from 'src/app/modules/e-commerce/products/components/delete-products-modal/delete-products-modal.component';
import { FetchProductsModalComponent } from 'src/app/modules/e-commerce/products/components/fetch-products-modal/fetch-products-modal.component';
import { GroupingState, IDeleteSelectedAction, IFetchSelectedAction, IFilterView, IGroupingView, ISearchView, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { PapersModel } from '../../papers/model/papers.model';
import { DeletePaperModalComponent } from '../../student-pages/papers/papers-list/delete-paper-modal/delete-paper-modal.component';
import { PapersService } from '../services/papers.service';
import { EditPaperModalComponent } from './edit-paper-modal/edit-paper-modal.component';
import { Role } from 'src/app/modules/auth/_models/role.model';


@Component({
  selector: 'app-papers-list',
  templateUrl: './papers-list-component.html',
})
export class PapersListComponent implements
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
  papers: PapersModel[];
  papersLabels: any = {};
  roles = ROLESEnum;
  appRoles: Role[];
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public papersService: PapersService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    this.papersService.getRoles().subscribe(res =>  {
      this.appRoles = res;
      const index = this.appRoles.findIndex(el => el.name === 'student');
      this.appRoles.splice(index, index);
    });
    this.papersService.fetch();
    const papersSubscripton = this.papersService.isLoading$.subscribe(res => { this.isLoading = res });
    this.subscriptions.push(papersSubscripton);
    this.grouping = this.papersService.grouping;
    this.paginator = this.papersService.paginator;
    this.sorting = this.papersService.sorting;
    this.papersService.fetch();
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditPaperModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.appRoles = this.appRoles;
    modalRef.result.then(() =>
      this.papersService.fetch(),
      () => { }
    );
  }

  filterForm() {
    this.filterGroup = this.fb.group({
      state: [''],
      paper_id: [''],
      searchTerm: [''],
    });
    console.log(this.filterGroup)
    this.subscriptions.push(
      this.filterGroup.controls.state.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.paper_id.valueChanges.subscribe(() => this.filter())
    );
  }

  filter() {
    const filter = {};
    const state = this.filterGroup.get('state').value;
    if (state) {
      filter['state'] = state;
    }


    const paper_id = this.filterGroup.get('paper_id').value;
    if (paper_id) {
      filter['paper_id'] = paper_id;
    }
    this.papersService.patchState({ filter });
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
      .subscribe((val) => { console.log(val); this.search(val) });
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.papersService.patchState({ searchTerm });
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
    this.papersService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.papersService.patchState({ paginator });
  }
  // actions
  delete(id: number) {
    const modalRef = this.modalService.open(DeletePaperModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => this.papersService.fetch(),
      () => { }
    );
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteProductsModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(
      () => this.papersService.fetch(),
      () => { }
    );
  }

  updateStatusForSelected() {
    /*const modalRef = this.modalService.open(
      UpdatePapersStatusModalComponent
    );
    modalRef.componentInstance.papersLabels = this.papersLabels;
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(
      () => this.papersService.fetch(),
      () => { }
    );*/
  }

  fetchSelected() {
    const modalRef = this.modalService.open(FetchProductsModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(
      () => this.papersService.fetch(),
      () => { }
    );
  }

}
