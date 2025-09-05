import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ItemService, ItemDto } from '../../services/item.service';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(ItemService);

  loading = false;
  error = '';
  list: ItemDto[] = [];
  editingId = signal<number | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: data => { this.list = data ?? []; this.loading = false; },
      error: err => { this.error = 'No se pudieron cargar ítems'; this.loading = false; console.error(err); }
    });
  }

  startCreate() { this.editingId.set(null); this.form.reset({ name: '', price: 0 }); }
  startEdit(it: ItemDto) { this.editingId.set(it.id); this.form.reset({ name: it.name, price: it.price }); }
  cancel() { this.startCreate(); }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const dto = this.form.value as any;
    this.loading = true;
    const id = this.editingId();
    const call = id == null ? this.svc.create(dto) : this.svc.update(id, dto);
    call.subscribe({
      next: _ => { this.loading = false; this.cancel(); this.load(); },
      error: err => { this.error = 'No se pudo guardar'; this.loading = false; console.error(err); }
    });
  }

  remove(id: number) {
    if (!confirm('¿Eliminar este ítem?')) return;
    this.loading = true;
    this.svc.delete(id).subscribe({
      next: _ => { this.loading = false; this.load(); },
      error: err => { this.error = 'No se pudo eliminar'; this.loading = false; console.error(err); }
    });
  }

  get f() { return this.form.controls; }
}
