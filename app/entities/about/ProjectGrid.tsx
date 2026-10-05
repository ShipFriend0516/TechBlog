import Image from 'next/image';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import SectionHeader from '@/app/entities/home/SectionHeader';
import { Project } from '@/app/types/Portfolio';

const linkClass =
  'inline-flex items-center gap-1.5 rounded-lg bg-base/60 px-3 py-1.5 text-xs text-fg-soft transition-colors hover:text-accent';

const ProjectCard = ({ project }: { project: Project }) => (
  <article className="group relative flex flex-col card-interactive rounded-card p-5">
    <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-raised">
      <Image
        src={project.image}
        alt={`${project.title} 대표 이미지`}
        fill
        sizes="(min-width: 768px) 560px, 100vw"
        className="object-cover transition-[transform,filter] duration-500 ease-out-expo group-hover:scale-[1.03] dark:brightness-[0.85] dark:group-hover:brightness-100"
      />
    </div>
    <h3 className="mt-5 text-xl font-bold transition-colors group-hover:text-accent-strong">
      {/* 카드 전체를 상세 페이지 링크로 — 아래 외부 링크는 z-10 으로 위에 올림 */}
      {project.slug ? (
        <Link
          href={`/portfolio/${project.slug}`}
          className="after:absolute after:inset-0 after:rounded-card"
        >
          {project.title}
        </Link>
      ) : (
        project.title
      )}
    </h3>
    <p className="mt-2 text-fg-soft leading-7 break-keep">
      {project.description}
    </p>
    {project.tags && (
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-accent-subtle px-2.5 py-0.5 text-xs font-medium text-accent"
          >
            {tag}
          </li>
        ))}
      </ul>
    )}
    <div className="relative z-10 mt-auto flex gap-2 pt-5">
      {project.demoUrl && (
        <a href={project.demoUrl} target="_blank" rel="noreferrer" className={linkClass}>
          <FiExternalLink size={13} />
          배포
        </a>
      )}
      {project.githubUrl && (
        <a href={project.githubUrl} target="_blank" rel="noreferrer" className={linkClass}>
          <FaGithub size={13} />
          코드
        </a>
      )}
    </div>
  </article>
);

const ProjectGrid = ({ projects }: { projects: Project[] }) => (
  <section>
    <SectionHeader eyebrow="Projects" title="만들어 온 것들" />
    <div className="grid md:grid-cols-2 gap-5">
      {projects.map((project) => (
        <ProjectCard key={project.title} project={project} />
      ))}
    </div>
  </section>
);

export default ProjectGrid;
