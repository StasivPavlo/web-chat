import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import * as chatsAction from "@features/chats/chatsSlice.ts";
import ChatBar from "@/components/ChatBar";
import MessageContextMenu from "@/components/MessageContextMenu";

const Chat = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { chatId } = useParams();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [messagesBackgroundWidth, setMessagesBackgroundWidth] = useState(0);
  const chat = useAppSelector((state) => chatId ? state.chats.chats.find(chat => chat.id === Number(chatId)) || null : null);
  const user = useAppSelector((state) => state.user.user);
  const messages = chat ? chat.messages : [];

  useEffect(() => {
    const updateWidth = () => {
      if (messagesContainerRef.current) {
        setMessagesBackgroundWidth(messagesContainerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    if (chat) {
      dispatch(chatsAction.setCurrentChat(chat.id));
    } else {
      dispatch(chatsAction.setCurrentChat(null));
      navigate('/');
    }
  }, [chat]);

  if (!chat || !user) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div ref={messagesContainerRef} className="bg-muted/50 md:min-h-min">
        <div className="h-[80vh] flex flex-col-reverse overflow-y-auto">
          <div className="chat-message-container flex flex-col justify-end gap-2 p-2">
            {messages.map((msg, index) => {
              const messageStyle = {
                maxWidth: messagesBackgroundWidth ? `${messagesBackgroundWidth * 0.6}px` : "75%",
              };

              return (
                <div className={`${msg.userId === user.id ? "self-end" : ""}`} key={index}>
                  <MessageContextMenu>
                    <div
                      className={`inline-block p-2 text-gray-200 rounded-lg ${msg.userId === user.id ? "bg-primary" : "bg-muted"}`}
                      style={messageStyle}
                    >
                      <div className="flex flex-col">
                        <span className={`break-words ${msg.userId === user.id ? "text-secondary" : "text-primary"}`}>
                          {msg.message}
                        </span>
                        <div className="flex justify-end mt-1">
                          <span
                            title={new Date(msg.time).toLocaleString()}
                            className={`text-xs cursor-default ${msg.userId === user.id ? "text-secondary" : "text-primary"}`}
                          >
                            {new Date(msg.time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </MessageContextMenu>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>



      <ChatBar />
    </div>
  );
};

export default Chat;
