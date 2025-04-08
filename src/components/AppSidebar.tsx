import { useCallback, useState } from "react";

import CreateChatModal from "@components/CreateChatModal.tsx";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@components/ui/sidebar";
import { Button } from "@components/ui/button";
import SearchForm from '@components/SearchForm';
import ProfileDropdown from '@components/ProfileDropdown';
import { useAppSelector } from '@hooks/hooks';
import AppSidebarContent from "@components/AppSidebarContent";

const AppSidebar = () => {
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const { chats } = useAppSelector(state => state.chats);

  const createChatHandler = () => {
    setIsCreateChatModalOpen(true);
  };

  const closeCreateChatModalHandle = useCallback(() => setIsCreateChatModalOpen(false), [setIsCreateChatModalOpen]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <ProfileDropdown />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        { chats ? (
          <AppSidebarContent chats={chats} />
        ) : (
          <div>You don't have any chats</div>
        )}
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
