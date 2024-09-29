import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import React from 'react';
import Image from 'next/image';

interface Props {
  profileThumbnail: string | StaticImport;
}

const Profile = ({ profileThumbnail }: Props) => {
  return (
    <div className={'w-8 h-8 aspect-square rounded-full bg-gray-300 '}>
      {profileThumbnail && (
        <Image
          src={profileThumbnail}
          alt={'프로필 사진'}
          width={50}
          height={50}
        />
      )}
    </div>
  );
};

export default Profile;
