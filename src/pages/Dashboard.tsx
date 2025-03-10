import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Dashboard() {
  const authContext = useContext(AuthContext);

  if (!authContext) return null;

  const { user } = authContext;

  return (
    <div className="p-6">
      <h2 className="text-2xl">Welcome, {user?.email}!</h2>
    </div>
  );
}
