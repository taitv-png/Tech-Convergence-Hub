// English content for the data in labs.ts, technology-themes.ts and operating-models.ts.
// Keyed by the stable ids (lab.id, cluster key, theme id, model id); labs.ts stays the
// Vietnamese source. Lab names follow the approved English room signs
// (D:/TCH/outputs/lab_signs/lab_names_current.json, 2026-10-14) where a sign exists.

export type LabTextEn = { name: string; desc: string; tech: string[]; apps: string[] };

export const labsEn: Record<string, LabTextEn> = {
  "precision-mechanics-lab": {
    name: "Precision Mechanics & Equipment Lab",
    desc: "Research, training, design, prototyping and evaluation of precision mechanical systems to support product development and engineering prototypes.",
    tech: ["CAD/CAM/CAE", "3D printers", "Laser cutter", "Mini CNC"],
    apps: ["Prototyping", "Automation", "Mechatronics"],
  },
  "hologram-printing-lab": {
    name: "Hologram Printing Lab",
    desc: "Hologram production and storage of holographic print data, alongside training and practical work in hologram production.",
    tech: ["Hologram printer", "Optical materials", "Processing workstations", "Support systems"],
    apps: ["Technology showcases", "Art-tech products", "Technology transfer"],
  },
  "classroom-e103": {
    name: "Classroom",
    desc: "Teaching room for 30 to 40 people.",
    tech: ["Projector", "Sound system", "Interactive whiteboard", "Wi-Fi"],
    apps: ["Teaching"],
  },
  "hologram-exhibition-room": {
    name: "Immersive Technology Exhibition & Post Production Room",
    desc: "A space for exhibiting holographic works and carrying out post-production.",
    tech: ["Hologram display system", "Post-production equipment", "Graphics workstations", "Projection equipment"],
    apps: ["Exhibitions", "Post-production"],
  },
  "immersive-technology-center": {
    name: "Immersive Technology Convergence Center",
    desc: "Research and hands-on work in imaging, simulation and digital interaction, alongside hologram post-production.",
    tech: ["Interaction tracking devices", "Behavioural data recording systems", "Simulation platform", "Presentation equipment"],
    apps: ["Research", "User experience evaluation"],
  },
  "human-centered-ai-lab": {
    name: "Human-Centered AI Innovation Lab",
    desc: "Researches and develops artificial intelligence applications that put people at the centre.",
    tech: ["GPUs", "Smart glasses", "Wearables", "Humanoid robots"],
    apps: ["AI services", "Innovative products", "Enterprise applications"],
  },
  "urban-physics-lab": {
    name: "Architectural & Urban Physics Lab",
    desc: "Measures and simulates physical conditions for green, energy-efficient architectural design.",
    tech: ["Physical simulation", "Measurement tools", "Climate models", "Dynamic analysis"],
    apps: ["Green architecture", "Sustainable planning", "Energy efficiency"],
  },
  "research-lab": {
    name: "Guest Researchers & Visiting Scholars",
    desc: "A shared research space for experts from Vietnam and abroad.",
    tech: ["Research space", "Team workspace", "Academic connections", "Research support systems"],
    apps: ["International collaboration", "Interdisciplinary research", "Co-creation projects"],
  },
  "smart-city-lab": {
    name: "Smart City Lab",
    desc: "Focuses on AIoT, digital twins and urban data management to solve real problems in safety, traffic and smart urban infrastructure.",
    tech: ["AIoT", "Digital twin", "GIS platform", "Urban data analytics"],
    apps: ["Research", "Urban analysis and forecasting"],
  },
  "digital-twin-lab": {
    name: "META - Digital Twin Lab",
    desc: "Urban data science research using digital maps, AI and real-time urban data management.",
    tech: ["Monitoring sensors", "Simulation platform", "Digital twin", "Predictive analytics"],
    apps: ["Simulation", "Operations forecasting"],
  },
  "automated-vehicles-lab": {
    name: "Automated Vehicles & Systems Lab",
    desc: "Research and teaching on mobile robots and autonomous vehicles, and the development of control algorithms.",
    tech: ["Mobile robots", "Autonomous vehicle platform", "Positioning sensors", "Control simulation"],
    apps: ["Robotics research", "Autonomous control training"],
  },
  "space-ocean-robotics-lab": {
    name: "Mobile Robot Lab",
    desc: "Research and teaching on mobile robots and autonomous vehicles (AGV, AMR). The lab offers a multi-terrain test environment and high-performance computers to develop control algorithms, computer vision and smart sensor integration (LiDAR, GPS, IMU) for autonomous operation.",
    tech: [
      "Mobile robots (wheeled, tracked, legged)",
      "Research drones",
      "Cameras, LiDAR, IMU, GPS, ultrasonic sensors",
      "ROS/ROS2, Gazebo, MATLAB/Simulink",
    ],
    apps: ["Robotics research", "Autonomous control training"],
  },
  "ocean-robotics-lab": {
    name: "Ocean Robotics Lab",
    desc: "Researches and tests autonomous and remotely operated underwater vehicles (AUV, ROV) with positioning, remote sensing and underwater communication, for training and robot development in real marine settings.",
    tech: [
      "Autonomous underwater, ground and aerial vehicles (UGV, UAV, AUV)",
      "Remotely operated vehicles (ROV)",
      "Positioning and control systems",
      "Oceanographic sensor network",
    ],
    apps: ["Underwater robotics", "Robotics research"],
  },
  "industrial-production-line-lab": {
    name: "MPS Station Center",
    desc: "Space and equipment for hands-on mechatronics and factory automation.",
    tech: ["MPS", "PLC", "Simulated conveyor", "Mechatronics equipment"],
    apps: ["Production practice", "Automation training"],
  },
  "embedded-iot-process-lab": {
    name: "Embedded & IoT System Lab",
    desc: "Research and teaching on power electronics, microcontrollers and embedded systems, and the development of Internet of Things (IoT) applications.",
    tech: ["SIMATIC S7-1500 training kits", "I/O data cables (IEEE 488)", "RFID kits", "IO-Link smart sensors"],
    apps: ["Embedded systems research", "Industrial networking training"],
  },
  "process-control-industrial-network-lab": {
    name: "Process Control & Industrial Communication Network Lab",
    desc: "Research and teaching on automation, intelligent control and industrial communication protocols, together with the MPS system and industrial monitoring systems.",
    tech: [
      "PLCs (Siemens, Mitsubishi, Schneider)",
      "Process models (water tank, temperature, pressure)",
      "HMI and monitoring screens",
      "Industrial switches and network modules",
    ],
    apps: ["Embedded systems research", "Industrial networking training"],
  },
  "edge-physical-ai-lab": {
    name: "Edge & Physical AI Lab",
    desc: "Brings together AI, sensors, actuators, embedded systems, robotics, IoT, computer vision and real-time control to build intelligent systems that work in the physical world.",
    tech: ["Edge AI", "Computer vision", "Real-time sensors", "Edge inference platform"],
    apps: ["Intelligent systems for the physical world", "Edge AI research"],
  },
  "ai-big-data-lab": {
    name: "AI & Big Data Lab",
    desc: "Leading applied research on AI and big data for economics and business, supporting international research publications, technology transfer and advanced professional training.",
    tech: ["Data processing cluster", "Data warehouse", "GPU workstations", "Machine learning platform"],
    apps: ["AI and big data", "Advanced data analytics"],
  },
  "ocean-monitoring-planning-energy-lab": {
    name: "Ocean Monitoring & Spatial Planning Lab",
    desc: "Researches, teaches and develops oceanographic sensor networks and remote sensing to monitor the marine environment and resources in real time. With field data, GIS, AI and decision support systems (DSS), it supports sustainable marine and coastal spatial planning through cross-disciplinary collaboration.",
    tech: [
      "Geographic information systems (GIS)",
      "Augmented reality",
      "Spatial tools (maps, atlases, story maps) with printers and touch tables",
      "Nearshore IoT sensor system",
    ],
    apps: ["Ocean monitoring", "Marine spatial planning"],
  },
  "ocean-physics-lab": {
    name: "Ocean Physics & Coastal Dynamics Lab",
    desc: "Research and simulation of ocean physical processes, supported by oscillation and fluid viscosity measurements. Hands-on training in fluid mechanics and coastal dynamics provides a foundation for marine engineering and energy research.",
    tech: ["Basic measuring instruments", "Oscillation measurement system", "Fluid viscosity measurement system", "Bridge circuit measurement system"],
    apps: ["Ocean monitoring", "Simulation"],
  },
  "ocean-renewable-energy-lab": {
    name: "Ocean Renewable Energy Lab",
    desc: "Researches, teaches and tests ocean energy technologies: wave energy (WEC), tidal energy (TEC), ocean currents and thermal or salinity gradients.",
    tech: [
      "Lab-scale WEC and TEC test models",
      "Small wave and current test tank",
      "Power, force and efficiency measurement",
      "DAQ and SCADA monitoring",
    ],
    apps: ["Marine renewable energy", "Testing"],
  },
  "smart-port-mobility-rail-lab": {
    name: "Smart Seaport Logistics & Terminal Operations Lab",
    desc: "Research and training on supply chain management, yard planning and port operations optimisation with a terminal operating system (TOS) and digital twin technology, using models of control systems, yards and cargo flows.",
    tech: [
      "Simulation models and equipment",
      "Scale container terminal (berth, container yard, gate)",
      "Scale ship-to-shore (STS), RTG/RMG cranes and AGV/AMR",
      "Mini container conveyor",
    ],
    apps: ["Smart logistics", "Port operations"],
  },
  "smart-mobility-lab": {
    name: "Smart Mobility Lab",
    desc: "A research lab and living lab for urban transport, road safety and data-driven sustainable development. It combines simulation, real data and digital platforms to support evidence-based planning and policy.",
    tech: ["Simulation and VR/AR systems", "AI traffic cameras", "GPS trackers", "Traffic simulation table"],
    apps: ["Smart mobility", "Simulation"],
  },
  "rail-systems-lab": {
    name: "Rail Systems Lab",
    desc: "Research and training in railway operations, maintenance and basic certification for students and technicians, based on operating, incident and safety scenarios in a simulated environment.",
    tech: ["High-performance workstations", "Control room displays", "Railway system model", "Multi-modal operations simulation desk"],
    apps: ["Railway operations training", "Simulation"],
  },
  "classroom-e503": {
    name: "Classroom",
    desc: "Teaching room for 30 to 40 people.",
    tech: ["Projector", "Sound system", "Interactive whiteboard", "Wi-Fi"],
    apps: ["Teaching"],
  },
  "classroom-e502": {
    name: "Classroom",
    desc: "Teaching room for 30 to 40 people.",
    tech: ["Projector", "Sound system", "Interactive whiteboard", "Wi-Fi"],
    apps: ["Teaching"],
  },
  "classroom-e504": {
    name: "Classroom",
    desc: "Teaching room for 30 to 40 people.",
    tech: ["Projector", "Sound system", "Interactive whiteboard", "Wi-Fi"],
    apps: ["Teaching"],
  },
  "classroom-e501": {
    name: "Classroom",
    desc: "Teaching room for 30 to 40 people.",
    tech: ["Projector", "Sound system", "Interactive whiteboard", "Wi-Fi"],
    apps: ["Teaching"],
  },
  "security-lab": {
    name: "Information Security Lab",
    desc: "Specialist, hands-on information security training that helps students build a portfolio of practical work.",
    tech: ["Security workstations", "Attack simulation environment", "Network equipment", "Lab servers"],
    apps: ["Information security practice"],
  },
  "security-lab-extra": {
    name: "Information Security Lab",
    desc: "Specialist, hands-on information security training that helps students build a portfolio of practical work.",
    tech: ["Security workstations", "Attack simulation environment", "Network equipment", "Lab servers"],
    apps: ["Information security practice"],
  },
  "circular-economy-lab": {
    name: "Circular Economy Lab",
    desc: "A space to assemble and test start-up products and to demonstrate biological treatment of organic waste.",
    tech: ["Assembly area", "Test equipment", "Biological treatment model", "Environmental measurement kit"],
    apps: ["Start-ups", "Technology demonstrations"],
  },
  "isc-open-lab": {
    name: "ISC Open Lab",
    desc: "A workspace offering business management support, copyright advice and support for product commercialisation.",
    tech: ["Open workspace", "Video conferencing", "Management tools", "Advisory area"],
    apps: ["Business support", "Advisory", "Commercialisation"],
  },
  "open-lab-prototyping-library": {
    name: "Open Lab, Prototyping Area & Digital Library",
    desc: "An incubation space for projects preparing to meet investors, with a digital library.",
    tech: ["Prototyping area", "Digital library", "Pitch space", "Presentation infrastructure"],
    apps: ["Incubation", "Library"],
  },
  "meeting-station-cafe": {
    name: "Meeting Station & Café",
    desc: "Light refreshments with a multi-purpose meeting room.",
    tech: ["Café area", "Flexible meeting room", "Projection system", "Conferencing equipment"],
    apps: ["Refreshments", "Meetings"],
  },
  "innovation-lounge": {
    name: "Innovation Lounge",
    desc: "A shared workspace for showcasing research outcomes and connecting online with experts.",
    tech: ["Open space", "Exhibition area", "Online meeting screens", "Team workspace"],
    apps: ["Workspace", "Seminars"],
  },
};

