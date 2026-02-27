import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private API = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.API);
  }

  create(category: Category): Observable<Category> {
    return this.http.post<Category>(this.API, category);
  }

  update(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.API}/${id}`, category);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}