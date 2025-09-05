import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ItemDto {
  id: number;
  name: string;
  price: number;
}

export interface ItemCreateDto {
  name: string;
  price: number;
}

export interface ItemUpdateDto extends ItemCreateDto {}

@Injectable({ providedIn: 'root' })
export class ItemService {
  private http = inject(HttpClient);
  private base = '/api/Item';

  getAll(): Observable<ItemDto[]> {
    return this.http.get<ItemDto[]>(this.base);
  }
  create(dto: ItemCreateDto): Observable<ItemDto> {
    return this.http.post<ItemDto>(this.base, dto);
  }
  update(id: number, dto: ItemUpdateDto): Observable<ItemDto> {
    return this.http.put<ItemDto>(`${this.base}/${id}`, dto);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
