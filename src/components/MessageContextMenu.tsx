import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuShortcut
} from "@components/ui/context-menu";
import { ContextMenuPortal } from "@radix-ui/react-context-menu";

const MessageContextMenu = ({ ...props }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger >
        {props.children}
      </ContextMenuTrigger>
      <ContextMenuPortal>
        <ContextMenuContent>
          <ContextMenuItem>
            Reply
            <ContextMenuShortcut>⇧R</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem >
            Copy
            <ContextMenuShortcut>⇧C</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem >
            Edit
            <ContextMenuShortcut>⇧E</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem >
            Forward
            <ContextMenuShortcut>⇧F</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem >
            Select
            <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem>
            Delete
            <ContextMenuShortcut>⇧⌘D</ContextMenuShortcut>
          </ContextMenuItem>

        </ContextMenuContent>
      </ContextMenuPortal>
    </ContextMenu>
  );
};

export default MessageContextMenu;