# Feature: Resource Management Frontend (Angular + PrimeNG)

## Mục tiêu

Phát triển giao diện frontend cho tính năng quản lý tài nguyên của VMLP.

Frontend gọi API đã có sẵn.

Stack:

* Angular
* PrimeNG
* Service sử dụng async/await (Promise)
* Component-based architecture
* Tách component phức tạp thành component con
* Không nhồi toàn bộ logic vào một màn hình
* Sử dụng Input / Output để giao tiếp component
* Tuân thủ format tương tự các màn hình hiện có:

  * Workspace Management
  * Workspace User Management

Không dùng ngrx.

---

# Cấu trúc thư mục

Tách riêng phần quản lý tài nguyên hệ thống (`resource`) và phần cấu hình tài nguyên theo workspace (`workspace-resource`) để dễ bảo trì và phân quyền.

```text
app/

features/

    resource/

        pages/

            resource-node-list/

            resource-group-list/

        components/

            resource-node-form/

            resource-group-form/

            resource-group-node-selector/

        dialogs/

            assign-node-dialog/

            resource-group-dialog/

    workspace-resource/

        pages/

            workspace-resource-config/

        components/

            workspace-resource-group-list/

            workspace-job-profile-list/

            workspace-job-profile-form/

        dialogs/

            job-profile-dialog/

services/

    resource.service.ts

    workspace-resource.service.ts

models/

    resource.model.ts

    workspace-resource.model.ts
```

---

# Data Model

## resource/resource.model.ts

```ts
export interface ResourceNode {
    id: string;

    nodeName: string;

    clusterName: string;

    description?: string;

    enabled: boolean;
}

export interface ResourceGroup {
    id: string;

    code: string;

    name: string;

    description?: string;

    serviceType: string;

    enabled: boolean;

    nodes?: ResourceNode[];
}

export interface ResourceGroupNode {
    id: string;

    resourceGroupId: string;

    resourceNodeId: string;
}
```

---

## workspace-resource/workspace-resource.model.ts

```ts
export interface WorkspaceResourceGroup {

    id: string;

    workspaceId: string;

    resourceGroupId: string;

    resourceGroupName: string;

    maxCpu?: number;

    maxMemory?: number;

    maxGpu?: number;

    maxParallelJobs?: number;

    enabled: boolean;
}

export interface WorkspaceJobProfile {

    id: string;

    workspaceResourceGroupId: string;

    code: string;

    name: string;

    cpuRequest?: number;

    cpuLimit?: number;

    memoryRequest?: number;

    memoryLimit?: number;

    gpuLimit?: number;

    maxConcurrent?: number;

    enabled: boolean;
}
```

---

# Service Rule

Service chỉ:

* gọi API
* map request

Không xử lý UI.

Dùng Promise.

Ví dụ:

```ts
async getResourceGroups(): Promise<ResourceGroup[]> {

}
```

Không dùng Observable ở component.

Component:

```ts
await service.load();
```

---

# 1. Resource Node Management

Route:

```text
/admin/resource/nodes
```

Permission:

```text
TENANT_ADMIN
```

Page:

```text
resource-node-list
```

Hiển thị:

* Table
* Search
* Create
* Edit
* Enable / Disable

PrimeNG:

```text
p-table

p-dialog

p-inputText

p-inputSwitch
```

Tách:

```text
resource-node-form
```

Input:

```ts
@Input()
model
```

Output:

```ts
@Output()
saved
```

---

# 2. Resource Group Management

Route:

```text
/admin/resource/groups
```

Permission:

```text
TENANT_ADMIN
```

Page:

```text
resource-group-list
```

Table:

* code
* name
* service type
* enabled

Action:

* create
* edit
* assign node

Dialog:

```text
resource-group-dialog
```

Node assignment:

```text
assign-node-dialog
```

UI:

Left:
available nodes

Right:
selected nodes

PrimeNG:

```text
p-pickList
```

Submit:

```text
save entire selection
```

Không call từng node.

---

# 3. Workspace Resource Configuration

Entry:

Workspace List

Action:

```text
Configure Resource
```

Route:

```text
/tenant/workspaces/:workspaceId/resources
```

Page:

```text
workspace-resource-config
```

Header:

```text
Workspace Info
```

Body:

```text
p-tabView
```

Tabs:

---

Tab 1

Resource Groups

Component:

```text
workspace-resource-group-list
```

Hiển thị:

Table

Columns:

* group
* cpu
* memory
* gpu
* parallel jobs

Actions:

* assign
* edit
* remove

Dialog:

Assign Resource Group

Fields:

```text
resource group

cpu

memory

gpu

parallel jobs
```

Permission:

```text
TENANT_ADMIN
```

Workspace Admin:

readonly

---

Tab 2

Job Profiles

Component:

```text
workspace-job-profile-list
```

Hiển thị:

Table

Columns:

* code
* name
* resource group
* cpu
* memory
* gpu

Actions:

* create
* edit
* delete

Dialog:

```text
workspace-job-profile-form
```

Fields:

```text
resource group
(required)

code

name

cpu request

cpu limit

memory request

memory limit

gpu

max concurrent
```

Rule:

Dropdown resource group:

only show resource groups assigned to workspace

Permission:

```text
TENANT_ADMIN
WORKSPACE_ADMIN
```

---

# Permission Matrix

| Feature        | Tenant Admin | Workspace Admin |
| -------------- | ------------ | --------------- |
| Manage Node    | Y            | N               |
| Manage Group   | Y            | N               |
| Assign Group   | Y            | N               |
| Create Profile | Y            | Y               |
| Edit Profile   | Y            | Y               |
| Delete Profile | Y            | Y               |

UI:

ẩn action không có quyền.

Không disable.

---

# Component Communication

Parent:

```html
<workspace-job-profile-list
    [workspaceId]="workspaceId"
    [editable]="canEdit"

    (saved)="reload()"
/>
```

Child:

```ts
@Input()
workspaceId

@Input()
editable

@Output()
saved
```

Không gọi service của component khác.

---

# Loading Convention

Sử dụng:

```text
p-progressSpinner
```

Biến:

```ts
loading=false
```

Pattern:

```ts
try {

 loading=true

 await load()

}

finally {

 loading=false

}
```

---

# Error Handling

Không xử lý lỗi ở service.

Component:

```ts
try {

}

catch {

 toast

}
```

PrimeNG:

```text
messageService
```

---

# Confirmation

Delete:

```text
confirmationService
```

---

# Reuse

Tái sử dụng:

* toolbar pattern từ workspace list
* filter pattern từ workspace user
* dialog pattern từ workspace create/edit
* permission directive hiện có

Không tạo UI pattern mới.
