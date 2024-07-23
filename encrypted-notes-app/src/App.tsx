import { EditorContent, useEditor } from "@tiptap/react";
import styles from "./App.module.css";
import StarterKit from "@tiptap/starter-kit";

function App() {
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

  return (
    <div className={styles.pageContainer}>
      <div className={styles.sidebar}>Sidebar</div>
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
