type ExperienceType = 'work' | 'education';

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  type: ExperienceType;
  current?: boolean;
}

export const experiences: ExperienceItem[] = [
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
