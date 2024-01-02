import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth } from "./pages/auth/auth";
import { ExpenseTracker } from "./pages/expenseTracker/expenseTracker";
import "./App.css";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<Auth />} />
          <Route path="/expense-tracker" exact element={<ExpenseTracker />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
