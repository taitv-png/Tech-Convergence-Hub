import Link from "next/link";
import { labs } from "../data/labs";

type LabDirectoryProps = {
	showHeader?: boolean;
};

export function LabDirectory({ showHeader = true }: LabDirectoryProps) {
	return (
		<section className="container section" id="lab-directory">
			{showHeader ? (
				<div className="section-head">
					<h2>Danh mục phòng thí nghiệm</h2>
				</div>
			) : null}
			<div className="labs-gallery">
				{labs.map((l) => {
					return (
						<Link className="lab-frame" href={`/labs/${l.id}`} key={l.id}>
							<div className="lab-frame-visual">
								<div className="lab-frame-media" aria-hidden="true" />
								<div className="lab-frame-overlay">
									<h3>{l.name}</h3>
									<p>{l.desc}</p>
									<div className="chip-row">
										{l.tech.slice(0, 3).map((tech) => (
											<span className="chip gray" key={tech}>
												{tech}
											</span>
										))}
									</div>
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</section>
	);
}
