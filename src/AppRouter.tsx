import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router";
import Register from './pages/Register.tsx';
import Login from './pages/Login.tsx';
import SelectChat from './pages/SelectChat.tsx';
import Chat from './pages/Chat.tsx';
interface Props {
  children: React.ReactNode,
}

const AppRouter: React.FC<Props> = ({ children }) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={children}>
          <Route path="/" element={<SelectChat />} />
          <Route path="/:chatId" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter
