import {
  EditorContent,
  useEditor,
  JSONContent,
  generateText,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import styles from "./NoteEditor.module.css";
import { Note } from "./types";

const extensions = [StarterKit];

type Props = {
  note: Note;
  onChange: (content: JSONContent, title?: string) => void;
};

const NoteEditor = ({ note, onChange }: Props) => {
  // editor 라이브러리
  const editor = useEditor(
    {
      extensions,
      content: note.content,
      editorProps: {
        attributes: {
          class: styles.textEditor,
        },
      },
      onUpdate: ({ editor }) => {
        const editorContent = editor.getJSON();
        const firstNodeContent = editorContent.content?.[0];
        onChange(
          editorContent,
          firstNodeContent && generateText(firstNodeContent, extensions)
        );
      },
    },
    [note.id]
  );

  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.toolbar}>
        <button
          className={
            editor?.isActive("italic")
              ? styles.toolbarButtonActive
              : styles.toolbarButton
          }
          onClick={toggleItalic}
        >
          italic
        </button>
        <button
          className={
            editor?.isActive("bold")
              ? styles.toolbarButtonActive
              : styles.toolbarButton
          }
          onClick={toggleBold}
        >
          bold
        </button>
      </div>
      <EditorContent editor={editor} className={styles.textEditorContent} />
    </div>
  );
};

export default NoteEditor;
