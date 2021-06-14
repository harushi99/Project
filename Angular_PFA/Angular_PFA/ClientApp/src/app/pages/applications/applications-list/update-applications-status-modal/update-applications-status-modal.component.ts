import { DatePipe } from '@angular/common';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, first, tap } from 'rxjs/operators';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { ApplicationModel } from '../../models/application.model';
import { ApplicationsService } from '../../services/applications.service';

@Component({
  selector: 'app-update-applications-status-modal',
  templateUrl: './update-applications-status-modal.component.html',
  styleUrls: ['./update-applications-status-modal.component.scss']
})
export class UpdateApplicationsStatusModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  @Input() papersLabels: any = {};
  state = 'en cours';
  applications: ApplicationModel[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];
  currentUser: UserModel;
  pickAt: NgbDateStruct;
  refusalReasons: string;
  formGroup: FormGroup;


  constructor(
    public applicationsService: ApplicationsService,
    public modal: NgbActiveModal,
    private auth: AuthService,
    private datePipe: DatePipe,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
    this.currentUser = this.auth.currentUserValue;
    this.loadApplications();
  }

  loadApplications() {
    this.loadForm()
    const sb = this.applicationsService.items$.pipe(
      first()
    ).subscribe((res: ApplicationModel[]) => {
      this.applications = res.filter(c => this.ids.indexOf(c.id) > -1);
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    this.formGroup = this.fb.group({
      refusalReasons: [this.refusalReasons, Validators.compose([Validators.required])],
      pickAt: [this.pickAt, Validators.compose([Validators.required])]
    });
  }

  updateApplicationState() {
    this.isLoading = true;
    const body = {
      state: this.state,
      agent_id: this.currentUser.id,
      recieving_date: this.pickAt ? `${this.pickAt["year"]}-${this.pickAt["month"]}-${this.pickAt["day"]}` : null,
      message: this.state === "validé" ? "validé" : this.refusalReasons,
      _method: 'PATCH',
    };
    const sb = this.applicationsService.edit(this.ids[0], body).pipe(
      tap(() => this.modal.close()),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  handleStateChange(e) {
    console.log(this.pickAt)
    if(e.target.value === "validé")
      this.refusalReasons = "";
    if(e.target.value === "refusé")
      this.pickAt = null;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
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

  updateValidity() {
    if(this.state === "refusé") {
      const control = this.formGroup.controls["refusalReasons"];
      return control.invalid;
    }
    if(this.state === "validé") {
      const control = this.formGroup.controls["pickAt"];
      return control.invalid;
    }
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
