import { socket } from "@/api/socket";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@components/ui/dropdown-menu";
import { useNavigate, useParams } from "react-router";
import * as chatsActions from '@features/chats/chatsSlice.ts';

const DropDown = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { chatId } = useParams();
  const currentChat = useAppSelector((state) => {
    if (chatId) {
      return state.chats.chats.find(chat => {
        return chat.id === Number(chatId);
      }) || null;
    }

    return null;
  });

  const deleteChatHandler = () => {
    if (currentChat) {
      socket.emit("deleteChat", { chatId: currentChat.id });
      dispatch(chatsActions.remove(currentChat.id));
      navigate('/');
    }
  };

  const deleteMessagesHandler = () => {
    if (currentChat) {
      socket.emit("deleteMessages", { chatId: currentChat.id });
      dispatch(chatsActions.removeMessages({ chatId: currentChat.id }));
    }
  };

  window.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key === 'D') {
      deleteChatHandler();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key === 'H') {
      deleteMessagesHandler();
    }
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-center p-4 cursor-pointer">
          <img className="h-6 w-6 hover:cursor-pointer" src="./src/icons/more.png" alt="Drop Down" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-3">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Turn off messages
            <DropdownMenuShortcut>⇧M</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            View profile
            <DropdownMenuShortcut>⇧P</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⇧S</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={deleteMessagesHandler}>
            Clear history
            <DropdownMenuShortcut>⇧H</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={deleteChatHandler}>
            Delete chat
            <DropdownMenuShortcut>⇧D</DropdownMenuShortcut>
          </DropdownMenuItem>

        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDown;
