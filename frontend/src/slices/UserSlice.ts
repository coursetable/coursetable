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
  type UserWorksheets,
  type FriendRecord,
  type FriendRequests,
  updateWorksheetMetadata,
} from '../queries/api';
import type { NetId, Season } from '../queries/graphql-types';
import type { Store } from '../store';

interface UserState {
  user?: UserInfo;
  worksheets?: UserWorksheets;
  friendRequests?: FriendRequests;
  friends?: FriendRecord;
}

interface UserActions {
  userRefresh: () => Promise<void>;
  worksheetsRefresh: () => Promise<void>;
  friendRefresh: () => Promise<void>;
  friendReqRefresh: () => Promise<void>;
  addFriend: (friendNetId: NetId) => Promise<void>;
  removeFriend: (friendNetId: NetId, isRequest: boolean) => Promise<void>;
  requestAddFriend: (friendNetId: NetId) => Promise<void>;
  addWorksheet: (season: Season, name: string) => Promise<void>;
  deleteWorksheet: (season: Season, worksheetNumber: number) => Promise<void>;
  renameWorksheet: (season: Season, worksheetNumber: number, newWsName: string) => Promise<void>;
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
  async addWorksheet(season: Season, name: string) {
    const { user } = get();
    if (!user) {
      toast.error('You are not logged in!');
    } else if (await updateWorksheetMetadata({season, action: "add", name})) {
      toast.info('Successfully added a new worksheet!');
    }
  },
  async deleteWorksheet(season: Season, worksheetNumber: number) {
    const { user } = get();
    if (!user) {
      toast.error('You are not logged in!');
    } else if (worksheetNumber === 0) {
      // Shouldn't happen, but doesn't hurt to be careful
      toast.error('You cannot delete your Main Worksheet!');
    } else if (await updateWorksheetMetadata({season, action: "delete", worksheetNumber})) {
      toast.info('Successfully deleted the worksheet!');
    }
  },
  async renameWorksheet(season: Season, worksheetNumber: number, newWsName: string) {
    const { user } = get();
    if (!user) {
      toast.error('You are not logged in!');
    } else if (worksheetNumber === 0) {
      // Shouldn't happen, but doesn't hurt to be careful
      toast.error('You cannot rename your Main Worksheet!');
    } else if (await updateWorksheetMetadata({season, action: "rename", worksheetNumber, name: newWsName})) {
      toast.info('Successfully renamed the worksheet!');
    }
  }
});
