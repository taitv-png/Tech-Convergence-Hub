# Giao việc cho Claude: thiết kế và triển khai UI/UX TCH

## Vai trò và phạm vi

Bạn là người phụ trách triển khai toàn bộ UI/UX của website Tech-Convergence Hub theo brief này. Người dùng đã yêu cầu giao phần UI/UX cho Claude và đã kết nối thư mục D:\TCH trong ứng dụng Claude.

Mã nguồn cần sửa nằm ở D:\TCH\Tech-Convergence-Hub, không phải thư mục wayfinding bên cạnh. Nếu môi trường Cowork ánh xạ đường dẫn khác, tìm thư mục Tech-Convergence-Hub trong thư mục TCH được cấp quyền, xác nhận bằng package.json và app/page.tsx, rồi làm việc ở đó. Không yêu cầu cài lại Claude Code hoặc chuyển sang một dự án mới khi đã đọc/ghi được mã nguồn qua thư mục kết nối.

Thực hiện thay đổi trong mã nguồn hiện có và kiểm tra kết quả, không chỉ trả về lời khuyên hay một mockup rời. Codex đã nghiên cứu và lập brief; Claude phụ trách thiết kế chi tiết và implementation. Đọc AGENTS.md và backbone.yml trước khi sửa. Không ghi đè các thay đổi hiện có hoặc reset Git. Không tự tạo agent con, không thay cấu hình agent hay cài thêm plugin. Dùng công cụ và mô hình đang có trong phiên.

## Mục tiêu

Website phải tối giản, hiện đại và mang tính công nghệ, đồng thời trông như một hệ sinh thái nghiên cứu của đại học có chủ đích thiết kế. Người xem nhanh chóng hiểu: TCH là gì, Campus E có những khả năng/lab nào, và làm sao tìm hoặc tham quan một không gian.

Điểm người dùng chưa hài lòng: intro còn giống một sơ đồ thông tin hơn là một trải nghiệm giới thiệu; các phiên bản nhãn dạng hộp tạo cảm giác giả; bố cục và hiệu ứng chưa đủ có ý tưởng; tiêu đề từng nhỏ hoặc thiếu phân cấp; nội dung bên trái từng giật khi chọn công nghệ. Phiên bản gần nhất đã cải thiện nhưng cần một lần thiết kế thống nhất toàn diện.

## Website tham khảo đã tuyển chọn

Đọc docs/ui-ux-references-2026-10-20.md và trực tiếp xem các trang khi có thể:

1. https://epfl-ecal-lab.ch/ : tham khảo chính về chữ lớn, tương phản, hình nghiên cứu và chuyển động nền. Giữ mức tiết chế cao hơn cho TCH.
2. https://www.sutd.edu.sg/asd/ : nhịp kể chuyện giữa định hướng, dự án, showcase và campus tour.
3. https://mitnano.mit.edu/ : UX giới thiệu cơ sở vật chất dùng chung và đưa người dùng tới đúng khả năng sử dụng.
4. https://ai.ethz.ch/research.html : cách nhóm các lĩnh vực nghiên cứu liên ngành.
5. https://dschool.stanford.edu/ : điều hướng nội dung theo ý định của người xem.
6. https://design-lab.mit.edu/ : bố cục đơn sắc, đường chia, typography và cách ưu tiên dự án.

Tham khảo nguyên tắc, không sao chép layout hoặc tài sản. Nội dung MIT Design Lab có phần cũ và một số hình không tải được khi khảo sát; SUTD được kiểm tra về cấu trúc, chưa đo timing motion. Đánh giá lại khi dùng. Không gọi mọi trang tham khảo là tốt toàn diện về mọi tiêu chí.

## Ý tưởng chốt: Trường hội tụ

Thiết kế phần mở đầu như một không gian nghiên cứu sống, có nhiều luồng thông tin kết nối thành một hệ thống chung. Sức hút đến từ bố cục, typography, hình thật và chuyển động rất có kiểm soát.

