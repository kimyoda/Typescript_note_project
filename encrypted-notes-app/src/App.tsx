import { EditorContent, useEditor } from "@tiptap/react";
import styles from "./App.module.css";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import Note from "./todo";

function App() {
  // 상태관리
  const [notes, setNotes] = useState<Record<string, Note>>({});

  // editor 라이브러리
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello Notes</p>",
  });

  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  const handleCreateNewNote = () => {
    const newNote = {
      id: uuid(),
      title: "New Note",
      content: editor?.getJSON() as any,
      updatedAt: new Date(),
    };
    setNotes((notes) => ({
      ...notes,
      [newNote.id]: newNote,
    }));
  };

  const noteList = Object.values(notes).sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.sidebar}>
        <button className={styles.sidebarButton} onClick={handleCreateNewNote}>
          New Note
        </button>
        <div className={styles.sidebarList}>
          {noteList.map((note) => (
            <div
              key={note.id}
              role="button"
              tabIndex={0}
              className={styles.sidebarItem}
            >
              {note.title}
            </div>
          ))}
        </div>
      </div>
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
    </div>
  );
}

export default App;
