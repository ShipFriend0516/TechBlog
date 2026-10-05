import SectionHeader from '@/app/entities/home/SectionHeader';
import { experiences } from '@/app/lib/constants/profile';

const ExperienceList = () => (
  <section>
    <SectionHeader eyebrow="Experience" title="걸어온 길" />
    <ol className="flex flex-col gap-2">
      {experiences.map((exp) => (
        <li
          key={exp.company}
          className="grid sm:grid-cols-[180px_1fr] gap-1 sm:gap-6 rounded-card bg-surface px-6 py-5"
        >
          <p className="text-sm text-fg-muted tabular-nums sm:pt-0.5">
            {exp.period}
          </p>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold break-keep">{exp.company}</h3>
              {exp.current && (
                <span className="rounded-full bg-accent-subtle px-2 py-0.5 text-xs font-medium text-accent">
                  재직 중
                </span>
              )}
              {exp.type === 'education' && (
                <span className="rounded-full bg-nebula-subtle px-2 py-0.5 text-xs font-medium text-nebula-soft">
                  교육
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-fg-soft">{exp.role}</p>
          </div>
        </li>
      ))}
    </ol>
  </section>
);

export default ExperienceList;
