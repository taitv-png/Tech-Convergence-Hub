export type Lab = {
  id: string;
  code: string;
  name: string;
  room: string;
  floor: string;
  cluster: string;
  desc: string;
  tech: string[];
  apps: string[];
  status?: string;
  capabilities?: string[];
  audiences?: string[];
  outcomes?: string[];
  intro?: string;
  heroLine?: string;
  sourceQuote?: string;
};

export type Cluster = {
  name: string;
  code: string;
  angle: number;
  roomCount?: number;
  desc: string;
  tags: string[];
};

export type NewsItem = {
  category: string;
  date: string;
  title: string;
  excerpt: string;
};

const doiTuongMacDinh = [
  "Sinh viên",
  "Học viên sau đại học",
  "Nhà nghiên cứu",
  "Doanh nghiệp và đối tác địa phương",
];

const dauRaMacDinh = [
  "Đề tài nghiên cứu ứng dụng",
  "Nguyên mẫu và mô hình trình diễn",
  "Chương trình đào tạo thực hành ngắn hạn",
  "Dự án chuyển giao công nghệ",
];

const nangLucTheoCum = (tenCum: string) => [
  `Phát triển và kiểm thử giải pháp trong cụm ${tenCum}`,
  "Tích hợp dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
  "Hỗ trợ đào tạo thực hành và nghiên cứu liên ngành",
  "Thử nghiệm thực địa theo mô hình phòng thí nghiệm sống và kết nối chuyển giao",
];

const taoLab = (
  item: Omit<Lab, "audiences" | "outcomes" | "capabilities">,
): Lab => ({
  ...item,
  audiences: doiTuongMacDinh,
  outcomes: dauRaMacDinh,
  capabilities: nangLucTheoCum(item.cluster),
  intro: item.desc,
  heroLine: "Nút hội tụ công nghệ",
  sourceQuote: item.sourceQuote ?? item.desc,
});

export const clustersByFloor: { floor: string; clusters: Cluster[] }[] = [
  {
    floor: "Lầu 1",
    clusters: [
      {
        name: "Robot và hệ thống tự hành",
        code: "ROBOT",
        roomCount: 2,
        angle: 25,
        desc: "Phát triển robot di động, robot bay, robot dưới nước và các hệ thống điều khiển tự hành.",
        tags: ["Robot di động", "Robot bay", "Robot dưới nước", "Hệ thống tự hành"],
      },
      {
        name: "Công nghệ nhập vai và trải nghiệm người dùng",
        code: "XR.HCI",
        roomCount: 4,
        angle: 75,
        desc: "Ứng dụng công nghệ đa chiều, hologram, VR/AR và tương tác người máy.",
        tags: ["Hologram", "VR/AR", "UX", "Tương tác"],
      },
      {
        name: "Đô thị thông minh và hệ thống đô thị",
        code: "URBAN",
        roomCount: 5,
        angle: 125,
        desc: "Nghiên cứu giao thông, vận hành đô thị, dữ liệu đô thị và hệ thống đường sắt thông minh.",
        tags: ["Đô thị thông minh", "Giao thông", "Đường sắt", "Vận hành"],
      },
      {
        name: "Biển, ven bờ và năng lượng",
        code: "OCEAN",
        roomCount: 5,
        angle: 175,
        desc: "Giám sát đại dương, quy hoạch biển ven bờ, cảng biển thông minh và năng lượng tái tạo đại dương.",
        tags: ["Cảng biển", "Giám sát biển", "Robot đại dương", "Năng lượng"],
      },
      {
        name: "Tự động hóa công nghiệp và IoT",
        code: "AIOT",
        roomCount: 4,
        angle: 225,
        desc: "Hội tụ hệ thống nhúng, mạng truyền thông công nghiệp, PLC/SCADA và sản xuất thông minh.",
        tags: ["Hệ thống nhúng", "IoT", "PLC/SCADA", "Sản xuất thông minh"],
      },
      {
        name: "An toàn thông tin và hạ tầng số",
        code: "CYBER",
        roomCount: 1,
        angle: 270,
        desc: "Đào tạo và thực hành an toàn thông tin, kiểm thử xâm nhập, điều tra số và bảo mật hệ thống.",
        tags: ["An toàn thông tin", "Điều tra số", "Mạng", "Bảo mật đám mây"],
      },
      {
        name: "Đổi mới sáng tạo và thương mại hóa",
        code: "MARKET",
        roomCount: 5,
        angle: 305,
        desc: "Ươm tạo, trình diễn, kết nối đầu tư và thương mại hóa kết quả nghiên cứu.",
        tags: ["Nguyên mẫu", "Ươm tạo", "Ngày trình diễn", "Chuyển giao"],
      },
    ],
  },
];

