export type Lab = { id:string; code:string; name:string; nameVi?:string; room:string; floor:string; cluster:string; desc:string; tech:string[]; apps:string[]; status?:string; capabilities?:string[]; audiences?:string[]; outcomes?:string[]; intro?:string; heroLine?:string };
export type Cluster = { name:string; code:string; angle:number; desc:string; tags:string[] };
export type NewsItem = { category:string; date:string; title:string; excerpt:string };

export const labs: Lab[] = [
  {
    "id": "human-centered-ai-lab",
    "code": "HCAI",
    "name": "Human-Centered AI Innovation Lab",
    "room": "E101",
    "floor": "1",
    "cluster": "AI, Data & Digital Twin",
    "desc": "Living Lab về AI ứng dụng, nơi sinh viên, nhà nghiên cứu, startup và doanh nghiệp cùng phát triển giải pháp lấy con người làm trung tâm.",
    "tech": [
      "GPU",
      "AI Glasses",
      "Wearables",
      "Humanoid Robot"
    ],
    "apps": [
      "AI for SMEs",
      "Service Innovation"
    ],
    "intro": "Living Lab về AI ứng dụng, nơi sinh viên, nhà nghiên cứu, startup và doanh nghiệp cùng phát triển giải pháp lấy con người làm trung tâm.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm AI, Data & Digital Twin",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "digital-twin-lab",
    "code": "META-DT",
    "name": "META - Digital Twin Lab",
    "room": "E201",
    "floor": "2",
    "cluster": "AI, Data & Digital Twin",
    "desc": "Lab phát triển cảm biến quan trắc, mô phỏng và dự báo điều kiện vận hành của công trình, campus và đô thị.",
    "tech": [
      "Sensors",
      "Cloud",
      "Digital Twin",
      "Interactive Table"
    ],
    "apps": [
      "Campus Twin",
      "Simulation"
    ],
    "intro": "Lab phát triển cảm biến quan trắc, mô phỏng và dự báo điều kiện vận hành của công trình, campus và đô thị.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm AI, Data & Digital Twin",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "edge-physical-ai-lab",
    "code": "EdgeAI",
    "name": "Edge_Physical AI Lab",
    "room": "E402/E403",
    "floor": "4",
    "cluster": "AI, Data & Digital Twin",
    "desc": "Lab tích hợp AI, cảm biến, robot, IoT và điều khiển thời gian thực trong các hệ thống vật lý thông minh.",
    "tech": [
      "Edge Computer",
      "GPU",
      "LiDAR",
      "IoT Gateway"
    ],
    "apps": [
      "Physical AI",
      "Industrial AI"
    ],
    "intro": "Lab tích hợp AI, cảm biến, robot, IoT và điều khiển thời gian thực trong các hệ thống vật lý thông minh.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm AI, Data & Digital Twin",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "ai-big-data-lab",
    "code": "AI-BigData",
    "name": "AI and Big Data Lab",
    "room": "E402/E403",
    "floor": "4",
    "cluster": "AI, Data & Digital Twin",
    "desc": "Hạ tầng tính toán, dữ liệu và AI phục vụ nghiên cứu, đào tạo sau đại học và hợp tác doanh nghiệp.",
    "tech": [
      "Data Lake",
      "ML Pipeline",
      "HPC",
      "Cloud"
    ],
    "apps": [
      "Prediction",
      "Decision Intelligence"
    ],
    "intro": "Hạ tầng tính toán, dữ liệu và AI phục vụ nghiên cứu, đào tạo sau đại học và hợp tác doanh nghiệp.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm AI, Data & Digital Twin",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "automated-vehicles-lab",
    "code": "AutoVehicle",
    "name": "Automated Vehicles & Systems Lab",
    "room": "E303",
    "floor": "3",
    "cluster": "Robotics & Autonomous Systems",
    "desc": "Lab nghiên cứu robot di động, AGV, AMR và xe tự hành trong môi trường thực nghiệm đa địa hình.",
    "tech": [
      "Jetson",
      "LiDAR",
      "IMU",
      "GPS"
    ],
    "apps": [
      "AGV",
      "Smart Logistics"
    ],
    "intro": "Lab nghiên cứu robot di động, AGV, AMR và xe tự hành trong môi trường thực nghiệm đa địa hình.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm Robotics & Autonomous Systems",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "mobile-robot-lab",
    "code": "MobileRobot",
    "name": "Mobile Robot Lab",
    "room": "E302",
    "floor": "3",
    "cluster": "Robotics & Autonomous Systems",
    "desc": "Không gian phát triển robot di động, drone và các hệ thống tự hành tích hợp cảm biến.",
    "tech": [
      "Drone",
      "ROS2",
      "Gazebo",
      "Camera"
    ],
    "apps": [
      "Inspection",
      "Robotics Education"
    ],
    "intro": "Không gian phát triển robot di động, drone và các hệ thống tự hành tích hợp cảm biến.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm Robotics & Autonomous Systems",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "hologram-printing-lab",
    "code": "HoloPrint",
    "name": "Hologram Printing Lab",
    "room": "E002",
    "floor": "G",
    "cluster": "Immersive & Human Experience",
    "desc": "Không gian sản xuất, xử lý và lưu trữ dữ liệu Hologram phục vụ nghiên cứu, trình diễn và thương mại hóa sản phẩm công nghệ đa chiều.",
    "tech": [
      "Hologram Printer",
      "Optics",
      "Workstation",
      "Post-production"
    ],
    "apps": [
      "ArtTech",
      "Immersive Display"
    ],
    "intro": "Không gian sản xuất, xử lý và lưu trữ dữ liệu Hologram phục vụ nghiên cứu, trình diễn và thương mại hóa sản phẩm công nghệ đa chiều.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm Immersive & Human Experience",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "immersive-tech-center",
    "code": "ImmersiveCore",
    "name": "Immersive Technology Convergence Center",
    "room": "E104",
    "floor": "1",
    "cluster": "Immersive & Human Experience",
    "desc": "Trung tâm nghiên cứu và thực hành công nghệ hình ảnh, mô phỏng, Hologram, VR/AR và tương tác kỹ thuật số.",
    "tech": [
      "VR",
      "LiDAR",
      "Camera 4K",
      "Interactive Display"
    ],
    "apps": [
      "XR Training",
      "Digital Twin Visualisation"
    ],
    "intro": "Trung tâm nghiên cứu và thực hành công nghệ hình ảnh, mô phỏng, Hologram, VR/AR và tương tác kỹ thuật số.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm Immersive & Human Experience",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "ergoux-lab",
    "code": "ErgoUX",
    "name": "ErgoUX Lab",
    "room": "E104",
    "floor": "1",
    "cluster": "Immersive & Human Experience",
    "desc": "Lab nghiên cứu hành vi, cảm xúc và hiệu suất người dùng thông qua dữ liệu sinh lý, chuyển động và tương tác người – máy.",
    "tech": [
      "Eye Tracker",
      "EDA/GSR",
      "HRV",
      "EEG"
    ],
    "apps": [
      "UX Testing",
      "HCI Research"
    ],
    "intro": "Lab nghiên cứu hành vi, cảm xúc và hiệu suất người dùng thông qua dữ liệu sinh lý, chuyển động và tương tác người – máy.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm Immersive & Human Experience",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "smart-city-lab",
    "code": "SmartCity",
    "name": "Smart City Lab",
    "room": "E204",
    "floor": "2",
    "cluster": "Smart City & Urban Systems",
    "desc": "Không gian nghiên cứu AIoT, Digital Twin và dữ liệu đô thị cho bài toán an ninh, giao thông và hạ tầng thông minh.",
    "tech": [
      "Urban Sensors",
      "Dashboard",
      "Digital Twin",
      "Data Platform"
    ],
    "apps": [
      "Traffic",
      "Urban Operations"
    ],
    "intro": "Không gian nghiên cứu AIoT, Digital Twin và dữ liệu đô thị cho bài toán an ninh, giao thông và hạ tầng thông minh.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm Smart City & Urban Systems",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "urban-data-design-lab",
    "code": "UrbanData",
    "name": "Data Driven & Urban Design Lab",
    "room": "E204",
    "floor": "2",
    "cluster": "Smart City & Urban Systems",
    "desc": "Lab kết hợp GIS, AI, dữ liệu thời gian thực và thiết kế đô thị để phân tích các vấn đề không gian đô thị.",
    "tech": [
      "ArcGIS",
      "Realtime Data",
      "Simulation Screen",
      "Workstation"
    ],
    "apps": [
      "Urban Design",
      "Spatial Analytics"
    ],
    "intro": "Lab kết hợp GIS, AI, dữ liệu thời gian thực và thiết kế đô thị để phân tích các vấn đề không gian đô thị.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm Smart City & Urban Systems",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "smart-mobility-lab",
    "code": "M.O.V.E",
    "name": "Smart Mobility Lab / M.O.V.E Lab",
    "room": "E401",
    "floor": "4",
    "cluster": "Smart City & Urban Systems",
    "desc": "Lab phân tích, mô phỏng và trực quan hóa hành vi di chuyển, giao thông đô thị và chính sách mobility.",
    "tech": [
      "GIS",
      "GPS Data",
      "Digital Twin",
      "Traffic Simulation"
    ],
    "apps": [
      "Mobility",
      "Policy Testing"
    ],
    "intro": "Lab phân tích, mô phỏng và trực quan hóa hành vi di chuyển, giao thông đô thị và chính sách mobility.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm Smart City & Urban Systems",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "rail-systems-lab",
    "code": "RailCore",
    "name": "Rail Systems Lab",
    "room": "E401",
    "floor": "4",
    "cluster": "Smart City & Urban Systems",
    "desc": "Lab đào tạo và mô phỏng vận hành hệ thống đường sắt đô thị, tín hiệu, điều khiển và bảo trì.",
    "tech": [
      "CBTC/PTC",
      "SCADA",
      "Mockup",
      "Training Console"
    ],
    "apps": [
      "Urban Rail",
      "Operations Training"
    ],
    "intro": "Lab đào tạo và mô phỏng vận hành hệ thống đường sắt đô thị, tín hiệu, điều khiển và bảo trì.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm Smart City & Urban Systems",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "ocean-robotics-lab",
    "code": "OceanBot",
    "name": "Ocean Robotics Lab",
    "room": "E302",
    "floor": "3",
    "cluster": "Ocean, Coastal & Energy",
    "desc": "Lab nghiên cứu AUV, ROV và robot phỏng sinh dưới nước phục vụ môi trường biển thực tế.",
    "tech": [
      "AUV",
      "ROV",
      "Underwater Sensors",
      "UAV/UGV"
    ],
    "apps": [
      "Marine Monitoring",
      "Blue Economy"
    ],
    "intro": "Lab nghiên cứu AUV, ROV và robot phỏng sinh dưới nước phục vụ môi trường biển thực tế.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm Ocean, Coastal & Energy",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "sapo-lab",
    "code": "SAPO",
    "name": "SAPO Lab",
    "room": "E404",
    "floor": "4",
    "cluster": "Ocean, Coastal & Energy",
    "desc": "Lab dữ liệu, quy hoạch và giám sát biển – vùng bờ bằng GIS, mô hình hóa, cảm biến và dashboard cảnh báo.",
    "tech": [
      "GIS",
      "UAV/AUV",
      "Ocean Sensors",
      "Dashboard"
    ],
    "apps": [
      "Coastal Planning",
      "Climate Adaptation"
    ],
    "intro": "Lab dữ liệu, quy hoạch và giám sát biển – vùng bờ bằng GIS, mô hình hóa, cảm biến và dashboard cảnh báo.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm Ocean, Coastal & Energy",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "smart-seaport-lab",
    "code": "SmartPort",
    "name": "Smart Seaport Logistics & Terminal Operations Lab",
    "room": "E401",
    "floor": "4",
    "cluster": "Ocean, Coastal & Energy",
    "desc": "Lab mô phỏng, tối ưu và trực quan hóa hoạt động cảng biển, container terminal và logistics xanh.",
    "tech": [
      "TOS Simulator",
      "Digital Twin",
      "AGV/AMR",
      "SCADA"
    ],
    "apps": [
      "Port Operation",
      "Logistics"
    ],
    "intro": "Lab mô phỏng, tối ưu và trực quan hóa hoạt động cảng biển, container terminal và logistics xanh.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm Ocean, Coastal & Energy",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "precision-mechanics-lab",
    "code": "MechProto",
    "name": "Precision Mechanics and Equipment Lab",
    "room": "E001",
    "floor": "G",
    "cluster": "Industrial Automation & IoT",
    "desc": "Nền tảng chế tạo nguyên mẫu, cơ khí chính xác và cơ điện tử cho các dự án robot, IoT, thiết bị thông minh và hệ thống truyền động.",
    "tech": [
      "CAD/CAM",
      "3D Printing",
      "CNC Mini",
      "Laser Cutting"
    ],
    "apps": [
      "Prototype",
      "Mechatronics"
    ],
    "intro": "Nền tảng chế tạo nguyên mẫu, cơ khí chính xác và cơ điện tử cho các dự án robot, IoT, thiết bị thông minh và hệ thống truyền động.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm Industrial Automation & IoT",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "embedded-iot-lab",
    "code": "AIoT-Node",
    "name": "Embedded and IoT System Lab",
    "room": "E301",
    "floor": "3",
    "cluster": "Industrial Automation & IoT",
    "desc": "Lab phát triển hệ thống nhúng, cảm biến, truyền thông IoT và thiết bị thông minh cho đô thị, công nghiệp và môi trường.",
    "tech": [
      "Arduino",
      "ESP32",
      "LoRa",
      "NB-IoT"
    ],
    "apps": [
      "Smart Factory",
      "AIoT"
    ],
    "intro": "Lab phát triển hệ thống nhúng, cảm biến, truyền thông IoT và thiết bị thông minh cho đô thị, công nghiệp và môi trường.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm Industrial Automation & IoT",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "cybersecurity-lab",
    "code": "CyberRange",
    "name": "Cybersecurity / Information Security Lab",
    "room": "E602/E603",
    "floor": "6",
    "cluster": "Cybersecurity & Digital Infrastructure",
    "desc": "Không gian đào tạo và thực hành an toàn thông tin, kiểm thử xâm nhập, điều tra số và bảo mật hệ thống số.",
    "tech": [
      "Cyber Range",
      "Network Lab",
      "Forensics",
      "IoT Security"
    ],
    "apps": [
      "CTF",
      "Cloud Security"
    ],
    "intro": "Không gian đào tạo và thực hành an toàn thông tin, kiểm thử xâm nhập, điều tra số và bảo mật hệ thống số.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm Cybersecurity & Digital Infrastructure",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "circular-economy-lab",
    "code": "CircularAIoT",
    "name": "Circular Economy Lab",
    "room": "E604",
    "floor": "6",
    "cluster": "Innovation & Commercialization",
    "desc": "Lab phát triển mô hình kinh tế tuần hoàn tích hợp AIoT, xử lý rác hữu cơ và tạo sản phẩm sinh học có giá trị.",
    "tech": [
      "Environmental Sensors",
      "AIoT",
      "Dashboard",
      "Bio-system"
    ],
    "apps": [
      "Circular Economy",
      "Bio-products"
    ],
    "intro": "Lab phát triển mô hình kinh tế tuần hoàn tích hợp AIoT, xử lý rác hữu cơ và tạo sản phẩm sinh học có giá trị.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm Innovation & Commercialization",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  },
  {
    "id": "innovation-lounge",
    "code": "OpenHub",
    "name": "Open Lab & Innovation Lounge",
    "room": "E702",
    "floor": "7",
    "cluster": "Innovation & Commercialization",
    "desc": "Không gian Demo Day, co-working, kết nối chuyên gia, nhà đầu tư, doanh nghiệp và các nhóm nghiên cứu trong Hub.",
    "tech": [
      "Hybrid Meeting",
      "Demo System",
      "Digital Library",
      "Showcase Wall"
    ],
    "apps": [
      "Demo Day",
      "Technology Transfer"
    ],
    "intro": "Không gian Demo Day, co-working, kết nối chuyên gia, nhà đầu tư, doanh nghiệp và các nhóm nghiên cứu trong Hub.",
    "heroLine": "Technology lab node",
    "capabilities": [
      "Phát triển và kiểm thử giải pháp trong cụm Innovation & Commercialization",
      "Hỗ trợ đào tạo thực hành, workshop và project-based learning",
      "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
      "Tạo điều kiện cho prototype, pilot testing và chuyển giao công nghệ"
    ],
    "audiences": [
      "Sinh viên",
      "Nhà nghiên cứu",
      "Doanh nghiệp",
      "Đối tác địa phương"
    ],
    "outcomes": [
      "Dự án nghiên cứu ứng dụng",
      "Nguyên mẫu công nghệ",
      "Workshop / short course",
      "Demo / showcase"
    ]
  }
];