// Seven capability clusters. key is the stable filter value; Vietnamese names stay in labs.ts.
export const clustersEn: Record<string, { name: string; desc: string; tags: string[] }> = {
  robotics: {
    name: "Robotics & Autonomous Systems",
    desc: "Mobile, aerial and underwater robots and autonomous control systems.",
    tags: ["Mobile robots", "Drones", "Underwater robots", "Autonomous systems"],
  },
  immersive: {
    name: "Immersive Technology & User Experience",
    desc: "Immersive technologies, holograms, VR/AR and human-computer interaction.",
    tags: ["Hologram", "VR/AR", "UX", "Interaction"],
  },
  urban: {
    name: "Smart Cities & Urban Systems",
    desc: "Transport, urban operations, urban data and smart railway systems.",
    tags: ["Smart cities", "Transport", "Railways", "Operations"],
  },
  ocean: {
    name: "Ocean, Coastal Systems & Energy",
    desc: "Ocean monitoring, marine and coastal planning, smart ports and ocean renewable energy.",
    tags: ["Seaports", "Ocean monitoring", "Ocean robotics", "Energy"],
  },
  automation: {
    name: "Industrial Automation & IoT",
    desc: "Embedded systems, industrial networks, PLC/SCADA and smart manufacturing.",
    tags: ["Embedded systems", "IoT", "PLC/SCADA", "Smart manufacturing"],
  },
  cyber: {
    name: "Cybersecurity & Digital Infrastructure",
    desc: "Information security training and practice: penetration testing, digital forensics and system security.",
    tags: ["Information security", "Digital forensics", "Networks", "Cloud security"],
  },
  innovation: {
    name: "Innovation & Commercialisation",
    desc: "Incubation, showcases, investor connections and commercialisation of research results.",
    tags: ["Prototypes", "Incubation", "Demo days", "Technology transfer"],
  },
};

