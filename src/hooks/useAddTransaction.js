import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../config/firebase-config"
import { useGetUserInfo } from "./useGetUserInfo";

export const useAddTransaction = () => {
  // put in the reference to the database, and then the name of the collection you're accessing
  const transactionCollectionRef = collection(db, "transactions");
  const { userID } = useGetUserInfo();
  const addTransaction = async ({
    description, 
    transactionAmount, 
    transactionType
  }) => {
    // args are the collectionRef, and the object, which is the data we want to add to the database
    await addDoc(transactionCollectionRef, {
      userID,
      description,
      transactionAmount,
      transactionType,
      createdAt: serverTimestamp(),
    });
  };
  return { addTransaction };
}