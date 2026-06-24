import { useNavigate } from "react-router-dom";
import { FiBookOpen, FiCpu, FiMessageCircle, FiMoon } from "react-icons/fi";
import { useAuthStore } from "../stores/useAuthStore";
import ThemePreviewTabs from "../components/marketing/ThemePreviewTabs";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const { toggleTheme, theme } = useAuthStore();
  const logo = theme === "dark" ? "/logo_white.png" : "/logo_black.png";

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className={styles.page}>
      <header className={styles.navbar}>
        <img src={logo} alt="BSI CoBuilder" className={styles.logo} />
        <div className={styles.rightActions}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={toggleTheme}
          >
            <FiMoon />
          </button>
          <button
            type="button"
            className={styles.navAction}
            onClick={() => scrollTo("faq")}
          >
            Readmore
          </button>
        </div>
      </header>

      <main className={styles.heroSection}>
        <div className={styles.heroInner}>
          <h1>
            Build <span>Internal Apps</span> With a Conversation.
          </h1>
          <p>
            CoBuilder Agent BSI transforms natural language into deployable,
            enterprise-grade internal tools. Streamline your workflow, eliminate
            boilerplate, and focus on business logic.
          </p>
          <div className={styles.ctaRow}>
            <button
              type="button"
              className={styles.primary}
              onClick={() => navigate("/login")}
            >
              Start Building
            </button>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => scrollTo("steps")}
            >
              <FiBookOpen /> How it Works
            </button>
          </div>
        </div>

        <aside className={styles.previewWrap}>
          <ThemePreviewTabs theme={theme} />
        </aside>
      </main>

      <section className={styles.stepsSection} id="steps">
        <div className={styles.stepKicker}>HOW IT WORKS</div>
        <h2>From idea to internal app in three steps.</h2>
        <div className={styles.stepGrid}>
          <article>
            <div className={styles.num}>01</div>
            <div className={styles.icon}>
              <FiMessageCircle />
            </div>
            <h3>Chat</h3>
            <p>Describe the internal tool you need in plain language.</p>
          </article>
          <article>
            <div className={styles.num}>02</div>
            <div className={styles.icon}>
              <FiCpu />
            </div>
            <h3>Generate</h3>
            <p>
              CoBuilder scaffolds the UI, wires data layer, and assembles
              preview.
            </p>
          </article>
          <article>
            <div className={styles.num}>03</div>
            <div className={styles.icon}>
              <FiCpu />
            </div>
            <h3>Deploy</h3>
            <p>Review, refine, and request deploy to BSI infrastructure.</p>
          </article>
        </div>
      </section>

      <section className={styles.faqSection} id="faq">
        <div className={styles.stepKicker}>READMORE</div>
        <h2>Readmore - FAQ</h2>
        <p className={styles.comingSoon}>Coming soon.</p>
      </section>

      <footer className={styles.footer}>
        <span>© 2026 BSI CoBuilder Agent</span>
      </footer>
    </div>
  );
}
