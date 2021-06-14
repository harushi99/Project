import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { PapersService } from 'src/app/pages/papers/services/papers.service';

@Component({
  selector: 'app-delete-paper-modal',
  templateUrl: './delete-paper-modal.component.html',
  styleUrls: ['./delete-paper-modal.component.scss']
})
export class DeletePaperModalComponent implements OnInit {

  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private papersService: PapersService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deletePaper() {
    this.isLoading = true;
    const sb = this.papersService.deletePaper(this.id).pipe(
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
