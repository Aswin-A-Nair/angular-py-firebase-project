import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = getAuth(initializeApp(environment.firebase));

  user = signal<User | null>(null);
  role = signal<string>('');

  constructor() {
    onAuthStateChanged(this.auth, async (user) => {
      this.user.set(user);
      if (user) {
        const result = await user.getIdTokenResult();
        this.role.set((result.claims['role'] as string) ?? 'user');
      } else {
        this.role.set('');
      }
    });
  }

  ready() {
    return this.auth.authStateReady();
  }

  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async getToken(): Promise<string | null> {
    return this.auth.currentUser ? this.auth.currentUser.getIdToken() : null;
  }
}