### Intro

- Nền hiệu ứng trải rộng toàn hero, không bị giới hạn ở ô sơ đồ bên phải. Dùng đường tín hiệu mảnh, các điểm sáng cam tiết chế hoặc lớp hình Campus E/lab được xử lý đồ họa. Chọn một chuyển động chính có chủ đích; không trộn nhiều lớp particle, glow, vòng tròn, grid và 3D cùng lúc.
- Chuyển động mở đầu khoảng 0.8-1.2 giây, sau đó là vòng lặp chậm nhẹ. Đây là mục tiêu thiết kế đề xuất, không phải timing sao chép từ nguồn. Nội dung và nút bấm phải dùng được ngay, không splash screen chặn đường vào.
- Giữ câu “Nơi công nghệ hội tụ. Ý tưởng vươn xa.” với cam để nhấn đúng cụm. Canh dòng thoáng, dấu tiếng Việt đầy đủ, vị trí và kích thước đứng yên khi hover hoặc chọn lab.
- Hai lối vào chính: Khám phá labs và Tham quan Campus E. Không tạo thêm nhiều CTA cạnh tranh nhau.
- Hiệu ứng chuột hoạt động trên toàn hero nhưng không làm trôi chữ. Không biến con trỏ thành công cụ bắt buộc, không phá thao tác chọn văn bản.
- Đưa 12 hướng công nghệ thành một phần khám phá rõ ràng ngay sau hero hoặc một lớp phụ có chủ đích. Không ép hero phải là sơ đồ tròn khổng lồ. Nếu vẫn dùng quỹ đạo, logo, vòng và đường nối phải chung tâm, nhãn dàn đều, không hộp giả, không chồng chữ. Mỗi lựa chọn phải cho kết quả thực: lab, phòng, tầng và đường dẫn tương ứng.

### Hệ thiết kế chung

- Giữ trắng ấm, than đen và cam TCH. Không tự đưa xanh lá hoặc thêm nhiều màu thương hiệu.
- Một font Be Vietnam Pro đã có local. Khoảng 6 cấp chữ chung: 12/14/16/20/48/64 px, có nội suy phù hợp trên màn nhỏ. Nếu điều chỉnh, hãy định nghĩa và dùng một thang nhất quán, không thêm cỡ riêng cho từng khối.
- Tiêu đề trang nổi bật; tên phần như Campus Explorer phải là tiêu đề thật và đủ lớn. Slogan hỗ trợ không được vô tình lớn hơn tên phần mà tên phần chỉ còn là nhãn nhỏ. Các section có chung nguyên tắc lề, dòng chia và khoảng cách.
- Giữ dải logo đối tác chuyển động nhẹ, nhỏ và tinh tế, có dừng/tiếp tục. Không phóng to logo hoặc tự thêm quan hệ hợp tác.
- Nền cuộn trắng sang đen ở phần Campus, sau đó trắng trở lại. Tất cả chữ, logo, đường chia, menu và trạng thái focus phải đọc được trong quá trình chuyển màu.
- Ảnh thật và phối cảnh cần có vai trò nội dung; không dùng thêm khung trang trí vô nghĩa. Không chèn dòng “Ảnh tham khảo”. Ghi nguồn trong tài liệu. Không trình bày ảnh AI hoặc phối cảnh như ảnh hiện trạng.
- Giảm và hợp nhất CSS chồng lớp nếu cần, nhưng giữ công nghệ và cấu trúc dự án hiện có. Không đổi framework hoặc đưa thêm thư viện lớn chỉ để trang có hiệu ứng.

### Toàn bộ hành trình UX

