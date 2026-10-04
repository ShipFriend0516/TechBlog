interface ProjectSummaryProps {
  category: string;
  year: string;
  technologies: string[];
}

const ProjectSummary = ({
  category,
  year,
  technologies,
}: ProjectSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-surface rounded-lg text-fg-soft">
      <div>
        <h3 className="text-sm font-semibold mb-1 text-fg">
          프로젝트 유형
        </h3>
        <p className="font-medium">{category}</p>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-1 text-fg">
          완료 연도
        </h3>
        <p className="font-medium">{year}</p>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-1 text-fg">
          사용 기술
        </h3>
        <p className="font-medium">{technologies.join(', ')}</p>
      </div>
    </div>
  );
};

export default ProjectSummary;
