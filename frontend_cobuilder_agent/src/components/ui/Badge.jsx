import { cn } from '../../utils/cn';
import styles from './Badge.module.css';

export default function Badge({ variant = 'default', children, className }) {
  return <span className={cn(styles.badge, styles[variant], className)}>{children}</span>;
}

