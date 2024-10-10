import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/nav-bar/navbar.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidePanelComponent } from './components/CostingComponents/side-panel/side-panel.component';
import { ItemListComponent } from './components/CostingComponents/central-part/item-list/item-list.component';
import { ProjectComponent } from './components/HomeComponents/project/project.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FontAwesomeModule, NavbarComponent,SidePanelComponent, ItemListComponent, ProjectComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TutorialTrueValue';
}
