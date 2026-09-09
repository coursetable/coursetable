import { toast } from 'sonner';
import type { StateCreator } from 'zustand';
import {
  getUserInfo,
  fetchUserWorksheets,
  fetchFriendWorksheets,
  fetchFriendReqs,
  fetchOutgoingFriendReqs,
  addFriend as baseAddFriend,
  requestAddFriend as baseRequestAddFriend,
  removeFriend as baseRemoveFriend,
  type UserInfo,
  type WishlistItem,
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
  wishlist?: WishlistItem[];
  friendRequests?: FriendRequests;
  outgoingFriendRequests?: FriendRequests;
  friends?: FriendRecord;
  sameCourseIdToCrns?: { [key: string]: number[] };
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
  outgoingFriendRequests: undefined,
  friends: undefined,
  sameCourseIdToCrns: undefined,
  async userRefresh() {
    const data = await getUserInfo();
    set({ user: data });
  },
  async worksheetsRefresh() {
    const data = await fetchUserWorksheets();
    set({ worksheets: data?.data });
  },
  async wishlistRefresh() {
    const res = await fetchUserWishlist();
    set({ wishlist: res?.data });
  },
  async friendRefresh() {
    const data = await fetchFriendWorksheets();
    set({
      friends: data?.friends,
      sameCourseIdToCrns: data?.sameCourseIdToCrns,
    });
  },
  async friendReqRefresh() {
    const [data, outgoingData] = await Promise.all([
      fetchFriendReqs(),
      fetchOutgoingFriendReqs(),
    ]);
    set({
      friendRequests: data?.requests,
      outgoingFriendRequests: outgoingData?.requests,
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
        `${isRequest ? 'Removed pending request with' : 'Removed friend'} ${friendNetId}`,
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
    } else if (
      get().outgoingFriendRequests?.find((x) => x.netId === friendNetId)
    ) {
      toast.error(`You already sent a friend request to ${friendNetId}.`);
    } else if (await baseRequestAddFriend(friendNetId)) {
      toast.info(`Sent friend request: ${friendNetId}`);
      await get().friendReqRefresh();
    }
  },
});
