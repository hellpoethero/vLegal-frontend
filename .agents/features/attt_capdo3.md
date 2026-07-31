# Màn hình 1 – Thiết lập chính sách mật khẩu

## Mục đích

Cho phép System Admin cấu hình chính sách mật khẩu áp dụng cho toàn bộ nền tảng.

## Đường dẫn

Security → Authentication → Password Policy

## Quyền truy cập

* System Admin: xem/chỉnh sửa
* Tenant Admin: chỉ xem (nếu được cho phép)

## Thành phần giao diện

### Khu vực: Chính sách đổi mật khẩu

| Trường                      | Kiểu   | Bắt buộc | Mô tả                                                             |
| --------------------------- | ------ | -------- | ----------------------------------------------------------------- |
| force_change_first_login    | Switch | Có       | Yêu cầu đổi mật khẩu khi đăng nhập lần đầu bằng mật khẩu mặc định |
| password_expiration_enabled | Switch | Có       | Bật cơ chế hết hạn mật khẩu                                       |
| password_expiration_days    | Number | Khi bật  | Số ngày mật khẩu còn hiệu lực                                     |

### Khu vực: Quy tắc mật khẩu

| Trường                    | Kiểu     |
| ------------------------- | -------- |
| min_length                | Number   |
| require_uppercase         | Checkbox |
| require_lowercase         | Checkbox |
| require_number            | Checkbox |
| require_special_character | Checkbox |
| password_history          | Number   |

Ràng buộc:

* min_length ≥ 8
* password_history ≥ 0

### Khu vực: Chu kỳ thay đổi

| Trường                 | Kiểu   |
| ---------------------- | ------ |
| password_rotation_days | Number |

Ý nghĩa:

* Sau X ngày hệ thống yêu cầu đổi mật khẩu.

## Hành vi

### Lưu cấu hình

Khi nhấn Save:

* Validate dữ liệu.
* Gọi API cập nhật policy.
* Hiển thị thông báo thành công.

### Khi người dùng đăng nhập

IF:

* force_change_first_login = true
* user.is_first_login = true

THEN:
→ chuyển sang màn Change Password.

### Khi mật khẩu hết hạn

IF:

* now > password_expired_at

THEN:

* chặn truy cập hệ thống
* chuyển sang màn Change Password

### Sau đổi mật khẩu thành công

THEN:

* reset trạng thái expired
* mở quyền đăng nhập

## API

GET /security/password-policy

Response:
{
"force_change_first_login": true,
"min_length": 12,
"require_uppercase": true,
"require_lowercase": true,
"require_number": true,
"require_special_character": true,
"password_rotation_days": 90,
"password_expiration_days": 90,
"password_history": 5
}

PUT /security/password-policy

## Mapping Keycloak

force_change_first_login
→ required actions

password rules
→ passwordPolicy

expiration
→ password expiration policy


# Màn hình 2 – Thiết lập chính sách đăng nhập

## Mục đích

Cho phép cấu hình giới hạn đăng nhập và cơ chế bảo vệ tài khoản.

## Đường dẫn

Security → Authentication → Login Policy

## Quyền truy cập

* System Admin

## Thành phần giao diện

### Khu vực: Giới hạn đăng nhập

| Trường                 | Kiểu   |
| ---------------------- | ------ |
| max_failed_attempts    | Number |
| failure_window_minutes | Number |
| lock_duration_minutes  | Number |

Ý nghĩa:

* Trong khoảng thời gian cấu hình, nếu vượt quá số lần thất bại → xử lý khóa.

### Khu vực: Chính sách xử lý vi phạm

| Trường               | Kiểu   |
| -------------------- | ------ |
| enable_warning       | Switch |
| disable_auto_login   | Switch |
| auto_disable_account | Switch |

### Khu vực: Cảnh báo

| Trường          | Kiểu |
| --------------- | ---- |
| warning_message | Text |

## Hành vi

Khi đăng nhập thất bại:

* tăng failed_count

Nếu:
failed_count ≥ max_failed_attempts

THEN:

* hiển thị cảnh báo
* vô hiệu hóa đăng nhập tự động
* khóa tài khoản nếu cấu hình bật

Sau khi hết thời gian khóa:

* tự mở khóa
  hoặc
* chờ admin mở khóa

## API

GET /security/login-policy

PUT /security/login-policy

## Mapping Keycloak

failed attempts
→ brute force detection

lock duration
→ temporary lock

disable login
→ disable account

# Màn hình 3 – Thiết lập MFA


## Màn hình 3 – MFA

### Mục đích

Quản lý xác thực đa yếu tố và phiên quản trị.

### Đường dẫn

Security → MFA

### Thành phần giao diện

#### Chính sách MFA

| Trường   | Kiểu                      |
| -------- | ------------------------- |
| enabled  | Switch                    |
| mode     | Select(required/optional) |
| apply_to | Multi Select              |

apply_to:

* platform_admin
* tenant_admin
* all_users

#### Chính sách phiên quản trị

| Trường                         | Kiểu   |
| ------------------------------ | ------ |
| admin_session_duration_minutes | Number |
| require_reauthentication       | Switch |
| reauth_interval_minutes        | Number |

### Hành vi

Khi thao tác quản trị:
IF thời gian vượt ngưỡng

THEN:
→ yêu cầu MFA lại

## API

GET /security/mfa-policy

PUT /security/mfa-policy

---
# Màn hình 4 – Quản lý chính sách truy cập

## Màn hình 4 – Chính sách truy cập

### Mục đích

Quản lý timeout phiên và giới hạn mạng truy cập quản trị.

### Đường dẫn

Security → Access Policy

### Thành phần giao diện

#### Session Timeout

| Trường               | Kiểu   |
| -------------------- | ------ |
| idle_timeout_minutes | Number |
| force_logout         | Switch |

Hành vi:
Nếu không có request trong khoảng timeout:

* kết thúc phiên
* chuyển về màn login

#### Giới hạn địa chỉ quản trị

Danh sách bảng:

| Network | Type | Status |
| ------- | ---- | ------ |

Form thêm mới:

| Trường       | Kiểu            |
| ------------ | --------------- |
| network_type | Select(ip/cidr) |
| value        | Text            |
| description  | Text            |

Hành động:

* Add
* Edit
* Delete

### Hành vi

Khi truy cập:

IF client_ip ∉ whitelist

THEN:

* trả về Access Denied
* ghi audit log

## API

GET /security/access-policy

PUT /security/access-policy

GET /security/admin-networks

POST /security/admin-networks

DELETE /security/admin-networks/{id}

## Mapping Keycloak

session timeout
→ realm session config

network restriction
→ VMLP gateway / backend middleware
