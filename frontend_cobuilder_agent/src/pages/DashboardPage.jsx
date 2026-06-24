import { useEffect, useMemo, useRef, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import ChatArea from '../components/chat/ChatArea';
import ChatInput from '../components/chat/ChatInput';
import SplitPanel from '../components/split-panel/SplitPanel';
import { useProjectStore } from '../stores/useProjectStore';
import { usePoller } from '../hooks/usePoller';
import { useAuthStore } from '../stores/useAuthStore';
import styles from './DashboardPage.module.css';

const MIN_CHAT_PERCENT = 30;
const MAX_CHAT_PERCENT = 70;
const DEFAULT_CHAT_PERCENT = 52;

export default function DashboardPage() {
  const { activeProjectId, setActiveProject, isPanelOpen, messages, projects } = useProjectStore();
  const { theme } = useAuthStore();
  const workspaceRef = useRef(null);
  const [chatPercent, setChatPercent] = useState(DEFAULT_CHAT_PERCENT);

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

  useEffect(() => {
    if (!isPanelOpen) return undefined;

    const handleMove = (event) => {
      if (!workspaceRef.current) return;
      const rect = workspaceRef.current.getBoundingClientRect();
      if (!rect.width) return;
      const nextPercent = ((event.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.max(MIN_CHAT_PERCENT, Math.min(MAX_CHAT_PERCENT, nextPercent));
      setChatPercent(clamped);
    };

    const handleUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    const startResize = () => {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    };

    const divider = workspaceRef.current?.querySelector('[data-splitter="true"]');
    divider?.addEventListener('mousedown', startResize);

    return () => {
      divider?.removeEventListener('mousedown', startResize);
      handleUp();
    };
  }, [isPanelOpen]);

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <div className={styles.main}>
        <TopBar />
        <div className={styles.workspace} ref={workspaceRef}>
          <div
            className={styles.chatCol}
            style={isPanelOpen ? { flex: `0 0 ${chatPercent}%` } : undefined}
          >
            <ChatArea />
            {hasConversation ? <ChatInput /> : null}
          </div>

          {isPanelOpen ? (
            <>
              <div className={styles.splitter} data-splitter="true" role="separator" aria-orientation="vertical" />
              <SplitPanel widthPercent={100 - chatPercent} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
