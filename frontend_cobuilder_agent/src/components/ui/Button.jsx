import { cn } from '../../utils/cn';
import Spinner from './Spinner';
import styles from './Button.module.css';

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  fullWidth = false,
  children,
  className,
  ...props
}) {
  return (
    <button
      type="button"
      className={cn(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : Icon ? <Icon className={styles.icon} /> : null}
      {children}
    </button>
  );
}

