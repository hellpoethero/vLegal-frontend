Mình sẽ thiết kế theo hướng **đơn giản, dễ mở rộng**, đúng với mô hình RBAC mà bạn đang xây dựng. Hiện tại chỉ quản lý **Group → Permission → User**, chưa có phân quyền đến từng đối tượng.

---

# 1. Permission Management (System Admin)

## Mục đích

Quản lý danh sách Permission của toàn hệ thống. Đây là dữ liệu hệ thống (Master Data), chỉ System Admin mới được truy cập.

Permission được định nghĩa theo cặp:

* Resource
* Action

Ví dụ:

| Resource   | Action |
| ---------- | ------ |
| Connection | View   |
| Connection | Use    |
| Connection | Manage |
| Pipeline   | View   |
| Experiment | Manage |

Permission không được tạo từ Workspace.

---

## Màn hình

Hiển thị dạng bảng.

Các cột:

* Code
* Resource
* Action
* Display Name
* Description

Ví dụ

| Code              | Resource   | Action | Display Name      |
| ----------------- | ---------- | ------ | ----------------- |
| CONNECTION_VIEW   | Connection | View   | View Connection   |
| CONNECTION_USE    | Connection | Use    | Use Connection    |
| CONNECTION_MANAGE | Connection | Manage | Manage Connection |

Có các chức năng:

* Tìm kiếm theo Code
* Lọc theo Resource
* Thêm Permission
* Chỉnh sửa Permission
* Xóa Permission (nếu không được sử dụng)

Không cho phép sửa Code sau khi tạo.

---

# 2. Workspace Group Management (Workspace Admin)

## Mục đích

Quản lý các nhóm người dùng trong Workspace.

Group được sử dụng để gom người dùng và gán Permission.

---

## Danh sách Group

Hiển thị bảng.

Các cột

* Name
* Description
* Number of Users
* Created At

Toolbar

* Create Group

Mỗi dòng

* Edit
* Delete

Không cho phép xóa nếu còn User thuộc Group.

---

## Tạo / Chỉnh sửa Group

Thông tin

* Group Name
* Description

Không cần cấu hình Permission tại popup này.

Sau khi tạo sẽ chuyển sang màn hình Permission.

---

# 3. Group Permission Management (Workspace Admin)

## Mục đích

Gán Permission cho từng Group.

Đây là nơi Workspace Admin xây dựng chính sách phân quyền.

---

## Giao diện

Bên trái

Danh sách Group

```text
Groups

○ Data Scientist

○ Data Engineer

○ Viewer

○ MLOps
```

Bên phải

Danh sách Permission.

Hiển thị theo Resource.

Ví dụ

```text
Connection

☑ View

☑ Use

☐ Manage

------------------

Pipeline

☑ View

☑ Use

☑ Manage

------------------

Experiment

☑ View

☐ Use

☐ Manage

------------------

Catalog

☑ View

☑ Use

☐ Manage
```

Permission được nhóm theo Resource.

Mỗi Resource có 3 quyền

* View
* Use
* Manage

Workspace Admin có thể tick hoặc bỏ tick.

Có nút

* Save

Lưu toàn bộ Permission của Group.

---

# 4. Workspace User Group Management (Workspace Admin)

## Mục đích

Gán User vào Group.

Một User có thể thuộc nhiều Group.

Permission cuối cùng là hợp của tất cả Permission từ các Group.

---

## Danh sách User

Hiển thị

| Username | Full Name | Groups |

Ví dụ

| minh | Nguyễn Minh | Data Scientist, MLOps |

Có nút

Assign Group

---

## Popup Assign Group

Thông tin User

```text
Username

Full Name
```

Danh sách Group

```text
☑ Data Scientist

☐ Data Engineer

☑ Viewer

☐ MLOps
```

Cho phép chọn nhiều Group.

Bấm Save để cập nhật.

---

# Quy tắc hiển thị

Workspace Admin luôn có toàn quyền.

Do đó:

* Không cần gán Group.
* Không xuất hiện trong màn hình Assign Group.

System Admin và Tenant Admin cũng không tham gia phân quyền Workspace.

Chỉ User mới được gán Group.

---

# Luồng sử dụng

```text
Workspace Admin

↓

Tạo Group

↓

Gán Permission cho Group

↓

Thêm User vào Group

↓

User đăng nhập

↓

Backend tổng hợp Permission từ tất cả Group

↓

Ẩn/Hiện chức năng và kiểm tra quyền API
```

---

# Phạm vi phiên bản đầu

Phiên bản hiện tại **không hỗ trợ phân quyền đến từng đối tượng** (ví dụ từng Connection, Notebook, Pipeline...). Permission chỉ được áp dụng ở **mức tính năng (Feature Level)**.

Ba mức quyền được định nghĩa thống nhất cho mọi loại tài nguyên:

* **View**: Người dùng được truy cập và xem tính năng.
* **Use**: Người dùng được thực hiện các nghiệp vụ thông thường trong tính năng (bao gồm tạo mới và thao tác trên các đối tượng do chính mình sở hữu theo quy tắc của backend).
* **Manage**: Người dùng được quản trị toàn bộ dữ liệu của tính năng trong phạm vi Workspace, bao gồm cả các đối tượng của người dùng khác.

Thiết kế này nhằm giữ hệ thống phân quyền đơn giản, đáp ứng yêu cầu quản trị hiện tại và tạo nền tảng để sau này mở rộng sang phân quyền theo từng đối tượng (ACL) mà không cần thay đổi mô hình Group–Permission hiện có.
