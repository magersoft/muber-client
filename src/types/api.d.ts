/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: toggleDrivingMode
// ====================================================

export interface toggleDrivingMode_ToggleDrivingMode {
  __typename: "ToggleDrivingModeResponse";
  ok: boolean;
  error: string | null;
}

export interface toggleDrivingMode {
  ToggleDrivingMode: toggleDrivingMode_ToggleDrivingMode;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: toggleThemeMode
// ====================================================

export interface toggleThemeMode_ToggleThemeMode {
  __typename: "ToggleThemeModeResponse";
  ok: boolean;
  error: string | null;
}

export interface toggleThemeMode {
  ToggleThemeMode: toggleThemeMode_ToggleThemeMode;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: editPlace
// ====================================================

export interface editPlace_EditPlace {
  __typename: "EditPlaceResponse";
  ok: boolean;
  error: string | null;
}

export interface editPlace {
  EditPlace: editPlace_EditPlace;
}

export interface editPlaceVariables {
  placeId: number;
  name?: string | null;
  isFavorite?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addPlace
// ====================================================

export interface addPlace_AddPlace {
  __typename: "AddPlaceResponse";
  ok: boolean;
  error: string | null;
}

export interface addPlace {
  AddPlace: addPlace_AddPlace;
}

export interface addPlaceVariables {
  name: string;
  lat: number;
  lng: number;
  address: string;
  isFavorite: boolean;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateProfile
// ====================================================

export interface updateProfile_UpdateMyProfile {
  __typename: "UpdateMyProfileResponse";
  ok: boolean;
  error: string | null;
}

export interface updateProfile {
  UpdateMyProfile: updateProfile_UpdateMyProfile;
}

export interface updateProfileVariables {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  password?: string | null;
  profilePhoto?: string | null;
  age?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: reportMovement
// ====================================================

export interface reportMovement_ReportMovement {
  __typename: "ReportMovementResponse";
  ok: boolean;
  error: string | null;
}

export interface reportMovement {
  ReportMovement: reportMovement_ReportMovement;
}

export interface reportMovementVariables {
  lat: number;
  lng: number;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getNearbyDrivers
// ====================================================

export interface getNearbyDrivers_GetNearbyDrivers_drivers {
  __typename: "User";
  id: number;
  lastLat: number | null;
  lastLng: number | null;
}

export interface getNearbyDrivers_GetNearbyDrivers {
  __typename: "GetNearbyDriversResponse";
  ok: boolean;
  error: string | null;
  drivers: (getNearbyDrivers_GetNearbyDrivers_drivers | null)[] | null;
}

export interface getNearbyDrivers {
  GetNearbyDrivers: getNearbyDrivers_GetNearbyDrivers;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: requestRide
// ====================================================

export interface requestRide_RequestRide_ride {
  __typename: "Ride";
  id: number;
}

export interface requestRide_RequestRide {
  __typename: "RequestRideResponse";
  ok: boolean;
  error: string | null;
  ride: requestRide_RequestRide_ride | null;
}

export interface requestRide {
  RequestRide: requestRide_RequestRide;
}

export interface requestRideVariables {
  pickUpAddress: string;
  pickUpLat: number;
  pickUpLng: number;
  dropOffAddress: string;
  dropOffLat: number;
  dropOffLng: number;
  price: number;
  distance: number;
  duration: number;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getNearbyRides
// ====================================================

export interface getNearbyRides_GetNearbyRide_ride_passenger {
  __typename: "User";
  fullName: string | null;
  profilePhoto: string | null;
}

export interface getNearbyRides_GetNearbyRide_ride {
  __typename: "Ride";
  id: number;
  pickUpAddress: string;
  dropOffAddress: string;
  price: number;
  distance: number;
  duration: number;
  passenger: getNearbyRides_GetNearbyRide_ride_passenger;
}

export interface getNearbyRides_GetNearbyRide {
  __typename: "GetNearbyRideResponse";
  ok: boolean;
  error: string | null;
  ride: getNearbyRides_GetNearbyRide_ride | null;
}

export interface getNearbyRides {
  GetNearbyRide: getNearbyRides_GetNearbyRide;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: acceptRide
// ====================================================

export interface acceptRide_UpdateRideStatus {
  __typename: "UpdateRideStatusResponse";
  ok: boolean;
  error: string | null;
}

export interface acceptRide {
  UpdateRideStatus: acceptRide_UpdateRideStatus;
}

export interface acceptRideVariables {
  ride: number;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: startPhoneVerification
// ====================================================

export interface startPhoneVerification_StartPhoneVerification {
  __typename: "StartPhoneVerificationResponse";
  ok: boolean;
  error: string | null;
}

export interface startPhoneVerification {
  StartPhoneVerification: startPhoneVerification_StartPhoneVerification | null;
}

export interface startPhoneVerificationVariables {
  phoneNumber: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: facebookConnect
// ====================================================

export interface facebookConnect_FacebookConnect {
  __typename: "FacebookConnectResponse";
  ok: boolean;
  error: string | null;
  token: string | null;
}

export interface facebookConnect {
  FacebookConnect: facebookConnect_FacebookConnect | null;
}

export interface facebookConnectVariables {
  firstName: string;
  lastName: string;
  email?: string | null;
  fbId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: completePhoneVerification
// ====================================================

export interface completePhoneVerification_CompletePhoneVerification {
  __typename: "CompletePhoneVerificationResponse";
  ok: boolean;
  error: string | null;
  token: string | null;
}

export interface completePhoneVerification {
  CompletePhoneVerification: completePhoneVerification_CompletePhoneVerification;
}

export interface completePhoneVerificationVariables {
  key: string;
  phoneNumber: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
