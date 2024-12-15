import { FaGithub } from 'react-icons/fa';

interface GithubLoginProps {
  signIn: () => void;
  text?: string;
}
const GithubLogin = ({ signIn, text }: GithubLoginProps) => {
  return (
    <button
      className="px-5 py-3 text-2xl bg-black text-white rounded-md shadow-md hover:bg-gray-600 transition-all inline-flex items-center gap-2"
      onClick={signIn}
    >
      <FaGithub />
      {text ? text : 'GitHub로 로그인'}
    </button>
  );
};

export default GithubLogin;
