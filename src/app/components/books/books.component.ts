import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Book } from '../../models/books.model';
import { Category } from '../../models/category.model';
import { BookService } from '../../services/book.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    TableModule, DialogModule, InputTextModule,
    ButtonModule, SelectModule, DatePickerModule,
    TagModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './books.component.html'
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  categories: Category[] = [];
  showModal = false;
  editingId: number | null = null;
  searchTerm = '';
  selectedCategoryId: number | null = null;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private categoryService: CategoryService,
    private messageService: MessageService,
      private cdr: ChangeDetectorRef    // ← ADD THIS

  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.loadBooks();
  }

  initForm(): void {
    this.form = this.fb.group({
      bookName:      ['', Validators.required],
      author:        ['', Validators.required],
      isbn:          ['', [Validators.required, this.uniqueIsbnValidator.bind(this)]],
      publishedDate: ['', Validators.required],
      categoryId:    [null, Validators.required]
    });
  }

  uniqueIsbnValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const dup = this.books.find(b => b.isbn === control.value && b.id !== this.editingId);
    return dup ? { uniqueIsbn: true } : null;
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe(data => this.categories = data);
  }

  loadBooks(): void {
    this.bookService.getAll(
      this.searchTerm || undefined,
      this.selectedCategoryId ?? undefined
    ).subscribe(data => this.books = data);
  }

  getCategoryName(id: number): string {
    return this.categories.find(c => c.id === id)?.name || '—';
  }

  openAddModal(): void {
    this.editingId = null;
    this.form.reset();
    this.showModal = true;
  }

  openEditModal(book: Book): void {
    this.editingId = book.id!;
    this.form.patchValue(book);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.form.reset();
  }

  saveBook(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload: Book = this.form.value;
    if (this.editingId) {
      this.bookService.update(this.editingId, payload).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Book updated!' });
        this.loadBooks(); this.closeModal();
      });
    } else {
      this.bookService.create(payload).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Book added!' });
        this.loadBooks(); this.closeModal();
      });
    }
  }

  confirmDelete(id: number): void {
    if (confirm('Delete this book? This cannot be undone.')) {
      this.bookService.delete(id).subscribe(() => {
        this.messageService.add({ severity: 'warn', summary: 'Deleted', detail: 'Book deleted.' });
        this.loadBooks();
      });
    }
  }

  get bookNameCtrl() { return this.form.get('bookName'); }
  get authorCtrl()   { return this.form.get('author'); }
  get isbnCtrl()     { return this.form.get('isbn'); }
  get dateCtrl()     { return this.form.get('publishedDate'); }
  get catCtrl()      { return this.form.get('categoryId'); }
}