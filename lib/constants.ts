export const WORKOUT_TYPES = [
  "Chest",
  "Back",
  "Legs",
  "Cardio",
  "Full Body",
] as const;

export type WorkoutType = typeof WORKOUT_TYPES[number];

export const MEMBERSHIP_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  BANNED: "banned",
} as const;

export const MEMBERSHIP_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

export const NOTIFICATION_TYPES = {
  JOIN_APPROVED: "join_approved",
  JOIN_REQUESTED: "join_requested",
  WORKOUT_INVITE: "workout_invite",
  INVITE_ACCEPTED: "invite_accepted",
  MEMBER_JOINED: "member_joined",
  ROLE_CHANGED: "role_changed",
} as const;

/** Platform subscription: owners get 3 months free, max 2 gyms; upgrade for more */
export const TRIAL_MONTHS = 3;
export const MAX_GYMS_TRIAL = 2;

export const SUBSCRIPTION_TIERS = {
  TRIAL: "trial",
  STARTER: "starter",
  GROWTH: "growth",
  ENTERPRISE: "enterprise",
} as const;

export const APP_NAME = "GymCircle";
export const APP_DESCRIPTION = "Coordinate workouts with your gym community";
