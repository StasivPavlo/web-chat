import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router";

import SelectChat from '@pages/SelectChat.tsx';
import Chat from '@pages/Chat.tsx';
import Activation from "@pages/Activation.tsx";
import Auth from "@pages/Auth.tsx";

interface Props {
  children: React.ReactNode,
}

const AppRouter: React.FC<Props> = ({ children }) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/activate" element={<Activation />} />
        <Route element={children}>
          <Route path="/" element={<SelectChat />} />
          <Route path="/:chatId" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
