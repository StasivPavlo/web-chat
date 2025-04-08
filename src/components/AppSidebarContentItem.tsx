import { Chat } from "@custom-types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Link } from "react-router-dom";

const SidebarContentItem = ({ chat }: { chat: Chat }) => {
  const lastMessage = chat.messages[chat.messages.length - 1];
  const text = lastMessage && (
    lastMessage.message.length < 26
      ? lastMessage.message
      : (lastMessage.message.slice(0, 26 - 3) + '...')
  );
  const time = lastMessage && new Date(lastMessage.time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <Link key={chat.id} to={`/${chat.id}`} className="flex items-center w-full py-2 px-3 rounded-lg hover:bg-secondary/80">
        <Avatar className="mr-3">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
            <div className="flex justify-between items-center">
                <div>{ chat.title }</div>
                { lastMessage && <div className="text-xs">{ time }</div> }
            </div>
            { lastMessage && <div className=" text-xs text-gray-600 font-mono">{ text }</div> }
        </div>
    </Link>
  );
};

export default SidebarContentItem;
