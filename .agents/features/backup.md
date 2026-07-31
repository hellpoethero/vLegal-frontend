Đối với **mục 6.1** thì thực ra chỉ cần **01 màn hình** là đủ. Phần **6.1.b** là chức năng backend (scheduler) thực hiện theo chính sách đã cấu hình, không cần giao diện riêng.

Dưới đây là mô tả phù hợp để đưa cho agent phát triển.

---

# Màn hình: Chính sách sao lưu dự phòng

## Mục đích

Cho phép quản trị viên thiết lập chính sách sao lưu dự phòng tự động đối với cơ sở dữ liệu và cấu hình hệ thống nhằm đảm bảo khả năng khôi phục khi xảy ra sự cố.

---

## Thông tin cấu hình

### Thông tin chung

* Bật/Tắt chính sách sao lưu tự động
* Tên chính sách
* Mô tả

### Đối tượng sao lưu

Cho phép lựa chọn một hoặc nhiều đối tượng cần sao lưu:

* Cơ sở dữ liệu
* Cấu hình hệ thống

### Lịch sao lưu

Các trường thông tin:

* Chu kỳ sao lưu

  * Hàng ngày
  * Hàng tuần
  * Hàng tháng
* Thời gian thực hiện
* Ngày thực hiện (đối với chu kỳ tuần/tháng)
* Múi giờ

### Chính sách lưu giữ

* Thời gian lưu giữ bản sao lưu (ngày)
* Số lượng bản sao lưu tối đa được giữ lại
* Tự động xóa các bản sao lưu hết thời gian lưu giữ

---

## Thông tin trạng thái

Hiển thị thông tin:

* Trạng thái chính sách (Đang hoạt động/Dừng)
* Thời gian sao lưu gần nhất
* Kết quả sao lưu gần nhất
* Thời gian dự kiến thực hiện lần tiếp theo

---

## Chức năng

* Lưu chính sách
* Khôi phục cấu hình mặc định
* Bật/Tắt chính sách sao lưu

---

## Quy tắc xử lý

* Khi chính sách được kích hoạt, hệ thống tự động thực hiện sao lưu theo lịch đã cấu hình.
* Hệ thống chỉ sao lưu các đối tượng được lựa chọn trong chính sách.
* Sau mỗi lần sao lưu thành công, hệ thống cập nhật thời gian và trạng thái thực hiện gần nhất.
* Khi số lượng hoặc thời gian lưu giữ bản sao lưu vượt quá chính sách đã thiết lập, hệ thống tự động xóa các bản sao lưu cũ theo quy tắc cấu hình.
* Trường hợp sao lưu thất bại, hệ thống ghi nhận nhật ký sự kiện và cập nhật trạng thái thực hiện để phục vụ quản trị và kiểm tra.

---

Thiết kế này đáp ứng đầy đủ **6.1.a** (có giao diện thiết lập chính sách) và **6.1.b** (hệ thống tự động thực hiện sao lưu theo chính sách), đồng thời không đưa thêm các tính năng ngoài phạm vi yêu cầu của QĐ 742.
