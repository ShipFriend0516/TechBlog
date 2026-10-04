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
    company: 'CJ올리브영 글로벌엔지니어링센터',
    role: 'AI플랫폼 Software Engineer',
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
            className="flex items-center gap-4 p-4 rounded-xl bg-surface"
          >
            <div className="p-2.5 rounded-lg bg-accent/10">
              {exp.type === 'work' ? (
                <HiOutlineBriefcase className="w-5 h-5 text-accent" />
              ) : (
                <HiOutlineAcademicCap className="w-5 h-5 text-accent" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-fg">
                  {exp.company}
                </h3>
                {exp.current && (
                  <span className="text-xs px-2 py-0.5 bg-fg-faint/10 text-accent rounded-full font-medium">
                    현재
                  </span>
                )}
              </div>
              <p className="text-sm text-fg-soft">
                {exp.role}
              </p>
            </div>
            <span className="text-sm text-fg-muted whitespace-nowrap">
              {exp.period}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
