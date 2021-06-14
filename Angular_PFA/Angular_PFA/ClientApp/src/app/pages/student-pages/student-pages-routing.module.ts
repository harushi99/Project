import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'papers-list',
                loadChildren: () =>
                    import('./papers/papers.module').then((m) => m.PapersModule),
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StudentPagesRoutingModule { }
