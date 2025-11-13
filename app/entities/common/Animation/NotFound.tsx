import Link from 'next/link';
import LottiePlayer from '@/app/entities/common/Animation/LottiePlayer';
import NotFoundAnimation from '@/app/public/assets/notfound2.json';

interface NotFoundProps {
  message?: string;
  className?: string;
  redirect?: {
    path: string;
    buttonText?: string;
  };
}
const NotFound = ({ message, className, redirect }: NotFoundProps) => {
  return (
    <div className={'w-full mx-auto flex justify-center'}>
      <div className={className + ' flex flex-col items-center'}>
        <LottiePlayer
          animationData={NotFoundAnimation}
          play={true}
          loop={true}
          style={{ width: 200 }}
        />
        <div
          className={
            'text-medium-m text-gray-500 text-center flex flex-col gap-0.5'
          }
        >
          {message?.split('\n').map((text) => <p key={text}>{text}</p>)}
        </div>
        {redirect && (
          <Link
            className={
              'bg-green-100 hover:bg-green-100/80 text-white text-semibold-r rounded-xl px-4 py-1 mt-2'
            }
            href={redirect.path}
          >
            {redirect.buttonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default NotFound;
