import { Routes } from '@angular/router';
  




import { CrearProfeComponent } from './profesor/crear-profe/crear-profe.component'
import { IndexProfeComponent } from './profesor/index-profe/index-profe.component';
import { ViewProfeComponent } from './profesor/view-profe/view-profe.component';
import { EditarProfeComponent} from './profesor/editar-profe/editar-profe.component'
import { MenuComponent } from './menu/menu.component';
import { BarranavegacionComponent } from './barranavegacion/barranavegacion.component';
export const routes: Routes = [
      { path: '', redirectTo: 'menu', pathMatch: 'full'},
      { path: 'profesor/crear-profe', component: CrearProfeComponent },
      { path: 'profesor/index-profe', component: IndexProfeComponent},
      { path: 'profesor/:profesoridProfesor/view-profe', component: ViewProfeComponent},
      { path: 'profesor/:profesoridProfesor/editar-profe', component: EditarProfeComponent },
      { path: 'menu', component: MenuComponent  },
      { path: 'barranavegacion', component: BarranavegacionComponent}

  ];