export const clusters: Cluster[] = [
  {
    name: "Robot và hệ thống tự hành",
    code: "ROBOT",
    angle: 25,
    desc: "Phát triển robot di động, robot bay, robot dưới nước và các hệ thống điều khiển tự hành.",
    tags: ["Robot di động", "Robot bay", "Robot dưới nước", "Hệ thống tự hành"],
  },
  {
    name: "Công nghệ nhập vai và trải nghiệm người dùng",
    code: "XR.HCI",
    angle: 75,
    desc: "Ứng dụng công nghệ đa chiều, hologram, VR/AR và tương tác người máy.",
    tags: ["Hologram", "VR/AR", "UX", "Tương tác"],
  },
  {
    name: "Đô thị thông minh và hệ thống đô thị",
    code: "URBAN",
    angle: 125,
    desc: "Nghiên cứu giao thông, vận hành đô thị, dữ liệu đô thị và hệ thống đường sắt thông minh.",
    tags: ["Đô thị thông minh", "Giao thông", "Đường sắt", "Vận hành"],
  },
  {
    name: "Biển, ven bờ và năng lượng",
    code: "OCEAN",
    angle: 175,
    desc: "Giám sát đại dương, quy hoạch biển ven bờ, cảng biển thông minh và năng lượng tái tạo đại dương.",
    tags: ["Cảng biển", "Giám sát biển", "Robot đại dương", "Năng lượng"],
  },
  {
    name: "Tự động hóa công nghiệp và IoT",
    code: "AIOT",
    angle: 225,
    desc: "Hội tụ hệ thống nhúng, mạng truyền thông công nghiệp, PLC/SCADA và sản xuất thông minh.",
    tags: ["Hệ thống nhúng", "IoT", "PLC/SCADA", "Sản xuất thông minh"],
  },
  {
    name: "An toàn thông tin và hạ tầng số",
    code: "CYBER",
    angle: 270,
    desc: "Đào tạo và thực hành an toàn thông tin, kiểm thử xâm nhập, điều tra số và bảo mật hệ thống.",
    tags: ["An toàn thông tin", "Điều tra số", "Mạng", "Bảo mật đám mây"],
  },
  {
    name: "Đổi mới sáng tạo và thương mại hóa",
    code: "MARKET",
    angle: 305,
    desc: "Ươm tạo, trình diễn, kết nối đầu tư và thương mại hóa kết quả nghiên cứu.",
    tags: ["Nguyên mẫu", "Ươm tạo", "Ngày trình diễn", "Chuyển giao"],
  },
];

