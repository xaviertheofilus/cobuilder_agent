import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiMoon,
} from "react-icons/fi";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import TypingCodeCard from "../components/marketing/TypingCodeCard";
import { useAuthStore } from "../stores/useAuthStore";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, theme, toggleTheme } = useAuthStore();
  const [email, setEmail] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const logo = theme === "dark" ? "/logo_white.png" : "/logo_black.png";

  const lines = useMemo(
    () => [
      "const session = await auth.signIn({ email, password });",
      "if (!session.ok) throw new Error('Invalid credentials');",
      "navigate('/dashboard');",
      "// secure internal app workspace",
    ],
    [],
  );

  return (
    <div className={styles.page}>
      <section className={styles.left}>
        <button
          type="button"
          className={styles.logoBtn}
          onClick={() => navigate("/")}
          aria-label="Back to home"
        >
          <img src={logo} alt="BSI CoBuilder" className={styles.logo} />
        </button>

        <h1>Login</h1>
        <p>Welcome back to CoBuilder Agent BSI.</p>

        <div className={styles.form}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={FiMail}
          />
          <Input
            label="Password"
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={FiLock}
            error={error}
            rightElement={
              <button
                type="button"
                className={styles.eye}
                onClick={() => setShowPass((value) => !value)}
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            }
          />

          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={FiArrowRight}
            onClick={async () => {
              const result = await login(email, password);
              if (result.ok) {
                setError("");
                navigate("/dashboard");
                return;
              }
              setError(result.error);
            }}
          >
            Log in
          </Button>
        </div>

        <div className={styles.divider}>
          <span />
          or
          <span />
        </div>
        <Button variant="secondary" fullWidth>
          Continue with BSI SSO
        </Button>

        <div className={styles.switchText}>
          New to CoBuilder?{" "}
          <button type="button" onClick={() => navigate("/register")}>
            Create Account
          </button>
        </div>
      </section>

      <section className={styles.right}>
        <button type="button" className={styles.themeBtn} onClick={toggleTheme}>
          <FiMoon />
        </button>
        <TypingCodeCard title="login.tsx" lines={lines} />
      </section>
    </div>
  );
}
