import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="topbar">
      <a routerLink="/orders" class="logo">Pedidos</a>
      <nav>
        <a routerLink="/orders">Listado</a>
        <a routerLink="/orders/new">Nuevo</a>
      </nav>
    </header>
    <router-outlet/>
  `,
  styles: [`
    .topbar{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid #eee}
    .logo{font-weight:700;text-decoration:none}
    nav a{margin-left:12px;text-decoration:none}
  `]
})
export class AppComponent {}
