import { Component,OnInit } from '@angular/core';
import { NavbarComponent } from "../../../components/nav-bar/navbar.component";
import { ProjectComponent } from "../../../components/HomeComponents/project/project.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NavbarComponent, ProjectComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  constructor() {
    // Constructor logic (if any)
    console.log('HomePageComponent constructed');
  }

  ngOnInit(): void {
    // Initialization logic
    console.log('HomePageComponent initialized');
  }
}
