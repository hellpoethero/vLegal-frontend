# Feature: Data Catalog

## Mục tiêu

Xây dựng màn hình **Data Catalog** cho phép người dùng duyệt metadata của các nguồn dữ liệu trong workspace.

Màn hình này không dùng để quản lý Connection mà dùng để **browse metadata**, xem cấu trúc dữ liệu và bổ sung mô tả (Description) cho từng object.

---

# Layout

Màn hình chia thành 2 panel.

```text
+----------------------------------------------------------------------------------+
| Search............................................... [Refresh] [Sync]           |
+-------------------------------+--------------------------------------------------+
|                               |                                                  |
| Catalog Explorer              | Data Browser                                     |
|                               |                                                  |
| ▼ PostgreSQL                  | public                                           |
|   ▼ sales                     |--------------------------------------------------|
|      public                   | 📋 orders                                        |
|      analytics                | 📋 customers                                     |
|                               | 📋 products                                      |
| ▼ MinIO                       |                                                  |
|   raw                         |                                                  |
|                               |                                                  |
| ▼ Workspace Storage           |                                                  |
|   workspace                   |                                                  |
+-------------------------------+--------------------------------------------------+
```

---

# Left Panel - Catalog Explorer

## Mục đích

Chỉ dùng để chọn "điểm bắt đầu" của metadata.

Không hiển thị toàn bộ cây.

Sidebar chỉ hiển thị đến cấp ổn định của từng datasource.

Ví dụ

PostgreSQL

```text
PostgreSQL
└── sales
    ├── public
    ├── analytics
    └── audit
```

MySQL

```text
MySQL
└── ecommerce
```

MinIO

```text
MinIO
└── raw
```

Workspace Storage

```text
Workspace Storage
└── workspace
```

Không render table, file hoặc folder ở sidebar.

---

## Expand

Connection có thể expand/collapse.

Database cũng có thể expand nếu datasource hỗ trợ.

Schema chỉ cần click để mở.

---

## Click

Khi click một node trong sidebar.

Ví dụ

```text
public
```

Panel bên phải sẽ load toàn bộ children của node đó.

---

# Right Panel - Data Browser

Hiển thị danh sách children của node đang chọn.

Ví dụ

Click schema

```text
public
```

Hiện

```text
orders
customers
products
```

Click folder

```text
customer
```

Hiện

```text
2024
2025
```

Click folder

```text
2025
```

Hiện

```text
order.parquet
customer.parquet
```

Không hiển thị dạng Tree.

Chỉ hiển thị danh sách.

---

# Header

Hiển thị breadcrumb.

Ví dụ

```text
PostgreSQL / sales / public
```

Hoặc

```text
MinIO / raw / customer / 2025
```

Breadcrumb cho phép click để quay lại.

---

# Data Browser Columns

Hiển thị dạng Table.

Các cột

| Column      | Description                                  |
| ----------- | -------------------------------------------- |
| Icon        | Icon theo loại object                        |
| Name        | Tên object                                   |
| Type        | Database / Schema / Table / Folder / File... |
| Description | Mô tả                                        |
| Status      | ACTIVE / DELETED                             |

---

# Icon

Database

🗄

Schema

📂

Table

📋

View

👁

Bucket

🪣

Folder

📁

File

📄

---

# Double Click

Nếu object có children.

Ví dụ

Schema

Folder

Database

Bucket

Double click sẽ đi vào object đó.

Panel bên phải load children.

Breadcrumb cập nhật.

---

# Leaf Object

Nếu object không có children.

Ví dụ

Table

File

Double click không điều hướng.

Chỉ mở Detail Drawer.

---

# Detail Drawer

Click một row sẽ mở panel bên phải (Drawer).

Hiển thị

```
Name

Type

Path

Description

Metadata
```

Metadata hiển thị dạng JSON readonly.

---

# Edit Description

Description có thể chỉnh sửa.

Có nút

```
Save
```

Chỉ update trường Description.

Không cho phép sửa

* Name
* Type
* Path
* Metadata

---

# Search

Thanh Search ở trên.

Search trong datasource hiện tại.

Search theo

* name
* display_name
* path

Không search toàn workspace.

---

# Refresh

Refresh node hiện tại.

Gọi lại API lấy children.

Không thực hiện sync datasource.

---

# Sync

Sync datasource đang chọn.

Ví dụ đang duyệt

```
PostgreSQL / sales / public
```

Sync sẽ sync toàn bộ Connection PostgreSQL.

Sau khi sync thành công.

Reload sidebar.

Reload node hiện tại.

---

# Deleted Object

Nếu object có status

```
DELETED
```

Hiển thị

* Icon màu xám
* Text màu xám
* Badge "Deleted"

Không ẩn.

---

# Navigation

Ví dụ

```
Sidebar

PostgreSQL
└── sales
    └── public
```

↓

Right

```
orders
customers
products
```

↓

Double click

```
orders
```

↓

Open Detail Drawer.

---

Ví dụ

```
Sidebar

MinIO
└── raw
```

↓

Right

```
customer
backup
```

↓

Double click

```
customer
```

↓

Right

```
2024
2025
```

↓

Double click

```
2025
```

↓

Right

```
order.parquet
customer.parquet
```

---

# UX Requirements

* Sidebar chỉ hiển thị đến cấp ổn định của từng datasource (Schema đối với PostgreSQL, Bucket đối với Object Storage, Root Folder đối với Workspace Storage...).
* Panel bên phải luôn hiển thị **children** của node đang chọn.
* Điều hướng sử dụng breadcrumb và double-click.
* Detail Drawer chỉ dùng để xem metadata và chỉnh sửa Description.
* Không cho phép chỉnh sửa metadata khác trên màn hình này.
* Giao diện cần hỗ trợ lazy loading và không render toàn bộ cây metadata cùng lúc để đảm bảo hiệu năng với datasource lớn.
