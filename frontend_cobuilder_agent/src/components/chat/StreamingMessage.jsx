import styles from './StreamingMessage.module.css';

export default function StreamingMessage({ text }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.bubble}>
        {text}
        <span className={styles.cursor}>|</span>
      </div>
    </div>
  );
}

