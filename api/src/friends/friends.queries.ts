import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq } from 'drizzle-orm';

import { studentFriendRequests } from '../../drizzle/schema.js';
import type * as schema from '../../drizzle/schema.js';

export const findUniqueRequest = async (
  tx: NodePgDatabase<typeof schema>,
  netId: string,
  friendNetId: string,
) => {
  const existingRequest = await tx
    .selectDistinctOn([
      studentFriendRequests.netId,
      studentFriendRequests.friendNetId,
    ])
    .from(studentFriendRequests)
    .where(
      and(
        eq(studentFriendRequests.netId, friendNetId),
        eq(studentFriendRequests.friendNetId, netId),
      ),
    );

  return existingRequest;
};
