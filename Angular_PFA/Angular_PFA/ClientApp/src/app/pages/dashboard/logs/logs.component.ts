import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LogModel } from '../models/log.model';
import { LogsService } from '../services/logs.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {


  logsListSubject: BehaviorSubject<LogModel[]> = new BehaviorSubject<LogModel[]>([]);
  logs: Observable<LogModel[]> = this.logsListSubject.asObservable();

  constructor(
    private logService: LogsService
  ) { }

  ngOnInit(): void {
    this.logService.getLogs().subscribe(res => this.logsListSubject.next(res.data))
  }

}
