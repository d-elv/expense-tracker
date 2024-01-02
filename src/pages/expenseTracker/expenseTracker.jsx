import { useEffect, useState } from "react";
import "./ExpenseTracker.css";
import { useAddTransaction } from "../../hooks/useAddTransaction.js";
import { useGetTransactions } from "../../hooks/useGetTransactions.js";
import { useGetUserInfo } from "../../hooks/useGetUserInfo.js";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config.js";
import { useNavigate } from "react-router-dom";

export const ExpenseTracker = () => {
  const { addTransaction } = useAddTransaction();
  const { transactions, transactionTotals } = useGetTransactions();
  const { name, profilePhoto } = useGetUserInfo();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionType, setTransactionType] = useState("expense");

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
            <input
              type="radio"
              id="expense"
              value="expense"
              required
              checked={transactionType === "expense"}
              onChange={(event) => setTransactionType(event.target.value)}
            />
            <label htmlFor="expense">Expense</label>
            <input
              type="radio"
              id="income"
              value="income"
              required
              checked={transactionType === "income"}
              onChange={(event) => setTransactionType(event.target.value)}
            />
            <label htmlFor="income">Income</label>
            <button type="submit">Add Transaction</button>
          </form>
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
        <div className="container">
          <h3>Transactions</h3>
          <ul>
            {transactions.map((transaction) => {
              const { description, transactionAmount, transactionType } =
                transaction;
              return (
                <li key={description}>
                  <h4>{description}</h4>
                  <p>
                    £{transactionAmount} •{" "}
                    <label
                      style={{
                        color: transactionType === "expense" ? "red" : "green",
                      }}
                    >
                      {transactionType}
                    </label>
                  </p>
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
// 2) User ability to delete transactions
