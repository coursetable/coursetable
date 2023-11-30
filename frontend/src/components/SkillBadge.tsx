import React from 'react';
import chroma from 'chroma-js';
import { Badge } from 'react-bootstrap';
import { skillsAreasColors } from '../queries/Constants';
import styles from './SkillBadge.module.css';

export default function SkillBadge({
  skill,
  hidden,
}: {
  skill: string;
  hidden?: boolean;
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
