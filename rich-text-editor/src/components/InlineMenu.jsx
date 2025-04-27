
import React from 'react';
import { formatText } from '@/utils/commands';

const InlineMenu = ({ position }) => {
  return (
    <div className="inline-menu" style={{ top: position.y - 40, left: position.x }}>
      <button onClick={() => formatText('backColor', 'yellow')}>Highlight</button>
    </div>
  );
};

export default InlineMenu;
