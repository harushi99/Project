import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { RolesService } from '../../services/roles.service';


@Component({
  selector: 'app-delete-roles',
  templateUrl: './delete-roles.component.html',
  styleUrls: ['./delete-roles.component.scss']
})
export class DeleteRolesComponent  implements OnInit, OnDestroy {
  @Input() ids: number[];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private rolesService: RolesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteRoles() {
    this.isLoading = true;
    const sb = this.rolesService.deleteItems(this.ids).pipe(
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


  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
