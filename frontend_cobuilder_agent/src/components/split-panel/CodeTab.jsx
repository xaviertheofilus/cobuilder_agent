import { useMemo } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useProjectStore } from '../../stores/useProjectStore';
import FileTree from './FileTree';
import styles from './CodeTab.module.css';

export default function CodeTab() {
  const { codeFiles, activeCodeFile } = useProjectStore();
  const file = useMemo(() => codeFiles.find((item) => item.path === activeCodeFile) || codeFiles[0], [activeCodeFile, codeFiles]);

  const lines = useMemo(
    () => (file?.content || '// No code generated yet').split('\n').map((line) => hljs.highlightAuto(line).value),
    [file?.content]
  );

  return (
    <div className={styles.wrap}>
      <FileTree />
      <div className={styles.viewer}>
        <div className={styles.fileName}>{file?.path || 'No file selected'}</div>
        <pre className={styles.pre}>
          <code>
            {lines.map((line, index) => (
              <div key={`${index}-${line.slice(0, 12)}`} className={styles.line}>
                <span className={styles.no}>{index + 1}</span>
                <span dangerouslySetInnerHTML={{ __html: line }} />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
