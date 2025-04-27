
import React from 'react';
import { formatText } from '@/utils/commands';
import styles from '../styles/editor.module.css';

const InlineMenu = ({ position }) => {
  return (
    <div className={styles.inline_menu} style={{ top: position.y - 40, left: position.x }}>
      <button onClick={() => formatText('backColor', 'yellow')}>Highlight</button>
    </div>
  );
};

export default InlineMenu;
