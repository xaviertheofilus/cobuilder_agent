import { MdSupportAgent } from 'react-icons/md';
import styles from './MessageBubble.module.css';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const timeText = message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : '';

  return (
    <div className={`${styles.row} ${isUser ? styles.userRow : ''}`}>
      {!isUser ? <div className={styles.avatar}><MdSupportAgent /></div> : null}
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}>
        <div>{message.content}</div>
        {Array.isArray(message.attachments) && message.attachments.length ? (
          <div className={styles.files}>
            {message.attachments.map((file) => (
              <span key={`${file.name}-${file.size}`} className={styles.file}>{file.name}</span>
            ))}
          </div>
        ) : null}
        <div className={styles.time}>{timeText}</div>
      </div>
    </div>
  );
}
