import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import Spinner from "../ui/Spinner";

export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuthStore();

  if (initializing) return <Spinner fullscreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
