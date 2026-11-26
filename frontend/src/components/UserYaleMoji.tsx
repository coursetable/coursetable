import { YaleMojiImage } from './PeopleYaleMoji';
import { useYaleMoji } from '../hooks/useYaleMoji';
import type { NetId } from '../queries/graphql-types';

export function UserYaleMoji({
  netId,
  name,
  className,
}: {
  readonly netId: NetId;
  readonly name?: string | null;
  readonly className?: string;
}) {
  const { avatar } = useYaleMoji(netId);
  return (
    <YaleMojiImage
      avatar={avatar}
      netId={netId}
      name={name}
      className={className}
    />
  );
}
