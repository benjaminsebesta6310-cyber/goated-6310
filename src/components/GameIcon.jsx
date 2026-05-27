import React from 'react';
import * as Icons from 'lucide-react';

export default function GameIcon({ name, className, id }) {
  // Dynamically resolve the Lucide component by string key
  const IconComponent = Icons[name] || Icons.Gamepad2;
  return <IconComponent className={className} id={id} />;
}
