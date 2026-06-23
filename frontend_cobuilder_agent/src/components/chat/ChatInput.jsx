import { useEffect, useRef } from 'react';
import { FiArrowUp, FiPaperclip, FiSliders } from 'react-icons/fi';
import { useProjectStore } from '../../stores/useProjectStore';
import { useStream } from '../../hooks/useStream';
import styles from './ChatInput.module.css';

const ACCEPTED_TYPES = '.png,.jpg,.jpeg,.pdf,.txt,.md';
const MAX_TEXTAREA_HEIGHT = 164;
const EMPTY_TEXTAREA_HEIGHT = 24;

export default function ChatInput({ embedded = false }) {
  const { send } = useStream();
  const fileRef = useRef(null);
  const textRef = useRef(null);
  const {
    isStreaming,
    isGenerating,
    setStylePickerOpen,
    draftPrompt,
    setDraftPrompt,
    attachments,
    setAttachments,
    selectedStyle,
  } = useProjectStore();

  const disabled = isStreaming || isGenerating || !draftPrompt.trim();

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

  return (
    <div className={`${styles.wrap} ${embedded ? styles.embedded : ''}`}>
      <div className={styles.composer}>
        <textarea
          ref={textRef}
          className={styles.textarea}
          rows={1}
          placeholder="e.g Build a smart invoice management web app for the finance team...."
          value={draftPrompt}
          onChange={(event) => setDraftPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              if (disabled) return;
              send(draftPrompt, attachments);
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
          <button
            className={`${styles.toolBtn} ${selectedStyle ? styles.styleSelected : ''}`}
            type="button"
            aria-label="Style"
            onClick={() => setStylePickerOpen(true)}
          >
            <FiSliders /> Style
          </button>
          <button className={styles.sendBtn} type="button" disabled={disabled} onClick={() => send(draftPrompt, attachments)}>
            <FiArrowUp /> Run
          </button>
        </div>
      </div>
    </div>
  );
}
