# Sinh giao diện Data Ingestion Module

## 1. Mục tiêu

Sinh giao diện frontend cho chức năng Data Ingestion.

Module gồm:

```text
Data Connections
Workspace Storage
Ingestion Jobs
Ingestion Runs
```

Framework:

```text
Angular
PrimeNG
Tailwind
Signal
TypeScript
```

Không dùng:

```text
BehaviorSubject
ReplaySubject
Subject
```

Sử dụng:

```text
signal
computed
effect
async pipe
```

API gọi bằng:

```text
await
```

Không subscribe thủ công.

Đọc:

```text
instructions/*
llm-full.txt
```

trước khi code.

---

# 2. Cấu trúc thư mục

Sinh:

```text
app/

├── features/
│
│   ├── data-connections/
│   │   ├── pages/
│   │   └── components/
│   │
│   ├── workspace-storage/
│   │   ├── pages/
│   │   └── components/
│   │
│   ├── ingestion-jobs/
│   │   ├── pages/
│   │   └── components/
│   │
│   └── ingestion-runs/
│       ├── pages/
│       └── components/
│
├── services/
│
│   ├── data-connection/
│   ├── workspace-storage/
│   ├── ingestion-job/
│   └── ingestion-run/
│
├── models/
│
│   ├── data-connection/
│   ├── workspace-storage/
│   ├── ingestion-job/
│   └── ingestion-run/
│
├── shared/
│
├── layout/
│
├── utils/
│
└── app.routes.ts
```

Quy tắc:

* Không đặt `models` trong feature.
* Không đặt `services` trong feature.
* Không đặt `routes.ts` trong feature nếu chỉ có ít route.
* Khai báo toàn bộ route tại `app.routes.ts`.
* Feature chỉ chứa:

  * pages
  * components
* Không đặt toàn bộ component vào pages.

---

# 3. Shared Components

Sinh:

```text
app/shared/components/
```

Tạo:

```text
page-header
table-toolbar
status-chip
confirm-delete
empty-state
filter-panel
key-value-view
```

Mục đích:

* tái sử dụng
* giảm lặp code

---

# 4. Models

Sinh:

```text
app/models/
```

Tổ chức:

```text
app/models/

├── data-connection/
├── workspace-storage/
├── ingestion-job/
└── ingestion-run/
```

Khai báo:

## data-connection/data-connection.model.ts

```ts
interface DataConnection
```

Map đúng API.

---

## workspace-storage/workspace-storage.model.ts

```ts
interface WorkspaceStorage
```

---

## ingestion-job/ingestion-job.model.ts

```ts
interface IngestionJob
```

---

## ingestion-run/ingestion-run.model.ts

```ts
interface IngestionRun
```

---

Tạo thêm:

```text
filter model
request model
response model
```

Ví dụ:

```text
data-connection/

data-connection.model.ts
data-connection-filter.model.ts
data-connection-request.model.ts
data-connection-response.model.ts
```

Không dùng any.

---

# 5. Services

Sinh:

```text
app/services/
```

Tổ chức:

```text
app/services/

├── data-connection/
│   └── data-connection.service.ts
│
├── workspace-storage/
│   └── workspace-storage.service.ts
│
├── ingestion-job/
│   └── ingestion-job.service.ts
│
└── ingestion-run/
    └── ingestion-run.service.ts
```

Dùng:

```text
inject(HttpClient)
```

API:

```text
GET /get/{id}

GET /get_all

POST /create

PUT /update/{id}

DELETE /delete/{id}

POST /filter
```

Rule:

* dùng await
* trả Promise
* không giữ state
* service chỉ gọi API
* không chứa signal

Ví dụ:

```ts
await service.getAll()
```

---

# 6. Layout

Sửa:

```text
app/layout/
```

Thêm menu.

Menu:

```text
Data
 ├── Connections
 ├── Ingestion Jobs

Admin
 └── Workspace Storage
```

Route:

```text
/data/connections

/data/ingestion

/admin/storage
```

Không sửa layout khác.

---

