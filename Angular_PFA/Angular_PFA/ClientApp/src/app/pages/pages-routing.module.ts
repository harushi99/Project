import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './_layout/layout.component';
import {AuthGuard} from '../modules/auth/_services/auth.guard';
import {ROLESEnum} from '../modules/auth/_models/ROLES.enum';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
        {
            path: 'admin',
            loadChildren: () =>
                import('./admin-pages/admin-pages.module').then((m) => m.AdminPagesModule),
            canActivate: [AuthGuard],
            data: {roles: [ROLESEnum.ADMIN, ROLESEnum.SCOLARITY]}
        },
        {
            path: 'student',
            loadChildren: () =>
                import('./student-pages/student-pages.module').then((m) => m.StudentPagesModule),
            canActivate: [AuthGuard],
            data: {roles: [ROLESEnum.STUDENT]}
        },
        {
          path: 'applications',
          loadChildren: () =>
              import('./applications/applications.module').then((m) => m.ApplicationsModule),
          canActivate: [AuthGuard],
          data: {roles: [ROLESEnum.STUDENT, ROLESEnum.ADMIN, ROLESEnum.SCOLARITY]}
      },
      {
        path: 'papers',
        loadChildren: () =>
            import('./papers/papers.module').then((m) => m.PapersModule),
        canActivate: [AuthGuard],
        data: {roles: [ROLESEnum.ADMIN]}
    } ,
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'builder',
        loadChildren: () =>
          import('./builder/builder.module').then((m) => m.BuilderModule),
      },
      {
        path: 'ecommerce',
        loadChildren: () =>
          import('../modules/e-commerce/e-commerce.module').then(
            (m) => m.ECommerceModule
          ),
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('../modules/user-management/user-management.module').then(
            (m) => m.UserManagementModule
          ),
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('../modules/user-profile/user-profile.module').then(
            (m) => m.UserProfileModule
          ),
      },
     {
        path: 'ngbootstrap',
        loadChildren: () =>
          import('../modules/ngbootstrap/ngbootstrap.module').then(
            (m) => m.NgbootstrapModule
          ),
      },
      {
        path: 'wizards',
        loadChildren: () =>
          import('../modules/wizards/wizards.module').then(
            (m) => m.WizardsModule
          ),
      },
      {
        path: 'material',
        loadChildren: () =>
          import('../modules/material/material.module').then(
            (m) => m.MaterialModule
          ),
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'error/404',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
