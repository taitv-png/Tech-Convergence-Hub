import { mapIsEnglish, tr } from "./locale";
// Vietnamese display copy consolidated from TONGHOP-LABS (6).docx.
// Descriptions summarize functions, not a claim that proposed equipment exists.
const ROOM_CATALOGUE_VI: Record<string, { name: string; description: string }> = {
  E002: {
    name: "Phòng kỹ thuật sản xuất và lưu trữ dữ liệu Hologram",
    description:
      "Sản xuất hình ảnh Hologram và lưu trữ dữ liệu in; kết hợp đào tạo, thực hành công nghệ in trong môi trường được kiểm soát về ánh sáng, nhiệt độ và độ rung.",
  },
  E001: {
    name: "Phòng thí nghiệm Cơ khí và Thiết bị chính xác",
    description:
      "Phát triển sản phẩm, nguyên mẫu kỹ thuật, hệ thống truyền động và các cụm chi tiết cơ khí có yêu cầu cao về độ chính xác, độ tin cậy và khả năng tích hợp.",
  },
  E103: {
    name: "Phòng học",
    description: "Không gian đào tạo 30–40 chỗ ngồi, phục vụ các hoạt động giảng dạy và học tập.",
  },
  E102: {
    name: "Phòng triển lãm Công nghệ đa chiều, Hậu kỳ sản xuất và Tương tác con người",
    description:
      "Trưng bày, triển lãm sản phẩm Hologram và thực hiện hậu kỳ sản xuất; nghiên cứu hành vi, cảm xúc và hiệu suất người dùng qua đo lường sinh lý, chuyển động và thiết bị tương tác.",
  },
  E104: {
    name: "Trung tâm Hội tụ Công nghệ tương tác đa chiều",
    description:
      "Nghiên cứu và thực hành công nghệ hình ảnh, mô phỏng, tương tác kỹ thuật số; đồng thời thực hiện hậu kỳ sản xuất Hologram.",
  },
  E101: {
    name: "Phòng thí nghiệm Đổi mới sáng tạo trí tuệ nhân tạo",
    description:
      "Nghiên cứu và phát triển các ứng dụng trí tuệ nhân tạo lấy con người làm trung tâm, hỗ trợ đổi mới sản phẩm, dịch vụ và quy trình vận hành.",
  },
  E203: {
    name: "Phòng thí nghiệm Vật lý kiến trúc và đô thị",
    description:
      "Nghiên cứu, đo đạc và mô phỏng âm học, ánh sáng, nhiệt độ, gió và mưa để hỗ trợ thiết kế kiến trúc xanh, tiết kiệm năng lượng và quy hoạch bền vững.",
  },
  E202: {
    name: "Phòng nghiên cứu chuyên gia",
    description:
      "Không gian hợp tác nghiên cứu và làm việc của các nghiên cứu viên trong nước và quốc tế trong hệ sinh thái UEH.",
  },
  E204: {
    name: "Phòng nghiên cứu Thành phố thông minh và Dữ liệu đô thị",
    description:
      "Kết hợp trí tuệ nhân tạo, Internet vạn vật, bản sao số và bản đồ số để quản lý, phân tích dữ liệu đô thị; nghiên cứu các giải pháp an ninh, giao thông và hạ tầng thông minh.",
  },
  E201: {
    name: "Phòng thí nghiệm thực hành mô phỏng Bản sao kỹ thuật số đô thị",
    description:
      "Phát triển công nghệ cảm biến quan trắc, mô phỏng và dự báo điều kiện vận hành của công trình và đô thị; phục vụ nghiên cứu, đào tạo và chuyển giao sản phẩm.",
  },
  E303: {
    name: "Phòng thí nghiệm Phương tiện tự động hóa",
    description:
      "Nghiên cứu và giảng dạy về robot di động, xe tự hành; phát triển thuật toán điều khiển, thị giác máy tính và tích hợp cảm biến trong môi trường thực nghiệm.",
  },
  E302: {
    name: "Phòng thí nghiệm Robot không gian và Đại dương",
    description:
      "Nghiên cứu, giảng dạy và thử nghiệm thiết bị bay không người lái cùng các phương tiện tự hành, điều khiển từ xa dưới nước; tích hợp định vị, viễn thám và giao tiếp trong môi trường biển.",
  },
  E304: {
    name: "Phòng thực hành Dây chuyền sản xuất công nghiệp",
    description:
      "Cung cấp không gian và thiết bị thực hành cơ điện tử, tự động hóa nhà máy và vận hành dây chuyền sản xuất công nghiệp.",
  },
  E301: {
    name: "Phòng thí nghiệm Hệ thống nhúng, Internet vạn vật và Điều khiển công nghiệp",
    description:
      "Nghiên cứu điện tử công suất, vi điều khiển, hệ thống nhúng và Internet vạn vật; kết hợp điều khiển quá trình, mạng truyền thông và giám sát công nghiệp.",
  },
  "E402+E403": {
    name: "Phòng thí nghiệm Trí tuệ nhân tạo, Dữ liệu lớn và Hệ thống thông minh",
    description:
      "Nghiên cứu trí tuệ nhân tạo và dữ liệu lớn; tích hợp cảm biến, hệ nhúng, robot, thị giác máy tính và điều khiển thời gian thực để phát triển hệ thống thông minh hoạt động trong môi trường vật lý.",
  },
  E404: {
    name: "Phòng thí nghiệm Quan trắc, Quy hoạch và Công nghệ đại dương",
    description:
      "Quan trắc và phân tích dữ liệu biển, hỗ trợ quy hoạch không gian biển và vùng bờ; nghiên cứu vật lý đại dương, động lực học ven biển và các công nghệ năng lượng tái tạo từ đại dương.",
  },
  E401: {
    name: "Phòng thí nghiệm Cảng biển, Di chuyển và Đường sắt thông minh",
    description:
      "Nghiên cứu logistics cảng biển, tối ưu vận hành giao thông và hệ thống đường sắt; kết hợp mô phỏng, dữ liệu thực và nền tảng số để hỗ trợ đào tạo, quản lý và hoạch định chính sách.",
  },
  E503: {
    name: "Phòng học",
    description: "Không gian đào tạo 30–40 chỗ ngồi, phục vụ các hoạt động giảng dạy và học tập.",
  },
  E502: {
    name: "Phòng học",
    description: "Không gian đào tạo 30–40 chỗ ngồi, phục vụ các hoạt động giảng dạy và học tập.",
  },
  E504: {
    name: "Phòng học",
    description: "Không gian đào tạo 30–40 chỗ ngồi, phục vụ các hoạt động giảng dạy và học tập.",
  },
  E501: {
    name: "Phòng học",
    description: "Không gian đào tạo 30–40 chỗ ngồi, phục vụ các hoạt động giảng dạy và học tập.",
  },
  "E602+E603": {
    name: "Cyber Security Lab",
    description:
      "Đào tạo thực hành an toàn thông tin, mô phỏng tấn công và phòng thủ trong môi trường mạng cách ly; hỗ trợ nghiên cứu, dự án chuyên ngành và các khóa đào tạo ngắn hạn.",
  },
  E604: {
    name: "Phòng thí nghiệm Kinh tế tuần hoàn",
    description:
      "Không gian nghiên cứu mở, lắp ráp và kiểm thử sản phẩm khởi nghiệp; trình diễn xử lý rác thải sinh học theo mô hình tuần hoàn, kết hợp cảm biến và trí tuệ nhân tạo để giám sát môi trường.",
  },
  E601: {
    name: "Không gian làm việc mở ISC",
    description:
      "Không gian làm việc và quản lý doanh nghiệp của ISC; tư vấn quyền tác giả, quyền sở hữu và thương mại hóa các sản phẩm nghiên cứu của trung tâm.",
  },
  E702: {
    name: "Không gian nghiên cứu mở, Chế tạo thử nghiệm và Thư viện số",
    description:
      "Không gian ươm tạo linh hoạt, chế tạo thử nghiệm và tiếp cận thư viện số; hỗ trợ trình diễn dự án, kết nối nhà đầu tư và thương mại hóa kết quả nghiên cứu.",
  },
  E701: {
    name: "Không gian Hội họp và Cà phê",
    description:
      "Kết hợp phòng họp, hội thảo và trao đổi chuyên môn với khu phục vụ cà phê, đồ ăn nhẹ và đặt món thông minh.",
  },
};
// English copy for the same rooms (names follow the approved English room signs).
const ROOM_CATALOGUE_EN: Record<string, { name: string; description: string }> = {
  E002: {
    name: "Hologram Printing Lab",
    description:
      "Hologram production and storage of holographic print data, with hands-on training in a room with controlled lighting, temperature and vibration.",
  },
  E001: {
    name: "Precision Mechanics & Equipment Lab",
    description:
      "Develops products, engineering prototypes, drive systems and mechanical assemblies that demand high precision, reliability and integration.",
  },
  E103: { name: "Classroom", description: "Teaching space for 30 to 40 people." },
  E102: {
    name: "Immersive Technology Exhibition & Post Production Room",
    description:
      "Exhibits holographic works and supports post-production; studies user behaviour, emotion and performance through physiological measurements, motion tracking and interactive devices.",
  },
  E104: {
    name: "Immersive Technology Convergence Center",
    description:
      "Research and practice in imaging, simulation and digital interaction, and hologram post-production.",
  },
  E101: {
    name: "Human-Centered AI Innovation Lab",
    description:
      "Researches and develops human-centred AI applications that support new products, services and operating processes.",
  },
  E203: {
    name: "Architectural & Urban Physics Lab",
    description:
      "Researches, measures and simulates acoustics, light, temperature, wind and rain for green, energy-efficient architecture and sustainable planning.",
  },
  E202: {
    name: "Guest Researchers & Visiting Scholars",
    description: "A shared research workspace for Vietnamese and international researchers in the UEH ecosystem.",
  },
  E204: {
    name: "Smart City Lab",
    description:
      "Combines AI, the Internet of Things, digital twins and digital maps to manage and analyse urban data, and studies smart solutions for safety, traffic and infrastructure.",
  },
  E201: {
    name: "META - Digital Twin Lab",
    description:
      "Develops monitoring sensors, simulation and forecasting of building and city operations, for research, teaching and technology transfer.",
  },
  E303: {
    name: "Automated Vehicles & Systems Lab",
    description:
      "Research and teaching on mobile robots and autonomous vehicles: control algorithms, computer vision and sensor integration in a test environment.",
  },
  E302: {
    name: "Mobile Robot Lab & Ocean Robotics Lab",
    description:
      "Research, teaching and testing of drones and autonomous or remotely operated underwater vehicles, with positioning, remote sensing and communication in marine settings.",
  },
  E304: {
    name: "MPS Station Center",
    description: "Space and equipment for hands-on mechatronics, factory automation and industrial production lines.",
  },
  E301: {
    name: "Embedded & IoT System Lab and Process Control & Industrial Communication Network Lab",
    description:
      "Power electronics, microcontrollers, embedded systems and the Internet of Things, with process control, industrial networks and monitoring.",
  },
  "E402+E403": {
    name: "AI & Big Data Lab and Edge & Physical AI Lab",
    description:
      "AI and big data research; sensors, embedded systems, robots, computer vision and real-time control for intelligent systems in the physical world.",
  },
  E404: {
    name: "Ocean Monitoring, Ocean Physics & Ocean Renewable Energy Labs",
    description:
      "Marine data monitoring and analysis for marine and coastal spatial planning; ocean physics, coastal dynamics and ocean renewable energy.",
  },
  E401: {
    name: "Smart Seaport Logistics & Terminal Operations Lab and Smart Mobility Lab - Rail Systems Lab",
    description:
      "Port logistics, transport operations and railway systems, combining simulation, real data and digital platforms for training, management and policy.",
  },
  E503: { name: "Classroom", description: "Teaching space for 30 to 40 people." },
  E502: { name: "Classroom", description: "Teaching space for 30 to 40 people." },
  E504: { name: "Classroom", description: "Teaching space for 30 to 40 people." },
  E501: { name: "Classroom", description: "Teaching space for 30 to 40 people." },
  "E602+E603": {
    name: "Cyber Security Lab",
    description:
      "Hands-on security training with attack and defence simulation on an isolated network; supports research, projects and short courses.",
  },
  E604: {
    name: "Circular Economy Lab",
    description:
      "Open research space to assemble and test start-up products; demonstrates circular treatment of organic waste with sensors and AI for environmental monitoring.",
  },
  E601: {
    name: "ISC Open Lab",
    description:
      "ISC workspace and business management; advice on copyright, ownership and commercialisation of the centre's research products.",
  },
  E702: {
    name: "Open Lab & Prototyping Area / Digital Library",
    description:
      "Flexible incubation, prototyping and digital library access; supports project demonstrations, investor connections and commercialisation of research.",
  },
  E701: {
    name: "Meeting Station & Café",
    description: "Meeting and seminar rooms with a café, light food and smart ordering.",
  },
};

// Localized on first use in the browser; on the server (link building) only the keys matter.
export const ROOM_CATALOGUE = mapIsEnglish() ? ROOM_CATALOGUE_EN : ROOM_CATALOGUE_VI;

export const commonSpaceName = (floor: number) =>
  floor === 0
    ? tr("Sảnh công nghệ tương tác", "Interactive technology lobby")
    : floor === 7
      ? tr("Sảnh đổi mới sáng tạo", "Innovation lobby")
      : tr(`Sảnh chung tầng ${floor}`, `Floor ${floor} common lobby`);
