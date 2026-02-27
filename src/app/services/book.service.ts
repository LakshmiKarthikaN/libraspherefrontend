import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/books.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  private API = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) {}

  getAll(search?: string, categoryId?: number): Observable<Book[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (categoryId) params = params.set('categoryId', categoryId.toString());
    return this.http.get<Book[]>(this.API, { params });
  }

  create(book: Book): Observable<Book> {
    return this.http.post<Book>(this.API, book);
  }

  update(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.API}/${id}`, book);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
