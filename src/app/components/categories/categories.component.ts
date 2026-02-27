import { Component, OnInit, ChangeDetectorRef } from '@angular/core';  // ← add ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    TableModule, DialogModule, InputTextModule,
    TextareaModule, ButtonModule, TagModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  showModal = false;
  showConfirm = false;
  editingId: number | null = null;
  deleteTargetId: number | null = null;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef   // ← ADD THIS
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, this.uniqueNameValidator.bind(this)]],
      description: ['']
    });
  }

  uniqueNameValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const dup = this.categories.find(c =>
      c.name.toLowerCase() === control.value.toLowerCase() && c.id !== this.editingId
    );
    return dup ? { uniqueName: true } : null;
  }

  loadCategories(): void {
  this.categoryService.getAll().subscribe({
    next: (data) => {
      this.categories = [...data];   // ← spread operator forces Angular to detect change
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Failed to load categories:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Connection Error',
        detail: 'Cannot connect to backend.'
      });
    }
  });
}
  openAddModal(): void {
    this.editingId = null;
    this.form.reset();
    this.showModal = true;
  }

  openEditModal(cat: Category): void {
    this.editingId = cat.id!;
    this.form.patchValue({ name: cat.name, description: cat.description });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.form.reset();
  }

  saveCategory(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload: Category = this.form.value;
    if (this.editingId) {
      this.categoryService.update(this.editingId, payload).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Category updated!' });
        this.loadCategories();
        this.closeModal();
      });
    } else {
      this.categoryService.create(payload).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Category added!' });
        this.loadCategories();
        this.closeModal();
      });
    }
  }

  confirmDelete(id: number): void {
    this.deleteTargetId = id;
    this.showConfirm = true;
  }

  deleteCategory(): void {
    if (!this.deleteTargetId) return;
    this.categoryService.delete(this.deleteTargetId).subscribe(() => {
      this.messageService.add({ severity: 'warn', summary: 'Deleted', detail: 'Category deleted.' });
      this.loadCategories();
      this.showConfirm = false;
    });
  }

  get nameCtrl() { return this.form.get('name'); }
}