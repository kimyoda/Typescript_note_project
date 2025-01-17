import styles from "./NotesPage.module.css";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { Note, UserData } from "./types";
import NoteEditor from "./NoteEditor";
import { JSONContent } from "@tiptap/react";
import storage from "./storage";
import debounce from "./debounce";
import { AES, enc } from "crypto-js";

const STORAGE_KEY = "notes";

const loadNotes = ({ username, passphrase }: UserData) => {
  const noteIds = storage.get<string[]>(`${username}: ${STORAGE_KEY}`, []);
  const notes: Record<string, Note> = {};
  noteIds.forEach((id) => {
    const encryptedNote = storage.get<string>(
      `${username}: ${STORAGE_KEY}: ${id}`
    );
    const note: Note = JSON.parse(
      AES.decrypt(encryptedNote, passphrase).toString(enc.Utf8)
    );
    notes[note.id] = {
      ...note,
      updatedAt: new Date(note.updatedAt),
    };
  });
  return notes;
};

const saveNote = debounce((note: Note, { username, passphrase }: UserData) => {
  const noteIds = storage.get<string[]>(`${username}: ${STORAGE_KEY}`, []);
  const noteIdsWithoutNote = noteIds.filter((id) => id !== note.id);
  storage.set(`${username}: ${STORAGE_KEY}`, [...noteIdsWithoutNote, note.id]);

  const encryptedNote = AES.encrypt(
    JSON.stringify(note),
    passphrase
  ).toString();
  storage.set(`${username}: ${STORAGE_KEY}: ${note.id}`, encryptedNote);
}, 200);

type Props = {
  userData: UserData;
};

function App({ userData }: Props) {
  // 상태관리
  const [notes, setNotes] = useState<Record<string, Note>>(() =>
    loadNotes(userData)
  );
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const activeNote = activeNoteId ? notes[activeNoteId] : null;

  const handleChangeNoteContent = (
    noteId: string,
    content: JSONContent,
    title = "New note"
  ) => {
    const updatedNote = {
      ...notes[noteId],
      updatedAt: new Date(),
      content,
      title,
    };

    setNotes((notes) => ({
      ...notes,
      [noteId]: updatedNote,
    }));
    saveNote(updatedNote, userData);
  };

  // 노트 추가
  const handleCreateNewNote = () => {
    const newNote = {
      id: uuid(),
      title: "New note",
      content: `<h1>New note</h1>`,
      updatedAt: new Date(),
    };
    setNotes((notes) => ({
      ...notes,
      [newNote.id]: newNote,
    }));
    setActiveNoteId(newNote.id);
    saveNote(newNote, userData);
  };

  const handleChangeActiveNote = (id: string) => {
    setActiveNoteId(id);
  };

  // updatedAt 기준 note를 내림차순으로 정렬
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
              className={
                note.id === activeNoteId
                  ? styles.sidebarItemActive
                  : styles.sidebarItem
              }
              onClick={() => handleChangeActiveNote(note.id)}
            >
              {note.title}
            </div>
          ))}
        </div>
      </div>
      {activeNote ? (
        <NoteEditor
          note={activeNote}
          onChange={(content, title) =>
            handleChangeNoteContent(activeNote.id, content, title)
          }
        />
      ) : (
        <div>Create a new note or select an existing one.</div>
      )}
    </div>
  );
}

export default App;
