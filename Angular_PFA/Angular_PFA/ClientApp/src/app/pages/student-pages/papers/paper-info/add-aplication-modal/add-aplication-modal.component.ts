import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ApplicationsService} from '../../../../applications/services/applications.service';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PapersModel} from '../../../../papers/model/papers.model';
import {PapersService} from '../../../../papers/services/papers.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-aplication-modal',
  templateUrl: './add-aplication-modal.component.html',
  styleUrls: ['./add-aplication-modal.component.scss']
})
export class AddAplicationModalComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  isLoading = false;
  file: FormControl = new FormControl();
  @Input() paper: PapersModel;

  constructor(private applicationsService: ApplicationsService,
              public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  sendNewApplication(): void {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('paper_id', this.paper.id.toString());
    formData.append('requirements', this.file.value);
    const subscr = this.applicationsService.addApplication(formData)
        .subscribe(
            (response) => {
              console.log(response);
              this.isLoading = false;
              this.applicationsService.fetch();
              this.modal.close();
            }, (err) => {
              console.error(err);
            }
        );
    this.subscriptions.push(subscr);
  }

  fileSelected(e) {
    if (e.addedFiles.length > 0)
    {
      this.file.setValue(e.addedFiles[0]);
    }
  }

  onRemove() {
    this.file.reset();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