// What each floor is for (the room code and floor number carry the location).
export const floorRolesEn: Record<string, string> = {
  "0": "Exhibition and demonstration of large-scale technology products",
  "1": "Research, training and projects in immersive technology and interactive user interfaces",
  "2": "Research, training and projects in smart cities and digital transformation",
  "3": "Research, training and projects in robotics, manufacturing and industrial monitoring",
  "4": "Research, training and projects in urban architecture, ocean technology and smart mobility",
  "5": "Classrooms and space for future expansion",
  "6": "Research, projects and multi-stakeholder collaboration",
  "7": "Research, projects and multi-stakeholder collaboration",
};

export const newsEn = [
  {
    category: "Strategy",
    date: "2026.06",
    title: "Tech-Convergence Hub proposal highlights UEH as a hub for technology convergence",
    excerpt:
      "The hub is envisioned as strategic infrastructure connecting teaching, research, experimentation and technology transfer through a living lab approach.",
  },
  {
    category: "Operations",
    date: "2026.06",
    title: "Optimisation, sharing and autonomy: shared principles for all labs",
    excerpt:
      "KPI-based management, shared use of spaces and technology clustering improve utilisation and help move research into practice.",
  },
  {
    category: "Investment plan",
    date: "2026.05",
    title: "Lab investment portfolio organised by floor and priority technology cluster for 2026 to 2030",
    excerpt:
      "The portfolio covers AI, robotics, digital twins, smart mobility, ocean technology, information security and innovation for a multidisciplinary university.",
  },
];

