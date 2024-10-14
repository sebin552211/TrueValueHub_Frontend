import { Routes } from '@angular/router';
import { NavbarComponent } from './components/nav-bar/navbar.component';
import { CostPageComponent } from './pages/Costing/cost-page/cost-page.component';
import { HomePageComponent } from './pages/home/home-page/home-page.component';
import { ProjectComponent } from './components/HomeComponents/project/project.component';
import { DraftTabComponent } from './components/HomeComponents/draft-tab/draft-tab.component';

export const routes: Routes = [

      {
        path: '',
        component: HomePageComponent,
        children: [
          { path: 'projects', component: ProjectComponent },
          { path: 'drafts', component: DraftTabComponent },
        ]
      },
      {
        path: 'costing',
        component: CostPageComponent,
        children: [],
      }
];
