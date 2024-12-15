interface GithubLoginProps {
  signIn: () => void;
  text?: string;
}
const GithubLogin = ({ signIn, text }: GithubLoginProps) => {
  return (
    <button
      className="px-8 py-2 text-2xl bg-black text-white rounded-md shadow-md hover:bg-gray-800 transition-all"
      onClick={signIn}
    >
      {text ? text : 'GitHub로 로그인'}
    </button>
  );
};

export default GithubLogin;
