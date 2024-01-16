import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  currentUser$ = authState(this.firebaseAuth);
  currentUser= toSignal(this.currentUser$)
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.firebaseAuth, email, password);
  }

  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.firebaseAuth, email, password);
  }

  logout() {
    return signOut(this.firebaseAuth);
  }

  passwordReset(email: string) {
    return sendPasswordResetEmail(this.firebaseAuth, email);
  }

  setDisplayName(user:any, name:string){
    return updateProfile(user, {displayName:name})
  }
}
