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
  age?: number | null;
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
