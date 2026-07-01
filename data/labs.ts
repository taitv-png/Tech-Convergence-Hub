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

export const clusters: Cluster[] = [
  {
    name: "AI, dữ liệu và bản sao số",
    code: "AI.DT",
    angle: 335,
    desc: "Hội tụ trí tuệ nhân tạo, dữ liệu lớn, mô phỏng và bản sao số cho các hệ thống phức hợp.",
    tags: ["AI", "Dữ liệu lớn", "Bản sao số", "Mô phỏng"],
  },
  {
    name: "Robot và hệ thống tự hành",
    code: "ROBOT",
    angle: 25,
    desc: "Phát triển robot di động, robot bay, robot dưới nước và các hệ thống điều khiển tự hành.",
    tags: ["AGV", "AMR", "Drone", "AUV/ROV"],
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
    id: "hologram-printing-lab",
    code: "HoloPrint",
    name: "Phòng kỹ thuật sản xuất và lưu trữ dữ liệu Hologram",
    room: "E002",
    floor: "Trệt",
    cluster: "Công nghệ nhập vai và trải nghiệm người dùng",
    desc: "Không gian sản xuất hologram, xử lý dữ liệu in và thử nghiệm thương mại hóa sản phẩm công nghệ đa chiều.",
    tech: ["Máy in hologram", "Vật liệu quang học", "Máy trạm xử lý", "Hệ thống phụ trợ"],
    apps: ["Trưng bày công nghệ", "Sản phẩm arttech", "Chuyển giao công nghệ"],
  }),
  taoLab({
    id: "precision-mechanics-lab",
    code: "MechProto",
    name: "Phòng thí nghiệm Cơ khí và Thiết bị Chính xác",
    room: "E001",
    floor: "Trệt",
    cluster: "Tự động hóa công nghiệp và IoT",
    desc: "Phát triển nguyên mẫu kỹ thuật, cụm chi tiết cơ khí chính xác và hệ thống truyền động phục vụ nghiên cứu cơ điện tử, robot và sản xuất thông minh.",
    tech: ["CAD/CAM/CAE", "Máy in 3D", "Máy cắt laser", "CNC mini"],
    apps: ["Chế tạo nguyên mẫu", "Tự động hóa", "Cơ điện tử"],
  }),
  taoLab({
    id: "immersive-exhibition-room",
    code: "ImmersiveExpo",
    name: "Phòng triển lãm Công nghệ đa chiều và Hậu kỳ sản xuất",
    room: "E102",
    floor: "1",
    cluster: "Công nghệ nhập vai và trải nghiệm người dùng",
    desc: "Không gian trưng bày sản phẩm hologram, phục vụ hậu kỳ sản xuất và trình diễn các ứng dụng công nghệ đa chiều.",
    tech: ["Sản phẩm hologram", "Đèn LED RGB", "Thiết bị phụ trợ", "Khung triển lãm"],
    apps: ["Triển lãm công nghệ", "Trình diễn arttech", "Thương mại hóa sản phẩm"],
  }),
  taoLab({
    id: "immersive-tech-center",
    code: "ImmersiveCore",
    name: "Trung tâm hội tụ công nghệ tương tác đa chiều",
    room: "E104",
    floor: "1",
    cluster: "Công nghệ nhập vai và trải nghiệm người dùng",
    desc: "Không gian nghiên cứu, thực hành công nghệ hình ảnh, mô phỏng, VR/AR và hậu kỳ sản xuất hologram.",
    tech: ["Kính VR", "Camera 4K", "Cảm biến LiDAR", "Hệ thống trình chiếu"],
    apps: ["Đào tạo nhập vai", "Trình diễn đa chiều", "Trực quan hóa bản sao số"],
  }),
  taoLab({
    id: "ergoux-lab",
    code: "ErgoUX",
    name: "Phòng thí nghiệm tương tác con người (ErgoUX)",
    room: "Lầu 1",
    floor: "1",
    cluster: "Công nghệ nhập vai và trải nghiệm người dùng",
    desc: "Nghiên cứu hành vi, cảm xúc và hiệu suất người dùng bằng dữ liệu sinh lý, chuyển động và tương tác người máy.",
    tech: ["Eye Tracker", "GSR/EDA", "HRV", "EEG/EMG"],
    apps: ["Đánh giá trải nghiệm", "Nghiên cứu HCI", "Thiết kế lấy con người làm trung tâm"],
  }),
  taoLab({
    id: "human-centered-ai-lab",
    code: "HCAI",
    name: "Phòng thí nghiệm Đổi mới sáng tạo AI lấy con người làm trung tâm",
    room: "E101",
    floor: "1",
    cluster: "AI, dữ liệu và bản sao số",
    desc: "Nghiên cứu và phát triển ứng dụng AI lấy con người làm trung tâm, kết hợp cảm biến, robot và hệ thống tương tác cho doanh nghiệp và đô thị.",
    tech: ["GPU", "Kính thông minh", "Thiết bị đeo", "Robot hình người"],
    apps: ["Dịch vụ AI", "Sản phẩm đổi mới", "Ứng dụng trong doanh nghiệp"],
  }),
  taoLab({
    id: "research-lab",
    code: "ResearchHub",
    name: "Phòng nghiên cứu chuyên gia",
    room: "E202",
    floor: "2",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Không gian hợp tác nghiên cứu giữa chuyên gia trong và ngoài nước trong hệ sinh thái đổi mới sáng tạo UEH.",
    tech: ["Không gian nghiên cứu", "Hạ tầng làm việc nhóm", "Kết nối học thuật", "Hệ thống hỗ trợ nghiên cứu"],
    apps: ["Hợp tác quốc tế", "Nghiên cứu liên ngành", "Dự án đồng sáng tạo"],
  }),
  taoLab({
    id: "digital-twin-lab",
    code: "META-DT",
    name: "Phòng thực hành mô phỏng bản sao kỹ thuật số đô thị (META - Digital Twin Lab)",
    room: "E201",
    floor: "2",
    cluster: "AI, dữ liệu và bản sao số",
    desc: "Phát triển cảm biến quan trắc, mô phỏng và dự báo điều kiện vận hành của công trình, campus và đô thị.",
    tech: ["Cảm biến môi trường", "Nền tảng đám mây", "Bản sao số", "Hệ thống trực quan"],
    apps: ["Campus thông minh", "Quản lý vận hành", "Hỗ trợ ra quyết định"],
  }),
  taoLab({
    id: "urban-physics-lab",
    code: "UrbanPhysics",
    name: "Phòng thí nghiệm Vật lý kiến trúc và đô thị",
    room: "E203",
    floor: "2",
    cluster: "Đô thị thông minh và hệ thống đô thị",
    desc: "Đo đạc và mô phỏng âm học, ánh sáng, nhiệt độ, gió mưa để hỗ trợ thiết kế kiến trúc xanh và tiết kiệm năng lượng.",
    tech: ["Mô phỏng vật lý", "Công cụ đo đạc", "Mô hình khí hậu", "Phân tích động học"],
    apps: ["Kiến trúc xanh", "Quy hoạch bền vững", "Tiết kiệm năng lượng"],
  }),
  taoLab({
    id: "smart-city-lab",
    code: "SmartCity",
    name: "Phòng nghiên cứu Đô thị thông minh",
    room: "E204",
    floor: "2",
    cluster: "Đô thị thông minh và hệ thống đô thị",
    desc: "Tập trung giải pháp AIoT, bản sao số và quản lý dữ liệu đô thị cho bài toán an ninh, giao thông và hạ tầng.",
    tech: ["AIoT", "Bản sao số", "Nền tảng dữ liệu", "Bảng điều khiển"],
    apps: ["An ninh đô thị", "Giao thông thông minh", "Vận hành hạ tầng"],
  }),
  taoLab({
    id: "urban-data-design-lab",
    code: "UrbanData",
    name: "Phòng nghiên cứu Khoa học dữ liệu đô thị",
    room: "Lầu 2",
    floor: "2",
    cluster: "Đô thị thông minh và hệ thống đô thị",
    desc: "Kết hợp GIS, AI và dữ liệu thời gian thực để hình ảnh hóa và phân tích không gian đô thị.",
    tech: ["GIS", "Dữ liệu thời gian thực", "Màn hình mô phỏng", "Máy trạm"],
    apps: ["Thiết kế đô thị", "Phân tích không gian", "Hỗ trợ quy hoạch"],
  }),
  taoLab({
    id: "mps-station-center",
    code: "MPS",
    name: "Phòng thực hành Dây chuyền sản xuất công nghiệp (MPS station center)",
    room: "E304",
    floor: "3",
    cluster: "Tự động hóa công nghiệp và IoT",
    desc: "Không gian thực hành cơ điện tử và tự động hóa nhà máy dựa trên hệ thống MPS và các mô hình dây chuyền công nghiệp.",
    tech: ["Hệ thống MPS", "Thiết bị thực hành tự động hóa", "Bàn học phụ trợ", "Mô hình dây chuyền"],
    apps: ["Đào tạo cơ điện tử", "Thực hành tự động hóa", "Mô phỏng sản xuất"],
  }),
  taoLab({
    id: "automated-vehicles-lab",
    code: "AutoVehicle",
    name: "Phòng thí nghiệm các phương tiện tự động hóa (Automated Vehicles & Systems Lab)",
    room: "E303",
    floor: "3",
    cluster: "Robot và hệ thống tự hành",
    desc: "Nghiên cứu AGV, AMR và xe tự hành trong môi trường đa địa hình, tích hợp thị giác máy tính và cảm biến thông minh.",
    tech: ["Jetson", "LiDAR", "IMU", "GPS"],
    apps: ["Vận tải tự hành", "Giám sát thông minh", "Logistics"],
  }),
  taoLab({
    id: "mobile-robot-lab",
    code: "MobileRobot",
    name: "Phòng thí nghiệm robot không gian (Mobile Robot Lab)",
    room: "E302",
    floor: "3",
    cluster: "Robot và hệ thống tự hành",
    desc: "Nghiên cứu, giảng dạy robot di động và thiết bị bay không người lái, phát triển hệ thống tự hành tích hợp cảm biến.",
    tech: ["Drone nghiên cứu", "ROS2", "Gazebo", "Cụm cảm biến"],
    apps: ["Đào tạo robot", "Kiểm định hệ thống", "Nghiên cứu tự hành"],
  }),
  taoLab({
    id: "ocean-robotics-lab",
    code: "OceanBot",
    name: "Phòng thí nghiệm Robot đại dương (Ocean Robotics Lab)",
    room: "Lầu 3",
    floor: "3",
    cluster: "Biển, ven bờ và năng lượng",
    desc: "Nghiên cứu và thử nghiệm AUV, ROV và robot phỏng sinh dưới nước cho môi trường biển thực tế.",
    tech: ["AUV", "ROV", "Cảm biến dưới nước", "Hệ thống định vị"],
    apps: ["Quan trắc biển", "Kinh tế biển", "Giám sát tài nguyên"],
  }),
  taoLab({
    id: "embedded-iot-lab",
    code: "AIoT-Node",
    name: "Phòng thí nghiệm Hệ thống Nhúng và IoT",
    room: "E301",
    floor: "3",
    cluster: "Tự động hóa công nghiệp và IoT",
    desc: "Nghiên cứu vi điều khiển, điện tử công suất và phát triển ứng dụng IoT cho đô thị, công nghiệp và môi trường.",
    tech: ["SIMATIC S7-1500", "RFID", "IO-Link", "Bộ kit nhúng"],
    apps: ["Nhà máy thông minh", "Hệ thống AIoT", "Giám sát công nghiệp"],
  }),
  taoLab({
    id: "process-control-lab",
    code: "ProcessNet",
    name: "Phòng thí nghiệm Điều khiển quá trình và mạng truyền thông công nghiệp (Process Control and Industrial Communication Network Lab)",
    room: "E301",
    floor: "3",
    cluster: "Tự động hóa công nghiệp và IoT",
    desc: "Nghiên cứu hệ thống tự động hóa, giao thức truyền thông công nghiệp và giám sát vận hành quá trình.",
    tech: ["PLC", "HMI", "Profibus/Profinet", "Mô hình quá trình"],
    apps: ["Điều khiển thông minh", "Mạng công nghiệp", "Thực hành MPS"],
  }),
  taoLab({
    id: "edge-physical-ai-lab",
    code: "EdgeAI",
    name: "Phòng thí nghiệm Edge Physical AI (Edge_Physical AI Lab)",
    room: "E402/E403",
    floor: "4",
    cluster: "AI, dữ liệu và bản sao số",
    desc: "Tích hợp AI, robot, IoT, thị giác máy tính và điều khiển thời gian thực cho các hệ thống vật lý thông minh.",
    tech: ["NVIDIA Jetson", "Camera nhiệt/độ sâu", "Gateway AIoT", "Edge server"],
    apps: ["AI vật lý", "Kho vận thông minh", "Nhà máy thông minh"],
  }),
  taoLab({
    id: "ai-big-data-lab",
    code: "AI-BigData",
    name: "Phòng thí nghiệm nghiên cứu AI và Big Data",
    room: "E402/E403",
    floor: "4",
    cluster: "AI, dữ liệu và bản sao số",
    desc: "Trung tâm nghiên cứu AI và Big Data cho khối ngành kinh tế, phục vụ công bố quốc tế, chuyển giao công nghệ và đào tạo nhân lực chất lượng cao.",
    tech: ["Cụm Dell PowerEdge", "Máy trạm GPU", "Kho dữ liệu", "Nền tảng học máy"],
    apps: ["Dự báo", "Phân tích quyết định", "Ứng dụng kinh doanh"],
  }),
  taoLab({
    id: "sapo-lab",
    code: "SAPO",
    name: "Ocean Monitoring & Spatial Planning Lab (SAPO)",
    room: "E404",
    floor: "4",
    cluster: "Biển, ven bờ và năng lượng",
    desc: "Quan trắc môi trường biển theo thời gian thực, kết hợp GIS, AI và hệ thống hỗ trợ ra quyết định cho quy hoạch không gian biển và vùng bờ bền vững.",
    tech: ["GIS", "IoT ven bờ", "Hệ thống DSS", "Trực quan hóa dữ liệu"],
    apps: ["Quy hoạch biển", "Thích ứng biến đổi khí hậu", "Giám sát tài nguyên"],
  }),
  taoLab({
    id: "ocean-physics-lab",
    code: "OceanPhysics",
    name: "Phòng thí nghiệm Vật lý đại dương",
    room: "E404",
    floor: "4",
    cluster: "Biển, ven bờ và năng lượng",
    desc: "Nghiên cứu và mô phỏng hiện tượng vật lý đại dương, đào tạo thực hành cơ học chất lỏng và động lực học vùng ven biển.",
    tech: ["Hệ đo dao động", "Hệ đo độ nhớt", "Mạch cầu Wilson", "Thiết bị đo cộng hưởng RLC"],
    apps: ["Đào tạo vật lý đại dương", "Nghiên cứu ven bờ", "Nền tảng cho công trình biển"],
  }),
  taoLab({
    id: "ocean-renewable-energy-lab",
    code: "ORE",
    name: "Phòng thí nghiệm Năng lượng tái tạo đại dương (ORE Lab)",
    room: "E404",
    floor: "4",
    cluster: "Biển, ven bờ và năng lượng",
    desc: "Nghiên cứu và thử nghiệm công nghệ năng lượng sóng, thủy triều, dòng hải lưu và các mô hình khai thác năng lượng biển.",
    tech: ["Mô hình WEC/TEC", "Bể thử sóng", "Hệ đo công suất", "SCADA/DAQ"],
    apps: ["Năng lượng biển", "Đào tạo kỹ thuật", "Mô hình trình diễn"],
  }),
  taoLab({
    id: "smart-seaport-lab",
    code: "SmartPort",
    name: "Phòng thí nghiệm Logistics cảng biển thông minh (Smart Seaport Logistics & Terminal Operations Lab)",
    room: "E401",
    floor: "4",
    cluster: "Biển, ven bờ và năng lượng",
    desc: "Mô phỏng và tối ưu vận hành cảng, điều độ bến bãi và chuỗi cung ứng bằng hệ thống bản sao số.",
    tech: ["Mô phỏng TOS", "Mô hình cảng", "AGV/AMR thu nhỏ", "Băng tải mô phỏng"],
    apps: ["Vận hành terminal", "Tối ưu logistics", "Đào tạo thực hành"],
  }),
  taoLab({
    id: "smart-mobility-lab",
    code: "MOVE",
    name: "Phòng thí nghiệm Di chuyển thông minh (Smart Mobility Lab)",
    room: "E401",
    floor: "4",
    cluster: "Đô thị thông minh và hệ thống đô thị",
    desc: "Phòng thí nghiệm sống về giao thông đô thị dựa trên dữ liệu, kết hợp mô phỏng và dữ liệu thực để hỗ trợ chính sách.",
    tech: ["Mô phỏng giao thông", "Camera AI", "GPS tracker", "VR có eye tracking"],
    apps: ["An toàn giao thông", "Đánh giá chính sách", "Di chuyển bền vững"],
  }),
  taoLab({
    id: "rail-systems-lab",
    code: "RailCore",
    name: "Phòng thí nghiệm Hệ thống Đường sắt (Rail Systems Lab)",
    room: "E401",
    floor: "4",
    cluster: "Đô thị thông minh và hệ thống đô thị",
    desc: "Đào tạo vận hành, bảo trì và xử lý sự cố đường sắt đô thị trên môi trường mô phỏng đa phương tiện.",
    tech: ["Sa bàn đường sắt", "Mô phỏng CBTC/ETCS", "Bàn điều hành", "Hệ thống giám sát"],
    apps: ["Đào tạo kỹ thuật viên", "Vận hành ga thông minh", "An toàn đường sắt"],
  }),
  taoLab({
    id: "cybersecurity-lab",
    code: "CyberRange",
    name: "Lab chương trình An toàn thông tin",
    room: "E602/E603",
    floor: "6",
    cluster: "An toàn thông tin và hạ tầng số",
    desc: "Không gian đào tạo và thực hành kiểm thử xâm nhập, điều tra số, bảo mật hệ thống; hỗ trợ xây dựng portfolio và chứng chỉ nghề nghiệp cho sinh viên.",
    tech: ["50 máy trạm", "Máy chủ hypervisor", "Thiết bị mạng", "Hệ thống thực hành an toàn"],
    apps: ["Kiểm thử xâm nhập", "Phân tích mã độc", "Ứng phó sự cố"],
  }),
  taoLab({
    id: "circular-economy-lab",
    code: "CircularAIoT",
    name: "Lab Kinh tế tuần hoàn",
    room: "E604",
    floor: "6",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Thử nghiệm mô hình xử lý rác hữu cơ kết hợp AIoT, hỗ trợ dự án khởi nghiệp sinh viên và trình diễn giải pháp bền vững.",
    tech: ["Cảm biến môi trường", "Mô hình sinh học", "Bảng điều khiển", "Hệ thống theo dõi"],
    apps: ["Kinh tế tuần hoàn", "Khởi nghiệp xanh", "Trình diễn công nghệ"],
  }),
  taoLab({
    id: "isc-open-lab",
    code: "ISC-Open",
    name: "ISC Open Lab",
    room: "E601",
    floor: "6",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Không gian làm việc và quản lý dự án, hỗ trợ tư vấn sở hữu trí tuệ và thương mại hóa sản phẩm nghiên cứu.",
    tech: ["Không gian mở", "Hệ thống làm việc nhóm", "Công cụ quản trị dự án", "Khung trưng bày"],
    apps: ["Ươm tạo dự án", "Kết nối doanh nghiệp", "Chuyển giao sản phẩm"],
  }),
  taoLab({
    id: "innovation-lounge",
    code: "OpenHub",
    name: "Open Lab, Prototyping Area và Thư viện số",
    room: "E702",
    floor: "7",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Không gian ươm tạo linh hoạt cho ngày trình diễn, khu tạo nguyên mẫu, thư viện số và kết nối nhà đầu tư với nhóm nghiên cứu.",
    tech: ["Khu tạo nguyên mẫu", "Không gian làm việc mở", "Thư viện số", "Hạ tầng trình diễn"],
    apps: ["Ngày trình diễn", "Ươm tạo dự án", "Kết nối đầu tư"],
  }),
  taoLab({
    id: "meeting-station-cafe",
    code: "MeetCafe",
    name: "Meeting Station and Café",
    room: "E701",
    floor: "7",
    cluster: "Đổi mới sáng tạo và thương mại hóa",
    desc: "Mô hình phục vụ ăn uống nhẹ kết hợp phòng họp doanh nghiệp, workshop và seminar trong hệ sinh thái đổi mới sáng tạo.",
    tech: ["Máy pha cà phê", "Phòng họp nhóm", "Hệ thống trình chiếu", "Hạ tầng sự kiện"],
    apps: ["Tổ chức sự kiện", "Kết nối đối tác", "Hỗ trợ thương mại hóa"],
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
