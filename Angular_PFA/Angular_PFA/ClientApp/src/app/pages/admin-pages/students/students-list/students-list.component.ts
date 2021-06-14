import { DeleteStudentComponent } from './delete-student/delete-student.component';
import { AlertService } from './../../../alert/service/alert.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DeleteProductModalComponent } from 'src/app/modules/e-commerce/products/components/delete-product-modal/delete-product-modal.component';
import { DeleteProductsModalComponent } from 'src/app/modules/e-commerce/products/components/delete-products-modal/delete-products-modal.component';
import { FetchProductsModalComponent } from 'src/app/modules/e-commerce/products/components/fetch-products-modal/fetch-products-modal.component';
import { UpdateProductsStatusModalComponent } from 'src/app/modules/e-commerce/products/components/update-products-status-modal/update-products-status-modal.component';
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
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomersService} from '../../../../modules/e-commerce/_services';
import {debounceTime, distinctUntilChanged, first} from 'rxjs/operators';
import {DeleteCustomerModalComponent} from '../../../../modules/e-commerce/customers/components/delete-customer-modal/delete-customer-modal.component';
import {DeleteCustomersModalComponent} from '../../../../modules/e-commerce/customers/components/delete-customers-modal/delete-customers-modal.component';
import {UpdateCustomersStatusModalComponent} from '../../../../modules/e-commerce/customers/components/update-customers-status-modal/update-customers-status-modal.component';
import {FetchCustomersModalComponent} from '../../../../modules/e-commerce/customers/components/fetch-customers-modal/fetch-customers-modal.component';
import {StudentsService} from '../services/students.service';
import {MajorsList} from '../../../models/majors.list';

class Filter {
  level: string;
}

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements
    OnInit,
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
    ISearchView{
  // file = new FormControl(null, Validators.required);

  constructor(
      private fb: FormBuilder,
      private modalService: NgbModal,
      public studentsService: StudentsService,
      private alertService: AlertService
) { }


  get f(){
    return this.myForm.controls;
  }
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  levels = MajorsList;

  createStudentFormGroup: FormGroup;
  updateStudentFormGroup: FormGroup;
  error = false;
  addLoading = false;
  myForm = new FormGroup({
    level: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  files: File[] = [];

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    this.studentsService.fetch();
    this.grouping = this.studentsService.grouping;
    this.paginator = this.studentsService.paginator;
    this.sorting = this.studentsService.sorting;
    const sb = this.studentsService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.createStudentFormGroup = this.fb.group(
        {
          cin: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(8), Validators.minLength(8)]],
          nce: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(7), Validators.minLength(7)]],
          lname: ['', Validators.required],
          fname: ['', Validators.required],
          level: ['', Validators.required],
          // password: ['', [Validators.required, Validators.minLength(8)]],
          // email: ['', [Validators.email]],
        }
    );
    this.updateStudentFormGroup = this.fb.group(
      {
        cin: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(8), Validators.minLength(8)]],
        lname: ['', Validators.required],
        fname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        nce: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(7), Validators.minLength(7)]],
        level: ['', Validators.required],
        password: ['', [Validators.minLength(8)]],

      }
    );
    // this.alertService.clear();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  reset(id) {
    this.studentsService.getStudentById(id)
      .pipe(first())
      .subscribe(user => {
        this.updateStudentFormGroup.controls.fname.setValue(user.fname);
        this.updateStudentFormGroup.controls.lname.setValue(user.lname);
        this.updateStudentFormGroup.controls.cin.setValue(user.cin);
        this.updateStudentFormGroup.controls.nce.setValue(user.nce);
        this.updateStudentFormGroup.controls.email.setValue(user.email);
        this.updateStudentFormGroup.controls.password.setValue('');
        this.updateStudentFormGroup.controls.level.setValue(user.level);
      });

  }
  editStudent(id: number, content: any){
    console.log('id', id);
    this.edit(content);
    this.reset(id);
  }

  updateStudentByForm(callBack){



  }
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
    const filter: Filter = new Filter();
    const level = this.filterGroup.get('level').value;
    if (level) {
      filter.level = level;
    }
    this.studentsService.patchState({ filter });
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
    this.studentsService.patchState({ searchTerm });
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
    this.studentsService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.studentsService.patchState({ paginator });
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

  delete(cin: number) {
    const modalRef = this.modalService.open(DeleteStudentComponent);
    modalRef.componentInstance.cin = cin;
    modalRef.result.then(() => this.studentsService.fetch(), () => { });
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteCustomersModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(() => this.studentsService.fetch(), () => { });
  }

  updateStatusForSelected() {
    const modalRef = this.modalService.open(UpdateCustomersStatusModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(() => this.studentsService.fetch(), () => { });
  }

  fetchSelected() {
    const modalRef = this.modalService.open(FetchCustomersModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(() => this.studentsService.fetch(), () => { });
  }

  addStudentByForm(callBack) {
    this.error = false;
    const data = this.createStudentFormGroup.value;
    this.addLoading = true;
    if (this.createStudentFormGroup.valid) {
      this.studentsService.addByForm(data)
          .pipe(first())
          .subscribe(
              (response) => {
                this.alertService.success('Registration successful');
                this.addLoading = false;
                // this.studentsService.fetch();
                callBack();
              },
              error => {
                this.error = true;
                this.addLoading = false;
                // this.alertService.error('Wrong data input');
              }
          );
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
    this.error = false;
    const acceptedExtensions = ['xlsx', 'csv', 'xls'];
    const file: File = event.target.files[0];
    this.files.push(...event.addedFiles);
    console.log(file);
    const fileSplit = file.name.split('.');
    const extension = fileSplit[fileSplit.length - 1];
    console.log(extension);
    if (acceptedExtensions.indexOf(extension) < 0) {
      this.error = true;
    } else {
    //  this.file.setValue(file);
      this.myForm.patchValue({
        fileSource: file
      });
    }}
  }

  addStudentsByExelFile(callBack) {
    const formData = new FormData();
    formData.append('file', this.myForm.get('fileSource').value);
    formData.append('level', this.myForm.get('level').value);
    console.log(formData);
    if (this.myForm.valid) {
      this.studentsService.addByExelFile(formData)
          .pipe(first())
          .subscribe(
              (response) => {
                this.alertService.success('Registration successful');
                this.addLoading = false;
                callBack();
              },
              error => {
                this.error = true;
                this.addLoading = false;
                callBack();
                this.alertService.error('Wrong data input');
              }
          );
    }
  }
  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
    this.myForm.patchValue({
      fileSource: this.files[0]
    });
  }
  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
    this.myForm.controls.fileSource.reset();
  }

 /* onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        file: file
      });
    }
  }  */
  downLoadFile(data: any, type: string) {
    /*let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert( 'Please disable your Pop-up blocker and try again.');
    }
*/
const blob = new Blob([data], { type});
const url = window.URL.createObjectURL(blob);
const anchor = document.createElement('a');
anchor.download = 'StudentsList.xlsx';
anchor.href = url;
anchor.click();
  }
  exportStudentList(){
   this.studentsService.exportStudents().subscribe(
     response =>
    this.downLoadFile(response, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    error => {
      this.alertService.error('Wrong data input');
    }
    );

  }

}
