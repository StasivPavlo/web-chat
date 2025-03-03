import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "./hooks/hooks.ts";
import * as chatsActions from "./features/chats/chatsSlice.ts";
import * as userActions from "./features/user/userSlice.ts";
import api from "./api/axios.ts";

import Loading from "./comoponents/Loading.tsx";
import SideBar from "./comoponents/SideBar.tsx";
import { socket } from "./api/socket.ts";

function App() {
  const [isCheckAuthLoading, setIsCheckAuthLoading] = useState(true);
  const [isChatsLoading, setIsChatsLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const logoutClick = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem('accessToken');
    dispatch(userActions.remove());
  }

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      api.get('/auth/checkAuth').then(res => {
        dispatch(userActions.add(res.data))
      }).catch((e) => {
        console.log(e.response);
        navigate("/auth?type=login");
      }).finally(() => {
        setIsCheckAuthLoading(false);
      });
    } else {
      navigate("/auth?type=login");
    }
  }, []);

  useEffect(() => {
    if (user) {
      socket.connect();
      socket.on('chats', (data) => {
        console.log({ onConnection: data });
        dispatch(chatsActions.add(data));
        setIsChatsLoading(false)
      })
      socket.on('message', (data) => {
        console.log({ onMessage: data });
        dispatch(chatsActions.addMessage(data));
      })
    }

    return () => {
      socket.off('chats');
      socket.off('message');
    }
  }, [user]);

  if (isCheckAuthLoading || isChatsLoading) {
    return (
      <div className="h-screen">
        <h1>{ isCheckAuthLoading ? 'Auth' : 'Loading chats'}</h1>
        <Loading />
      </div>
    );
  }

  return user ? (
    <div>
      <header>
        <p>{user.name}</p>
        <button onClick={logoutClick}>Logout</button>
      </header>
      <SideBar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/auth?type=login" />
  )
}

export default App;
