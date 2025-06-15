const ProjectOverview = ({ description }: { description: string }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">프로젝트 개요</h2>
      <p className="whitespace-pre-line text-weak leading-relaxed">
        {description}
      </p>
    </div>
  );
};
export default ProjectOverview;
