// Operating models (mô hình không gian / mô hình hoạt động). They are not the 12 technology
// themes in data/technology-themes.ts.
//
// Names follow the laser slide (5-living-labs-laze-noi-video-muot-v4.pptx), left to right:
// Sandbox, Living Lab, Laboratory, Makerspace, Field Lab. A later classification document lists
// Incubator instead of Laboratory. Unresolved: confirm with the owner before renaming; do not
// swap labels silently. Descriptions summarise TONGHOP-LABS.docx (repository root copy).

export type OperatingModel = {
  id: string;
  name: string;
  summary: string;
  activities: string;
  outcomes: string;
};

export const operatingModels: OperatingModel[] = [
  {
    id: "sandbox",
    name: "Sandbox",
    summary:
      "Không gian thử nghiệm công nghệ mở, nơi giải pháp được chạy thử trong môi trường mô phỏng và giám sát trước khi đưa ra thực tế.",
    activities: "Kiểm thử kịch bản, mô phỏng vận hành, giám sát và điều chỉnh hệ thống.",
    outcomes: "Phương án đã được kiểm chứng, sẵn sàng cho bước thí điểm.",
  },
  {
    id: "living-lab",
    name: "Living Lab",
    summary:
      "Phòng thí nghiệm sống: giải pháp được thử nghiệm, hiệu chỉnh và chuyển giao trong bối cảnh thật của campus, doanh nghiệp và đô thị.",
    activities:
      "Sinh viên, nhà nghiên cứu, doanh nghiệp và chính quyền cùng xác định vấn đề và đồng sáng tạo giải pháp.",
    outcomes: "Thí điểm trong môi trường thực, giải pháp chuyển giao cho đối tác.",
  },
  {
    id: "laboratory",
    name: "Laboratory",
    summary:
      "Phòng thí nghiệm chuyên ngành với thiết bị riêng, phục vụ đào tạo thực hành và nghiên cứu chuyên sâu.",
    activities: "Học thực hành, làm thí nghiệm, nghiên cứu theo đề tài và dự án.",
    outcomes: "Kết quả nghiên cứu, công bố khoa học, năng lực kỹ thuật cho người học.",
  },
  {
    id: "makerspace",
    name: "Makerspace",
    summary:
      "Không gian tạo mẫu: lắp ráp, chế tạo và kiểm thử sản phẩm trước giai đoạn ươm tạo và thương mại hóa.",
    activities: "Tạo nguyên mẫu, thử nghiệm sản phẩm, chuẩn bị trình diễn cho nhà đầu tư và đối tác.",
    outcomes: "Nguyên mẫu, sản phẩm trình diễn, dự án sẵn sàng ươm tạo.",
  },
  {
    id: "field-lab",
    name: "Field Lab",
    summary:
      "Thực hành và thử nghiệm ngoài thực địa, đưa thành phố và vùng trở thành không gian học tập và nghiên cứu.",
    activities: "Thu thập dữ liệu thực địa, quan sát, triển khai thử nghiệm tại hiện trường.",
    outcomes: "Dữ liệu thực địa, bằng chứng cho quy hoạch và chính sách.",
  },
];

// Laser scene geometry, read from the slide (fractions of the 16:9 slide).
// beam: the laser group; layers: the two cropped copies of the same GIF (one turned 180°).
// building: the separate artwork; label: the name text box.
export type SlideModel = {
  id: string;
  name: string;
  laser: string;
  beam: { left: number; width: number; layers: { left: number; width: number; rotate: boolean; alpha: number }[] };
  building: { left: number; top: number; width: number };
  label: { left: number; width: number };
};

export const slideModels: SlideModel[] = [
  {
    id: "sandbox",
    name: "Sandbox",
    laser: "laser-mekong",
    beam: { left: 0.0486, width: 0.1366, layers: [{ left: 0, width: 1, rotate: false, alpha: 0.7 }, { left: 0.2847, width: 0.5334, rotate: true, alpha: 0.7 }] },
    building: { left: 0.0413, top: 0.4069, width: 0.1513 },
    label: { left: 0.031, width: 0.171 },
  },
  {
    id: "living-lab",
    name: "Living Lab",
    laser: "laser-campus-b",
    beam: { left: 0.2321, width: 0.1468, layers: [{ left: 0, width: 1, rotate: false, alpha: 0.7 }, { left: 0.268, width: 0.563, rotate: true, alpha: 1 }] },
    building: { left: 0.2216, top: 0.3954, width: 0.1709 },
    label: { left: 0.218, width: 0.171 },
  },
  {
    id: "laboratory",
    name: "Laboratory",
    laser: "laser-campus-v",
    beam: { left: 0.4168, width: 0.1585, layers: [{ left: 0, width: 1, rotate: false, alpha: 0.7 }, { left: 0.2589, width: 0.4877, rotate: true, alpha: 1 }] },
    building: { left: 0.4386, top: 0.3157, width: 0.1293 },
    label: { left: 0.416, width: 0.171 },
  },
  {
    id: "makerspace",
    name: "Makerspace",
    laser: "laser-nexus",
    beam: { left: 0.6132, width: 0.1321, layers: [{ left: 0, width: 1, rotate: false, alpha: 1 }, { left: 0.2874, width: 0.4905, rotate: true, alpha: 1 }] },
    building: { left: 0.5978, top: 0.4557, width: 0.1921 },
    label: { left: 0.597, width: 0.171 },
  },
  {
    id: "field-lab",
    name: "Field Lab",
    laser: "laser-campus-n",
    beam: { left: 0.7946, width: 0.1332, layers: [{ left: 0, width: 1, rotate: false, alpha: 1 }, { left: 0.3125, width: 0.3975, rotate: true, alpha: 1 }] },
    building: { left: 0.7951, top: 0.3245, width: 0.1472 },
    label: { left: 0.779, width: 0.171 },
  },
];

// Click order in the slide: Laboratory, Living Lab, Makerspace, Sandbox, Field Lab.
export const slideRevealOrder = [2, 1, 3, 0, 4];
