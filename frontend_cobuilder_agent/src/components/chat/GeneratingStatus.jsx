import { useProjectStore } from '../../stores/useProjectStore';
import styles from './GeneratingStatus.module.css';

const statusLabel = {
  idle: 'Idle',
  pending: 'Analyzing requirements...',
  generating: 'Generating frontend and API layer...',
  completed: 'Finalizing...',
  failed: 'Generation failed',
};

export default function GeneratingStatus() {
  const { generationStatus, generationProgress } = useProjectStore();

  return (
    <div className={styles.box}>
      <div className={styles.row}>
        <span>{statusLabel[generationStatus] || 'Generating...'}</span>
        <span>{generationProgress}%</span>
      </div>
      <div className={styles.track}>
        <div className={styles.progress} style={{ width: `${generationProgress}%` }} />
      </div>
    </div>
  );
}

