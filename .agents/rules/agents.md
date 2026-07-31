# Cấu trúc thư mục:
- app: Code chính
- assets: ảnh, ...
- environments: môi trường, config
- app/layout: layout chính, trong này khai báo cả menubar, app sidebar, ... => chú ý thêm menu ở đây.
- app/shared: shared components
- app/services: các service
- app/utils: các utils
- app/features: tính năng chính
- app/models: khai báo data model
- app/pages: ví dụ tham khảo

# quy tắc:
- Đọc instruction trước khi code.
- Tham khảo component tại src/app/pages/uikit khi sử dụng. Nếu chưa đủ thì xem thêm trong .agents/skills/llm-full.txt. Đây là theme của primeng. Hãy dùng tối đa có thể, chỉnh sửa thêm CSS nếu cần. Chỉ các trường hợp buộc sử dụng component ngoài thì mới dùng.
- Code theo theme của primeng, không chuyển sang theme khác.
- Đặt code vào đúng các thư mục theo mô tả.
- Tách 1 tính năng thành nhiều component con để dễ quản lý, sửa chữa.
- Dùng typescript để khai báo type cho dữ liệu, tránh lỗi runtime.
- Sử dụng signal để quản lý state, không dùng BehaviorSubject, ReplaySubject, Subject.
- Sử dụng async pipe để subscribe các signal.
- Sử dụng tailwind để định dạng style.
- dùng await promises cho request.
- khai báo routes vào app.routes.ts. và config các route theo feature.