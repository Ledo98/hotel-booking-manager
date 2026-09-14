import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {
  private fb = inject(FormBuilder);
  auth = inject(AuthService);

  isSending = signal<boolean>(false);
  isSent = signal<boolean>(false);

  form: FormGroup = this.fb.group({
    name: [{ value: this.auth.currentUser() || '', disabled: true }, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    issueType: ['Booking Issue', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  submitForm() {
    if (this.form.valid) {
      this.isSending.set(true);
      
      setTimeout(() => {
        this.isSending.set(false);
        this.isSent.set(true);
        this.form.reset();
        this.form.get('name')?.setValue(this.auth.currentUser());
      }, 2000);
    } else {
      this.form.markAllAsTouched();
    }
  }

  sendAnother() {
    this.isSent.set(false);
  }
}