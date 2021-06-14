import { COMMA, E, ENTER } from '@angular/cdk/keycodes';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { Role } from 'src/app/modules/auth/_models/role.model';
import { PapersModel } from '../../model/papers.model';
import { PapersService } from '../../services/papers.service';

const EMPTY_PAPER: PapersModel = {
  id: undefined,
  label: '',
  path: '',
  file: undefined,
  requirements: '',
  role_id: undefined,
  created_at: '',
  updated_at: ''
};

@Component({
  selector: 'app-edit-paper-modal',
  templateUrl: './edit-paper-modal.component.html',
  styleUrls: ['./edit-paper-modal.component.scss']
})
export class EditPaperModalComponent implements OnInit, OnDestroy {

  @Input() id: number;
  @Input() appRoles: Role[];
  isLoading$;
  paper: PapersModel;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  requirements: any[] = [];
  fileName = '';
  file: File;
  constructor(
    private papersService: PapersService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.papersService.isLoading$;
    this.loadPaper();
  }

  fileSelected(e) {
    console.log(e)
    if(e.addedFiles.length > 0)
    {
      this.fileName = e.addedFiles[0].name;
      this.paper.file = e.addedFiles[0];
      this.file = e.addedFiles[0];
    }
  }

  onRemove(e) {
    this.fileName = null;
    this.paper.file = null;
    this.file
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.requirements.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(requirement: any): void {
    const index = this.requirements.indexOf(requirement);

    if (index >= 0) {
      this.requirements.splice(index, 1);
    }
  }

  loadPaper() {
    if (!this.id) {
      this.paper = EMPTY_PAPER;
      this.loadForm();
    } else {
      const sb = this.papersService.getPaperById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_PAPER);
        })
      ).subscribe((paper) => {
        this.paper = paper["data"];
        if(this.paper.requirements)
          this.paper.requirements.split(",").forEach(el => this.requirements.push({name: el.trim()}))
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      label: [this.paper.label, Validators.compose([Validators.required])],
      role: [this.paper.role_id, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.preparePaper();
    if (this.paper.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const formData: FormData = new FormData();
    if(this.paper.file)
      formData.append('file', this.paper.file, this.fileName);

    formData.append('label', this.paper.label);
    formData.append('role_id', `${this.paper.role_id}`);
    formData.append('requirements', this.paper.requirements);
    formData.append('_method', "PATCH");

    const sbUpdate = this.papersService.edit(this.id, formData).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.paper);
      }),
    ).subscribe(res => this.paper = res["data"]);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const formData: FormData = new FormData();
    formData.append('file', this.paper.file, this.fileName);
    formData.append('label', this.paper.label);
    formData.append('role_id', `${this.paper.role_id}`);
    formData.append('requirements', this.paper.requirements);
    const sbCreate = this.papersService.createPaper(formData).pipe(
      tap(() => {
        this.modal.close();
        this.fileName = "";
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.paper);
      }),
    ).subscribe((res) => {
      this.paper.label = "";
      this.paper.role_id = null;
    });
    this.subscriptions.push(sbCreate);
  }

  private preparePaper() {
    const reqs = [];
    const formData = this.formGroup.value;
    this.paper.label = formData.label;
    this.paper.role_id = formData.role;
    this.requirements.forEach(el => reqs.push(el["name"].trim()))
    this.paper.requirements = reqs.join();
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
