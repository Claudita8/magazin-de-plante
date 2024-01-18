import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
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
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class UserListService {
  firestore = inject(Firestore);
  usersCollection$ = collection(this.firestore, 'users')
  notifications = inject(NotificationService)

  getUsersList() {
    return collectionData(this.usersCollection$)
  }
  async updateUser(userId: string, isAdmin: boolean) {
    try {
      const ref = doc(this.firestore, 'users', userId);
      await updateDoc(ref, {isAdmin: isAdmin})
      this.notifications.success('User updatat')

    }catch(error: any) {
      this.notifications.error(error.message)
    }
  }
}
