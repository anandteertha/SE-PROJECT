import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  customizations: string = "settings/customizations";
  constructor(private router: Router) {}

  redirect(link: string): void {
    this.router.navigateByUrl(`/${link}`);
  }

}
