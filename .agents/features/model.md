Mình thấy UI của bạn đang đi đúng hướng. Tuy nhiên mình sẽ chỉnh một chút để **luồng thao tác giống GitHub/GitLab/MLflow Registry**, tức là:

* Trang danh sách để quản lý.
* Trang chi tiết để làm việc với một model.
* Artifact và Version đều là "con" của Managed Model.

Dưới đây là đặc tả UI mình sẽ đưa cho AI Agent.

---

# 1. Màn hình Quản lý Model

**Đường dẫn**

```text
/menu/model
```

Đây là màn hình quản lý toàn bộ **Managed Model**.

---

## Header

Hiển thị:

```text
Model Management
```

Bên phải:

* Create Model

---

## Thanh tìm kiếm

Một hàng filter.

| Thành phần   | Kiểu       |
| ------------ | ---------- |
| Từ khóa      | Input      |
| Use Case     | Select     |
| Status       | Select     |
| Created By   | Select     |
| Created Time | Date Range |
| Search       | Button     |
| Reset        | Button     |

---

## Bảng Managed Model

Các cột

| Cột             | Nội dung               |
| --------------- | ---------------------- |
| Name            | Tên model              |
| Use Case        | Use Case               |
| Current Version | Version hiện tại       |
| Artifact Type   | TRAIN / UPLOAD / MIXED |
| Version Count   | số version             |
| Status          | ACTIVE / DISABLED      |
| Created By      | Người tạo              |
| Created At      | Thời gian              |
| Action          | Menu                   |

---

### Status

Status hiển thị dạng Badge.

Ví dụ

```text
🟢 ACTIVE
```

hoặc

```text
⚪ DISABLED
```

Click badge

↓

Popup

```text
Disable model?

[Cancel] [Confirm]
```

Không cần mở dialog sửa.

---

### Action

Menu

```text
View

Edit

Delete
```

---

Click vào dòng

↓

Đi vào

```text
Model Detail
```

---

# 2. Model Detail

Header

```text
Forecast North
```

Sub title

```text
Managed Model
```

Bên phải

```text
Register Artifact

Edit

Delete
```

---

# Tab 1 - Overview

Hiển thị

## Basic Information

Card

```text
Name

Description

Use Case

Current Version

Status

Created By

Created At

Updated By

Updated At
```

---

## Artifact Statistics

Card

```text
Total Artifact

Train

Upload

MLflow

HuggingFace
```

Hiển thị dạng Stat Card.

Ví dụ

```text
Total

35
```

---

## Version Statistics

```text
Current Version

Latest Version

Total Version
```

---

## Recent Activities

Table nhỏ

```text
Registered

Promoted

Disabled

...
```

---

# Tab 2 - Artifacts

Đây là tab quan trọng nhất.

---

## Summary

Hiển thị các thẻ

```text
All

Train

Upload

MLflow

HF
```

Ví dụ

```text
All (35)

Train (30)

Upload (3)

MLflow (2)
```

Click

↓

lọc.

---

## Toolbar

```text
Search

Framework

Algorithm

Artifact Type

Status

Created Time

Refresh
```

---

## Table

| Cột           | Nội dung       |
| ------------- | -------------- |
| Name          | tên artifact   |
| Source        | TRAIN / UPLOAD |
| Framework     | XGBoost        |
| Artifact Type | Pickle         |
| Metric        | Best metric    |
| Status        | READY          |
| Created At    | ...            |
| Action        | ...            |

---

Action

```text
View

Register Version

Delete
```

---

Click Row

↓

Drawer

hoặc

Artifact Detail

---

# Artifact Detail

Thông tin

```text
General

Metrics

Metadata

Tags

Experiment

Run

Artifact URI
```

Nếu source

=

TRAIN

thì hiện

```text
Experiment

Run

Algorithm
```

Nếu Upload

↓

ẩn.

---

# Tab 3 - Versions

Toolbar

```text
Register Version
```

---

Table

| Cột         | Nội dung |
| ----------- | -------- |
| Version     | v1       |
| Artifact    | CatBoost |
| Source      | TRAIN    |
| Current     | ✓        |
| Description | ...      |
| Created At  | ...      |
| Action      | ...      |

---

Action

```text
Promote

View Artifact

Delete
```

---

Current Version

Hiển thị

```text
⭐
```

---

Click Promote

↓

Dialog

```text
Promote Version

Version

v5

becomes Current Version

Cancel

Confirm
```

---

# Register Artifact Dialog

Đây là dialog mở từ

```text
Register Artifact
```

---

Step 1

Chọn Source

```text
Train

Upload

MLflow

HF
```

---

Step 2

Table

Hiển thị toàn bộ Artifact phù hợp.

Search.

Filter.

Radio chọn.

---

Step 3

```text
Version Name

Description

Set as Current
```

---

Confirm

↓

Backend

```text
Create Version

(Optional)

Set Current
```

---

# UX mình đề xuất bổ sung

## 1. Overview nên có "Current Version"

Card to.

Ví dụ

```text
Current

v5

TRAIN

CatBoost

2026-07-20
```

Để user nhìn phát biết ngay.

---

## 2. Artifact nên có Compare

Nếu chọn

2 artifact

↓

```text
Compare Metrics
```

Rất hữu ích.

---

## 3. Version nên có Timeline

Ví dụ

```text
v1

↓

v2

↓

v3(Current)
```

Người dùng sẽ hiểu lịch sử hơn là chỉ nhìn bảng.

---

## 4. Breadcrumb

```text
Model

>

Forecast North
```

---

# Mình có một góp ý về UX

Theo mình **tab Artifact mới nên là tab mặc định**, không phải Overview.

Lý do là sau khi người dùng đã tạo Managed Model, khoảng **80% thời gian họ sẽ làm việc với Artifact**:

* xem các model train mới,
* chọn artifact để đăng ký thành version,
* so sánh metrics,
* lọc theo nguồn.

Overview chủ yếu để xem thông tin một lần, còn Artifact là nơi diễn ra hầu hết thao tác hằng ngày. Vì vậy mình sẽ sắp xếp:

```text
Artifacts   |   Versions   |   Overview
```

và mở mặc định ở **Artifacts**. Điều này cũng khá giống trải nghiệm của GitHub (Code là tab đầu tiên, không phải About) hay MLflow Model Registry, nơi người dùng đi thẳng vào các version/artifact trước khi quan tâm đến metadata.
