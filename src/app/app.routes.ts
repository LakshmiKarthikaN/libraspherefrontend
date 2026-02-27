import { Routes } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { BooksComponent } from './components/books/books.component';

export const routes: Routes = [
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  { path: 'categories', component: CategoriesComponent },
  { path: 'books', component: BooksComponent },
];