import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { floorLabels, labs } from "../../../data/labs";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
	return labs.map((l) => ({ slug: l.id }));
}

export async function generateMetadata({ params }: Props) {
	const { slug } = await params;
	const lab = labs.find((l) => l.id === slug);

	return lab
		? { title: `${lab.name} · Tech-Convergence Hub`, description: lab.desc }
		: {};
}

export default async function LabDetailPage({ params }: Props) {
	const { slug } = await params;
	const lab = labs.find((l) => l.id === slug);

	if (!lab) notFound();

	const related = labs.filter((x) => x.cluster === lab.cluster && x.id !== lab.id);
	const floorLabel = floorLabels[lab.floor] ?? `Lầu ${lab.floor}`;
	const capabilities =
		lab.capabilities ?? [
			`Phát triển và kiểm thử giải pháp trong cụm ${lab.cluster}`,
			"Hỗ trợ đào tạo thực hành và nghiên cứu theo dự án",
			"Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
			"Tạo điều kiện tạo nguyên mẫu, thử nghiệm hiện trường và chuyển giao công nghệ",
		];
	const outcomes =
		lab.outcomes ?? [
			"Dự án nghiên cứu ứng dụng",
			"Nguyên mẫu công nghệ",
			"Chương trình đào tạo ngắn hạn",
			"Mô hình trình diễn",
		];

	return (
		<>
			<Header />
			<main>
				<section className="container page-hero lab-page-hero">
					<Link className="back-link" href="/labs#lab-directory">
						← Quay lại
					</Link>
					<div className="page-box lab-detail-hero">
						<article className="lab-detail-media">
							<div className="lab-detail-hero-copy">
								<h1>{lab.name}</h1>
							</div>
						</article>
					</div>
				</section>
				<section className="container section-sm">
					<div className="lab-detail-shell">
						<aside className="panel lab-detail-side">
							<h3 style={{ marginTop: 16 }}>
								{lab.room} · {floorLabel}
							</h3>
							<div className="chip-row">
								<span className="chip">{lab.cluster}</span>
							</div>
							<div className="spec-table">
								<div className="spec-row">
									<b>Phòng</b>
									<span>{lab.room}</span>
								</div>
								<div className="spec-row">
									<b>Tầng</b>
									<span>{lab.floor}</span>
								</div>
								<div className="spec-row">
									<b>Tín hiệu</b>
									<span>{lab.tech.slice(0, 3).join(" · ")}</span>
								</div>
								<div className="spec-row">
									<b>Cụm</b>
									<span>{lab.cluster}</span>
								</div>
							</div>
							<p style={{ marginTop: 22 }}>
								<Link className="btn btn-primary" style={{ width: "100%" }} href="/news">
									Tin mới
								</Link>
							</p>
						</aside>
						<main className="lab-detail-main">
							{lab.sourceQuote ? (
								<article className="card lab-content-intro-wrap">
									<p className="lab-content-intro">{lab.sourceQuote}</p>
								</article>
							) : null}
							<article className="card lab-tech-card">
								<span className="cluster-code">Công nghệ cốt lõi</span>
								<div className="chip-row">
									{lab.tech.map((x) => (
										<span className="chip" key={x}>
											{x}
										</span>
									))}
								</div>
							</article>
							<article className="card lab-app-card">
								<span className="cluster-code">Lĩnh vực ứng dụng</span>
								<div className="chip-row">
									{lab.apps.map((x) => (
										<span className="chip gray" key={x}>
											{x}
										</span>
									))}
								</div>
							</article>
							<div className="grid grid-2">
								<article className="card">
									<h3>Năng lực chính</h3>
									<ul className="list">
										{capabilities.map((x) => (
											<li key={x}>{x}</li>
										))}
									</ul>
								</article>
								<article className="card">
									<h3>Đầu ra có thể triển khai</h3>
									<ul className="list">
										{outcomes.map((x) => (
											<li key={x}>{x}</li>
										))}
									</ul>
								</article>
							</div>
							<article className="card">
								<h3>Đối tượng phù hợp</h3>
								<div className="chip-row">
									{(lab.audiences ?? ["Sinh viên", "Nhà nghiên cứu", "Doanh nghiệp", "Đối tác địa phương"]).map((x) => (
										<span className="chip" key={x}>
											{x}
										</span>
									))}
								</div>
							</article>
							<section>
								<div className="section-head left related-head">
									<span className="kicker">Lab liên quan</span>
								</div>
								<div className="lab-directory-grid related-labs-grid">
									{related.map((x) => (
										<Link className="lab-directory-card" href={`/labs/${x.id}`} key={x.id}>
											<h3>{x.name}</h3>
											<p>{x.desc}</p>
											<div className="meta">
												<span>{floorLabels[x.floor] ?? `Lầu ${x.floor}`} · {x.room}</span>
												<span>→</span>
											</div>
										</Link>
									))}
								</div>
							</section>
						</main>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
