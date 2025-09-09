import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
