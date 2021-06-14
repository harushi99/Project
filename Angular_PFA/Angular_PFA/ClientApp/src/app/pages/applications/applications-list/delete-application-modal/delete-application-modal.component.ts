import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { ApplicationsService } from '../../services/applications.service';

@Component({
  selector: 'app-delete-application-modal',
  templateUrl: './delete-application-modal.component.html',
  styleUrls: ['./delete-application-modal.component.scss']
})
export class DeleteApplicationModalComponent implements OnInit, OnDestroy {

  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private applicationsService: ApplicationsService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteApplication() {
    this.isLoading = true;
    const sb = this.applicationsService.deleteApplication(this.id).pipe(
      tap(() => this.modal.close()),
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
