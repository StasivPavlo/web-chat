export interface Chat {
  id: number;
  title: string;
  messages: Message[];
}

export interface Message {
  userId: number;
  message: string;
  time: string;
}
