import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'students',
        loadChildren: () =>
            import('./students/students.module').then((m) => m.StudentsModule),
    },
    {
        path: 'users',
        loadChildren: () =>
            import('./users/users.module').then((m) => m.UsersModule),
    },
    {
        path: 'roles',
        loadChildren: () =>
            import('./roles/roles.module').then((m) => m.RolesModule),
    },
    { path: '**', redirectTo: 'error/404' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminPagesRoutingModule { }
