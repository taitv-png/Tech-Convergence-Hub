import { tr } from './locale';
export type SurveyPhoto = { file: string; label: string };
export type RoomSurvey = { folder: string; summary: string; sourceLabel: string; photos: SurveyPhoto[]; note?: string };

const series = (first: number, last: number): SurveyPhoto[] => Array.from({ length: last - first + 1 }, (_, index) => ({
  file: `IMG_${first + index}`, label: tr(`Hiện trạng · góc ${index + 1}`, `Site photo: view ${index + 1}`),
}));
const computers: RoomSurvey = {
  folder: 'installed-computer-lab', sourceLabel: tr("Bộ ảnh nội thất dùng chung cho E402–E403 và E602–E603", "Shared interior survey photos for E402-E403 and E602-E603"),
  summary: tr("Dãy máy tính · bàn gỗ chia khoang · ghế kem, cam và xanh lá · bảng trắng · bàn giảng viên · máy chiếu", "Computer banks, divided wood desks, cream, orange and green chairs, whiteboard, instructor desk and projector"),
  photos: [
    { file: 'IMG_5033', label: tr("Toàn cảnh · dãy máy tính và cửa kính", "Overview: computer banks and glazed entrances") },
    { file: 'IMG_5035', label: tr("Bảng trắng · hai cửa trên dãy kính", "Whiteboard and the two glazed-wall entrances") },
    { file: 'IMG_5036', label: tr("Nhìn về cửa phía cầu thang", "View towards the stair-side entrance") },
    { file: 'IMG_5039', label: tr("Bàn giảng viên · máy chiếu và cột", "Instructor desk, projector and columns") },
    { file: 'IMG_5037', label: tr("Các khoang cửa sổ và lối đi", "Window bays and aisles") },
    ...[5031, 5027, 5028, 5029, 5030, 5032, 5034, 5038].map(number => ({ file: `IMG_${number}`, label: tr(`Hiện trạng · ảnh ${number}`, `Site photo ${number}`) })),
  ],
  note: tr("Hai phòng dùng chung bố trí theo xác nhận của bạn. Số hàng và số chỗ dựng trong mô hình là ước lượng từ ảnh.", "Both rooms share this layout, as confirmed by the owner. The modeled rows and seating are estimates from the photos."),
};

export const ROOM_SURVEYS: Record<string, RoomSurvey> = {
  'E402+E403': computers,
  'E602+E603': computers,
  E201: {
    folder: 'survey-e201', sourceLabel: tr("Ảnh hiện trạng phòng E201", "E201 site photos"),
    summary: tr("Bàn họp · cụm bàn trao đổi · bàn máy tính · kệ tài liệu · cột giữa phòng · rèm lá dọc", "Meeting table, group tables, computer desk, brochure rack, central column and vertical blinds"),
    photos: series(5102, 5107),
  },
  E202: {
    folder: 'survey-e202', sourceLabel: tr("Ảnh hiện trạng phòng E202", "E202 site photos"),
    summary: tr("Bàn làm việc có vách ngăn · bàn họp · tủ lưu trữ · bảng trắng · máy chiếu", "Partitioned desks, meeting tables, storage cabinets, whiteboard and projector"),
    photos: series(5084, 5100),
  },
  E302: {
    folder: 'survey-e302', sourceLabel: tr("Ảnh hiện trạng phòng E302", "E302 site photos"),
    summary: tr("Khu thử nghiệm có lưới bảo vệ · sân đánh dấu · thiết bị bay/robot · bàn điều khiển nhiều màn hình", "Netted test arena, marked floor, drones and robots, and a multi-monitor control desk"),
    photos: [1391, 1394, 1396, 1397].map(number => ({ file: `IMG_${number}`, label: tr(`Khu thử nghiệm lưới · ảnh ${number}`, `Netted test arena: photo ${number}`) })),
  },
  E303: {
    folder: 'survey-e303', sourceLabel: tr("Ảnh hiện trạng phòng E303", "E303 site photos"),
    summary: tr("Hai dãy bàn máy tính · tủ kính thiết bị · cụm thực hành tự động hóa · bàn giảng viên và bảng", "Two computer-desk banks, glass-front equipment cabinet, automation training system, instructor desk and whiteboard"),
    photos: series(5053, 5066),
  },
  E304: {
    folder: 'survey-e304', sourceLabel: tr("Ảnh hiện trạng phòng E304", "E304 site photos"),
    summary: tr("Sa bàn đường giao thông trên sàn · dãy robot xe bánh · bàn máy tính điều khiển · bảng và máy chiếu", "Floor road layout, wheeled robots, computer control desk, whiteboard and projector"),
    photos: series(5040, 5051),
  },
};

export const hasRoomSurvey = (id: string) => Object.prototype.hasOwnProperty.call(ROOM_SURVEYS, id);
