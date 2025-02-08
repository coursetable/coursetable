import { toast } from 'react-toastify';
import type { StateCreator } from 'zustand';
import {
  getUserInfo,
  fetchUserWorksheets,
  fetchFriendWorksheets,
  fetchFriendReqs,
  addFriend as baseAddFriend,
  requestAddFriend as baseRequestAddFriend,
  removeFriend as baseRemoveFriend,
  type UserInfo,
  type UserWishlist,
  type UserWorksheets,
  type FriendRecord,
  type FriendRequests,
  fetchUserWishlist,
} from '../queries/api';
import type { NetId } from '../queries/graphql-types';
import type { Store } from '../store';

interface UserState {
  user?: UserInfo;
  worksheets?: UserWorksheets;
  wishlist?: UserWishlist;
  friendRequests?: FriendRequests;
  friends?: FriendRecord;
}

interface UserActions {
  userRefresh: () => Promise<void>;
  worksheetsRefresh: () => Promise<void>;
  wishlistRefresh: () => Promise<void>;
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
  user: undefined,
  worksheets: undefined,
  wishlist: undefined,
  friendRequests: undefined,
  friends: undefined,
  async userRefresh() {
    const data = await getUserInfo();
    set({ user: data });
  },
  async worksheetsRefresh() {
    const data = await fetchUserWorksheets();
    set({ worksheets: data?.data });
  },
  async wishlistRefresh() {
    const data = await fetchUserWishlist();
    set({ wishlist: data });
  },
  async friendRefresh() {
    const data = await fetchFriendWorksheets();
    set({ friends: data?.friends });
  },
  async friendReqRefresh() {
    const data = await fetchFriendReqs();
    set({ friendRequests: data?.requests });
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
    const { user } = get();
    if (!user) {
      toast.error('You are not logged in!');
    } else if (friendNetId === user.netId) {
      toast.error('You cannot request yourself as friend!');
    } else if (get().friends?.[friendNetId]) {
      toast.error(`You are already friends with ${friendNetId}.`);
    } else if (get().friendRequests?.find((x) => x.netId === friendNetId)) {
      toast.error(
        `You already received a friend request from ${friendNetId}. Go approve the request instead!`,
      );
    } else if (await baseRequestAddFriend(friendNetId)) {
      toast.info(`Sent friend request: ${friendNetId}`);
    }
  },
});
