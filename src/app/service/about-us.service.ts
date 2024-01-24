import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { UsersService } from './users.service';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AboutUsService {
  firestore = inject(Firestore);
  userService = inject(UsersService);
  contact$ = collection(this.firestore, 'contact');
  contactCollection$ = collectionData(this.contact$).pipe(
    map((contactCollection) => {
      return contactCollection.sort((a, b) =>
        a['isAnswered'] === b['isAnswered'] ? 0 : a['isAnswered'] ? 1 : -1
      );
    })
  );

  async addContactRequest(info: any, id: number) {
    const infoSend = {
      ...this.userService.currentUserProfile(),
      ...info,
      id,
    };
    return await addDoc(this.contact$, infoSend);
  }

  async updateContact(contact: any): Promise<any> {
    const contactSnapshot = await getDocs(this.contact$);
    contactSnapshot.docs.forEach((docSnapshot: any) => {
      if (docSnapshot.data()['id'] === contact.id) {
        const ref = doc(this.firestore, 'contact', docSnapshot.id);
        return updateDoc(ref, { ...contact });
      }
      return;
    });
  }
}
