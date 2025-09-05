import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PersonService, PersonDto } from '../../services/person.service';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(PersonService);

  loading = false;
  error = '';
  list: PersonDto[] = [];

  // id que se edita (null => creación)
  editingId = signal<number | null>(null);

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(60)]],
    lastName:  ['', [Validators.required, Validators.maxLength(60)]],
    email:     ['',[Validators.email, Validators.maxLength(120)]],
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: data => { this.list = data ?? []; this.loading = false; },
      error: err => { this.error = 'No se pudieron cargar personas'; this.loading = false; console.error(err); }
    });
  }

  startCreate() {
    this.editingId.set(null);
    this.form.reset({ firstName: '', lastName: '', email: '' });
  }

  startEdit(p: PersonDto) {
    this.editingId.set(p.id);
    this.form.reset({
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email || ''
    });
  }

  cancel() {
    this.editingId.set(null);
    this.form.reset({ firstName: '', lastName: '', email: '' });
  }

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
    if (!confirm('¿Eliminar esta persona?')) return;
    this.loading = true;
    this.svc.delete(id).subscribe({
      next: _ => { this.loading = false; this.load(); },
      error: err => { this.error = 'No se pudo eliminar'; this.loading = false; console.error(err); }
    });
  }

  get f() { return this.form.controls; }
}

