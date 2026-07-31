## 1. Màn hình: Nhật ký hệ thống

### Mục đích

Cho phép quản trị viên tra cứu, theo dõi, thống kê và xuất nhật ký hệ thống nhằm phục vụ công tác quản trị, kiểm tra, giám sát và truy vết các hoạt động của người sử dụng cũng như các sự kiện phát sinh trong hệ thống.

---

### Khu vực tìm kiếm và lọc dữ liệu

Cho phép tìm kiếm và lọc nhật ký theo các tiêu chí:

* Từ khóa tìm kiếm
* Khoảng thời gian (Từ ngày – Đến ngày)
* Người thực hiện
* Địa chỉ IP
* Tenant
* Workspace
* Loại nhật ký
* Nhóm chức năng
* Hành động thực hiện
* Đối tượng tác động
* Mức độ nghiêm trọng
* Kết quả thực hiện (Thành công/Thất bại)
* HTTP Method
* API Endpoint
* HTTP Status Code
* Session ID
* Request ID

Các nút chức năng:

* Tìm kiếm
* Đặt lại điều kiện lọc
* Làm mới dữ liệu
* Xuất Excel
* Xuất CSV
* Xuất JSON

---

### Danh sách nhật ký

Danh sách nhật ký được hiển thị dưới dạng bảng, bao gồm các thông tin:

* STT
* Thời gian ghi nhận
* Người thực hiện
* Tenant
* Workspace
* Địa chỉ IP
* Loại nhật ký
* Nhóm chức năng
* Hành động
* Đối tượng tác động
* Kết quả thực hiện
* Mức độ nghiêm trọng
* HTTP Method
* API Endpoint
* HTTP Status
* Thời gian xử lý
* Mô tả ngắn
* Request ID

Danh sách hỗ trợ:

* Phân trang
* Sắp xếp theo cột
* Tùy chọn số bản ghi trên mỗi trang
* Làm mới tự động
* Chọn nhiều bản ghi

---

### Xem chi tiết nhật ký

Khi chọn một bản ghi, hệ thống hiển thị toàn bộ thông tin chi tiết bao gồm:

#### Thông tin chung

* ID nhật ký
* Thời gian ghi nhận
* Người thực hiện
* Tenant
* Workspace
* Session ID
* Request ID

#### Thông tin truy cập

* Địa chỉ IP
* User Agent
* Trình duyệt
* Hệ điều hành
* Thiết bị truy cập

#### Thông tin thao tác

* Loại nhật ký
* Nhóm chức năng
* Hành động thực hiện
* Đối tượng tác động
* ID đối tượng
* Tên đối tượng
* Kết quả thực hiện
* Mức độ nghiêm trọng
* Nội dung mô tả
* Mã lỗi (nếu có)

#### Thông tin API

* HTTP Method
* API Endpoint
* HTTP Status Code
* Thời gian xử lý

#### Dữ liệu mở rộng

* Metadata (JSON)
* Thông tin bổ sung

---

## 2. Màn hình: Cấu hình chính sách nhật ký

### Mục đích

Cho phép quản trị viên cấu hình chính sách lưu giữ, quản lý và khai thác nhật ký hệ thống theo quy định của tổ chức.

---

### Thông tin cấu hình

Các trường thông tin:

* Bật/Tắt chức năng ghi nhật ký hệ thống
* Thời gian lưu giữ nhật ký (ngày)
* Tự động xóa nhật ký hết hạn
* Chu kỳ dọn dẹp nhật ký (Hàng ngày/Hàng tuần/Hàng tháng)
* Thời gian thực hiện tác vụ dọn dẹp
* Dung lượng lưu trữ tối đa dành cho nhật ký (GB)
* Cho phép nén nhật ký cũ
* Thời gian bắt đầu nén nhật ký (ngày)
* Ngưỡng cảnh báo dung lượng lưu trữ (%)
* Cho phép xuất nhật ký
* Định dạng xuất mặc định (Excel/CSV/JSON)
* Số lượng bản ghi tối đa cho mỗi lần xuất
* Vai trò được phép xem nhật ký
* Vai trò được phép xuất nhật ký
* Vai trò được phép thay đổi chính sách nhật ký

---

### Chức năng

Quản trị viên có thể thực hiện các chức năng:

* Cập nhật chính sách nhật ký
* Khôi phục cấu hình mặc định
* Hủy thay đổi
* Kiểm tra hiệu lực của cấu hình trước khi lưu

---

### Quy tắc áp dụng

* Chính sách sau khi được lưu sẽ áp dụng cho toàn bộ hệ thống.
* Việc thay đổi thời gian lưu giữ chỉ áp dụng đối với các bản ghi được tạo sau khi cấu hình có hiệu lực.
* Tác vụ dọn dẹp nhật ký được thực hiện tự động theo chu kỳ đã cấu hình.
* Chỉ người dùng có quyền quản trị hệ thống mới được phép thay đổi chính sách nhật ký.
* Việc thay đổi chính sách nhật ký phải được ghi nhận vào nhật ký hệ thống để phục vụ công tác kiểm tra và truy vết.
