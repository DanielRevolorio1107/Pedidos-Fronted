import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService, OrderDto } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  private orderSvc = inject(OrderService);
  loading = true;
  error = '';
  orders: OrderDto[] = [];
  expanded = new Set<number>();

  ngOnInit() {
    this.orderSvc.getAll().subscribe({
      next: data => { this.orders = data ?? []; this.loading = false; },
      error: err => { this.error = 'No se pudo cargar pedidos'; this.loading = false; console.error(err); }
    });
  }
  toggle(id: number) { this.expanded.has(id) ? this.expanded.delete(id) : this.expanded.add(id); }
  isOpen(id: number) { return this.expanded.has(id); }
  trackById(_: number, o: OrderDto) { return o.id; }
}
