import { useState } from "react";
import LoginPage from "./LoginPage";
import NotesPage from "./NotesPage";
import { UserData } from "./types";

const App = () => {
  const [UserData, setUserData] = useState<UserData>();

  return UserData ? (
    <NotesPage userData={UserData} />
  ) : (
    <LoginPage setUserData={setUserData} />
  );
};

export default App;
