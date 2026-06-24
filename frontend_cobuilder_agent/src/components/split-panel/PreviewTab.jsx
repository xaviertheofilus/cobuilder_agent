import { useMemo } from 'react';
import { FiMonitor } from 'react-icons/fi';
import { useProjectStore } from '../../stores/useProjectStore';
import { resolvePreviewUrl } from '../../services/runtimeConfig';
import Spinner from '../ui/Spinner';
import styles from './PreviewTab.module.css';

export default function PreviewTab() {
  const { previewUrl, isGenerating, previewFrameVersion } = useProjectStore();
  const normalizedPreviewUrl = useMemo(() => resolvePreviewUrl(previewUrl), [previewUrl]);

  return (
    <div className={styles.wrap}>
      <div className={styles.content}>
        {isGenerating ? (
          <div className={styles.empty}><Spinner /><p>Generating your app...</p></div>
        ) : normalizedPreviewUrl ? (
          <iframe
            key={`${normalizedPreviewUrl}-${previewFrameVersion}`}
            title="preview"
            src={normalizedPreviewUrl}
            className={styles.frame}
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className={styles.empty}><FiMonitor /><h4>No preview yet</h4><p>Generate an app to see it here.</p></div>
        )}
      </div>
    </div>
  );
}
