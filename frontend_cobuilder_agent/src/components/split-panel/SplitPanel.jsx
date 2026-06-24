import { FiDownload, FiExternalLink, FiRefreshCw, FiX } from 'react-icons/fi';
import JSZip from 'jszip';
import { useProjectStore } from '../../stores/useProjectStore';
import { resolvePreviewLabel } from '../../services/runtimeConfig';
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

function openNewTab() {
  const next = window.open(window.location.href, '_blank', 'noopener,noreferrer');
  if (next) next.opener = null;
}

export default function SplitPanel({ widthPercent = 48 }) {
  const { codeFiles, setPanelOpen, previewUrl, bumpPreviewFrameVersion } = useProjectStore();
  const previewLabel = resolvePreviewLabel(previewUrl);

  return (
    <aside className={styles.panel} style={{ flex: `0 0 ${widthPercent}%` }}>
      <div className={styles.tabBar}>
        <div className={styles.hostWrap}>
          <div className={styles.lights}><span /><span /><span /></div>
          <div className={styles.hostLabel}>{previewLabel}</div>
        </div>
        <div className={styles.actions}>
          <button type="button" title="Refresh" onClick={bumpPreviewFrameVersion}>
            <FiRefreshCw />
          </button>
          <button type="button" title="New tab" onClick={openNewTab}>
            <FiExternalLink />
          </button>
          <button type="button" title="ZIP" onClick={() => downloadZip(codeFiles)}>
            <FiDownload />
          </button>
          <button type="button" title="Exit" onClick={() => setPanelOpen(false)}>
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
