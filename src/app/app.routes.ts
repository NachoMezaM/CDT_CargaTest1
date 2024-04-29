import { Routes } from '@angular/router';
  
import { IndexComponent } from './asignatura/index/index.component';
import { ViewComponent } from './asignatura/view/view.component';
import { CrearComponent } from './asignatura/crear/crear.component';
import { EditarComponent } from './asignatura/editar/editar.component';
import { CrearProfeComponent } from './profesor/crear-profe/crear-profe.component'
import { IndexProfeComponent } from './profesor/index-profe/index-profe.component';
import { ViewProfeComponent } from './profesor/view-profe/view-profe.component';
import { EditarProfeComponent} from './profesor/editar-profe/editar-profe.component'
import { MenuComponent } from './menu/menu.component';
import { BarranavegacionComponent } from './barranavegacion/barranavegacion.component';
export const routes: Routes = [
      { path: '', redirectTo: 'menu', pathMatch: 'full'},
      { path: 'asignatura/index', component: IndexComponent },
      { path: 'asignatura/asignaturaId/view', component: ViewComponent },
      { path: 'asignatura/create', component: CrearComponent },
      { path: 'asignatura/asignaturaId/edit', component: EditarComponent },
      { path: 'profesor/crear-profe', component: CrearProfeComponent },
      { path: 'profesor/index-profe', component: IndexProfeComponent},
      { path: 'profesor/:profesoridProfesor/view-profe', component: ViewProfeComponent},
      { path: 'profesor/:profesoridProfesor/editar-profe', component: EditarProfeComponent },
      { path: 'menu', component: MenuComponent  },
      { path: 'barranavegacion', component: BarranavegacionComponent}

  ];
