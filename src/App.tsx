import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "./hooks/hooks.ts";

function App() {
  const { user } = useAppSelector((state) => state.user);

  console.log(user);

  return user ? (
    <div>
      <header>{user.name}</header>
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" />
  )
}

export default App
