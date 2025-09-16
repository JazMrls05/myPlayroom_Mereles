import { Component } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quiensoy',
  imports: [MatCardModule, RouterLink],
  templateUrl: './quiensoy.component.html',
  styleUrl: './quiensoy.component.scss'
})
export class QuiensoyComponent {

}
