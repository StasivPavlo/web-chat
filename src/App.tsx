import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "./hooks/hooks.ts";
import * as userActions from "./features/user/userSlice.ts";
import api from "./api/axios.ts";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const logoutClick = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem('accessToken');
    dispatch(userActions.remove());

    navigate("/login");
  }

  useEffect(() => {
    api.get('/auth/checkAuth').then(res => {
      dispatch(userActions.add(res.data))
    }).catch((e) => {
      console.log(e.response);
      navigate("/login");
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return user ? (
    <div>
      <header>
        <p>{user.name}</p>
        <button onClick={logoutClick}>Logout</button>
      </header>
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" />
  )
}

export default App;
