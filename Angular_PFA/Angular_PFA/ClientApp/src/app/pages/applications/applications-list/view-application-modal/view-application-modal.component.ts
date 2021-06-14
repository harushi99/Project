import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ApplicationsService} from '../../services/applications.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {ApplicationModel} from '../../models/application.model';
import {PapersService} from '../../../papers/services/papers.service';
import {PapersModel} from '../../../papers/model/papers.model';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-view-application-modal',
  templateUrl: './view-application-modal.component.html',
  styleUrls: ['./view-application-modal.component.scss']
})
export class ViewApplicationModalComponent implements OnInit, OnDestroy {

  isLoading = true;
  subscriptions: Subscription[] = [];
  application: ApplicationModel;
  @Input() id;
  papers: PapersModel[];
  papersLabels: any = {};

  constructor(private applicationsService: ApplicationsService,
              public papersService: PapersService,
              public modal: NgbActiveModal,
              private http: HttpClient) { }

  ngOnInit(): void {
    const papersSubscription = this.papersService.getPapers().subscribe(res => {
      this.papers = res;
      this.setPapersLabels();
    });
    const sb = this.applicationsService.getApplicationById(this.id)
        .subscribe((res: any) => {
      this.application = res.application;
      this.isLoading = false;
    });
    this.subscriptions.push(sb);
    this.subscriptions.push(papersSubscription);
  }

  setPapersLabels() {
    this.papers.forEach(paper => this.papersLabels[paper.id] = paper.label);
  }

  downloadFile() {
    this.applicationsService.getApplicationRequirments(this.application.requirements)
        .subscribe(
            (res: any) => {
              const blob = new Blob([res], { type: 'application/pdf'});
              const url = window.URL.createObjectURL(blob);
              const anchor = document.createElement('a');
              anchor.download = 'Doc.pdf';
              anchor.href = url;
              anchor.click();
            }
        );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
