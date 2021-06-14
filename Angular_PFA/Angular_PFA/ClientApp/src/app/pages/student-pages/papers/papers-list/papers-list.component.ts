import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {PapersModel} from '../../../papers/model/papers.model';
import {PapersService} from '../../../papers/services/papers.service';

@Component({
  selector: 'app-papers-list',
  templateUrl: './papers-list.component.html',
  styleUrls: ['./papers-list.component.scss']
})
export class PapersListComponent implements OnInit, OnDestroy, AfterViewInit {

  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  PapersListSubject: BehaviorSubject<PapersModel[]> = new BehaviorSubject<PapersModel[]>([]);
  isLoadingSubject: BehaviorSubject<boolean>;
  papers: Observable<PapersModel[]> = this.PapersListSubject.asObservable();

  constructor(
      public papersService: PapersService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngAfterViewInit(): void {
    const papersSubscription = this.papersService.getPapers()
        .subscribe(
            (response) => {
              this.PapersListSubject.next(response);
            }, error => {
              console.log(error);
            }
        );
    this.subscriptions.push(papersSubscription);
  }

}
