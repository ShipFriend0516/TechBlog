import notfoundAnimation from '@/app/public/assets/notfound.json';
import LottiePlayer from '@/app/entities/common/Animation/LottiePlayer';
const NotFound = () => {
  return (
    <div className={' relative mx-auto max-w-4xl'}>
      <LottiePlayer
        animationData={notfoundAnimation}
        loop
        play
        speed={0.5}
        style={{
          width: '75%',
          height: '50%',
        }}
        className={'mx-auto'}
      />
      <h1
        className={
          'absolute left-1/2 bottom-1/4 -translate-x-1/2 -translate-y-1/4 text-center text-2xl text-nowrap'
        }
      >
        이런, 요청하신 데이터를 찾지 못했습니다.
      </h1>
    </div>
  );
};

export default NotFound;
