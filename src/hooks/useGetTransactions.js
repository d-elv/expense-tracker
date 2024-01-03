import { useState, useEffect } from "react"
import { query, collection, onSnapshot, where, orderBy } from "firebase/firestore"
import { db } from "../config/firebase-config.js"
import { useGetUserInfo } from "./useGetUserInfo"

export const useGetTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [transactionTotals, setTransactionTotals] = useState({
    balance: 0.0, 
    income: 0.0, 
    expenses: 0.0,
  });
  const transactionCollectionRef = collection(db, "transactions");
  const { userID } = useGetUserInfo();
  const getTransactions = async () => {
    let unsubscribe;
    try {
      const queryTransactions = query(
        transactionCollectionRef,
        // think where as similar to an SQL statement, this line compares userID of database entry with current logged in user
        // returning only the logged in user's documents from the firebase database.
        where("userID", "==", userID),
        orderBy("createdAt")
      );

      // unsubscribe for clean up
      unsubscribe = onSnapshot(queryTransactions, (snapshot) => {
        let documents = [];
        let totalIncome = 0;
        let totalExpenses = 0;

        snapshot.forEach((document) => {
          const data = document.data();
          const id = document.id;

          documents.push({ ...data, id });

          if (data.transactionType === "expense") {
            totalExpenses += Number(data.transactionAmount);
          } else {
            totalIncome += Number(data.transactionAmount);
          }
        });

        setTransactions(documents);
        let balance = totalIncome - totalExpenses;
        setTransactionTotals({
          balance,
          income: totalIncome,
          expenses: totalExpenses,
        });
      });
    } catch (error) {
      console.error(error)
    }
    return () => unsubscribe();
  }

  useEffect(() => {
    getTransactions();
  }, [])
  return {transactions, transactionTotals};
}