export const themesEn: Record<string, string> = {
  iot: "Connected sensors, embedded systems and real-time data.",
  immersive: "Holography, immersive technologies and interactive experiences.",
  logistics: "Simulation and optimisation of smart seaport logistics.",
  ocean: "Monitoring, spatial planning and research for marine and coastal systems.",
  ai: "Edge AI, big data and human-centred applications.",
  mobility: "Automated vehicles, transport and smart railway systems.",
  robotics: "Mobile robots, ocean robots and autonomous vehicles.",
  "smart-city": "Urban data, digital twins and architectural physics.",
  energy: "Renewable energy research and ocean physics.",
  materials: "Precision mechanics, physics, industrial control and the circular economy.",
  cyber: "Research and practice in protecting data, systems and digital infrastructure.",
  ux: "User experience and human-centred AI.",
};

export const modelsEn: Record<string, { summary: string; activities: string; outcomes: string }> = {
  sandbox: {
    summary:
      "A controlled environment for testing technologies through simulation and monitoring before real-world deployment.",
    activities: "Test scenarios, simulate operations, monitor and tune systems.",
    outcomes: "Validated solutions ready for pilot testing.",
  },
  "living-lab": {
    summary:
      "A real-world setting where solutions are co-developed, tested and refined with users on campus, in businesses and across the city, supporting technology transfer.",
    activities: "Students, researchers, businesses and government define problems and co-create solutions.",
    outcomes: "Real-world pilots and solutions transferred to partners.",
  },
  laboratory: {
    summary: "Specialist laboratories with dedicated equipment for practical teaching and in-depth research.",
    activities: "Practical classes, experiments, research projects.",
    outcomes: "Research results, publications and technical skills for learners.",
  },
  makerspace: {
    summary: "A prototyping space to assemble, build and test products before incubation and commercialisation.",
    activities: "Build prototypes, test products, prepare demos for investors and partners.",
    outcomes: "Prototypes, demo products and projects ready for incubation.",
  },
  "field-lab": {
    summary: "Field-based learning, research and testing in real urban and regional settings.",
    activities: "Collect field data, observe and run on-site trials.",
    outcomes: "Field data and evidence for planning and policy.",
  },
};

