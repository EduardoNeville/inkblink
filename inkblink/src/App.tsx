// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Elements } from '@stripe/react-stripe-js';
import { Navbar } from "@/routes/Navbar";
import ProtectedRoute from "@/routes/ProtectedRoute";

import Home from "@/pages/Home";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Pricing from "@/pages/Pricing";
import Features from "@/pages/Features";
import Create from "@/pages/Create";
import { stripePromise } from "./stripe";
import PaymentForm from "./pages/Payment";

export default function App() {
  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/features" element={<Features />} />
            <Route path="/payment" element={<PaymentForm />} />
            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  <Create />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </Elements>
    </AuthProvider>
  );
}
