import { Chat } from "@custom-types/chat";
import AppSidebarContentItem from "@components/AppSidebarContentItem";

function AppSidebarContent({ chats }: { chats: Chat[] }) {
  return (
		<div className="flex flex-col">
			{ chats.map((chat) => <AppSidebarContentItem key={chat.id} chat={chat} />)}
		</div>
  );
}

export default AppSidebarContent;
