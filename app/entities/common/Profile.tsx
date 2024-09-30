import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import React from 'react';
import Image from 'next/image';

interface Props {
  profileThumbnail?: string | StaticImport;
  username: string;
}

const Profile = ({ profileThumbnail, username }: Props) => {
  return (
    <div className={'flex items-center text-nowrap'}>
      <div
        className={
          'w-8 h-8 aspect-square rounded-full bg-gray-300 overflow-hidden'
        }
      >
        {profileThumbnail && (
          <Image
            src={profileThumbnail}
            alt={'프로필 사진'}
            width={50}
            height={50}
          />
        )}
      </div>
      <span className={'font-bold mx-2'}>{username}</span>
    </div>
  );
};

export default Profile;
