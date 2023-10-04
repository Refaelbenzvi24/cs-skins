import React, {memo} from "react";
import Image, {StaticImageData} from "next/image";
import cn from "classnames";
import {AvatarSize, AVATAR_SIZE} from "./Avatar.utils";
import styles from "./Avatar.module.scss";

type AvatarProps = {
  /** Avatar image source */
  src: string | StaticImageData;
  /** Avatar size */
  size?: AvatarSize;
}

/** The Avatar component is used to display a user's profile picture. */
const Avatar = memo(({src, size = AVATAR_SIZE.MD}: AvatarProps) => {

  const avatarClassName = cn(
    styles.avatar,
    styles[`avatar${size}`]
  );

  return (
    <div className={avatarClassName}>
      <Image fill src={src} className={styles.avatarImg} alt="" />
    </div>
  );
});

Avatar.displayName = "Avatar";

export type {AvatarProps};

export {Avatar};