# 7. Data Connections

Folder:

```text
features/data-connections
```

Page gọi service trực tiếp.

Import:

```text
app/services/data-connection
app/models/data-connection
```

State cục bộ dùng signal trong page.

---

## Pages

### connection-list-page

Hiển thị:

```text
header
toolbar
table
```

Không chứa business phức tạp.

Signal:

```ts
connections
loading
filter
selected
```

---

### connection-detail-page

Dùng cho:

```text
create
edit
view
```

---

## Components

### connection-table

PrimeNG:

```text
p-table
```

Cột:

```text
name
type
last_tested
status
actions
```

---

### connection-filter

PrimeNG:

```text
sidebar
dropdown
input
```

Filter:

```text
keyword
type
status
```

---

### connection-form

Dynamic form.

Theo:

```text
connection_type
```

Ví dụ:

POSTGRES

```text
host
port
database
```

RTSP

```text
url
fps
```

Không render JSON editor.

---

### connection-test-button

Button riêng.

Gọi:

```text
test connection
```

---

# 8. Workspace Storage

Folder:

```text
features/workspace-storage
```

Chỉ đọc.

Import:

```text
app/services/workspace-storage
app/models/workspace-storage
```

---

Page:

```text
storage-page
```

Component:

```text
storage-table

storage-detail
```

Hiển thị:

```text
role

type

managed

config
```

Không có edit.

Không có create.

---

# 9. Ingestion Jobs

Folder:

```text
features/ingestion-jobs
```

Import:

```text
app/services/ingestion-job
app/models/ingestion-job
```

---

Pages

```text
job-list-page

job-detail-page

job-create-page
```

---

## job-table

PrimeNG:

```text
table
menu
chip
```

Cột:

```text
name

source

target

mode

latest_run
```

Actions:

```text
run

edit

delete
```

---

## job-create-page

Wizard.

PrimeNG:

```text
stepper
```

Bước:

```text
1 General

2 Source

3 Target

4 Runtime
```

---

Step 1

```text
name

description

mode
```

---

Step 2

```text
source type
```

Choice:

```text
External Connection

Internal Storage
```

Nếu external:

load connection.

Nếu internal:

load workspace storage.

---

Step 3

Target tương tự.

---

Step 4

```text
schedule

retry

timeout
```

Summary.

---

Components:

```text
job-general

job-source

job-target

job-runtime

job-summary
```

Mỗi step 1 component.

Signal trong page:

```ts
currentStep

draft

loading
```

Không giữ state trong component con.

---

# 10. Ingestion Runs

Folder:

```text
features/ingestion-runs
```

Import:

```text
app/services/ingestion-run
app/models/ingestion-run
```

---

Pages:

```text
run-list-page

run-detail-page
```

---

run-table

PrimeNG:

```text
table
tag
```

Cột:

```text
run

status

start

duration
```

---

run-detail

Sections:

```text
overview

metrics

runtime

logs

error
```

Tabs.

PrimeNG:

```text
tabview
```

---

# 11. Routes

Sửa:

```text
app.routes.ts
```

Khai báo:

```text
data/connections

data/connections/:id

data/ingestion

data/ingestion/create

data/ingestion/:id

data/runs/:id

admin/storage
```

Không tạo route file riêng trong feature.

Có thể lazy load page nếu cần.

---

# 12. UI Rules

Bắt buộc:

* PrimeNG theme
* Tailwind spacing
* Không CSS global
* Không inline style
* Không any
* Không Observable state
* Không business trong component
* Không gọi API trực tiếp trong component con

Luồng:

```text
page
↓
service
↓
api
```

Signal chỉ dùng để giữ state UI trong page.

Service không giữ state.

---

# 13. Loading + Error

Dùng:

```text
Skeleton
Toast
ConfirmDialog
```

Loading bằng signal.

Error hiển thị:

```text
toast
```

Không alert.

---

# 14. Response Mapping

API:

```json
{
  "data_connection": {}
}
```

Map:

```ts
res.data_connection
```

Không bind raw response.
