import { HiOutlineAcademicCap, HiOutlineBriefcase } from 'react-icons/hi';
import SectionHeading from '../common/SectionHeading';

type ExperienceType = 'work' | 'education';

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  type: ExperienceType;
  current?: boolean;
}

const experiences: ExperienceItem[] = [
  {
    company: 'CJ올리브영',
    role: 'AI플랫폼팀 Intern',
    period: '2025.09 ~',
    type: 'work',
    current: true,
  },
  {
    company: '네이버 부스트캠프 9기 웹·모바일',
    role: '웹풀스택 챌린지, 멤버십 수료',
    period: '2024.07 ~ 2024.12',
    type: 'education',
  },
];

const Experience = () => {
  return (
    <section className="grid gap-6">
      <SectionHeading title="Experience" />
      <div className="flex flex-col gap-3">
        {experiences.map((exp) => (
          <div
            key={exp.company}
            className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-neutral-800/50"
          >
            <div className="p-2.5 rounded-lg bg-primary-deep/10 dark:bg-primary-deep/20">
              {exp.type === 'work' ? (
                <HiOutlineBriefcase className="w-5 h-5 text-primary dark:text-emerald-400" />
              ) : (
                <HiOutlineAcademicCap className="w-5 h-5 text-primary dark:text-emerald-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">
                  {exp.company}
                </h3>
                {exp.current && (
                  <span className="text-xs px-2 py-0.5 bg-neutral-400/10 dark:bg-neutral-400/20 text-primary-bangladesh dark:text-primary-mountain rounded-full font-medium">
                    현재
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {exp.role}
              </p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {exp.period}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
