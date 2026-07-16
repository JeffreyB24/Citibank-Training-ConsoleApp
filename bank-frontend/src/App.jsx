import { Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CustomersPage from "./pages/Admin/CustomersPage";
import AccountsPage from "./pages/Admin/AccountsPage";
import TransactionsPage from "./pages/Admin/TransactionsPage";
import CustomerDashboard from "./pages/User/CustomerDashboard";
import MyAccountsPage from "./pages/User/MyAccountsPage";
import MyTransactionsPage from "./pages/User/MyTransactionsPage";
import MyTransactionsHistoryPage from "./pages/User/MyTransactionsHistoryPage";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route
        path="/admin/customers"
        element={<CustomersPage />}
      />
      <Route
        path="/admin/accounts"
        element={<AccountsPage />}
      />
      <Route
        path="/admin/transactions"
        element={<TransactionsPage />}
      />

      <Route
        path="/customer"
        element={<CustomerDashboard />}
      />

      <Route
        path="/customer/accounts"
        element={<MyAccountsPage />}
      />

      <Route 
        path="/customer/transactions"
        element={<MyTransactionsPage />}
      />

      <Route 
        path="/customer/history"
        element={<MyTransactionsHistoryPage />}
      />
    </Routes>
  );
}

export default App;