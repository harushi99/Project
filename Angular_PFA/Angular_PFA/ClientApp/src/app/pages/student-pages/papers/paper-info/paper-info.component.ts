import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PapersService} from '../../../papers/services/papers.service';
import {PapersModel} from '../../../papers/model/papers.model';
import {BehaviorSubject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApplicationsService} from '../../../applications/services/applications.service';
import {AddAplicationModalComponent} from "./add-aplication-modal/add-aplication-modal.component";

@Component({
  selector: 'app-paper-info',
  templateUrl: './paper-info.component.html',
  styleUrls: ['./paper-info.component.scss']
})
export class PaperInfoComponent implements OnInit, OnDestroy {

  private subscriptions = [];

  id: number;
  paperSubject: BehaviorSubject<PapersModel> = new BehaviorSubject<PapersModel>(null);
  paperObservable = this.paperSubject.asObservable();

  constructor(private route: ActivatedRoute,
              private papersService: PapersService,
              private modalService: NgbModal,
              private applicationsService: ApplicationsService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['paper-id'];
    const subsription = this.papersService.getPaperById(this.id)
          .subscribe(
              (response) => {
                  this.paperSubject.next(response.data);
              },
              error => console.log(error)
          );
    this.subscriptions.push(subsription);
  }

  downloadFileHandler() {
    const sub = this.papersService.getPaperFile(this.paperSubject.value.path)
        .subscribe(
            (response) => {
                this.downLoadFile(response, 'application/pdf');
            }
        );
    this.subscriptions.push(sub);
  }

  downLoadFile(data: any, type: string) {
        const blob = new Blob([data], { type});
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = `${this.paperSubject.value.label}.pdf`;
        anchor.href = url;
        anchor.click();
    }

    addNewApplication() {
        const modalRef = this.modalService.open(AddAplicationModalComponent);
        modalRef.componentInstance.paper = this.paperSubject.value;
        modalRef.result.then(
            () => this.applicationsService.fetch(),
            () => { }
        );
    }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

}
