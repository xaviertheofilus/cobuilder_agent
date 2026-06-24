import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiStar } from 'react-icons/ci';
import { FiEdit3, FiLogOut, FiMoreHorizontal, FiSidebar, FiTrash2 } from 'react-icons/fi';
import { GoProjectSymlink } from 'react-icons/go';
import { RiChatNewLine } from 'react-icons/ri';
import { useProjectStore } from '../../stores/useProjectStore';
import { useAuthStore } from '../../stores/useAuthStore';
import styles from './Sidebar.module.css';

function ProjectSection({
  title,
  icon: Icon,
  projects,
  activeProjectId,
  openMenuId,
  editingProjectId,
  editName,
  setEditName,
  onProjectClick,
  onMenuOpen,
  onRenameStart,
  onRenameCommit,
  onRenameCancel,
  onToggleStar,
  onDelete,
}) {
  if (!projects.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.label}>
        <Icon />
        <span>{title}</span>
      </div>
      {projects.map((project) => {
        const active = project.id === activeProjectId;
        const isEditing = editingProjectId === project.id;

        return (
          <div key={project.id} className={`${styles.item} ${active ? styles.active : ''}`}>
            <button type="button" className={styles.projectBtn} onClick={() => onProjectClick(project.id)}>
              <div className={styles.projectMain}>
                <GoProjectSymlink />
                {isEditing ? (
                  <input
                    autoFocus
                    className={styles.inlineInput}
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    onBlur={() => onRenameCommit(project.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') onRenameCommit(project.id);
                      if (event.key === 'Escape') onRenameCancel();
                    }}
                  />
                ) : (
                  <span className={styles.name}>{project.name}</span>
                )}
              </div>
              <span className={styles.date}>{project.lastEdited}</span>
            </button>
            {!isEditing ? (
              <div className={styles.menuWrap} onClick={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  className={styles.moreBtn}
                  aria-label="Project menu"
                  onClick={() => onMenuOpen(openMenuId === project.id ? null : project.id)}
                >
                  <FiMoreHorizontal />
                </button>
                {openMenuId === project.id ? (
                  <div className={styles.menu}>
                    <button type="button" onClick={() => onToggleStar(project.id)}>
                      <CiStar /> {project.starred ? 'Unstar' : 'Star'}
                    </button>
                    <button type="button" onClick={() => onRenameStart(project)}>
                      <FiEdit3 /> Rename project
                    </button>
                    <button type="button" className={styles.danger} onClick={() => onDelete(project.id)}>
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const {
    projects,
    activeProjectId,
    setActiveProject,
    createProject,
    deleteProject,
    renameProject,
    toggleStar,
    isSidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed,
  } = useProjectStore();
  const { user, logout, theme } = useAuthStore();
  const logo = theme === 'dark' ? '/logo_white.png' : '/logo_black.png';

  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editName, setEditName] = useState('');

  const starredProjects = useMemo(() => projects.filter((project) => project.starred), [projects]);
  const lastProjects = useMemo(() => projects.filter((project) => !project.starred), [projects]);

  useEffect(() => {
    const closeOnOutside = () => setOpenMenuId(null);
    window.addEventListener('click', closeOnOutside);
    return () => window.removeEventListener('click', closeOnOutside);
  }, []);
  useEffect(() => {
    const syncMobile = () => {
      if (window.innerWidth <= 960) setSidebarCollapsed(true);
    };
    syncMobile();
    window.addEventListener('resize', syncMobile);
    return () => window.removeEventListener('resize', syncMobile);
  }, [setSidebarCollapsed]);

  const handleDelete = (id) => {
    if (projects.length <= 1) return;
    deleteProject(id);
    setOpenMenuId(null);
  };

  const startProject = starredProjects[0] || projects[0];

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 960) {
      setSidebarCollapsed(true);
      return;
    }
    toggleSidebar();
  };

  return (
    <aside className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.head}>
        {!isSidebarCollapsed ? <img src={logo} alt="BSI CoBuilder" className={styles.logo} /> : null}
        <button type="button" className={styles.collapseBtn} onClick={handleToggleSidebar} aria-label="Toggle sidebar">
          <FiSidebar />
        </button>
      </div>

      {isSidebarCollapsed ? (
        <div className={styles.compactActions}>
          <button
            type="button"
            className={styles.compactIcon}
            title="New Project"
            onClick={() => {
              createProject();
              navigate('/dashboard');
            }}
          >
            <RiChatNewLine />
          </button>
          <button
            type="button"
            className={`${styles.compactIcon} ${styles.startIcon}`}
            title="Star"
            onClick={() => {
              if (!startProject) return;
              setActiveProject(startProject.id);
              setSidebarCollapsed(false);
            }}
          >
            <CiStar />
          </button>
        </div>
      ) : (
        <>
          <div className={styles.newWrap}>
            <button
              type="button"
              className={styles.newProjectBtn}
              title="New project"
              onClick={() => {
                createProject();
                navigate('/dashboard');
              }}
            >
              <RiChatNewLine />
              <span>New Project</span>
            </button>
          </div>

          <div className={styles.projects}>
            <ProjectSection
              title="Starred Projects"
              icon={CiStar}
              projects={starredProjects}
              activeProjectId={activeProjectId}
              openMenuId={openMenuId}
              editingProjectId={editingProjectId}
              editName={editName}
              setEditName={setEditName}
              onProjectClick={(id) => {
                setActiveProject(id);
                setOpenMenuId(null);
              }}
              onMenuOpen={setOpenMenuId}
              onRenameStart={(project) => {
                setOpenMenuId(null);
                setEditingProjectId(project.id);
                setEditName(project.name);
              }}
              onRenameCommit={(id) => {
                renameProject(id, editName.trim() || 'Untitled Project');
                setEditingProjectId(null);
              }}
              onRenameCancel={() => {
                setEditingProjectId(null);
              }}
              onToggleStar={(id) => {
                toggleStar(id);
                setOpenMenuId(null);
              }}
              onDelete={handleDelete}
            />

            <ProjectSection
              title="Last Projects"
              icon={GoProjectSymlink}
              projects={lastProjects}
              activeProjectId={activeProjectId}
              openMenuId={openMenuId}
              editingProjectId={editingProjectId}
              editName={editName}
              setEditName={setEditName}
              onProjectClick={(id) => {
                setActiveProject(id);
                setOpenMenuId(null);
              }}
              onMenuOpen={setOpenMenuId}
              onRenameStart={(project) => {
                setOpenMenuId(null);
                setEditingProjectId(project.id);
                setEditName(project.name);
              }}
              onRenameCommit={(id) => {
                renameProject(id, editName.trim() || 'Untitled Project');
                setEditingProjectId(null);
              }}
              onRenameCancel={() => {
                setEditingProjectId(null);
              }}
              onToggleStar={(id) => {
                toggleStar(id);
                setOpenMenuId(null);
              }}
              onDelete={handleDelete}
            />
          </div>

          <div className={styles.bottom}>
            <div className={styles.avatar}>{(user?.name || 'Admin').slice(0, 2).toUpperCase()}</div>
            <div className={styles.userBlock}>
              <div className={styles.userName}>{user?.name || 'Admin'}</div>
              <div className={styles.userEmail}>{user?.email || 'admin@bsi.co.id'}</div>
            </div>
            <button
              type="button"
              className={styles.logout}
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <FiLogOut />
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
