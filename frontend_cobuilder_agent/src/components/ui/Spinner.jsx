import { cn } from '../../utils/cn';
import styles from './Spinner.module.css';

export default function Spinner({ size = 'md', className }) {
  return <span className={cn(styles.spinner, styles[size], className)} aria-label="loading" />;
}

