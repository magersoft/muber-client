import { GetMyProfileResponse } from './graph';

export interface IUser {
  fullName: string;
  profilePhoto: string;
  isDriving: boolean;
  darkTheme: boolean;
}

export interface UserDataResponse {
  GetMyProfile: GetMyProfileResponse
}
