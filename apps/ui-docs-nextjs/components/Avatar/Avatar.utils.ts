const AVATAR_SIZE = {
  SM: "SM",
  MD: "MD",
  LG: "LG",
  XL: "XL"
} as const;

type AvatarSize = keyof typeof AVATAR_SIZE;

export type {AvatarSize};

export {AVATAR_SIZE};