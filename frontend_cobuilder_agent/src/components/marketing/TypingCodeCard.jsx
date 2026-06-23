import { useEffect, useMemo, useState } from 'react';
import styles from './TypingCodeCard.module.css';

const TOKEN_REGEX = /(\/\/.*$|"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`|\b(?:const|let|var|import|export|default|function|if|else|throw|new|return|await|async)\b|\b\d+\b|\b[a-zA-Z_$][\w$]*(?=\s*\())/g;

function colorize(line) {
  if (!line) return [{ type: 'plain', value: '\u00A0' }];

  const tokens = [];
  let cursor = 0;

  for (const match of line.matchAll(TOKEN_REGEX)) {
    const [value] = match;
    const index = match.index ?? 0;

    if (index > cursor) {
      tokens.push({ type: 'plain', value: line.slice(cursor, index) });
    }

    const type = value.startsWith('//')
      ? 'comment'
      : value.startsWith("'") || value.startsWith('"') || value.startsWith('`')
        ? 'string'
        : /^\d+$/.test(value)
          ? 'number'
          : /^(const|let|var|import|export|default|function|if|else|throw|new|return|await|async)$/.test(value)
            ? 'keyword'
            : 'fn';

    tokens.push({ type, value });
    cursor = index + value.length;
  }

  if (cursor < line.length) {
    tokens.push({ type: 'plain', value: line.slice(cursor) });
  }

  return tokens;
}

export default function TypingCodeCard({ title = 'app.tsx', lines = [] }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (!lines.length) return undefined;
    const interval = setInterval(() => {
      setCharIndex((current) => {
        const full = lines[lineIndex] || '';
        if (current < full.length) return current + 1;
        setLineIndex((idx) => (idx + 1) % lines.length);
        return 0;
      });
    }, 34);
    return () => clearInterval(interval);
  }, [lineIndex, lines]);

  const preparedLines = useMemo(
    () =>
      lines.map((line, index) => {
        const visible = index < lineIndex ? line : index === lineIndex ? line.slice(0, charIndex) : '';
        return colorize(visible);
      }),
    [charIndex, lineIndex, lines]
  );

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <span />
        <span />
        <span />
        <small>{title}</small>
      </div>
      <div className={styles.codeArea}>
        {preparedLines.map((segments, index) => (
          <div key={index} className={styles.line}>
            {segments.map((segment, partIdx) => (
              <span key={`${partIdx}-${segment.value}`} className={styles[`token${segment.type[0].toUpperCase()}${segment.type.slice(1)}`]}>
                {segment.value}
              </span>
            ))}
            {index === lineIndex ? <span className={styles.caret}>|</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
