import { Component,OnInit } from '@angular/core';
import { NavbarComponent } from "../../../components/nav-bar/navbar.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NavbarComponent],
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
