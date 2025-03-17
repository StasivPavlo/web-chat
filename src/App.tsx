import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate, useParams } from "react-router";

import { useAppDispatch, useAppSelector } from "@hooks/hooks.ts";
import * as chatsActions from '@features/chats/chatsSlice.ts';
import * as userActions from "@features/user/userSlice.ts";
import api from "@api/axios.ts";

import Loading from "@components/Loading.tsx";
import DropDown from "@/components/DropDown";
import AppSidebar from "@components/AppSidebar";
import { socket } from "@api/socket.ts";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";

function App() {
  const [isCheckAuthLoading, setIsCheckAuthLoading] = useState(true);
  const [isChatsLoading, setIsChatsLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const { chatId } = useParams();

  const chat = useAppSelector((state) => {
    if (chatId) {
      return state.chats.chats.find(chat => {
        return chat.id === Number(chatId)
      }) || null;
    }

    return null;
  });

  const logoutHandler = async () => {
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
        <h1>{isCheckAuthLoading ? 'Auth' : 'Loading chats'}</h1>
        <Loading />
      </div>
    );
  }

  if (!chat || !user) {
    return null;
  }

  return user ? (
    <div>
      <SidebarProvider>
        <AppSidebar user={user} logoutHandler={logoutHandler} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky">
            <div className="flex items-center justify-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>

            {chat && (<h2 className="text-gray-100 text-lg font-semibold">{chat.title}</h2>)}

            
            <DropDown />
            
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
          </div>

        </SidebarInset>
      </SidebarProvider>
    </div>
  ) : (
    <Navigate to="/auth?type=login" />
  )
}

export default App;
