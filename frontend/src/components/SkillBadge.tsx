import React from 'react';
import chroma from 'chroma-js';
import clsx from 'clsx';
import { Badge } from 'react-bootstrap';
import { skillsAreasColors } from '../utilities/constants';
import styles from './SkillBadge.module.css';

export default function SkillBadge({
  skill,
  hidden,
  className,
}: {
  readonly skill: string;
  readonly hidden?: boolean;
  readonly className?: string;
}) {
  return (
    <Badge
      variant="secondary"
      className={clsx(className, styles.tag)}
      style={{
        color: skillsAreasColors[skill],
        backgroundColor: chroma(skillsAreasColors[skill]!).alpha(0.16).css(),
        opacity: hidden ? 0 : 1,
      }}
    >
      {skill}
    </Badge>
  );
}
