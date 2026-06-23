import { FiEdit3, FiMoon, FiSend } from 'react-icons/fi';
import { useProjectStore } from '../../stores/useProjectStore';
import { useAuthStore } from '../../stores/useAuthStore';
import styles from './TopBar.module.css';

export default function TopBar() {
  const {
    projects,
    activeProjectId,
    renameProject,
    messages,
    setPanelOpen,
    setActiveTab,
    tabs,
    activeTab,
    isPanelOpen,
  } = useProjectStore();
  const { toggleTheme } = useAuthStore();
  const project = projects.find((item) => item.id === activeProjectId);
  const hasConversation = (messages[activeProjectId] ?? []).some((message) => message.role === 'user');

  const commitRename = (rawName) => {
    const next = rawName.trim() || 'Untitled Project';
    renameProject(activeProjectId, next);
  };

  return (
    <div className={styles.bar}>
      <div className={styles.titleGroup}>
        <FiEdit3 className={styles.editIcon} />
        <input
          className={styles.titleInput}
          value={project?.name || ''}
          onChange={(event) => renameProject(activeProjectId, event.target.value)}
          onBlur={(event) => commitRename(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              commitRename(event.currentTarget.value);
              event.currentTarget.blur();
            }
            if (event.key === 'Escape') {
              event.currentTarget.value = project?.name || 'Untitled Project';
              event.currentTarget.blur();
            }
          }}
        />
      </div>
      <div className={styles.actions}>
        {hasConversation ? (
          <>
            <button
              type="button"
              className={`${styles.modeBtn} ${isPanelOpen && activeTab === tabs.PREVIEW ? styles.active : ''}`}
              onClick={() => {
                setPanelOpen(true);
                setActiveTab(tabs.PREVIEW);
              }}
            >
              Preview
            </button>
            <button
              type="button"
              className={`${styles.modeBtn} ${isPanelOpen && activeTab === tabs.CODE ? styles.active : ''}`}
              onClick={() => {
                setPanelOpen(true);
                setActiveTab(tabs.CODE);
              }}
            >
              Code
            </button>
            <button type="button" className={styles.deployBtn}>
              <FiSend /> Req Deploy
            </button>
          </>
        ) : null}
        <button type="button" className={styles.theme} onClick={toggleTheme}>
          <FiMoon />
        </button>
      </div>
    </div>
  );
}
