import { YaleMojiImage } from './PeopleYaleMoji';
import { useYaleMoji } from '../hooks/useYaleMoji';
import type { NetId } from '../queries/graphql-types';

export function UserYaleMoji({
  netId,
  className,
}: {
  readonly netId: NetId;
  readonly className?: string;
}) {
  const { avatar } = useYaleMoji(netId);
  return <YaleMojiImage avatar={avatar} className={className} />;
}
