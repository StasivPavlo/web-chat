import React, {useCallback, useState} from "react";

import Button from "./Button.tsx";
import CreateChatModal from "./CreateChatModal.tsx";

const SideBar: React.FC = () => {
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);

  const createChatHandler = () => {
    setIsCreateChatModalOpen(true);
  }

  const closeCreateChatModalHandle = useCallback(() => setIsCreateChatModalOpen(false), [setIsCreateChatModalOpen])

  return (
    <div>
      <Button onClick={createChatHandler}>Create Chat</Button>
      <CreateChatModal
        isOpen={isCreateChatModalOpen}
        onClose={closeCreateChatModalHandle}
      />
    </div>
  )
}

export default SideBar;
