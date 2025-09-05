import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PersonDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  fullName?: string;
}

export interface PersonCreateDto {
  firstName: string;
  lastName: string;
  email?: string;
}

export interface PersonUpdateDto extends PersonCreateDto {}

@Injectable({ providedIn: 'root' })
export class PersonService {
  private http = inject(HttpClient);
  private base = '/api/Person';

  getAll(): Observable<PersonDto[]> {
    return this.http.get<PersonDto[]>(this.base);
  }
  create(dto: PersonCreateDto): Observable<PersonDto> {
    return this.http.post<PersonDto>(this.base, dto);
  }
  update(id: number, dto: PersonUpdateDto): Observable<PersonDto> {
    return this.http.put<PersonDto>(`${this.base}/${id}`, dto);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
