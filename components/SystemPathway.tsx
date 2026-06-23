const steps = [
	["01", "Thu thập", "Lấy dữ liệu từ thiết bị và cảm biến."],
	["02", "Phân tích", "Dùng AI để lọc tín hiệu chính."],
	["03", "Mô phỏng", "Kiểm thử kịch bản bằng Digital Twin."],
	["04", "Trình bày", "Hiển thị trên dashboard và báo cáo."],
	["05", "Triển khai", "Thử nghiệm pilot và chuyển giao."],
];

export function SystemPathway() {
	return (
		<section className="container section system-pathway-section">
			<div className="section-head">
				<h2>Chu trình triển khai</h2>
			</div>
			<div className="pathway">
				{steps.map(([n, t, d]) => (
					<article className="card path-step" key={n}>
						<small>{n}</small>
						<h3>{t}</h3>
						<p>{d}</p>
					</article>
				))}
			</div>
		</section>
	);
}
