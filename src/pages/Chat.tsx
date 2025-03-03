import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useAppDispatch, useAppSelector } from "../hooks/hooks.ts";
import * as chatsAction from "../features/chats/chatsSlice.ts";

import { socket } from "../api/socket.ts";

import Input from "./../comoponents/Input.tsx";
import Button from "./../comoponents/Button.tsx";

const Chat = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { chatId } = useParams();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const chat = useAppSelector((state) => {
    if (chatId) {
      return state.chats.chats.find(chat => {
        return chat.id === Number(chatId)
      }) || null;
    }

    return null;
  });
  const user = useAppSelector((state) => state.user.user);

  const messages = chat ? chat.messages : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!chat) {
      navigate('/')
    }
  }, [chat]);

  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (user && chat && input) {
      socket.emit('message', { chatId: chatId, message: input });
      dispatch(chatsAction.addMessage({ userId: user.id, chatId: chat.id, message: input }));
      setInput('');
    }
  };

  if (!chat || !user) {
    return null;
  }

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md border border-gray-700 bg-gray-900 p-4 rounded-lg shadow-lg">
      <h2 className="text-gray-100 text-lg font-semibold mb-2">Chat</h2>
      <div className="flex-1 overflow-y-auto space-y-2 p-2 border border-gray-700 rounded-lg bg-gray-800">
        { messages.map((msg, index) => (
            <div
              key={index}
              className={`relative p-2 text-gray-200 rounded-lg max-w-xs ${
                msg.userId === user.id ? "bg-blue-600 ml-auto" : "bg-gray-700 mr-auto"
              }`}
            >
              <span className="block text-xs text-gray-300 mb-1">{msg.userId}</span>
              {msg.message}
              <span className="absolute bottom-1 right-2 text-xs text-gray-300">{new Date(msg.time).toLocaleString()}</span>
            </div>
          )
        ) }
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2 mt-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400"
        />
        <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700 text-white">
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
