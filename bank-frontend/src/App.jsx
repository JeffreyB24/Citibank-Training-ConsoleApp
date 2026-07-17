import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import CustomerLayout from "./components/CustomerLayout";

import LoginPage from "./pages/LoginPage";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import CustomersPage from "./pages/Admin/CustomersPage";
import AccountsPage from "./pages/Admin/AccountsPage";
import TransactionsPage from "./pages/Admin/TransactionsPage";

import CustomerDashboard from "./pages/User/CustomerDashboard";
import MyAccountsPage from "./pages/User/MyAccountsPage";
import CustomerTransactionsPage from "./pages/User/CustomerTransactionsPage";
import TransactionHistoryPage from "./pages/User/TransactionHistoryPage";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<LoginPage />}
      />

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          />
        }
      >
        <Route
          element={<AdminLayout />}
        >
          <Route
            path="/admin"
            element={
              <AdminDashboard />
            }
          />

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
            element={
              <TransactionsPage />
            }
          />
        </Route>
      </Route>

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["CUSTOMER"]}
          />
        }
      >
        <Route
          element={<CustomerLayout />}
        >
          <Route
            path="/customer"
            element={
              <CustomerDashboard />
            }
          />

          <Route
            path="/customer/accounts"
            element={<MyAccountsPage />}
          />

          <Route
            path="/customer/transactions"
            element={
              <CustomerTransactionsPage />
            }
          />

          <Route
            path="/customer/history"
            element={
              <TransactionHistoryPage />
            }
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;