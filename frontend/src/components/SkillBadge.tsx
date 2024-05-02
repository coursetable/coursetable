import clsx from 'clsx';
import { Badge } from 'react-bootstrap';
import chroma from 'chroma-js';
import { skillsAreasColors } from '../utilities/constants';
import styles from './SkillBadge.module.css';

export default function SkillBadge({
  skill,
  className,
}: {
  readonly skill: string;
  readonly className?: string;
}) {
  return (
    <Badge
      bg="none"
      className={clsx(className, styles.tag)}
      style={{
        color: skillsAreasColors[skill],
        backgroundColor: chroma(skillsAreasColors[skill]!).alpha(0.16).css(),
      }}
    >
      {skill}
    </Badge>
  );
}