export const labs: Lab[] = [
  taoLab({
    id: "precision-mechanics-lab",
    code: "MechProto",
    name: "Phòng thí nghiệm Cơ khí và Thiết bị Chính xác",
    room: "E001",
    floor: "0",
    cluster: "Tự động hóa công nghiệp và IoT",
    desc: "Không gian nghiên cứu, đào tạo, thiết kế, chế tạo thử nghiệm và đánh giá hệ thống cơ khí chính xác, phục vụ phát triển sản phẩm và nguyên mẫu kỹ thuật.",
    tech: ["CAD/CAM/CAE", "Máy in 3D", "Máy cắt laser", "CNC mini"],
    apps: ["Chế tạo nguyên mẫu", "Tự động hóa", "Cơ điện tử"],
  }),
  taoLab({
    id: "hologram-printing-lab",
    code: "HoloPrint",
    name: "Phòng kỹ thuật sản xuất và lưu trữ dữ liệu Hologram",
    room: "E002",
    floor: "0",
    cluster: "Công nghệ nhập vai và trải nghiệm người dùng",
    desc: "Không gian sản xuất, lưu trữ dữ liệu in, kết hợp đào tạo và thực hành sản xuất Hologram.",
    tech: ["Máy in hologram", "Vật liệu quang học", "Máy trạm xử lý", "Hệ thống phụ trợ"],
    apps: ["Trưng bày công nghệ", "Sản phẩm arttech", "Chuyển giao công nghệ"],
  }),
  taoLab({
    id: "classroom-e103",
    code: "ClassE103",
    name: "Phòng học",
    room: "E103",
    floor: "1",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Phòng đào tạo quy mô 30 đến 40 chỗ ngồi.",
    tech: ["Máy chiếu", "Hệ thống âm thanh", "Bảng tương tác", "Mạng không dây"],
    apps: ["Đào tạo"],
  }),
  taoLab({
    id: "hologram-exhibition-room",
    code: "ImmersiveExpo",
    name: "Phòng triển lãm Công nghệ đa chiều và Hậu kỳ sản xuất",
    room: "E102",
    floor: "1",
    cluster: "Công nghệ nhập vai và trải nghiệm người dùng",
    desc: "Trưng bày các sản phẩm Hologram và thực hiện hậu kỳ sản xuất.",
    tech: ["Hệ trưng bày Hologram", "Thiết bị hậu kỳ", "Máy trạm đồ họa", "Thiết bị trình chiếu"],
    apps: ["Triển lãm", "Hậu kỳ sản xuất"],
  }),
  taoLab({
    id: "immersive-technology-center",
    code: "ImmersiveCore",
    name: "Trung tâm Hội tụ Công nghệ tương tác đa chiều",
    room: "E104",
    floor: "1",
    cluster: "Công nghệ nhập vai và trải nghiệm người dùng",
    desc: "Không gian nghiên cứu, thực hành các công nghệ hình ảnh, mô phỏng và tương tác kỹ thuật số, đồng thời là không gian hậu kỳ sản xuất Hologram.",
    tech: ["Thiết bị theo dõi tương tác", "Bộ ghi dữ liệu hành vi", "Nền tảng mô phỏng", "Thiết bị trình diễn"],
    apps: ["Nghiên cứu", "Đánh giá trải nghiệm người dùng"],
  }),
  taoLab({
    id: "human-centered-ai-lab",
    code: "HCAI",
    name: "Phòng thí nghiệm Đổi mới sáng tạo AI",
    room: "E101",
    floor: "1",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Nghiên cứu và phát triển các ứng dụng trí tuệ nhân tạo lấy con người làm trung tâm.",
    tech: ["GPU", "Kính thông minh", "Thiết bị đeo", "Robot hình người"],
    apps: ["Dịch vụ AI", "Sản phẩm đổi mới", "Ứng dụng trong doanh nghiệp"],
  }),
  taoLab({
    id: "urban-physics-lab",
    code: "UrbanPhysics",
    name: "Phòng Thí nghiệm Vật lý Kiến trúc và Đô thị",
    room: "E203",
    floor: "2",
    cluster: "Đô thị thông minh và hệ thống đô thị",
    desc: "Đo đạc và mô phỏng các yếu tố vật lý phục vụ thiết kế kiến trúc xanh và tiết kiệm năng lượng.",
    tech: ["Mô phỏng vật lý", "Công cụ đo đạc", "Mô hình khí hậu", "Phân tích động học"],
    apps: ["Kiến trúc xanh", "Quy hoạch bền vững", "Tiết kiệm năng lượng"],
  }),
  taoLab({
    id: "research-lab",
    code: "ResearchHub",
    name: "Phòng nghiên cứu chuyên gia",
    room: "E202",
    floor: "2",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Không gian hợp tác nghiên cứu của các chuyên gia trong và ngoài nước.",
    tech: ["Không gian nghiên cứu", "Hạ tầng làm việc nhóm", "Kết nối học thuật", "Hệ thống hỗ trợ nghiên cứu"],
    apps: ["Hợp tác quốc tế", "Nghiên cứu liên ngành", "Dự án đồng sáng tạo"],
  }),
  taoLab({
    id: "smart-city-lab",
    code: "SmartCity",
    name: "Phòng nghiên cứu Smart City",
    room: "E204",
    floor: "2",
    cluster: "Đô thị thông minh và hệ thống đô thị",
    desc: "Tập trung vào các giải pháp AIoT, Digital Twin và quản lý dữ liệu đô thị để giải quyết các bài toán thực tế về an ninh, giao thông và hạ tầng đô thị thông minh.",
    tech: ["AIoT", "Digital Twin", "Nền tảng GIS", "Phân tích dữ liệu đô thị"],
    apps: ["Nghiên cứu", "Phân tích và dự báo đô thị"],
  }),
  taoLab({
    id: "digital-twin-lab",
    code: "META-DT",
    name: "Phòng nghiên cứu khoa học dữ liệu đô thị",
    room: "E201",
    floor: "2",
    cluster: "Đô thị thông minh và hệ thống đô thị",
    desc: "Phòng thí nghiệm và nghiên cứu khoa học dữ liệu đô thị trên hệ thống bản đồ số, tích hợp AI, quản lý dữ liệu đô thị theo thời gian thực.",
    tech: ["Cảm biến quan trắc", "Nền tảng mô phỏng", "Bản sao số", "Phân tích dự báo"],
    apps: ["Mô phỏng", "Dự báo vận hành"],
  }),
  taoLab({
    id: "automated-vehicles-lab",
    code: "AutoVehicle",
    name: "Phòng thí nghiệm các phương tiện tự động hóa",
    room: "E303",
    floor: "3",
    cluster: "Robot và hệ thống tự hành",
    desc: "Nghiên cứu và giảng dạy về robot di động, xe tự hành, phát triển thuật toán điều khiển.",
    tech: ["Robot di động", "Nền tảng xe tự hành", "Cảm biến định vị", "Mô phỏng điều khiển"],
    apps: ["Nghiên cứu robot", "Đào tạo điều khiển tự hành"],
  }),
  taoLab({
    id: "space-ocean-robotics-lab",
    code: "SpaceOceanBot",
    name: "Phòng thí nghiệm robot không gian và Phòng thí nghiệm Robot đại dương",
    room: "E302",
    floor: "3",
    cluster: "Robot và hệ thống tự hành",
    desc: "Nghiên cứu và thực nghiệm các thiết bị bay không người lái cùng các phương tiện tự hành dưới nước.",
    tech: ["Drone nghiên cứu", "ROV/AUV", "Bệ thử nghiệm", "Hệ thống điều khiển tự hành"],
    apps: ["Robot không người lái", "Robot dưới nước"],
  }),
  taoLab({
    id: "industrial-production-line-lab",
    code: "MPSLine",
    name: "Phòng thực hành Dây chuyền sản xuất công nghiệp",
    room: "E304",
    floor: "3",
    cluster: "Tự động hóa công nghiệp và IoT",
    desc: "Cung cấp không gian và thiết bị thực hành cho cơ điện tử và tự động hóa nhà máy.",
    tech: ["MPS", "PLC", "Băng chuyền mô phỏng", "Thiết bị cơ điện tử"],
    apps: ["Thực hành sản xuất", "Đào tạo tự động hóa"],
  }),
  taoLab({
    id: "embedded-iot-process-lab",
    code: "EmbedProcess",
    name: "Phòng thí nghiệm Hệ thống Nhúng và IoT, cùng Phòng thí nghiệm Điều khiển quá trình và mạng truyền thông công nghiệp",
    room: "E301",
    floor: "3",
    cluster: "Tự động hóa công nghiệp và IoT",
    desc: "Nghiên cứu, giảng dạy về hệ thống nhúng, Internet vạn vật, tự động hóa và mạng truyền thông công nghiệp.",
    tech: ["Vi điều khiển", "Gateway IoT", "PLC/SCADA", "Mạng công nghiệp"],
    apps: ["Nghiên cứu hệ thống nhúng", "Đào tạo mạng công nghiệp"],
  }),
  taoLab({
    id: "edge-physical-ai-lab",
    code: "EdgeAI",
    name: "Phòng thí nghiệm Edge_Physical AI (Edge_Physical AI Lab)",
    room: "E402, E403",
    floor: "4",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Tích hợp AI, cảm biến, truyền động, nhúng, robot, IoT, thị giác máy tính và điều khiển thời gian thực nhằm phát triển các hệ thống thông minh hoạt động trong môi trường vật lý thực tế.",
    tech: ["Edge AI", "Thị giác máy tính", "Cảm biến thời gian thực", "Nền tảng suy luận tại biên"],
    apps: ["Hệ thống thông minh vật lý", "Nghiên cứu Edge AI"],
  }),
  taoLab({
    id: "ai-big-data-lab",
    code: "AIBigData",
    name: "Phòng thí nghiệm nghiên cứu AI và Big Data",
    room: "E402, E403",
    floor: "4",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Nghiên cứu ứng dụng hàng đầu về AI và Big Data trong khối ngành kinh tế, có năng lực công bố quốc tế, chuyển giao công nghệ thực tiễn và đào tạo nguồn nhân lực chất lượng cao.",
    tech: ["Cụm xử lý dữ liệu", "Kho dữ liệu", "Máy trạm GPU", "Nền tảng học máy"],
    apps: ["AI và dữ liệu lớn", "Phân tích dữ liệu nâng cao"],
  }),
  taoLab({
    id: "ocean-monitoring-planning-energy-lab",
    code: "OceanPlanning",
    name: "Phòng thí nghiệm Quan trắc và Quy hoạch Không gian Biển, Phòng thí nghiệm vật lý đại dương và Phòng thí nghiệm Năng lượng tái tạo đại dương",
    room: "E404",
    floor: "4",
    cluster: "Biển, ven bờ và năng lượng",
    desc: "Giám sát đại dương, quy hoạch không gian biển, mô phỏng vật lý đại dương và thử nghiệm công nghệ năng lượng tái tạo biển.",
    tech: ["Hệ quan trắc biển", "GIS biển", "Mô phỏng vật lý đại dương", "Thiết bị thử nghiệm năng lượng biển"],
    apps: ["Quan trắc đại dương", "Quy hoạch biển", "Năng lượng tái tạo biển"],
  }),
  taoLab({
    id: "smart-port-mobility-rail-lab",
    code: "PortMoveRail",
    name: "Phòng thí nghiệm Logistics Cảng biển thông minh, Phòng thí nghiệm Di chuyển thông minh và Phòng thí nghiệm Hệ thống Đường sắt",
    room: "E401",
    floor: "4",
    cluster: "Đô thị thông minh và hệ thống đô thị",
    desc: "Nghiên cứu tối ưu hóa vận hành cảng biển, giao thông đô thị và đào tạo vận hành hệ thống đường sắt.",
    tech: ["Mô phỏng logistics cảng", "Phân tích giao thông", "Mô hình hệ thống đường sắt", "Bảng điều hành"],
    apps: ["Logistics thông minh", "Di chuyển thông minh", "Đào tạo vận hành đường sắt"],
  }),
  taoLab({
    id: "classroom-e503",
    code: "ClassE503",
    name: "Phòng học",
    room: "E503",
    floor: "5",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Phòng đào tạo với quy mô 30 đến 40 chỗ ngồi.",
    tech: ["Máy chiếu", "Hệ thống âm thanh", "Bảng tương tác", "Mạng không dây"],
    apps: ["Đào tạo"],
  }),
  taoLab({
    id: "classroom-e502",
    code: "ClassE502",
    name: "Phòng học",
    room: "E502",
    floor: "5",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Phòng đào tạo với quy mô 30 đến 40 chỗ ngồi.",
    tech: ["Máy chiếu", "Hệ thống âm thanh", "Bảng tương tác", "Mạng không dây"],
    apps: ["Đào tạo"],
  }),
  taoLab({
    id: "classroom-e504",
    code: "ClassE504",
    name: "Phòng học",
    room: "E504",
    floor: "5",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Phòng đào tạo với quy mô 30 đến 40 chỗ ngồi.",
    tech: ["Máy chiếu", "Hệ thống âm thanh", "Bảng tương tác", "Mạng không dây"],
    apps: ["Đào tạo"],
  }),
  taoLab({
    id: "classroom-e501",
    code: "ClassE501",
    name: "Phòng học",
    room: "E501",
    floor: "5",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Phòng đào tạo với quy mô 30 đến 40 chỗ ngồi.",
    tech: ["Máy chiếu", "Hệ thống âm thanh", "Bảng tương tác", "Mạng không dây"],
    apps: ["Đào tạo"],
  }),
  taoLab({
    id: "security-lab",
    code: "CyberRange",
    name: "Lab chương trình An toàn thông tin",
    room: "E602",
    floor: "6",
    cluster: "An toàn thông tin và hạ tầng số",
    desc: "Đào tạo thực hành chuyên sâu về an toàn thông tin để sinh viên có portfolio thực tế.",
    tech: ["Máy trạm bảo mật", "Môi trường mô phỏng tấn công", "Thiết bị mạng", "Máy chủ lab"],
    apps: ["Thực hành an toàn thông tin"],
  }),
  taoLab({
    id: "security-lab-extra",
    code: "CyberRange2",
    name: "Lab chương trình An toàn thông tin",
    room: "E603",
    floor: "6",
    cluster: "An toàn thông tin và hạ tầng số",
    desc: "Đào tạo thực hành chuyên sâu về an toàn thông tin để sinh viên có portfolio thực tế.",
    tech: ["Máy trạm bảo mật", "Môi trường mô phỏng tấn công", "Thiết bị mạng", "Máy chủ lab"],
    apps: ["Thực hành an toàn thông tin"],
  }),
  taoLab({
    id: "circular-economy-lab",
    code: "CircularAIoT",
    name: "Lab Kinh tế tuần hoàn",
    room: "E604",
    floor: "6",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Không gian lắp ráp, kiểm thử sản phẩm khởi nghiệp và trình diễn mô hình xử lý rác thải hữu cơ bằng sinh học.",
    tech: ["Khu lắp ráp", "Thiết bị kiểm thử", "Mô hình xử lý sinh học", "Bộ đo môi trường"],
    apps: ["Khởi nghiệp", "Trình diễn công nghệ"],
  }),
  taoLab({
    id: "isc-open-lab",
    code: "ISC-Open",
    name: "ISC Open Lab",
    room: "E601",
    floor: "6",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Không gian làm việc, hỗ trợ quản trị doanh nghiệp, tư vấn bản quyền và thương mại hóa sản phẩm.",
    tech: ["Không gian làm việc mở", "Hệ thống họp trực tuyến", "Công cụ quản trị", "Khu tư vấn"],
    apps: ["Hỗ trợ doanh nghiệp", "Tư vấn", "Thương mại hóa"],
  }),
  taoLab({
    id: "open-lab-prototyping-library",
    code: "OpenHub",
    name: "Open Lab, Prototyping Area và Thư viện số",
    room: "E702",
    floor: "7",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Không gian ươm tạo, phục vụ các dự án trước nhà đầu tư và cung cấp thư viện số.",
    tech: ["Khu tạo nguyên mẫu", "Thư viện số", "Không gian pitch", "Hạ tầng trình diễn"],
    apps: ["Ươm tạo", "Thư viện"],
  }),
  taoLab({
    id: "meeting-station-cafe",
    code: "MeetCafe",
    name: "Meeting Station and Café",
    room: "E701",
    floor: "7",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Phục vụ ăn uống nhẹ, kết hợp phòng họp đa chức năng.",
    tech: ["Khu café", "Phòng họp linh hoạt", "Hệ thống trình chiếu", "Thiết bị hội họp"],
    apps: ["Ăn uống", "Phòng họp"],
  }),
  taoLab({
    id: "innovation-lounge",
    code: "InnovationLounge",
    name: "Innovation Lounge (hành lang)",
    room: "E7 Hall",
    floor: "7",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Không gian làm việc chung, trưng bày thành quả nghiên cứu và kết nối trực tuyến với chuyên gia.",
    tech: ["Không gian mở", "Khu trưng bày", "Màn hình kết nối trực tuyến", "Khu làm việc nhóm"],
    apps: ["Không gian làm việc", "Hội thảo"],
  }),
];

