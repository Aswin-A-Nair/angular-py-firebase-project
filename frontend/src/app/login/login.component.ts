import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  showPassword = signal(false);
  loading = signal(false);
  error = signal('');
  info = signal('');

  async onSubmit() {
    this.error.set('');
    this.info.set('');
    if (!this.email.trim() || !this.password) {
      this.error.set('Enter your email and password.');
      return;
    }
    this.loading.set(true);
    try {
      await this.auth.login(this.email.trim(), this.password);
      this.router.navigate(['/dashboard']);
    } catch (e: any) {
      this.error.set(this.friendlyMessage(e?.code));
    } finally {
      this.loading.set(false);
    }
  }

  async forgotPassword() {
    this.error.set('');
    this.info.set('');
    if (!this.email.trim()) {
      this.error.set('Enter your email first, then select "Forgot your password?".');
      return;
    }
    try {
      await this.auth.resetPassword(this.email.trim());
      this.info.set('If this email has an account, a reset link is on its way.');
    } catch (e: any) {
      this.error.set(this.friendlyMessage(e?.code));
    }
  }

  private friendlyMessage(code?: string): string {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Incorrect email or password.';
      case 'auth/invalid-email':
        return 'Enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Wait a few minutes and try again.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection.';
      default:
        return 'Sign in failed. Try again.';
    }
  }
}