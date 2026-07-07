import Link from "next/link";
import type { CSSProperties } from "react";
import { floorLabels, labs } from "../data/labs";

type LabDirectoryProps = {
	showHeader?: boolean;
};

export function LabDirectory({ showHeader = true }: LabDirectoryProps) {
	const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
	return (
		<section className="container section" id="lab-directory">
			{showHeader ? (
				<div className="section-head">
					<h2>Danh mục phòng thí nghiệm</h2>
				</div>
			) : null}
			<div className="labs-gallery">
				{labs.map((l) => {
					const cardStyle = {
						"--lab-media-image": `url("${basePath}${l.visual.realImage || l.visual.cardImage}")`,
					} as CSSProperties;

					return (
						<Link className="lab-frame" href={`/labs/${l.id}`} key={l.id}>
							<div className="lab-frame-visual">
								<div className="lab-frame-media" aria-hidden="true" style={cardStyle} />
								<div className="lab-frame-overlay">
									<h3>{l.name}</h3>
									<p className="lab-floor-label">{floorLabels[l.floor] ?? `Lầu ${l.floor}`}</p>
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