export const news: NewsItem[] = [
  {
    category: "Định hướng chiến lược",
    date: "2026.06",
    title: "Đề xuất Tech-Convergence Hub nhấn mạnh vai trò điểm hội tụ công nghệ của UEH",
    excerpt:
      "Hub được định vị là hạ tầng chiến lược kết nối đào tạo, nghiên cứu, thử nghiệm và chuyển giao công nghệ theo mô hình phòng thí nghiệm sống.",
  },
  {
    category: "Tối ưu vận hành",
    date: "2026.06",
    title: "Nguyên tắc Tối ưu - Chia sẻ - Tự chủ được áp dụng cho toàn bộ hệ thống phòng thí nghiệm",
    excerpt:
      "Cơ chế quản trị theo KPI, xoay vòng không gian và gom cụm công nghệ giúp tăng hiệu suất sử dụng, đồng thời đẩy nhanh quá trình từ nghiên cứu đến ứng dụng.",
  },
  {
    category: "Danh mục đầu tư",
    date: "2026.05",
    title: "Hoàn thiện danh mục phòng thí nghiệm theo tầng và theo cụm công nghệ ưu tiên giai đoạn 2026-2030",
    excerpt:
      "Danh mục bao gồm các nhóm AI, robot, bản sao số, giao thông thông minh, công nghệ biển, an toàn thông tin và đổi mới sáng tạo để phục vụ đại học đa ngành.",
  },
];
