import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail, FiMoon, FiUser } from 'react-icons/fi';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import TypingCodeCard from '../components/marketing/TypingCodeCard';
import { useAuthStore } from '../stores/useAuthStore';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login, theme, toggleTheme } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const strength =
    password.length === 0 ? 0 : password.length <= 5 ? 1 : password.length <= 9 ? 2 : password.length <= 13 ? 3 : 4;
  const logo = theme === 'dark' ? '/logo_white.png' : '/logo_black.png';

  const lines = useMemo(
    () => [
      "const user = await auth.register({ name, email, password });",
      "assignRole(user.id, 'Submitter');",
      "seedProject(user.id, 'Untitled Project');",
      "navigate('/dashboard');",
    ],
    []
  );

  return (
    <div className={styles.page}>
      <section className={styles.left}>
        <button type="button" className={styles.logoBtn} onClick={() => navigate('/')} aria-label="Back to home">
          <img src={logo} alt="BSI CoBuilder" className={styles.logo} />
        </button>

        <h1>Create Account</h1>
        <p>Start building internal apps in minutes.</p>

        <div className={styles.form}>
          <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} icon={FiUser} placeholder="Your full name" />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            icon={FiMail}
            placeholder="you@bsi.co.id"
          />
          <Input
            label="Password"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            icon={FiLock}
            placeholder="Create a password"
            rightElement={
              <button type="button" className={styles.eye} onClick={() => setShowPass((current) => !current)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            }
          />

          <div className={styles.strength}>
            {[0, 1, 2, 3].map((index) => (
              <span key={index} className={index < strength ? styles.on : ''} />
            ))}
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={FiArrowRight}
            onClick={async () => {
              await login(email || 'admin', password || 'admin');
              navigate('/dashboard');
            }}
          >
            Create Account
          </Button>
        </div>

        <div className={styles.switchText}>
          Already have an account?{' '}
          <button type="button" onClick={() => navigate('/login')}>
            Log in
          </button>
        </div>
      </section>

      <section className={styles.right}>
        <button type="button" className={styles.themeBtn} onClick={toggleTheme}>
          <FiMoon />
        </button>
        <TypingCodeCard title="register.tsx" lines={lines} />
      </section>
    </div>
  );
}
