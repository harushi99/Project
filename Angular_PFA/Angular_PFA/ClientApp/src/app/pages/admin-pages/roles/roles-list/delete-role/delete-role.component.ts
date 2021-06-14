import { RolesService } from './../../services/roles.service';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';



@Component({
  selector: 'app-delete-role',
  templateUrl: './delete-role.component.html',
  styleUrls: ['./delete-role.component.scss']
})
export class DeleteRoleComponent implements OnInit, OnDestroy {

  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private rolesService: RolesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteRole() {
    this.isLoading = true;
    const sb = this.rolesService.deleteRole(this.id).pipe(
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
