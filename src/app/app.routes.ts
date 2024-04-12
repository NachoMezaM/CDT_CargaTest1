import { Routes } from '@angular/router';
  
import { IndexComponent } from './asignatura/index/index.component';
import { ViewComponent } from './asignatura/view/view.component';
import { CrearComponent } from './asignatura/crear/crear.component';
import { EditarComponent } from './asignatura/editar/editar.component';
  
export const routes: Routes = [
      { path: '', redirectTo: 'asignatura/index', pathMatch: 'full'},
      { path: 'asignatura/index', component: IndexComponent },
      { path: 'asignatura/asignaturaId/view', component: ViewComponent },
      { path: 'asignatura/create', component: CrearComponent },
      { path: 'asignatura/asignaturaId/edit', component: EditarComponent } 
  ];
