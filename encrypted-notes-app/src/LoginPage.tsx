import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./LoginPage.module.css";
import storage from "./storage";
import { AES, enc } from "crypto-js";
import { v4 as uuidv4 } from "uuid";

// 패스워드 키 설정
const PASSPHRASE_STORAGE_KEY = "passphrase";

// 유저데이터 타입
type Props = {
  setUserData: (UserData: { username: string; passphrase: string }) => void;
};

const LoginPage = ({ setUserData }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // 비밀번호 암호화
    const encryptedPassphrase = storage.get<string | undefined>(
      `${username}: ${PASSPHRASE_STORAGE_KEY}`
    );

    if (!encryptedPassphrase) {
      const passphrase = uuidv4();
      storage.set(
        `${username}: ${PASSPHRASE_STORAGE_KEY}`,
        AES.encrypt(passphrase, password).toString()
      );
      setUserData({ username, passphrase });
      return;
    }

    const passphrase = AES.decrypt(encryptedPassphrase, password).toString(
      enc.Utf8
    );

    if (passphrase) {
      setUserData({ username, passphrase });
    } else {
      setErrorText("Invalid credentials for existing user");
    }
  };

  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className={styles.pageContainer}>
      <form className={styles.loginContainer} onSubmit={handleSubmit}>
        {errorText}
        <label>
          <div>Username</div>
          <input
            name="username"
            type="text"
            className={styles.textField}
            onChange={handleChangeUsername}
            value={username}
          />
        </label>
        <label>
          <div className={styles.labelText}>Password</div>
          <input
            name="Password"
            type="password"
            className={styles.textField}
            onChange={handleChangePassword}
            value={password}
          />
        </label>
        <div>
          <button type="submit" className={styles.button}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
