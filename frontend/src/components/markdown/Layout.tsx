import type { ReactNode } from 'react';
import clsx from 'clsx';
import { TextComponent } from '../Typography';
import styles from './Layout.module.css';

export default function Layout({ children }: { readonly children: ReactNode }) {
  return (
    <div className={clsx(styles.container, 'mx-auto')}>
      <TextComponent type="secondary" as="div">
        {children}
      </TextComponent>
    </div>
  );
}