// English alt text for the illustrative lab photos (data/lab-photos.ts holds Vietnamese).
export const photoAltEn: Record<string, string> = {
  "precision-mechanics-lab": "Close-up of a CNC milling cutter machining a metal part in a precision machine.",
  "hologram-printing-lab": "Optical table with laser beams and components used in holographic recording and optical processing.",
  "classroom-e103": "Modern classroom with desks, chairs and natural light.",
  "hologram-exhibition-room": "Interactive table and hologram display in an exhibition space.",
  "immersive-technology-center": "A person exploring virtual reality through a VR headset.",
  "human-centered-ai-lab": "A person and a robot arm interacting through a flower.",
  "urban-physics-lab": "Building model used to study aerodynamics and wind effects on architecture.",
  "research-lab": "A group of experts discussing ideas around models and research documents in a workspace.",
  "smart-city-lab": "Singapore at night, with waterfront infrastructure and public space.",
  "digital-twin-lab": "Aerial view of a street grid and building layout in a city.",
  "automated-vehicles-lab": "Waymo autonomous car with LiDAR and camera sensors on the roof.",
  "space-ocean-robotics-lab": "The Curiosity rover being assembled and tested in a NASA clean room.",
  "ocean-robotics-lab": "Sampling arm of the Jason underwater robot surveying a seafloor volcanic area.",
  "industrial-production-line-lab": "Industrial robot arms working together on a car production line.",
  "embedded-iot-process-lab": "Arduino UNO R4 WiFi board for embedded systems and IoT research.",
  "process-control-industrial-network-lab": "Automation equipment with a controller and machinery in an industrial setting.",
  "edge-physical-ai-lab": "Robot systems and test equipment in a digital manufacturing research lab.",
  "ai-big-data-lab": "Server racks and data processing infrastructure in a data centre.",
  "ocean-monitoring-planning-energy-lab": "A CTD instrument measuring conductivity, temperature and depth lowered into the sea for oceanographic monitoring.",
  "ocean-physics-lab": "Ice and wave test basin at Aalto, illustrating fluid mechanics and ocean simulation research.",
  "ocean-renewable-energy-lab": "The PLAT-I floating tidal energy platform at sea in Canada.",
  "smart-port-mobility-rail-lab": "Overview of the Miami container port with berths, cranes and cargo routes.",
  "smart-mobility-lab": "A modern tram on an urban line, illustrating smart public transport.",
  "rail-systems-lab": "Control panel in a modern locomotive cab, illustrating railway operations training.",
  "classroom-e503": "Bright classroom with individual desks, a whiteboard, a screen and bookshelves.",
  "classroom-e502": "Lecture room with green chairs, writing desks and a projection area at the front.",
  "classroom-e504": "Modern classroom and seminar room with long tables, chairs and large windows.",
  "classroom-e501": "Students talking and studying in a modern classroom.",
  "security-lab": "Rows of server racks lit in blue, illustrating infrastructure for information security practice.",
  "security-lab-extra": "Aisle between server racks at the Virginia Tech data centre, illustrating digital infrastructure security.",
  "circular-economy-lab": "Hands holding rich compost next to green plants, illustrating resource recovery from organic waste.",
  "isc-open-lab": "Bright co-working space with desks, a discussion area and glass partitions.",
  "open-lab-prototyping-library": "3D printers, tools and parts in a prototyping area.",
  "meeting-station-cafe": "Bright café corner by a glass wall with high tables, upholstered chairs and plants.",
  "innovation-lounge": "Co-working lounge with sofas, screens and round tables for sharing ideas.",
};
