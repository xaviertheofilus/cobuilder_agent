import { cn } from '../../utils/cn';
import styles from './Input.module.css';

export default function Input({ label, error, hint, icon: Icon, rightElement, className, ...props }) {
  return (
    <div className={cn(styles.wrapper, className)}>
      {label ? <label className={styles.label}>{label}</label> : null}
      <div className={cn(styles.inputWrap, error && styles.error)}>
        {Icon ? <Icon className={styles.icon} /> : null}
        <input className={styles.input} {...props} />
        {rightElement ? <div className={styles.rightElement}>{rightElement}</div> : null}
      </div>
      {error ? <div className={styles.errorText}>{error}</div> : hint ? <div className={styles.hint}>{hint}</div> : null}
    </div>
  );
}

