import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { OrderService } from '../../services/order.service';
import { PersonService, PersonDto } from '../../services/person.service';
import { ItemService, ItemDto } from '../../services/item.service';
import { OrderDetailService } from '../../services/order-detail.service';

type PendingDetail = {
  itemId: number;
  itemName: string;
  quantity: number;
  price: number;
  total: number;
};

@Component({
  selector: 'app-order-new',
  standalone: true,
  imports: [    CommonModule, RouterModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule],
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.css'],
})
export class OrderNewComponent implements OnInit {
  // servicios
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private orderSvc = inject(OrderService);
  private personSvc = inject(PersonService);
  private itemSvc = inject(ItemService);
  private detailSvc = inject(OrderDetailService);

  // estado
  loading = false;
  saving = false;
  error = '';

  persons: PersonDto[] = [];
  items: ItemDto[] = [];

  // encabezado del pedido
  form = this.fb.group({
    number: [null as number | null, [Validators.required, Validators.min(1)]],
    personId: [null as number | null, [Validators.required]],
  });

  // formulario de línea a agregar
  detailForm = this.fb.group({
    itemId: [null as number | null, Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  // carrito local
  pending: PendingDetail[] = [];

  // signals para precio y total de la línea
  private selItemId = signal<number | null>(null);
  private qtySig = signal<number>(1);

  priceSig = computed(() => {
    const it = this.items.find(i => i.id === this.selItemId());
    return it ? it.price : 0;
  });
  lineTotalSig = computed(() => this.priceSig() * this.qtySig());

  // gran total
  grandTotal = computed(() => this.pending.reduce((s, d) => s + d.total, 0));

  ngOnInit() {
    this.loading = true;
    Promise.all([
      this.personSvc.getAll().toPromise(),
      this.itemSvc.getAll().toPromise(),
    ])
      .then(([pe, it]) => {
        this.persons = pe ?? [];
        this.items = it ?? [];

        // recalcular price/total al cambiar item o cantidad
        this.detailForm.get('itemId')!.valueChanges.subscribe(v => {
          this.selItemId.set(v as number | null);
        });
        this.detailForm.get('quantity')!.valueChanges.subscribe(v => {
          const q = Math.max(1, Number(v) || 1);
          this.qtySig.set(q);
        });
      })
      .catch(err => {
        console.error(err);
        this.error = 'No se pudieron cargar datos.';
      })
      .finally(() => (this.loading = false));
  }

  // agregar línea al carrito
  addDetail() {
    if (this.detailForm.invalid) {
      this.detailForm.markAllAsTouched();
      return;
    }
    const itemId = this.detailForm.value.itemId as number;
    const it = this.items.find(x => x.id === itemId)!;
    const quantity = Math.max(1, Number(this.detailForm.value.quantity) || 1);
    const price = it.price;
    const total = price * quantity;

    const existing = this.pending.find(p => p.itemId === itemId);
    if (existing) {
      existing.quantity += quantity;
      existing.total = existing.quantity * existing.price;
      this.pending = [...this.pending];
    } else {
      this.pending = [
        ...this.pending,
        { itemId, itemName: it.name, quantity, price, total },
      ];
    }

    // reset línea
    this.detailForm.reset({ itemId: null, quantity: 1 });
    this.selItemId.set(null);
    this.qtySig.set(1);
  }

  // ediciones rápidas de cantidad
  inc(itemId: number) {
    const r = this.pending.find(p => p.itemId === itemId);
    if (!r) return;
    r.quantity++;
    r.total = r.quantity * r.price;
    this.pending = [...this.pending];
  }
  dec(itemId: number) {
    const r = this.pending.find(p => p.itemId === itemId);
    if (!r) return;
    if (r.quantity > 1) {
      r.quantity--;
      r.total = r.quantity * r.price;
      this.pending = [...this.pending];
    }
  }
  updateQty(itemId: number, value: string) {
    const q = Math.max(1, Number(value) || 1);
    const r = this.pending.find(p => p.itemId === itemId);
    if (!r) return;
    r.quantity = q;
    r.total = r.quantity * r.price;
    this.pending = [...this.pending];
  }
  removeDetail(itemId: number) {
    this.pending = this.pending.filter(p => p.itemId !== itemId);
  }
  clearPending() { this.pending = []; }

  // guardar
  save() {
    if (this.form.invalid || this.pending.length === 0) {
      this.form.markAllAsTouched();
      this.detailForm.markAllAsTouched();
      return;
    }
    this.saving = true;

    const dto = {
      number: this.form.value.number as number,
      personId: this.form.value.personId as number,
    };

    this.orderSvc.create(dto).subscribe({
      next: (res: any) => {
        const orderId = res?.id; 
        const calls = this.pending.map(d =>
          this.detailSvc.create({
            orderId,
            itemId: d.itemId,
            quantity: d.quantity,
            price: d.price,
            total: d.total,
          }).toPromise()
        );

        Promise.all(calls)
          .then(() => this.router.navigateByUrl('/orders'))
          .catch(err => {
            console.error(err);
            this.error = 'El pedido se creó, pero falló al agregar detalles.';
          })
          .finally(() => (this.saving = false));
      },
      error: err => {
        console.error(err);
        this.error = 'No se pudo crear el pedido.';
        this.saving = false;
      },
    });
  }

  // helpers 
  get f()  { return this.form.controls; }
  get df() { return this.detailForm.controls; }
}
