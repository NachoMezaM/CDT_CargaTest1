import { Routes } from '@angular/router';
import { IndexComponent } from './post/index/index.component';
import { ViewComponent } from './post/view/view.component';
import { CreateComponent } from './post/create/create.component';
import { EditComponent } from './post/edit/edit.component';
import { CrearProfeComponent } from './profesor/crear-profe/crear-profe.component'
import { IndexProfeComponent } from './profesor/index-profe/index-profe.component';
import { ViewProfeComponent } from './profesor/view-profe/view-profe.component';
import {EditarProfeComponent} from './profesor/editar-profe/editar-profe.component'
export const routes: Routes = [
      { path: '', redirectTo: 'menu', pathMatch: 'full'},
      { path: 'post/index', component: IndexComponent },
      { path: 'post/postId/view', component: ViewComponent },
      { path: 'post/create', component: CreateComponent },
      { path: 'post/postId/edit', component: EditComponent },
      { path: 'profesor/crear-profe', component: CrearProfeComponent },
      { path: 'profesor/index-profe', component: IndexProfeComponent},
      { path: 'profesor/view-profe', component: ViewProfeComponent},
      { path: 'profesor/editar-profe', component: EditarProfeComponent }

  ];
