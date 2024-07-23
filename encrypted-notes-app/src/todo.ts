import { JSONContent } from "@tiptap/react";

type Note = {
  id: string;
  title: string;
  content: JSONContent;
  updatedAt: Date;
};

export default Note;
