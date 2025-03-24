import React, { useCallback, useState } from "react";

import CreateChatModal from "@components/CreateChatModal.tsx";
import { User } from "@custom-types/user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "./ui/sidebar";
import { Button } from "@components/ui/button";

interface Props {
  user: User;
  logoutHandler: () => void;
}

const AppSidebar: React.FC<Props> = ({ user, logoutHandler }) => {
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);

  const createChatHandler = () => {
    setIsCreateChatModalOpen(true);
  };

  const closeCreateChatModalHandle = useCallback(() => setIsCreateChatModalOpen(false), [setIsCreateChatModalOpen]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <div>
          <p>{user.name}</p>
          <button onClick={logoutHandler}>Logout</button>
        </div>
        <Button onClick={createChatHandler}>Create Chat</Button>
        <CreateChatModal
          isOpen={isCreateChatModalOpen}
          onClose={closeCreateChatModalHandle}
        />
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
