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
  docSnapshots,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class FeedbackServiceService {
  firestore = inject(Firestore);
  firestoreCollection$ = collection(this.firestore, 'feedback');
  firestoreCollection = collectionData(this.firestoreCollection$);
  feedbackCollection = toSignal(this.firestoreCollection);

  async updateRecenzie(recenzie: any): Promise<any> {
    const productSnapshot = await getDocs(this.firestoreCollection$);
    let productFound = false;
    for (const docSnapshot of productSnapshot.docs) {
      if (docSnapshot.data()['id'] === recenzie.id) {
        const ref = doc(this.firestore, 'feedback', docSnapshot.id);
        await updateDoc(ref, {
          ...recenzie,
          feedback: [
            ...docSnapshot.data()['feedback'],
            ...recenzie['feedback'],
          ],
        });
        productFound = true;
        break;
      }
    }
    if (!productFound) {
      return addDoc(this.firestoreCollection$, recenzie);
    }
  }

  async removeComment(recenzie: any): Promise<any> {
    const productSnapshot = await getDocs(this.firestoreCollection$);

    productSnapshot.forEach((docSnapshot: any) => {
      if (docSnapshot.data()['id'] === recenzie.id) {
        const ref = doc(this.firestore, 'feedback', docSnapshot.id);
        const feedback = docSnapshot.data()['feedback'];
        const removedFeedback = feedback.filter(
          (feedback: any) => feedback.date !== recenzie.date
        );
        return updateDoc(ref, { feedback: removedFeedback });
      }
      return;
    });
  }

  async deleteFeedback(recenzie: any): Promise<any> {
    const productSnapshot = await getDocs(this.firestoreCollection$);

    productSnapshot.forEach((docSnapshot: any) => {
      if (docSnapshot.data()['id'] === recenzie.id) {
        const ref = doc(this.firestore, 'feedback', docSnapshot.id);
        return deleteDoc(ref);
      }
      return;
    });
  }
}
