import { useProjectStore } from '../stores/useProjectStore';
import { streamChat } from '../services/streamChat';

export function useStream() {
  const {
    activeProjectId,
    addMessage,
    setStreamingText,
    appendStreamingText,
    finalizeStream,
    setIsStreaming,
    setIsGenerating,
    setGenerationStatus,
    setGenerationProgress,
    setPanelOpen,
    setActiveTab,
    setAgentPhase,
    clearComposer,
    setSidebarCollapsed,
    tabs,
    agentPhases,
  } = useProjectStore();

  const send = async (text, attachments = []) => {
    if (!activeProjectId || !text?.trim()) return;

    addMessage(activeProjectId, {
      role: 'user',
      type: 'text',
      content: text,
      attachments,
    });

    setSidebarCollapsed(true);
    setIsStreaming(true);
    setStreamingText('');
    setAgentPhase(agentPhases.RUNNING);

    await streamChat(
      activeProjectId,
      text,
      (chunk) => appendStreamingText(chunk),
      () => {
        finalizeStream();
        setIsGenerating(true);
        setGenerationStatus('pending');
        setGenerationProgress(0);
        setPanelOpen(true);
        setActiveTab(tabs.PREVIEW);
        clearComposer();
      },
      () => {
        finalizeStream();
      }
    );
  };

  return { send };
}
