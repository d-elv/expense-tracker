import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useRemoveTransaction = async (checkedItems) => {
  await Promise.all(
    checkedItems.map(async (docId) => {
      const itemRef = doc(db, "transactions", docId);
      await deleteDoc(itemRef);
    })
  );
}