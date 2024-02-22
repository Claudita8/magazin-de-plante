import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
} from '@angular/fire/firestore';

import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class UserListService {
  firestore = inject(Firestore);
  usersCollection$ = collection(this.firestore, 'users');
  notifications = inject(NotificationService);

  getUsersList() {
    return collectionData(this.usersCollection$);
  }
  async updateUser(userId: string, isAdmin: boolean) {
    try {
      const ref = doc(this.firestore, 'users', userId);
      await updateDoc(ref, { isAdmin: isAdmin });
      this.notifications.success('User updatat');
    } catch (error: any) {
      this.notifications.error('Userul nu a putut fi updatat');
    }
  }
}
