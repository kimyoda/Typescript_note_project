import { useState } from "react";
import LoginPage from "./LoginPage";
import NotesPage from "./NotesPage";

const App = () => {
  const [UserData, setUserData] = useState<{
    username: string;
    passphrase: string;
  }>();

  return UserData ? <NotesPage /> : <LoginPage setUserData={setUserData} />;
};

export default App;
