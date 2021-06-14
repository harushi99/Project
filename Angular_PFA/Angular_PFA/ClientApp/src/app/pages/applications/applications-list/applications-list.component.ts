import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DeleteProductsModalComponent } from 'src/app/modules/e-commerce/products/components/delete-products-modal/delete-products-modal.component';
import { FetchProductsModalComponent } from 'src/app/modules/e-commerce/products/components/fetch-products-modal/fetch-products-modal.component';
import { GroupingState, IDeleteSelectedAction, IFetchSelectedAction, IFilterView, IGroupingView, ISearchView, ISortView, IUpdateStatusForSelectedAction, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { PapersModel } from '../../papers/model/papers.model';
import { PapersService } from '../../papers/services/papers.service';
import { ApplicationsService } from '../services/applications.service';
import { DeleteApplicationModalComponent } from './delete-application-modal/delete-application-modal.component';
import { UpdateApplicationsStatusModalComponent } from './update-applications-status-modal/update-applications-status-modal.component';
import {AuthService} from '../../../modules/auth';
import {ROLESEnum} from '../../../modules/auth/_models/ROLES.enum';
import {ViewApplicationModalComponent} from './view-application-modal/view-application-modal.component';
import { ApplicationModel } from '../models/application.model';
import { Role } from 'src/app/modules/auth/_models/role.model';

@Component({
  selector: 'app-applications-list',
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.scss']
})
export class ApplicationsListComponent implements
  OnInit,
  OnDestroy,
  // IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  // IUpdateStatusForSelectedAction,
  // ISortView,
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
  ApplicationListSubject: BehaviorSubject<ApplicationModel[]> = new BehaviorSubject<ApplicationModel[]>([]);
  applications: Observable<ApplicationModel[]> = this.ApplicationListSubject.asObservable();
  rolePermissions: any[];
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  roles = ROLESEnum;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public applicationsService: ApplicationsService,
    public papersService: PapersService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    const papersSubscription = this.papersService.getPapers().subscribe(res => {
      this.papers = res;
      this.setPapersLabels();
    });


    this.papersService.getRoleById(this.authService.currentUserValue.roles[0].id)
    .subscribe(res => {this.rolePermissions = res['permissions']; this.filterApplications(); console.log(this.rolePermissions)});

    this.subscriptions.push(papersSubscription);
    this.applicationsService.fetch();
    const applicationsSubscripton = this.applicationsService.isLoading$.subscribe(res => { this.isLoading = res });
    this.subscriptions.push(applicationsSubscripton);
    this.grouping = this.applicationsService.grouping;
    this.paginator = this.applicationsService.paginator;
    this.sorting = this.applicationsService.sorting;
    this.applicationsService.fetch();
    this.applicationsService.items$.subscribe(res => this.ApplicationListSubject.next(res));
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  filterApplications() {
    const applicationsSubscription = this.applicationsService.items$
        .subscribe(
            (response) => {
              if (!this.authService.checkIfUserHasRole(this.roles.STUDENT) && !this.authService.checkIfUserHasRole(this.roles.ADMIN)) {
                const applicationsFiltered: ApplicationModel[] = [];
                response.forEach(app => {
                  const paper = this.papers.find(paper => paper.id === app.paper_id);
                  if (!paper) return null;
                  const permission = this.rolePermissions.find(permission => paper.label === permission['name']);
                  if (!permission) return null;
                  applicationsFiltered.push(app);
                });
                console.log(applicationsFiltered);
                this.ApplicationListSubject.next(applicationsFiltered);
              }
              else
                this.ApplicationListSubject.next(response);
            }, error => {
              console.log(error);
            }
        );
    this.subscriptions.push(applicationsSubscription);
  }

  setPapersLabels() {
    this.papers.forEach(paper => this.papersLabels[paper.id] = paper.label);
    console.log(this.papersLabels);
  }

  filterForm() {
    this.filterGroup = this.fb.group({
      state: [''],
      paper_id: [''],
      searchTerm: [''],
    });
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
    this.applicationsService.patchState({ filter });
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
      .subscribe((val) => { this.search(val) });
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.applicationsService.patchState({ searchTerm });
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
    this.applicationsService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.applicationsService.patchState({ paginator });
  }
  // actions
  delete(id: number) {
    const modalRef = this.modalService.open(DeleteApplicationModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => this.applicationsService.fetch(),
      () => { }
    );
  }

  viewApplication(id: string) {
    const modalRef = this.modalService.open(ViewApplicationModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
        () => this.applicationsService.fetch(),
        () => { }
    );
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteProductsModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(
      () => this.applicationsService.fetch(),
      () => { }
    );
  }

  updateStatusForSelected() {
    const modalRef = this.modalService.open(
      UpdateApplicationsStatusModalComponent
    );
    modalRef.componentInstance.papersLabels = this.papersLabels;
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(
      () => this.applicationsService.fetch(),
      () => { }
    );
  }

  fetchSelected() {
    const modalRef = this.modalService.open(FetchProductsModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(
      () => this.applicationsService.fetch(),
      () => { }
    );
  }

}
