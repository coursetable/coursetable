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
  getOwnProfile,
  getPublicProfile,
  updateProfile,
  toggleEvalsAccess,
  type UserInfo,
  type UserWorksheets,
  type FriendRecord,
  type FriendRequests,
  type UserProfile,
  type UserPublicProfile,
} from '../queries/api';
import type { NetId } from '../queries/graphql-types';
import type { Store } from '../store';

interface UserState {
  user?: UserInfo;
  worksheets?: UserWorksheets;
  friendRequests?: FriendRequests;
  friends?: FriendRecord;
  ownProfile?: UserProfile;
  publicProfile?: UserPublicProfile;
}

interface UserActions {
  userRefresh: () => Promise<void>;
  worksheetsRefresh: () => Promise<void>;
  friendRefresh: () => Promise<void>;
  friendReqRefresh: () => Promise<void>;
  addFriend: (friendNetId: NetId) => Promise<void>;
  removeFriend: (friendNetId: NetId, isRequest: boolean) => Promise<void>;
  requestAddFriend: (friendNetId: NetId) => Promise<void>;
  ownProfileRefresh: () => Promise<void>;
  publicProfileRefresh: (netId: NetId) => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  toggleEvalsAccess: () => Promise<void>;
}

export interface UserSlice extends UserState, UserActions {}

export const createUserSlice: StateCreator<Store, [], [], UserSlice> = (
  set,
  get,
) => ({
  user: undefined,
  worksheets: undefined,
  friendRequests: undefined,
  friends: undefined,
  ownProfile: undefined,
  publicProfile: undefined,
  async userRefresh() {
    const data = await getUserInfo();
    set({ user: data });
  },
  async worksheetsRefresh() {
    const data = await fetchUserWorksheets();
    set({ worksheets: data?.data });
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
  async ownProfileRefresh() {
    const data = await getOwnProfile();
    set({ ownProfile: data });
  },
  async publicProfileRefresh(netId: NetId) {
    const data = await getPublicProfile(netId);
    set({ publicProfile: data });
  },
  async updateProfile(profileData) {
    await updateProfile(profileData);
    await get().ownProfileRefresh();
    const netId = get().user?.netId;
    if (netId) 
      await get().publicProfileRefresh(netId);
    
  },
  async toggleEvalsAccess() {
    await toggleEvalsAccess();
    await get().ownProfileRefresh();
    const netId = get().user?.netId;
    if (netId) 
      await get().publicProfileRefresh(netId);
    
  },
});
