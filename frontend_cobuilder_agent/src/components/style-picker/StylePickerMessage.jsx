import { useState } from 'react';
import { FiCheck, FiGrid, FiLayout, FiSidebar, FiX } from 'react-icons/fi';
import styleData from '../../data/styles.json';
import { useProjectStore } from '../../stores/useProjectStore';
import styles from './StylePickerMessage.module.css';

function LayoutIcon({ id }) {
  if (id === 'sidebar-nav') return <FiSidebar />;
  if (id === 'top-nav') return <FiLayout />;
  return <FiGrid />;
}

function toggleSelection(current, item) {
  if (current?.id === item.id) return null;
  return item;
}

export default function StylePickerMessage() {
  const { setSelectedStyle, setStylePickerOpen, selectedStyle } = useProjectStore();
  const [palette, setPalette] = useState(selectedStyle?.palette || null);
  const [font, setFont] = useState(selectedStyle?.font || null);
  const [layout, setLayout] = useState(selectedStyle?.layout || null);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.head}>
          <div>
            <h4>Choose a style for your app</h4>
            <p>Choose any combination. Click selected option again to clear.</p>
          </div>
          <button type="button" className={styles.close} onClick={() => setStylePickerOpen(false)}>
            <FiX />
          </button>
        </div>

        <section>
          <div className={styles.label}>COLOR PALETTE</div>
          <div className={styles.paletteRow}>
            {styleData.palettes.map((item) => (
              <button key={item.id} type="button" className={`${styles.palette} ${palette?.id === item.id ? styles.selected : ''}`} onClick={() => setPalette((current) => toggleSelection(current, item))}>
                <div className={styles.strips}>{item.colors.map((color) => <span key={color} style={{ background: color }} />)}</div>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className={styles.label}>TYPOGRAPHY</div>
          <div className={styles.grid3}>
            {styleData.fonts.map((item) => (
              <button key={item.id} type="button" className={`${styles.choice} ${font?.id === item.id ? styles.selected : ''}`} onClick={() => setFont((current) => toggleSelection(current, item))}>
                <strong>Aa</strong>
                <span>{item.name}</span>
                {font?.id === item.id ? <FiCheck className={styles.check} /> : null}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className={styles.label}>LAYOUT</div>
          <div className={styles.grid3}>
            {styleData.layouts.map((item) => (
              <button key={item.id} type="button" className={`${styles.choice} ${layout?.id === item.id ? styles.selected : ''}`} onClick={() => setLayout((current) => toggleSelection(current, item))}>
                <LayoutIcon id={item.id} />
                <span>{item.name}</span>
                {layout?.id === item.id ? <FiCheck className={styles.check} /> : null}
              </button>
            ))}
          </div>
        </section>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.skip}
            onClick={() => {
              setStylePickerOpen(false);
            }}
          >
            Skip
          </button>
          <button
            type="button"
            className={styles.confirm}
            onClick={() => {
              const hasAny = palette || font || layout;
              setSelectedStyle(hasAny ? { palette, font, layout } : null);
              setStylePickerOpen(false);
            }}
          >
            Confirm Style
          </button>
        </div>
      </div>
    </div>
  );
}
