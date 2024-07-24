import { Content } from "@tiptap/react";

export type Note = {
  id: string;
  title: string;
  content: Content;
  updatedAt: Date;
};

// UserData
export type UserData = {
  username: string;
  passphrase: string;
};
