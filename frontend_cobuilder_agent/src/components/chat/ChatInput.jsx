import { useEffect, useMemo, useRef, useState } from 'react';
import { FiArrowUp, FiPaperclip, FiSliders, FiX } from 'react-icons/fi';
import { MdSupportAgent } from 'react-icons/md';
import { useProjectStore } from '../../stores/useProjectStore';
import { useStream } from '../../hooks/useStream';
import { fetchAiQuestions } from '../../services/aiQuestions';
import styles from './ChatInput.module.css';

const ACCEPTED_TYPES = '.png,.jpg,.jpeg,.pdf,.txt,.md';
const MAX_TEXTAREA_HEIGHT = 164;
const EMPTY_TEXTAREA_HEIGHT = 24;

function statusText({ isStreaming, isGenerating, generationStatus, agentPhase }) {
  if (isStreaming) return 'Agent is running...';
  if (isGenerating && generationStatus === 'pending') return 'Agent is thinking...';
  if (isGenerating) return 'Agent is cooking...';
  if (agentPhase === 'thinking') return 'Agent is thinking...';
  if (agentPhase === 'cooking') return 'Agent is cooking...';
  if (agentPhase === 'running') return 'Agent is running...';
  return 'Agent is waiting...';
}

export default function ChatInput({ embedded = false }) {
  const { send } = useStream();
  const fileRef = useRef(null);
  const textRef = useRef(null);
  const {
    activeProjectId,
    projects,
    messages,
    isStreaming,
    isGenerating,
    generationStatus,
    setStylePickerOpen,
    draftPrompt,
    setDraftPrompt,
    attachments,
    setAttachments,
    selectedStyle,
    agentPhase,
  } = useProjectStore();

  const [questionSet, setQuestionSet] = useState(null);
  const [checkedAnswers, setCheckedAnswers] = useState([]);
  const [dismissQuestion, setDismissQuestion] = useState(false);

  const activeProject = useMemo(
    () => projects.find((item) => item.id === activeProjectId),
    [projects, activeProjectId]
  );

  const latestUserMessage = useMemo(() => {
    const bucket = messages[activeProjectId] ?? [];
    return [...bucket].reverse().find((item) => item.role === 'user');
  }, [messages, activeProjectId]);

  const shouldShowStyle = !(activeProject?.hasRunOnce);

  useEffect(() => {
    const node = textRef.current;
    if (!node) return;

    node.style.height = 'auto';
    if (!draftPrompt.trim()) {
      node.style.height = `${EMPTY_TEXTAREA_HEIGHT}px`;
      return;
    }
    node.style.height = `${Math.min(node.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [draftPrompt]);

  useEffect(() => {
    let cancelled = false;

    if (!activeProject?.hasRunOnce || !latestUserMessage?.id) {
      return () => {
        cancelled = true;
      };
    }

    fetchAiQuestions(activeProjectId, {
      seedText: latestUserMessage.content || '',
      latestMessageId: latestUserMessage.id,
    }).then((data) => {
      if (cancelled) return;
      setQuestionSet({ projectId: activeProjectId, ...data });
      setCheckedAnswers([]);
      setDismissQuestion(false);
    });

    return () => {
      cancelled = true;
    };
  }, [activeProject?.hasRunOnce, activeProjectId, latestUserMessage?.content, latestUserMessage?.id]);

  const composerStatus = statusText({ isStreaming, isGenerating, generationStatus, agentPhase });
  const hasPrompt = Boolean(draftPrompt.trim());
  const hasCheckedAnswers = checkedAnswers.length > 0;
  const isSendDisabled = isStreaming || isGenerating || (!hasPrompt && !hasCheckedAnswers);

  const buildPromptWithAnswers = () => {
    const picked = (questionSet?.options || []).filter((item) => checkedAnswers.includes(item));

    const basePrompt = draftPrompt.trim();

    if (!picked.length) return basePrompt;
    if (!basePrompt) return `Clarification choices: ${picked.join('; ')}`;

    return `${basePrompt}\n\nClarification choices: ${picked.join('; ')}`;
  };

  const handleSend = () => {
    if (isSendDisabled) return;
    send(buildPromptWithAnswers(), attachments);
    setCheckedAnswers([]);
    setDismissQuestion(false);
  };

  return (
    <div className={`${styles.wrap} ${embedded ? styles.embedded : ''}`}>
      <div className={styles.composer}>
        <div className={styles.agentStatus}>
          <span className={styles.statusDot} />
          <MdSupportAgent />
          <span>{composerStatus}</span>
        </div>

        {activeProject?.hasRunOnce && questionSet?.projectId === activeProjectId && !dismissQuestion ? (
          <div className={styles.questionCard}>
            <div className={styles.questionHead}>
              <div className={styles.questionTitle}>{questionSet.title}</div>
              <button
                type="button"
                className={styles.exitBtn}
                onClick={() => setDismissQuestion(true)}
                aria-label="Exit question"
              >
                <FiX />
              </button>
            </div>

            <div className={styles.choiceList}>
              {questionSet.options.slice(0, 3).map((option) => (
                <label key={option} className={styles.choiceItem}>
                  <input
                    type="checkbox"
                    checked={checkedAnswers.includes(option)}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setCheckedAnswers((prev) => [...prev, option]);
                        return;
                      }
                      setCheckedAnswers((prev) => prev.filter((item) => item !== option));
                    }}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ) : null}

        <textarea
          ref={textRef}
          className={styles.textarea}
          rows={1}
          placeholder="Balas langsung saja..."
          value={draftPrompt}
          onChange={(event) => setDraftPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
        />

        {attachments.length ? (
          <div className={styles.files}>
            {attachments.map((file) => (
              <button
                type="button"
                key={`${file.name}-${file.size}`}
                className={styles.fileChip}
                onClick={() => setAttachments(attachments.filter((item) => item !== file))}
              >
                {file.name}
              </button>
            ))}
          </div>
        ) : null}

        <div className={styles.actions}>
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPTED_TYPES}
            multiple
            className={styles.fileInput}
            onChange={(event) => {
              const files = Array.from(event.target.files || []);
              setAttachments(files);
            }}
          />
          <button className={styles.toolBtn} type="button" aria-label="Attach" onClick={() => fileRef.current?.click()}>
            <FiPaperclip /> Attach
          </button>
          {shouldShowStyle ? (
            <button
              className={`${styles.toolBtn} ${selectedStyle ? styles.styleSelected : ''}`}
              type="button"
              aria-label="Style"
              onClick={() => setStylePickerOpen(true)}
            >
              <FiSliders /> Style
            </button>
          ) : null}
          <button className={styles.sendBtn} type="button" disabled={isSendDisabled} onClick={handleSend}>
            <FiArrowUp /> Run
          </button>
        </div>
      </div>
    </div>
  );
}

