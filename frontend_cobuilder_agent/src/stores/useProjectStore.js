import { create } from 'zustand';

const TABS = {
  PREVIEW: 'preview',
  CODE: 'code',
};

const AGENT_PHASE = {
  WAITING: 'waiting',
  RUNNING: 'running',
  COOKING: 'cooking',
};

const initialMessages = {
  p0: [],
  p1: [],
  p2: [],
  p3: [],
};

const now = () => new Date().toISOString();
const today = () => now().slice(0, 10);

export const useProjectStore = create((set, get) => ({
  projects: [
    { id: 'p0', name: 'Untitled Project', status: 'idle', lastEdited: '2026-06-23', starred: false },
    { id: 'p1', name: 'HR Leave Portal', status: 'completed', lastEdited: '2025-06-20', starred: false },
    { id: 'p2', name: 'Asset Tracker', status: 'idle', lastEdited: '2025-06-18', starred: false },
    { id: 'p3', name: 'Report Generator', status: 'idle', lastEdited: '2025-06-15', starred: false },
  ],
  activeProjectId: 'p0',
  messages: initialMessages,
  streamingText: '',
  isStreaming: false,
  isGenerating: false,
  generationStatus: 'idle',
  generationProgress: 0,
  previewUrl: null,
  codeFiles: [],
  activeCodeFile: null,
  isPanelOpen: false,
  activeTab: TABS.PREVIEW,
  selectedStyle: null,
  isStylePickerOpen: false,
  draftPrompt: '',
  attachments: [],
  agentPhase: AGENT_PHASE.WAITING,
  isSidebarCollapsed: false,

  createProject: () => {
    const id = crypto.randomUUID();
    set((state) => ({
      projects: [{ id, name: 'Untitled Project', status: 'idle', lastEdited: today(), starred: false }, ...state.projects],
      messages: { ...state.messages, [id]: [] },
      activeProjectId: id,
      isStylePickerOpen: false,
      draftPrompt: '',
      attachments: [],
      agentPhase: AGENT_PHASE.WAITING,
    }));
  },
  renameProject: (id, name) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id
          ? {
              ...project,
              name: name ?? '',
              lastEdited: today(),
            }
          : project
      ),
    })),
  deleteProject: (id) =>
    set((state) => {
      const nextProjects = state.projects.filter((project) => project.id !== id);
      if (!nextProjects.length) return state;
      const nextActive = state.activeProjectId === id ? nextProjects[0].id : state.activeProjectId;
      const nextMessages = { ...state.messages };
      delete nextMessages[id];
      return {
        projects: nextProjects,
        activeProjectId: nextActive,
        messages: nextMessages,
      };
    }),
  toggleStar: (id) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id
          ? {
              ...project,
              starred: !project.starred,
              lastEdited: today(),
            }
          : project
      ),
    })),
  setActiveProject: (id) =>
    set((state) => ({
      activeProjectId: id,
      isStylePickerOpen: false,
      draftPrompt: '',
      attachments: [],
      agentPhase: AGENT_PHASE.WAITING,
      projects: state.projects.map((project) =>
        project.id === id
          ? {
              ...project,
              lastEdited: today(),
            }
          : project
      ),
    })),
  addMessage: (projectId, message) =>
    set((state) => {
      const bucket = state.messages[projectId] ?? [];
      return {
        messages: {
          ...state.messages,
          [projectId]: [...bucket, { id: message.id || crypto.randomUUID(), createdAt: now(), ...message }],
        },
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                lastEdited: today(),
              }
            : project
        ),
      };
    }),
  setStreamingText: (text) => set({ streamingText: text }),
  appendStreamingText: (chunk) => set((state) => ({ streamingText: `${state.streamingText}${chunk}` })),
  finalizeStream: () => {
    const state = get();
    if (!state.streamingText.trim()) {
      set({ isStreaming: false, streamingText: '', agentPhase: AGENT_PHASE.WAITING });
      return;
    }
    state.addMessage(state.activeProjectId, {
      role: 'assistant',
      type: 'text',
      content: state.streamingText,
    });
    set({ streamingText: '', isStreaming: false, agentPhase: AGENT_PHASE.COOKING });
  },
  setIsStreaming: (value) => set({ isStreaming: value }),
  setIsGenerating: (value) => set({ isGenerating: value, agentPhase: value ? AGENT_PHASE.COOKING : AGENT_PHASE.WAITING }),
  setGenerationStatus: (status) => set({ generationStatus: status }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
  setPreviewUrl: (url) => set({ previewUrl: url }),
  setCodeFiles: (files) => set({ codeFiles: files, activeCodeFile: files?.[0]?.path ?? null }),
  setActiveCodeFile: (path) => set({ activeCodeFile: path }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  setPanelOpen: (open) => set({ isPanelOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedStyle: (style) => set({ selectedStyle: style }),
  setStylePickerOpen: (open) => set({ isStylePickerOpen: open }),
  setDraftPrompt: (text) => set({ draftPrompt: text }),
  setAttachments: (attachments) => set({ attachments }),
  clearComposer: () => set({ draftPrompt: '', attachments: [] }),
  setAgentPhase: (phase) => set({ agentPhase: phase }),
  setSidebarCollapsed: (value) => set({ isSidebarCollapsed: value }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  getActiveMessages: () => {
    const state = get();
    return state.messages[state.activeProjectId] ?? [];
  },
  tabs: TABS,
  agentPhases: AGENT_PHASE,
}));