export const clusters: Cluster[] = [
  {
    "name": "AI, Data & Digital Twin",
    "code": "AI.DT",
    "angle": 335,
    "desc": "AI, dữ liệu, GIS, mô phỏng và Digital Twin cho hệ thống đô thị phức hợp.",
    "tags": [
      "AI/ML",
      "Big Data",
      "Digital Twin",
      "GIS"
    ]
  },
  {
    "name": "Robotics & Autonomous Systems",
    "code": "ROBOT",
    "angle": 25,
    "desc": "Robot di động, xe tự hành, drone, AUV/ROV và sensor fusion.",
    "tags": [
      "AGV/AMR",
      "Drone",
      "AUV/ROV",
      "ROS2"
    ]
  },
  {
    "name": "Immersive & Human Experience",
    "code": "XR.HCI",
    "angle": 75,
    "desc": "VR/AR, Hologram, UX, HCI và đo lường trải nghiệm người dùng.",
    "tags": [
      "VR/AR",
      "Hologram",
      "UX",
      "Eye-tracking"
    ]
  },
  {
    "name": "Smart City & Urban Systems",
    "code": "URBAN",
    "angle": 125,
    "desc": "Smart mobility, urban data, rail systems, green building và quản trị đô thị.",
    "tags": [
      "Mobility",
      "Urban Data",
      "Rail",
      "Green Building"
    ]
  },
  {
    "name": "Ocean, Coastal & Energy",
    "code": "OCEAN",
    "angle": 175,
    "desc": "Kinh tế biển, cảng thông minh, năng lượng đại dương và giám sát vùng bờ.",
    "tags": [
      "Smart Port",
      "Coastal",
      "Marine Robotics",
      "Energy"
    ]
  },
  {
    "name": "Industrial Automation & IoT",
    "code": "AIoT",
    "angle": 225,
    "desc": "Hệ thống nhúng, IoT công nghiệp, PLC/SCADA và sản xuất thông minh.",
    "tags": [
      "Embedded",
      "IoT",
      "PLC/SCADA",
      "Industry 4.0"
    ]
  },
  {
    "name": "Cybersecurity & Digital Infrastructure",
    "code": "CYBER",
    "angle": 270,
    "desc": "Cyber range, kiểm thử xâm nhập, điều tra số, bảo mật IoT/cloud/AI.",
    "tags": [
      "CTF",
      "Forensics",
      "Cloud",
      "AI Security"
    ]
  },
  {
    "name": "Innovation & Commercialization",
    "code": "MARKET",
    "angle": 305,
    "desc": "Prototype, testing, Demo Day, sở hữu trí tuệ và chuyển giao công nghệ.",
    "tags": [
      "Lab-to-Market",
      "IP",
      "Demo Day",
      "Incubation"
    ]
  }
];

export const news: NewsItem[] = [
  {
    "category": "Cập nhật Hub",
    "date": "2026.06",
    "title": "Tech-Convergence Hub định hình mô hình orbit công nghệ cho hệ sinh thái lab",
    "excerpt": "Cách tổ chức mới giúp người học, nhà nghiên cứu và đối tác đi từ cụm công nghệ đến từng lab, từng bài toán ứng dụng và cơ hội hợp tác."
  },
  {
    "category": "Câu chuyện nghiên cứu",
    "date": "2026.06",
    "title": "Digital Twin và Campus Living Lab: từ dữ liệu vận hành đến mô phỏng hỗ trợ ra quyết định",
    "excerpt": "Các lab về AI, dữ liệu đô thị và mô phỏng có thể cùng tạo thành nền tảng thử nghiệm cho campus thông minh, năng lượng, môi trường và mobility."
  },
  {
    "category": "Công nghệ",
    "date": "2026.05",
    "title": "AI, Robotics và Edge Computing hội tụ trong các hệ thống vật lý thông minh",
    "excerpt": "Từ robot tự hành đến thiết bị hiện trường, các lab hướng tới năng lực đưa AI ra khỏi màn hình để tương tác với thế giới thực."
  }
];
