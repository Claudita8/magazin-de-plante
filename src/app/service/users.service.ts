import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';

import { AuthService } from './auth.service';
import { Observable, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  firestore = inject(Firestore);
  authService = inject(AuthService);
  storage = inject(Storage);
  currentUserProfile$ = this.authService.currentUser$.pipe(
    switchMap((user: any) => {
      if (user) {
        const ref = doc(this.firestore, 'users', user.uid);
        return docData(ref) as Observable<any>;
      }
      return of(null);
    })
  );
  currentUserProfile = toSignal(this.currentUserProfile$);
  addUser(user: any) {
    const ref = doc(this.firestore, 'users', user.uid);
    return setDoc(ref, user);
  }
  async uploadProfilePhoto(image: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    const result = await uploadBytes(storageRef, image);
    return await getDownloadURL(result.ref);
  }

  updateUser(user: any) {
    const ref = doc(this.firestore, 'users', user.uid);
    return updateDoc(ref, { ...user });
  }
}
