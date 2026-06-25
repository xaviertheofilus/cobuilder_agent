import { useProjectStore } from '../stores/useProjectStore';
import { streamChat } from '../services/streamChat';
import { buildStyleConfig } from '../services/styleConfig';

function toAttachmentPayload(attachments = []) {
  return attachments.map((file) => ({
    name: file.name,
    type: file.type,
    size: file.size,
  }));
}

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
    setAgentPhase,
    clearComposer,
    setSidebarCollapsed,
    setStylePickerOpen,
    markProjectRan,
    agentPhases,
    selectedStyle,
  } = useProjectStore();

  const send = async (text, attachments = []) => {
    if (!activeProjectId || !text?.trim()) return;

    addMessage(activeProjectId, {
      role: 'user',
      type: 'text',
      content: text,
      attachments,
    });

    // Clear prompt immediately after submit so composer never shows stale text while streaming.
    clearComposer();

    markProjectRan(activeProjectId);
    setStylePickerOpen(false);
    setSidebarCollapsed(true);
    setIsStreaming(true);
    setStreamingText('');
    setAgentPhase(agentPhases.RUNNING);

    const payload = {
      ...buildStyleConfig(selectedStyle),
      attachments: toAttachmentPayload(attachments),
    };

    await streamChat(
      activeProjectId,
      text,
      payload,
      (chunk) => appendStreamingText(chunk),
      () => {
        finalizeStream();
        setIsGenerating(true);
        setGenerationStatus('pending');
        setGenerationProgress(0);
      },
      () => {
        finalizeStream();
      }
    );
  };

  return { send };
}
