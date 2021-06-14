import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PapersListComponent } from './papers-list/papers-list-component';
import { PapersComponent } from './papers.component';


const routes: Routes = [
  {
    path: '',
    component: PapersComponent,
    children: [
      {
        path: 'papers-list',
        component: PapersListComponent,
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
export class PapersRoutingModule { }
