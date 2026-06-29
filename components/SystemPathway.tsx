const steps = [
	["01", "Hội tụ", "Kết nối dữ liệu, thiết bị và hạ tầng tính toán dùng chung."],
	["02", "Phân tích", "Ứng dụng AI và dữ liệu lớn để nhận diện vấn đề cốt lõi."],
	["03", "Mô phỏng", "Kiểm thử kịch bản trên nền tảng bản sao số và hệ mô phỏng."],
	["04", "Thử nghiệm", "Triển khai phòng thí nghiệm sống ngoài thực địa với chính quyền và doanh nghiệp."],
	["05", "Chuyển giao", "Chuẩn hóa giải pháp, đào tạo và thương mại hóa sản phẩm công nghệ."],
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
