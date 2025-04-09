import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "@/routes/Navbar";
import { AuthProvider } from "@/routes/AuthContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute"; // Adjust path if needed

import Home from "@/pages/Home";
import Signup from "@/pages/Signup";
import Pricing from "@/pages/Pricing";
import Features from "@/pages/Features";
import Create from "@/pages/Create";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/create" element={
            <ProtectedRoute>
              <Create />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
