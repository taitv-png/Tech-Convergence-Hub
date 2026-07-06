type IntroStat = {
  label: string;
  value: string;
};

type ProjectIntroStripProps = {
  id?: string;
  description: string;
  title?: string;
  stats?: IntroStat[];
};

export function ProjectIntroStrip({ id, title, description, stats }: ProjectIntroStripProps) {
  return (
    <section className="project-intro-strip" id={id} aria-label={title}>
      <div className="project-intro-strip-copy">
        {title ? <h2>{title}</h2> : null}
        <p>{description}</p>
      </div>

      {stats?.length ? (
        <div className="project-intro-strip-stats" aria-label={`${title ?? "Project intro"} quick stats`}>
          {stats.map((stat) => (
            <div className="project-intro-stat" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}