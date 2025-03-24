import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import { SendIcon } from "lucide-react";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useParams } from "react-router";

import * as chatsActions from '@features/chats/chatsSlice.ts';
import { socket } from "@api/socket.ts";

const ChatBar = () => {
  const [input, setInput] = useState('');

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const { chatId } = useParams();

  const currentChat = useAppSelector((state) => {
    if (chatId) {
      return state.chats.chats.find(chat => {
        return chat.id === Number(chatId);
      }) || null;
    }

    return null;
  });

  const sendMessageHandler = () => {
    if (user && currentChat && input) {
      socket.emit('message', { chatId: chatId, message: input.trim() });
      dispatch(chatsActions.addMessage({ userId: user.id, chatId: currentChat.id, message: input.trim() }));
      setInput('');

      if (textareaRef.current) {
        textareaRef.current.style.height = "40px";
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  return (
    <div className="flex justify-center items-center mt-0 pt-4">
      <div className="flex items-end border rounded-md p-4 w-full gap-4">
        <Textarea
          placeholder="Type your message..."
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              // eslint-disable-next-line no-console
              console.log('Enter pressed');

              e.preventDefault();
              sendMessageHandler();
            }
          }} />
        <Button onClick={sendMessageHandler} disabled={!input} title="Type your message">
          <SendIcon />
        </Button>
      </div>
    </div>
  );
};

export default ChatBar;
