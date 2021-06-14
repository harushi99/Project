import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../modules/auth';
import {ROLESEnum} from '../../modules/auth/_models/ROLES.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  roles = ROLESEnum;

  constructor(public athService: AuthService) { }

  ngOnInit(): void {
  }

}
