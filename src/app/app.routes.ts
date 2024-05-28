import { Routes } from '@angular/router';
import { IndexComponent } from './post/index/index.component';
import { ViewComponent } from './post/view/view.component';
import { CreateComponent } from './post/create/create.component';
import { EditComponent } from './post/edit/edit.component';
import { SeccionComponent } from './post/seccion/seccion.component';
import { CrearProfeComponent } from './profesor/crear-profe/crear-profe.component'
import { IndexProfeComponent } from './profesor/index-profe/index-profe.component';
import { ViewProfeComponent } from './profesor/view-profe/view-profe.component';
import { EditarProfeComponent} from './profesor/editar-profe/editar-profe.component'
import { MenuComponent } from './menu/menu.component';
import { BarranavegacionComponent } from './barranavegacion/barranavegacion.component';
import { CargaHorariaComponent } from './carga-horaria/carga-horaria/carga-horaria.component';
import { VisualizarCargaComponent } from './carga-horaria/visualizar-carga/visualizar-carga.component';
import { CargaAcademicaComponent } from './carga-horaria/carga-academica/carga-academica.component';
import { ViewSeccionesComponent } from './post/view-secciones/view-secciones.component';

export const routes: Routes = [
    
      { path: '', redirectTo: 'menu', pathMatch: 'full'},
      { path: 'post/index', component: IndexComponent },
      { path: 'post/:postId/view', component: ViewComponent },
      { path: 'post/create', component: CreateComponent },
      { path: 'post/:postId/edit', component: EditComponent },
      { path: 'post/:postId/seccion', component: SeccionComponent },
      { path: 'profesor/crear-profe', component: CrearProfeComponent },
      { path: 'profesor/index-profe', component: IndexProfeComponent},
      { path: 'profesor/:profesoridProfesor/view-profe', component: ViewProfeComponent},
      { path: 'profesor/:profesoridProfesor/editar-profe', component: EditarProfeComponent },
      { path: 'menu', component: MenuComponent  },
      { path: 'barranavegacion', component: BarranavegacionComponent},
      { path: 'carga-horaria/carga-horaria', component: CargaHorariaComponent},
      { path: 'carga-horaria/visualizar-carga', component: VisualizarCargaComponent},
      { path: 'carga-horaria/cargarAcademica', component:CargaAcademicaComponent},
      { path: 'carga-horaria/visualizar-carga', component: VisualizarCargaComponent},
      {path:  'view-seccion/view-seccion', component: ViewSeccionesComponent}

  ];


