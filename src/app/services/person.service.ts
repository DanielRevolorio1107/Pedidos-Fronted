import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface PersonDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
}

@Injectable({ providedIn: 'root' })
export class PersonService {
  private http = inject(HttpClient);
  private base = '/api/Person'; // tu backend expone api/Person

  getAll() {
    return this.http.get<PersonDto[]>(this.base);
  }
}
