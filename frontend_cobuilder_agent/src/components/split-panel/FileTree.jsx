import { useMemo, useState } from 'react';
import { FiFile, FiFolder, FiFolderMinus } from 'react-icons/fi';
import { useProjectStore } from '../../stores/useProjectStore';
import styles from './FileTree.module.css';

function buildTree(files) {
  const root = {};
  files.forEach((file) => {
    const parts = file.path.split('/');
    let node = root;
    parts.forEach((part, idx) => {
      if (!node[part]) node[part] = { __children: {}, __file: idx === parts.length - 1 };
      node = node[part].__children;
    });
  });
  return root;
}

function Node({ name, data, path = '', depth = 0, expanded, toggle, onSelect, activeCodeFile }) {
  const currentPath = path ? `${path}/${name}` : name;
  const isFile = data.__file;

  if (isFile) {
    return (
      <button type="button" className={`${styles.file} ${activeCodeFile === currentPath ? styles.activeFile : ''}`} style={{ paddingLeft: 12 + depth * 16 }} onClick={() => onSelect(currentPath)}>
        <FiFile /> {name}
      </button>
    );
  }

  const isOpen = expanded.has(currentPath);
  return (
    <div>
      <button type="button" className={styles.folder} style={{ paddingLeft: 12 + depth * 16 }} onClick={() => toggle(currentPath)}>
        {isOpen ? <FiFolderMinus /> : <FiFolder />} {name}
      </button>
      {isOpen
        ? Object.entries(data.__children).map(([childName, childData]) => (
            <Node key={childName} name={childName} data={childData} path={currentPath} depth={depth + 1} expanded={expanded} toggle={toggle} onSelect={onSelect} activeCodeFile={activeCodeFile} />
          ))
        : null}
    </div>
  );
}

export default function FileTree() {
  const { codeFiles, activeCodeFile, setActiveCodeFile } = useProjectStore();
  const [expanded, setExpanded] = useState(new Set(['src']));
  const tree = useMemo(() => buildTree(codeFiles), [codeFiles]);

  const toggle = (path) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  if (!codeFiles.length) return <div className={styles.empty}>No files generated yet.</div>;

  return (
    <div className={styles.tree}>
      {Object.entries(tree).map(([name, data]) => (
        <Node key={name} name={name} data={data} expanded={expanded} toggle={toggle} onSelect={setActiveCodeFile} activeCodeFile={activeCodeFile} />
      ))}
    </div>
  );
}

