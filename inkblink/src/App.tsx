// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "@/routes/Navbar";

import Home from "@/pages/Home";
import Signup from "@/pages/Signup";
import Pricing from "@/pages/Pricing";
import Features from "@/pages/Features";
import Create from "@/pages/Create";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </Router>
  );
}
