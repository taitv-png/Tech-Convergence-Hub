import Link from "next/link";

export function Hero() {
	return (
		<section className="hero">
			<div className="container hero-grid">
				<aside className="hero-visual" aria-hidden="true">
					<article className="hero-media hero-media-main">
						<div className="hero-overlay">
							<h1>Không gian công nghệ cho nghiên cứu.</h1>
							<p className="lead">Tìm cụm lab phù hợp và bắt đầu nhanh.</p>
							<div className="hero-actions">
								<Link className="btn btn-primary" href="/labs#lab-directory">
									Xem danh mục lab
								</Link>
							</div>
						</div>
					</article>
				</aside>
			</div>
		</section>
	);
}
