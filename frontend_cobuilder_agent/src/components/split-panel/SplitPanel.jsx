import { useEffect, useState } from 'react';
import { FiDownload, FiExternalLink, FiRefreshCw, FiX } from 'react-icons/fi';
import JSZip from 'jszip';
import { useProjectStore } from '../../stores/useProjectStore';
import { resolvePreviewLabel, resolvePreviewUrl } from '../../services/runtimeConfig';
import PreviewTab from './PreviewTab';
import styles from './SplitPanel.module.css';

async function downloadZip(codeFiles) {
  const zip = new JSZip();

  if (!codeFiles.length) {
    zip.file('README.txt', 'No generated files yet.');
  } else {
    codeFiles.forEach((file) => {
      zip.file(file.path, file.content || '');
    });
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'cobuilder-generated-code.zip';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function openNewTab(previewTarget) {
  if (!previewTarget) return;
  const next = window.open(previewTarget, '_blank', 'noopener,noreferrer');
  if (next) next.opener = null;
}

export default function SplitPanel({ widthPercent = 48 }) {
  const { codeFiles, setPanelOpen, previewUrl, bumpPreviewFrameVersion } = useProjectStore();
  const previewLabel = resolvePreviewLabel(previewUrl);
  const previewTarget = resolvePreviewUrl(previewUrl);
  const [activeAction, setActiveAction] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!activeAction) return undefined;
    const timer = setTimeout(() => setActiveAction(''), 900);
    return () => clearTimeout(timer);
  }, [activeAction]);

  const onRefresh = () => {
    setActiveAction('refresh');
    setIsRefreshing(true);
    bumpPreviewFrameVersion();
    setTimeout(() => setIsRefreshing(false), 700);
  };

  return (
    <aside className={styles.panel} style={{ flex: `0 0 ${widthPercent}%` }}>
      <div className={styles.tabBar}>
        <div className={styles.hostWrap}>
          <div className={styles.lights}><span /><span /><span /></div>
          <div className={styles.hostLabel}>{previewLabel}</div>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            title="Refresh"
            onClick={onRefresh}
            className={activeAction === 'refresh' ? styles.actionActive : ''}
          >
            <FiRefreshCw className={isRefreshing ? styles.spin : ''} />
          </button>
          <button
            type="button"
            title={previewTarget ? 'New tab' : 'No preview yet'}
            onClick={() => {
              if (!previewTarget) return;
              setActiveAction('newtab');
              openNewTab(previewTarget);
            }}
            disabled={!previewTarget}
            className={activeAction === 'newtab' ? styles.actionActive : ''}
          >
            <FiExternalLink />
          </button>
          <button
            type="button"
            title="ZIP"
            onClick={() => {
              setActiveAction('zip');
              downloadZip(codeFiles);
            }}
            className={activeAction === 'zip' ? styles.actionActive : ''}
          >
            <FiDownload />
          </button>
          <button
            type="button"
            title="Exit"
            onClick={() => {
              setActiveAction('exit');
              setPanelOpen(false);
            }}
            className={activeAction === 'exit' ? styles.actionActive : ''}
          >
            <FiX />
          </button>
        </div>
      </div>
      <div className={styles.body}>
        <PreviewTab />
      </div>
    </aside>
  );
}
