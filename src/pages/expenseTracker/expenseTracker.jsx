import { useState } from "react";
import "./ExpenseTracker.css";
import { useAddTransaction } from "../../hooks/useAddTransaction.js";
import { useGetTransactions } from "../../hooks/useGetTransactions.js";
import { useGetUserInfo } from "../../hooks/useGetUserInfo.js";
import { signOut } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../../config/firebase-config.js";
import { useNavigate } from "react-router-dom";

export const ExpenseTracker = () => {
  const { addTransaction } = useAddTransaction();
  const { transactions, transactionTotals } = useGetTransactions();
  const { name, profilePhoto } = useGetUserInfo();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("expense");
  const [checkedItems, setCheckedItems] = useState([]);

  const { balance, income, expenses } = transactionTotals;

  const onSubmit = async (event) => {
    event.preventDefault();
    addTransaction({
      description,
      transactionAmount,
      transactionType,
    });
    setDescription("");
    setTransactionAmount("");
  };

  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckboxChange = (documentId) => {
    setCheckedItems((prevCheckedItems) => {
      if (prevCheckedItems.includes(documentId)) {
        return prevCheckedItems.filter((id) => id !== documentId);
      } else {
        return [...prevCheckedItems, documentId];
      }
    });
  };

  const handleRemoveCheckedItems = async () => {
    await Promise.all(
      checkedItems.map(async (documentId) => {
        const itemRef = doc(db, "transactions", documentId);
        await deleteDoc(itemRef);
      })
    );
  };

  return (
    <>
      <div className="expense-tracker">
        {" "}
        <div className="container">
          <h1> {name}'s Expense Tracker</h1>
          <div className="balance">
            <h3>Your Balance</h3>
            {balance >= 0 ? <h2>£{balance}</h2> : <h2>-£{balance * -1}</h2>}
          </div>
          <div className="summary">
            <div className="income">
              <h4>Income</h4>
              <p>£{income}</p>
            </div>
            <div className="expenses">
              <h4>Expenses</h4>
              <p>£{expenses}</p>
            </div>
          </div>
          <div className="form-wrapper">
            <form className="add-transaction" onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="Description"
                value={description}
                required
                onChange={(event) => setDescription(event.target.value)}
              />
              <input
                type="number"
                placeholder="Amount"
                value={transactionAmount}
                required
                onChange={(event) => setTransactionAmount(event.target.value)}
              />
              <div className="radio-label-styling">
                <input
                  className="radio-styling"
                  type="radio"
                  id="expense"
                  value="expense"
                  required
                  checked={transactionType === "expense"}
                  onChange={(event) => setTransactionType(event.target.value)}
                />
                <label htmlFor="expense">Expense</label>
              </div>
              <div className="radio-label-styling">
                <input
                  className="radio-styling"
                  type="radio"
                  id="income"
                  value="income"
                  required
                  checked={transactionType === "income"}
                  onChange={(event) => setTransactionType(event.target.value)}
                />
                <label htmlFor="income">Income</label>
              </div>
              <button type="submit" className="add-transaction-button">
                Add Transaction
              </button>
            </form>
            <button
              className="remove-transactions-button"
              onClick={handleRemoveCheckedItems}
            >
              Remove Transactions
            </button>
          </div>
        </div>
        {profilePhoto && (
          <div className="profile">
            {" "}
            <img className="profile-photo" src={profilePhoto} />
            <button className="sign-out-button" onClick={signUserOut}>
              Sign Out
            </button>
          </div>
        )}
      </div>
      <div className="transactions">
        <div className="transaction-container">
          <h2 className="transactions-title">Transactions</h2>
          <ul className="transaction-list">
            {transactions.map((transaction, index) => {
              const { description, transactionAmount, transactionType, id } =
                transaction;
              return (
                <li key={id} className={index % 2 === 0 ? "even" : "odd"}>
                  <div className="list-item-info-div">
                    <h4 className="list-item-title">{description}</h4>
                    <p className="list-item-p">
                      £{transactionAmount} •{" "}
                      <label
                        style={{
                          color:
                            transactionType === "expense" ? "red" : "green",
                        }}
                      >
                        {transactionType}
                      </label>
                    </p>
                  </div>
                  <div className="list-item-checkbox-div">
                    <input
                      type="checkbox"
                      id={`checkbox-${id}`}
                      checked={checkedItems.includes(id)}
                      onChange={() => handleCheckboxChange(id)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

// TODO:
// 1) Add Snackbar pop up for successful sign out
// 3) Move delete document function to its own useRemoveTransactions.js hook

// COMPLETE
// 2) User ability to delete transactions
