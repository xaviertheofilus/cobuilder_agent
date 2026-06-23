import { FiMonitor } from 'react-icons/fi';
import { useProjectStore } from '../../stores/useProjectStore';
import Spinner from '../ui/Spinner';
import styles from './PreviewTab.module.css';

export default function PreviewTab() {
  const { previewUrl, isGenerating } = useProjectStore();

  return (
    <div className={styles.wrap}>
      <div className={styles.browserBar}>
        <div className={styles.lights}><span /><span /><span /></div>
        <div className={styles.url}>localhost:3000</div>
      </div>
      <div className={styles.content}>
        {isGenerating ? (
          <div className={styles.empty}><Spinner /><p>Generating your app...</p></div>
        ) : previewUrl ? (
          <iframe title="preview" src={previewUrl} className={styles.frame} sandbox="allow-scripts allow-same-origin" />
        ) : (
          <div className={styles.empty}><FiMonitor /><h4>No preview yet</h4><p>Generate an app to see it here.</p></div>
        )}
      </div>
    </div>
  );
}

