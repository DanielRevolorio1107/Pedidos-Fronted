import { Routes } from '@angular/router';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderNewComponent } from './pages/order-new/order-new.component';
import { PeopleComponent } from './pages/people/people.component';
import { ItemsComponent } from './pages/items/items.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'orders' },
  { path: 'orders', component: OrdersComponent },
  { path: 'orders/new', component: OrderNewComponent },
  { path: 'people', component: PeopleComponent },
  { path: 'items', component: ItemsComponent },
  { path: '**', redirectTo: 'orders' },
];
