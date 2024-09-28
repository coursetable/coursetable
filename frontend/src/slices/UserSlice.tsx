import { toast } from 'react-toastify';
import type { StateCreator } from 'zustand';
import {
  fetchUserWorksheets,
  fetchFriendWorksheets,
  fetchFriendReqs,
  fetchUserWishlist,
  addFriend as baseAddFriend,
  requestAddFriend as baseRequestAddFriend,
  removeFriend as baseRemoveFriend,
  type UserWorksheets,
  type UserWishlist,
  type FriendRecord,
  type FriendRequests,
} from '../queries/api';
import type { NetId } from '../queries/graphql-types';
import type { Store } from '../store';

interface UserState {
  user: {
    netId?: NetId;
    worksheets?: UserWorksheets;
    wishlist?: UserWishlist;
    hasEvals?: boolean;
    year?: number;
    school?: string;
    friendRequests?: FriendRequests;
    friends?: FriendRecord;
  };
}

interface UserActions {
  userRefresh: () => Promise<void>;
  friendRefresh: () => Promise<void>;
  friendReqRefresh: () => Promise<void>;
  addFriend: (friendNetId: NetId) => Promise<void>;
  removeFriend: (friendNetId: NetId, isRequest: boolean) => Promise<void>;
  requestAddFriend: (friendNetId: NetId) => Promise<void>;
}

export interface UserSlice extends UserState, UserActions {}

export const createUserSlice: StateCreator<Store, [], [], UserSlice> = (
  set,
  get,
) => ({
  user: {
    netId: undefined,
    worksheets: undefined,
    wishlist: undefined,
    hasEvals: undefined,
    year: undefined,
    school: undefined,
    friendRequests: undefined,
    friends: undefined,
  },
  async userRefresh() {
    // TODO: combine these two API calls into one, if possible.
    const fetchedUserWorksheets = await fetchUserWorksheets();
    const fetchedUserWishlist = await fetchUserWishlist();
    if (fetchedUserWorksheets) {
      set({
        user: {
          ...get().user,
          netId: fetchedUserWorksheets.netId,
          hasEvals: fetchedUserWorksheets.evaluationsEnabled ?? undefined,
          year: fetchedUserWorksheets.year ?? undefined,
          school: fetchedUserWorksheets.school ?? undefined,
          worksheets: fetchedUserWorksheets.data as UserWorksheets,
          wishlist: fetchedUserWishlist?.data as UserWishlist,
        },
      });
    } else {
      set({
        user: {
          netId: undefined,
          hasEvals: undefined,
          year: undefined,
          school: undefined,
          worksheets: undefined,
          wishlist: undefined,
        },
      });
    }
  },
  async friendRefresh() {
    const friends = await fetchFriendWorksheets();
    set({
      user: {
        ...get().user,
        friends: friends?.friends ?? undefined,
      },
    });
  },
  async friendReqRefresh() {
    const friendRequests = await fetchFriendReqs();
    set({
      user: {
        ...get().user,
        friendRequests: friendRequests?.requests ?? undefined,
      },
    });
  },
  async addFriend(friendNetId: NetId) {
    if (await baseAddFriend(friendNetId))
      toast.info(`Added friend: ${friendNetId}`);
    await Promise.all([get().friendRefresh(), get().friendReqRefresh()]);
  },
  async removeFriend(friendNetId: NetId, isRequest: boolean) {
    if (await baseRemoveFriend(friendNetId)) {
      toast.info(
        `${isRequest ? 'Declined request from' : 'Removed friend'} ${friendNetId}`,
      );
    }
    await Promise.all([get().friendRefresh(), get().friendReqRefresh()]);
  },
  async requestAddFriend(friendNetId: NetId) {
    if (friendNetId === get().user.netId) {
      toast.error('You cannot request yourself as friend!');
    } else if (get().user.friends?.[friendNetId]) {
      toast.error(`You are already friends with ${friendNetId}.`);
    } else if (
      get().user.friendRequests?.find((x) => x.netId === friendNetId)
    ) {
      toast.error(
        `You already received a friend request from ${friendNetId}. Go approve the request instead!`,
      );
    } else if (await baseRequestAddFriend(friendNetId)) {
      toast.info(`Sent friend request: ${friendNetId}`);
    }
  },
});
