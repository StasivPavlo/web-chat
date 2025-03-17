import React from "react";
import { createPortal } from "react-dom";
import { useFormik } from "formik";

import api from "@api/axios.ts";
import { socket } from "@api/socket.ts";
import { useAppDispatch } from "@hooks/hooks.ts";
import * as chatsAction from "@features/chats/chatsSlice.ts";

import Modal, { ModalContent, ModalTitle } from "@components/Modal.tsx";
import InputWrapper from "@components/InputWrapper.tsx";
import Input from "@components/Input.tsx";
import {Button} from "@components/ui/button";

interface  Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateChatModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      chatName: '',
    },
    onSubmit({ chatName }) {
      api.post('chat/create', { title: chatName }).then((result) => {
        dispatch(chatsAction.add(result.data.chat));
        socket.emit('joinToChat', { chatId: result.data.chat.id });
      });
    },
  });

  return createPortal(
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalTitle>Create Chat</ModalTitle>
      <ModalContent>
        <form onSubmit={formik.handleSubmit}>
          <InputWrapper label="Chat Name">
            <Input
              id="chatName"
              type="text"
              placeholder="Chat Name"
              { ...formik.getFieldProps("chatName") }
            />
          </InputWrapper>
          <Button type="submit">Submit</Button>
        </form>
      </ModalContent>
    </Modal>,
    document.body,
  );
};

export default CreateChatModal;
