import { useEffect, useMemo } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import ChatArea from '../components/chat/ChatArea';
import ChatInput from '../components/chat/ChatInput';
import SplitPanel from '../components/split-panel/SplitPanel';
import { useProjectStore } from '../stores/useProjectStore';
import { usePoller } from '../hooks/usePoller';
import { useAuthStore } from '../stores/useAuthStore';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { activeProjectId, setActiveProject, isPanelOpen, messages, projects } = useProjectStore();
  const { theme } = useAuthStore();

  usePoller(activeProjectId);

  const hasConversation = useMemo(
    () => (messages[activeProjectId] ?? []).some((message) => message.role === 'user'),
    [activeProjectId, messages]
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!activeProjectId && projects.length) setActiveProject(projects[0].id);
  }, [activeProjectId, projects, setActiveProject]);

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <div className={styles.main}>
        <TopBar />
        <div className={styles.workspace}>
          <div className={`${styles.chatCol} ${isPanelOpen ? styles.chatColShrink : ''}`}>
            <ChatArea />
            {hasConversation ? <ChatInput /> : null}
          </div>
          {isPanelOpen ? <SplitPanel /> : null}
        </div>
      </div>
    </div>
  );
}
