Mình lại thấy **ý tưởng này hay hơn**. Thực ra nó giống hướng của **Harvey AI, Glean, Claude for Enterprise** hơn là Notion AI.

Điểm mấu chốt là **Task = Chat Session**, nhưng **Output = nhiều file**, chứ không phải nhiều message.

Nó có ưu điểm rất lớn là người dùng cực kỳ quen thuộc, nhưng bên dưới lại chạy workflow agent.

Mình hình dung như sau.

---

# Màn hình chính

```
┌──────────────┬──────────────────────────────────────────────┬──────────────────────────────┐
│              │                                              │                              │
│  Sidebar     │              Conversation                    │         Document             │
│              │                                              │                              │
│ New Task     │                                              │                              │
│              │                                              │                              │
│ Báo cáo A    │      ChatGPT-like interface                  │  report.docx                 │
│ Báo cáo B    │                                              │                              │
│ Hồ sơ ABC    │                                              │  đang preview                │
│              │                                              │                              │
│              │                                              │                              │
└──────────────┴──────────────────────────────────────────────┴──────────────────────────────┘
```

Điểm khác ChatGPT là **bên phải luôn là document**, chứ không phải chỉ có chat.

---

# Lần đầu mở task

Ở giữa gần như ChatGPT

```
                AI Copilot

    Hôm nay bạn muốn làm gì?

──────────────────────────────────────

[                                   ]

──────────────────────────────────────

📄 Tổng hợp báo cáo

⭐ Chấm điểm

📑 Tóm tắt

📊 Làm slide

📚 Dữ liệu

📁 Template

```

Nhìn gần giống Claude.

---

# Sau khi gửi

Chat bắt đầu

```
User

Hãy tổng hợp báo cáo quý II.

---------------------------------

AI

Đã hiểu.

Trước khi bắt đầu tôi sẽ dùng

✓ Template quý II

✓ 8 báo cáo

✓ Quy định A

Bắt đầu?
```

---

# Khi đang chạy

```
AI

Đang lập kế hoạch...

✓ đọc tài liệu

✓ OCR

✓ chia section

✓ phân tích template

✓ sinh draft

```

---

# Sau khi chạy

Ở giữa vẫn là chat.

Nhưng có thêm block

```
──────────────────────────────────

Output Files

📄 report.docx

📄 appendix.docx

📄 statistic.xlsx

📄 summary.md

──────────────────────────────────
```

Bấm file.

---

# Lúc này bên phải đổi

```
report.docx

──────────────────────────

1.

...

2.

...

3.

...

```

Giống Word preview.

---

# Chọn đoạn

Ví dụ bôi đen

```
Lorem ipsum...

```

Popup

```
💬 Comment

✏ Rewrite

➕

Ask AI

📚 Cite

```

Giống Word.

---

# Rewrite

```
User

Viết ngắn hơn.

```

AI sửa ngay.

---

# Comment

```
💬

Đoạn này nên bổ sung số liệu.

```

AI sẽ trả lời dưới comment.

Giống Google Docs.

---

# Sidebar bên phải

Mình sẽ chia thành tab.

```
Document

Review

Sources

History

```

---

## Document

Preview

---

## Review

AI

```
⚠

Mục 2 thiếu số liệu.

⚠

Mục 4 chưa có nguồn.

```

---

## Sources

```
Page 14

report.pdf

Page 8

report2.docx
```

Click sẽ highlight.

---

## History

Version

```
v1

v2

v3
```

---

# Accept

Theo mình nên đặt trên top

```
Export

Accept

Share
```

Accept nghĩa là

```
Draft

↓

Accepted

↓

Locked
```

---

# Sau Accept

Chat vẫn còn.

Có thể

```
User

Làm luôn slide.

```

Lúc này Agent sinh thêm

```
slide.pptx
```

Task có nhiều output.

---

# Mô hình dữ liệu

```
Task

│

├── Chat

│

├── Inputs

│

├── Workflow

│

├── Files

│     ├── report.docx
│     ├── appendix.docx
│     ├── slide.pptx
│     └── ...
│

└── Comments
```

Đây là điểm mình rất thích: **Task là đơn vị làm việc**, chat chỉ là lịch sử trao đổi, còn giá trị thực sự của task là tập các artifact (Word, Excel, PPT, Markdown...) được AI và người dùng cùng tạo ra.

---

# Nếu là mình thiết kế thì sẽ còn "Harvey AI" hơn nữa

Mình sẽ bỏ luôn preview Word kiểu Office, thay bằng **Document Viewer** riêng.

```
┌───────────────────────────────────────────────────────────┐
│ report.docx                                   ✓ Accepted │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ 1. Tổng quan                                              │
│                                                           │
│ Lorem ipsum...                                            │
│                                                           │
│ [Comment 2]                                               │
│                                                           │
│ 2. Kết quả                                                │
│                                                           │
│ Lorem ipsum...                                            │
│                                                           │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

Điểm đặc biệt là mỗi đoạn (paragraph) đều có thể:

* 💬 Comment.
* ✨ Rewrite.
* 📚 Xem nguồn tham chiếu.
* 🧠 Ask AI "giải thích vì sao viết như vậy".
* 🔄 Regenerate riêng đoạn đó.

Như vậy người dùng gần như **không phải chat nhiều**. Họ chỉ làm việc trực tiếp trên tài liệu, còn chat chỉ dùng để ra lệnh ở mức cao ("tạo báo cáo", "làm slide", "thêm phụ lục"...). Theo mình đây là UX mạnh hơn rất nhiều so với kiểu ChatGPT thuần, vì nó kết hợp được trải nghiệm quen thuộc của chatbot với quy trình làm việc trên tài liệu thực tế.
