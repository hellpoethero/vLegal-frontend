# Chức năng cấu hình thu nhận dữ liệu (Data Ingestion)

## 1. Mục tiêu

Cho phép người quản trị tạo và quản lý cấu hình thu nhận dữ liệu từ một nguồn dữ liệu đến một đích lưu trữ dữ liệu.

Một cấu hình thu nhận bao gồm:

* Thông tin chung.
* Một kết nối nguồn (Source Connection).
* Một kết nối đích (Target Connection).
* Một hoặc nhiều đối tượng nguồn (bảng/collection/file pattern/API endpoint).
* Cấu hình thu nhận riêng cho từng đối tượng.

Mỗi đối tượng nguồn được thực thi độc lập nhưng được nhóm dưới một cấu hình thu nhận chung.

---

# 2. Luồng giao diện

## Bước 1 – Thông tin chung

Người dùng khai báo thông tin tổng quát.

### Trường dữ liệu

| Trường       | Kiểu           | Bắt buộc |
| ------------ | -------------- | -------- |
| name         | text           | ✓        |
| description  | textarea       |          |
| workspace_id | select         | ✓        |
| timezone     | select         | ✓        |
| status       | draft / active | ✓        |

### Giá trị mặc định

* timezone: theo workspace
* status: draft

---

## Bước 2 – Chọn nguồn và đích

Người dùng chọn nơi lấy dữ liệu và nơi lưu dữ liệu.

### Source

| Trường               |
| -------------------- |
| source_connection_id |

Chỉ cho chọn connection trạng thái hoạt động.

---

### Target

| Trường               |
| -------------------- |
| target_connection_id |

Sau khi chọn:

Hệ thống tải metadata:

```text
source_capabilities
target_capabilities
source_objects
target_structure
```

Ví dụ:

```json
{
  "supports_schema": true,
  "supports_database": false,
  "supports_collection": false
}
```

---

## Bước 3 – Chọn và cấu hình đối tượng thu nhận

Màn hình chính.

Hiển thị danh sách đối tượng nguồn.

Ví dụ:

| Chọn | Schema nguồn | Bảng nguồn | Schema đích | Bảng đích | Chế độ | Incremental | Schedule |
| ---- | ------------ | ---------- | ----------- | --------- | ------ | ----------- | -------- |

Cho phép:

* chọn nhiều dòng;
* tìm kiếm;
* lọc;
* cấu hình hàng loạt;
* cấu hình riêng.

---

### 3.1 Chọn đối tượng nguồn

Người dùng chọn một hoặc nhiều đối tượng.

Ví dụ:

```text
sales.orders
sales.customer
crm.product
```

---

### 3.2 Cấu hình đích

Cho từng đối tượng:

| Trường           |
| ---------------- |
| target_namespace |
| target_object    |

Tên trường phụ thuộc loại đích:

Ví dụ:

* SQL → schema + table
* Mongo → database + collection
* Object Storage → bucket + folder

Nếu đích không hỗ trợ schema:

* ẩn trường schema.

---

### 3.3 Quy tắc đặt tên bảng đích (Naming Rule)

Hỗ trợ tự sinh tên bảng đích.

Chế độ:

#### Keep source name

Ví dụ:

```text
orders
→ orders
```

---

#### Prefix

Ví dụ:

```text
prefix = raw_

orders
→ raw_orders
```

---

#### Suffix

Ví dụ:

```text
suffix = _v2

orders
→ orders_v2
```

---

#### Pattern

Cho phép sử dụng biến.

Biến hỗ trợ:

```text
{schema}
{table}
{date}
```

Ví dụ:

```text
raw_{schema}_{table}

sales.orders
→ raw_sales_orders
```

Người dùng có thể:

* áp dụng toàn bộ;
* sửa riêng từng bảng.

Sau khi áp dụng:

* tên sinh ra vẫn cho chỉnh thủ công.

---

### 3.4 Cấu hình chế độ thu nhận

Cho từng bảng.

Giá trị:

* FULL
* INCREMENTAL
* CDC

---

Nếu chọn INCREMENTAL:

Hiển thị:

| Trường             |
| ------------------ |
| incremental_column |
| initial_value      |

Ví dụ:

```text
updated_at
modified_time
version
```

Kiểm tra:

* cột tồn tại;
* kiểu dữ liệu hợp lệ.

---

### 3.5 Cấu hình lịch chạy

Lịch chạy được cấu hình theo từng đối tượng.

Trường:

| Trường              |
| ------------------- |
| schedule_enabled    |
| schedule_type       |
| schedule_expression |

Ví dụ:

```text
cron
interval
manual
realtime
```

---

Cho phép cấu hình hàng loạt.

Ví dụ:

```text
Apply schedule

mode:
hourly

↓

Áp dụng cho toàn bộ bảng đã chọn
```

Sau đó cho phép override từng bảng.

Ví dụ:

```text
orders
→ realtime

customer
→ 30m
```

---

### 3.6 Bulk Apply

Cho phép áp dụng cấu hình chung cho nhiều bảng.

Các trường hỗ trợ:

* target namespace
* naming rule
* sync mode
* incremental column
* schedule

Sau khi áp dụng:

* không khóa chỉnh sửa từng dòng.

---

### 3.7 Kiểm tra hợp lệ

Kiểm tra realtime:

#### Trùng bảng đích

Không cho phép ingest vào bảng đã tồn tại.

Ví dụ:

```text
orders
→ raw.orders

(raw.orders tồn tại)
```

Hiển thị:

```text
Target already exists
```

Người dùng phải:

* đổi tên;
* đổi namespace.

---

#### Incremental không hợp lệ

Ví dụ:

```text
column not found
```

---

#### CDC không khả dụng

Ví dụ:

```text
CDC not supported
```

---

## Bước 4 – Xem lại

Hiển thị:

### Thông tin chung

* name
* workspace
* timezone

---

### Kết nối

* source
* target

---

### Danh sách đối tượng

| Source | Target | Mode | Schedule |

---

Thống kê:

```text
Selected objects: N
Warnings: M
Errors: K
```

Chỉ cho tạo khi không còn lỗi.

---

# 3. Mô hình dữ liệu

## ingestion

Thông tin chung.

```text
id
workspace_id

name
description

source_connection_id
target_connection_id

timezone

status

created_by
created_at
updated_at
```

---

## ingestion_task

Một bản ghi tương ứng một đối tượng nguồn.

```text
id

ingestion_id

source_namespace
source_object

target_namespace
target_object

sync_mode

schedule_enabled
schedule_type
schedule_expression

incremental_column
incremental_initial_value

enabled

created_at
updated_at
```

---

## ingestion_run

Lịch sử thực thi.

```text
id

ingestion_task_id

trigger_type

started_at
finished_at

status

rows_read
rows_written

watermark_before
watermark_after

error_message
```

---

# 4. Quy tắc nghiệp vụ

* Một ingestion chỉ có một source connection.
* Một ingestion chỉ có một target connection.
* Một ingestion có nhiều ingestion_task.
* Một ingestion_task chỉ tương ứng một đối tượng nguồn.
* Không cho phép ghi vào bảng đích đã tồn tại.
* Mỗi bảng được cấu hình chế độ đồng bộ độc lập.
* Mỗi bảng được cấu hình lịch chạy độc lập.
* Hỗ trợ áp dụng cấu hình hàng loạt nhưng luôn cho phép override từng bảng.
