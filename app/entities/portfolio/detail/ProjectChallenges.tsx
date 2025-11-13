import Link from 'next/link';
import { FaLink } from 'react-icons/fa6';
import { Challenge } from '@/app/types/Portfolio';

interface ProjectChallengesProps {
  challenges: Challenge[];
}

const ProjectChallenges = ({ challenges }: ProjectChallengesProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold">프로젝트 문제해결</h2>
      <p className="text-weak leading-relaxed">
        이 섹션에서는 프로젝트 진행 중 발생한 문제와 해결 방법을 공유합니다.
      </p>
      {challenges.map((problem, index) => (
        <div key={index} className="mt-6">
          {problem.url ? (
            <Link
              href={problem.url || '#'}
              className={`${problem.url && 'text-blue-400 hover:text-blue-500'} flex items-center gap-2`}
            >
              <h3 className="text-lg font-semibold">{problem.title}</h3>
              {problem.url && <FaLink />}
            </Link>
          ) : (
            <h3 className="text-lg font-semibold">{problem.title}</h3>
          )}
          <p className="text-weak">{problem.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ProjectChallenges;
