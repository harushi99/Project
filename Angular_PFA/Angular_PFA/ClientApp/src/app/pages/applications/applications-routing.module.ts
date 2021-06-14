import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationsListComponent } from './applications-list/applications-list.component';
import { ApplicationsComponent } from './applications.component';


const routes: Routes = [
  {
    path: '',
    component: ApplicationsComponent,
    children: [
      {
        path: 'applications-list',
        component: ApplicationsListComponent,
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationsRoutingModule { }
