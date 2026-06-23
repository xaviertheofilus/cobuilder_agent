import { useEffect, useMemo, useState } from 'react';
import styles from './ThemePreviewTabs.module.css';

const SCENES = [
  {
    id: 'fe',
    label: 'Frontend',
    lines: [
      [
        ['kw', 'const '],
        ['fn', 'appName'],
        ['text', ' = '],
        ['str', "'BSI CoBuilder Agent'"],
      ],
      [
        ['kw', 'export default function '],
        ['fn', 'Dashboard'],
        ['text', '() { return <main>Preview</main>; }'],
      ],
      [
        ['kw', 'import '],
        ['fn', '{ useState }'],
        ['kw', " from "],
        ['str', "'react'"],
      ],
    ],
  },
  {
    id: 'be',
    label: 'Backend',
    lines: [
      [['kw', 'app.post'], ['text', "('/api/projects', async (req, res) => {"]],
      [['kw', '  const '], ['fn', 'project'], ['text', ' = await service.create(req.body);']],
      [['text', '  res.json({ '], ['fn', 'app'], ['text', ": 'BSI CoBuilder Agent', project }); });"]],
    ],
  },
  {
    id: 'db',
    label: 'Data',
    lines: [
      [['kw', 'SELECT '], ['fn', '* '], ['kw', 'FROM '], ['str', 'projects'], ['kw', ' WHERE '], ['fn', 'team'], ['text', "='BSI';"]],
      [['kw', 'INSERT '], ['kw', 'INTO '], ['str', 'events'], ['text', "(name) VALUES('generate');"]],
      [['kw', '-- status: '], ['fn', 'ready'], ['text', ' for preview + deploy']],
    ],
  },
];

export default function ThemePreviewTabs() {
  const [active, setActive] = useState(SCENES[0].id);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const scene = useMemo(() => SCENES.find((item) => item.id === active) || SCENES[0], [active]);

  useEffect(() => {
    const rotate = setInterval(() => {
      setActive((current) => {
        const index = SCENES.findIndex((tab) => tab.id === current);
        return SCENES[(index + 1) % SCENES.length].id;
      });
      setLineIndex(0);
      setCharIndex(0);
    }, 2600);

    return () => clearInterval(rotate);
  }, []);

  useEffect(() => {
    const flatLine = scene.lines[lineIndex]?.map((seg) => seg[1]).join('') || '';
    const typing = setInterval(() => {
      setCharIndex((current) => {
        if (current < flatLine.length) return current + 1;
        setLineIndex((idx) => (idx + 1) % scene.lines.length);
        return 0;
      });
    }, 18);

    return () => clearInterval(typing);
  }, [lineIndex, scene.lines]);

  const renderTypedSegments = (segments, typedLength) => {
    let remaining = typedLength;
    return segments.map(([kind, part], idx) => {
      const take = Math.max(0, Math.min(part.length, remaining));
      remaining -= take;
      return (
        <span key={`${kind}-${idx}`} className={styles[kind]}>
          {part.slice(0, take)}
        </span>
      );
    });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.topRow}>
        {SCENES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.tab} ${item.id === active ? styles.active : ''}`}
            onMouseEnter={() => {
              setActive(item.id);
              setLineIndex(0);
              setCharIndex(0);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.editor}>
        {scene.lines.map((segments, index) => {
          const full = segments.map((seg) => seg[1]).join('');
          const typedLength = index < lineIndex ? full.length : index === lineIndex ? charIndex : 0;
          return (
            <div key={`${scene.id}-${index}`} className={styles.line}>
              <span className={styles.no}>{index + 1}</span>
              <span className={styles.code}>{renderTypedSegments(segments, typedLength)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
