import React from 'react';
import chroma from 'chroma-js';
import { Badge } from 'react-bootstrap';
import { skillsAreasColors } from '../utilities/constants';
import styles from './SkillBadge.module.css';

export default function SkillBadge({
  skill,
  hidden,
}: {
  readonly skill: string;
  readonly hidden?: boolean;
}) {
  return (
    <Badge
      variant="secondary"
      className={styles.tag}
      style={{
        color: skillsAreasColors[skill],
        backgroundColor: chroma(skillsAreasColors[skill]).alpha(0.16).css(),
        opacity: hidden ? 0 : 1,
      }}
    >
      {skill}
    </Badge>
  );
}