1. Trang chủ: định vị rõ, intro hấp dẫn, hiểu các nhóm năng lực, thấy không gian thật, vào khám phá Campus và tìm cách kết nối.
2. Danh mục labs: tìm theo từ khóa, tầng, cụm và hướng công nghệ; trạng thái kết quả, xóa lọc và không tìm thấy rõ ràng. Giữ các deep link bộ lọc đang có.
3. Chi tiết lab: tên, chức năng, phòng/tầng và hành động tìm trên bản đồ rõ; ảnh không lấn át thông tin thực dụng.
4. Campus Explorer: dùng ảnh Campus E từ bộ wayfinding cho phần giới thiệu; từ đó vào bản đồ, chọn tầng/phòng, chỉ đường và tham quan 3D. Giữ nguyên logic bản đồ và tour đang hoạt động. Không thay engine hoặc dựng một bản đồ giả thay nguồn thật.
5. Tin/hoạt động và kết nối: chung typography, ảnh và quy tắc layout với toàn site; link làm đúng việc như tên gọi.

## Mã nguồn và dữ liệu có sẵn

- app/page.tsx, components/HomeExperience.tsx, TechnologyOrbit.tsx, SectionHeading.tsx, CampusPortal.tsx, PartnerRibbon.tsx, Header.tsx, Footer.tsx, SiteMotion.tsx.
- app/graphic.css, intro.css, motion.css, redesign.css, globals.css, fonts.css. Hiện có nhiều lớp CSS nên xem cascade kỹ.
- components/LabDirectory.tsx, app/labs/, app/news/, app/explore/, components/wayfinding/.
- data/labs.ts là nguồn nội dung thật: hiện 35 lab, 7 cụm. data/technology-themes.ts có 12 hướng để khám phá, không đồng nghĩa với 12 cụm chính thức. Tính số từ dữ liệu.
- lib/explorer-link.ts giữ quy tắc gộp phòng và deep link. Không phá alias E402/E403 và E602/E603.
- public/images/campus-e.jpg là ảnh mặt tiền từ intro của dự án wayfinding. public/images/convergence-hero.webp là minh họa AI. public/rooms/ là phối cảnh. docs/image-sources.md ghi nguồn.
- docs/design-system.md, docs/redesign-2026.md và docs/screenshots/ chứa các quyết định và ảnh bản hiện tại.
- Next.js 15, React 19, static export; base path khi xuất GitHub Pages là /Tech-Convergence-Hub. Bản xem thử local có thể đang ở http://127.0.0.1:3010/Tech-Convergence-Hub/.

## Trình tự thực hiện và bàn giao

1. Xem website hiện tại, dữ liệu và các tham khảo. Nêu ngắn gọn hướng thiết kế chọn rồi triển khai trực tiếp trong đúng mã nguồn được kết nối.
2. Làm intro, hệ thiết kế chung và các trang trong phạm vi trên. Không sửa nội dung nghiệp vụ bằng suy đoán. Không bịa lab, số liệu, hoạt động hay công trình.
3. Kiểm tra build sản phẩm và TypeScript bằng quy trình sẵn có của dự án. Kiểm tra thủ công desktop/mobile, chữ tiếng Việt, zoom, bàn phím, reduced motion, các CTA, bộ lọc và link sang phòng E104. Tuân thủ gate của AGENTS.md cho các vòng visual/e2e đầy đủ; không tự khởi chạy suite hoặc loop lớn.
4. Chuyển cả 12 lựa chọn công nghệ và xác nhận tiêu đề không đổi vị trí/kích thước. Kiểm tra nhãn không chồng nhau và không có lỗi hydration. Giữ animation nhẹ, ngừng vòng render khi ngoài màn hình nếu dùng canvas/WebGL.
5. Báo kết quả bằng tiếng Việt: đã sửa gì, file chính, kiểm tra đã qua, giới hạn còn lại. Có ảnh kết quả và bản local dùng được nếu môi trường cho phép. Không tự publish, push, commit, cài thêm phần mềm, xóa file người dùng hoặc thay quyền truy cập.

Người dùng muốn bạn thực hiện phần UI/UX, không chỉ đề xuất. Nếu thiếu quyền hoặc đường dẫn, nêu đúng chỗ thiếu và không ghi đè bằng một website mới tách rời.
