import Link from "next/link";

export function Hero() {
	return (
		<section className="hero">
			<div className="container hero-grid">
				<aside className="hero-visual" aria-hidden="true">
					<article className="hero-media hero-media-main">
						<div className="hero-overlay">
							<h1>Tech-Convergence Hub</h1>
							<p className="lead">
								Tech-Convergence Hub kết nối AI, robot, dữ liệu, mô phỏng và công nghệ nhập vai để giải các bài toán đô thị,
								biển, năng lượng và hạ tầng thông minh.
							</p>
							<div className="hero-actions">
								<Link className="btn btn-primary" href="/labs#lab-directory">
									Xem danh mục phòng thí nghiệm
								</Link>
							</div>
						</div>
					</article>
				</aside>
			</div>
		</section>
	);
}
