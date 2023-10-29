/**
 * @file Handlers for managing users' friends.
 */

import express from 'express';

// import axios from 'axios';

import { prisma } from '../config';

import winston from '../logging/winston';
import { StudentFacebookFriends, Students } from '@prisma/client';

const ME_FIELDS = 'id,name,first_name,middle_name,last_name';
const FRIEND_FIELDS = 'id,name,first_name,middle_name,last_name';
const FRIENDS_PAGE_LIMIT = 500;

/**
 * Fetch and create/update user's Facebook friends.
 *
 * @param req - express request object
 * @param res - express response object
 */
export const updateFriends = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {
  winston.info(`Updating friends`);

  if (!req.user) {
    return res.status(401).json({ success: false });
  }

  const { netId } = req.user;

  // User's Facebook token for fetching their friends
  // const fbToken = req.headers['fb-token'];

  // Get current user's Facebook info
  // const { data: facebookProfile } = await axios({
  //   url: `${FACEBOOK_API_ENDPOINT}/me?fields=${ME_FIELDS}&access_token=${fbToken}`,
  //   method: 'get',
  // });

  winston.info(`Creating friend info for user ${netId}`);

  // Update user's Facebook info
  // await prisma.students.upsert({
  //   // update (do not create a new friend) when one already matches the netId and Facebook ID
  //   where: {
  //     netId,
  //   },
  //   // basic info for creation
  //   create: {
  //     netId,
  //     facebookId: BigInt(facebookProfile.id),
  //     facebookDataJson: JSON.stringify(facebookProfile),
  //   },
  //   // update people's names if they've changed
  //   update: {
  //     facebookId: BigInt(facebookProfile.id),
  //     facebookDataJson: JSON.stringify(facebookProfile),
  //   },
  // });

  let userFriends: { id: string; name: string }[] = [];

  // Cursor pointing to the next page of friends
  let after: string | undefined = '';

  /**
   * Update friends array from fetched data.
   *
   * @param friendsData - response object from Facebook API
   */
  // const updateFriendsCursor = (friendsData: {
  //   data: { id: string; name: string }[];
  //   paging: { cursors: { before: string; after: string } };
  // }) => {
  //   userFriends = userFriends.concat(friendsData.data);

  //   // break by setting after to undefined
  //   if (friendsData.data.length === 0 || !friendsData.paging) {
  //     after = undefined;
  //   } else {
  //     // otherwise, update the cursor
  //     after = friendsData.paging.cursors.after;
  //   }
  // };

  // while (after !== undefined) {
  //   winston.info(`Fetching Facebook friends page`);

  //   // Usually awaits in loops are discouraged because async functions
  //   // can be parallelized, but this is an exception because the next loop
  //   // depends on the cursor returned by this one.

  //   try {
  //     // eslint-disable-next-line no-await-in-loop
  //     await axios
  //       .get(
  //         `${FACEBOOK_API_ENDPOINT}/me/friends?fields=${FRIEND_FIELDS}&limit=${FRIENDS_PAGE_LIMIT}&access_token=${fbToken}&after=${after}`,
  //       )
  //       .then(({ data }) => updateFriendsCursor(data));
  //   } catch (err) {
  //     winston.error(`Facebook Graph API error: ${err}`);
  //     return res.status(500).json({ success: false });
  //   }
  // }

  try {
    const upsertFriends = userFriends.map((friend) => {

      return prisma.studentFacebookFriends.upsert({
        // update (do not create a new friend) when one already matches the netId and Facebook ID
        where: {
          netId,
        },
        // basic info for creation
        create: {
          netId,
          name: friend.name,
        },
        // update people's names if they've changed
        update: {
          name: friend.name,
        },
      });
    });

    await prisma.$transaction(upsertFriends);

    return res.json({ success: true });
  } catch (err) {
    winston.error(`Error with upserting Facebook friends: ${err}`);
    return res.status(500).json({ success: false });
  }
};

/**
 * Delete user's conneccted Facebook info (friends and account ID)
 *
 * @param req - express request object
 * @param res - express response object
 */
// export const disconnectFacebook = async (
//   req: express.Request,
//   res: express.Response,
// ): Promise<express.Response> => {
//   winston.info(`Disconnecting Facebook`);

//   if (!req.user) {
//     return res.status(401).json({ success: false });
//   }

//   const { netId } = req.user;

//   try {
//     winston.info(`Removing Facebook friends for user ${netId}`);
//     await prisma.studentFacebookFriends.deleteMany({
//       where: {
//         netId,
//       },
//     });

//     winston.info(`Removing Facebook account info for user ${netId}`);
//     await prisma.students.deleteMany({
//       where: {
//         netId,
//       },
//     });
//     return res.json({ success: true });
//   } catch (err) {
//     winston.error(`Error with disconnecting Facebook: ${err}`);
//     return res.status(500).json({ success: false });
//   }
// };

/**
 * Get worksheets of user's friends.
 *
 * @param req - express request object
 * @param res - express response object
 */
export const getFriendsWorksheets = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {
  winston.info(`Fetching Facebook friends' worksheets`);

  if (!req.user) {
    return res.status(401).json();
  }

  const { netId } = req.user;

  // Get Facebook ID of user
  winston.info("Getting user's Facebook ID");
  const studentProfile = await prisma.students.findUnique({
    where: {
      netId,
    },
  });

  const userFacebookId = studentProfile?.facebookId;

  if (!userFacebookId) {
    return res.status(401).json();
  }

  // Get NetIDs of Facebook friends
  winston.info('Getting NetIDs of Facebook friends');
  const friends = await prisma.studentFacebookFriends.findMany({
    where: {
      facebookId: userFacebookId,
    },
  });

  const friendNetIds = friends.map(
    (friend: StudentFacebookFriends) => friend.netId,
  );

  // Get friends' worksheets from NetIDs
  winston.info('Getting worksheets of Facebook friends');
  const friendWorksheets = await prisma.worksheetCourses.findMany({
    where: {
      net_id: {
        in: friendNetIds,
      },
    },
  });

  // Get friends' worksheets from NetIDs
  winston.info('Getting info of Facebook friends');
  const friendInfos: Students[] = await prisma.students.findMany({
    where: {
      netId: {
        in: friendNetIds,
      },
    },
  });

  // map netId to worksheets (list of [season, oci_id])
  const worksheetsByFriend: { [key: string]: [string, number][] } = {};
  friendWorksheets.forEach(
    ({
      net_id,
      oci_id,
      season,
    }: {
      net_id: string;
      oci_id: number;
      season: number;
    }) => {
      if (net_id in worksheetsByFriend) {
        worksheetsByFriend[net_id].push([String(season), oci_id]);
      } else {
        worksheetsByFriend[net_id] = [[String(season), oci_id]];
      }
    },
  );

  // map netId to friend name and Facebook ID
  const infoByFriend: {
    [key: string]: { name: string; facebookId: string };
  } = {};
  friendInfos.forEach(
    ({ netId: friendNetId, facebookId, facebookDataJson }: Students) => {
      if (facebookDataJson && facebookDataJson !== '') {
        infoByFriend[friendNetId] = {
          name: JSON.parse(facebookDataJson).name,
          facebookId: String(facebookId),
        };
      } else {
        infoByFriend[friendNetId] = {
          name: friendNetId,
          facebookId: String(facebookId),
        };
      }
    },
  );

  return res.status(200).json({
    success: true,
    worksheets: worksheetsByFriend,
    friendInfo: infoByFriend,
  });
};
