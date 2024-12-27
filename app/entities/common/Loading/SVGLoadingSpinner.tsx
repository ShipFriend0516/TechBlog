import { ImSpinner2 } from 'react-icons/im';

interface SVGLoadingSpinnerProps {
  message: string;
}
const SVGLoadingSpinner = ({ message }: SVGLoadingSpinnerProps) => {
  return (
    <div
      className={
        'flex justify-center items-center gap-2 mx-auto col-span-3 w-1/3 h-full pt-20'
      }
    >
      <ImSpinner2 className={'text-3xl animate-spin'} />
      {message && <span> {message}</span>}
    </div>
  );
};

export default SVGLoadingSpinner;
