Theo mình thì **màn hình này nên là trung tâm của toàn bộ phần ML**. Nó tương đương với trang **Run Detail** của MLflow hay **Model Version** của Weights & Biases.

Mình sẽ thiết kế theo các section như sau.

---

# 1. Header

Thông tin chung

```
Model Artifact

Tên:
XGBoost Classifier v3

Run:
Experiment Run #24

Experiment:
Customer Churn

Usecase:
Churn Prediction

Version:
v3

Status:
Completed

Created:
2026-07-23 10:21

Duration:
12m 15s

Algorithm:
XGBoost

Framework:
xgboost 3.0

Artifact URI:
minio://...
```

Góc phải

```
Deploy

Download

Register

Delete

Compare
```

---

# 2. KPI Cards

Ngay dưới Header là các metric quan trọng.

Ví dụ Classification

```
Accuracy      0.954

Precision     0.948

Recall        0.943

F1            0.945

AUC           0.982

LogLoss       0.124
```

Regression

```
RMSE

MAE

MAPE

R²

Explained Variance
```

Forecast

```
MAPE

sMAPE

MASE

RMSE
```

Đây là thứ người dùng nhìn đầu tiên.

---

# 3. Training Information

Thông tin train

```
Dataset

Training rows

Validation rows

Test rows

Feature count

Target

Random seed

Train time

CPU

GPU

Memory
```

Có thể hiện luôn

```
Train: 70%

Validation: 15%

Test: 15%
```

---

# 4. Hyper Parameters

Dạng table

```
learning_rate

max_depth

n_estimators

subsample

...

```

Có nút

```
Expand JSON
```

---

# 5. Evaluation

Đây là phần lớn nhất.

Tùy từng problem type.

---

## Classification

### Training Curve

```
Loss
```

Line chart

---

```
Accuracy
```

Line chart

---

### Confusion Matrix

```
      Predict

      A B C

A

B

C
```

---

### ROC Curve

---

### Precision Recall Curve

---

### Class Distribution

Bar chart

---

### Feature Importance

Bar chart

---

### Classification Report

```
             Precision Recall F1

Cat

Dog

Bird

Macro Avg

Weighted Avg
```

---

## Regression

Line

```
Loss
```

---

Scatter

```
Prediction vs Actual
```

---

Residual Plot

---

Error Histogram

---

Feature Importance

---

## Forecast

```
Actual vs Forecast
```

Line

---

Forecast Error

---

Residual

---

Seasonal Error

---

## Clustering

PCA

---

UMAP

---

Silhouette

---

Cluster Distribution

---

# 6. Sample Prediction

Cực kỳ quan trọng.

Classification

```
Sample

Prediction

Ground Truth

Probability
```

Ví dụ

| Text | Predict  | Actual   | Prob |
| ---- | -------- | -------- | ---- |
| ...  | Positive | Positive | 98%  |

---

Object Detection

Ảnh

Bounding Box

---

Segmentation

Ảnh

Mask

Prediction

---

Forecast

```
Date

Actual

Forecast
```

---

# 7. Explainability

Nếu model hỗ trợ.

```
Feature Importance

Permutation Importance

SHAP Summary

SHAP Waterfall

Partial Dependence
```

---

# 8. Artifact

Danh sách file.

```
model.pkl

metrics.json

loss.json

roc.json

confusion.json

requirements.txt

conda.yaml

predict.py

feature_importance.png
```

Download.

---

# 9. Environment

```
Python

Framework

CUDA

OS

Package Version
```

Ví dụ

```
Python 3.12

xgboost 3.0

numpy 2.0

pandas 3.0
```

---

# 10. Log

Nếu notebook ghi log.

```
Epoch 1

Epoch 2

Epoch 3

...
```

---

# 11. Metadata

```
Tags

Description

Created By

Workspace

Experiment

Run

Version

Registered Model
```

---

# 12. Compare

Có nút

```
Compare with...
```

Sau đó chọn

```
Model A

Model B

Model C
```

So sánh

* Metrics
* Hyperparameter
* Training Curve
* Feature Importance

---

# Bố cục UI

```
---------------------------------------------------------
Header
---------------------------------------------------------

 KPI KPI KPI KPI KPI KPI

---------------------------------------------------------
Training Information
---------------------------------------------------------

Hyper Parameters

---------------------------------------------------------
Evaluation
---------------------------------------------------------

Loss

Accuracy

ROC

PR

Confusion Matrix

Feature Importance

---------------------------------------------------------
Sample Prediction
---------------------------------------------------------

---------------------------------------------------------
Explainability
---------------------------------------------------------

---------------------------------------------------------
Artifacts
---------------------------------------------------------

---------------------------------------------------------
Environment
---------------------------------------------------------

---------------------------------------------------------
Metadata
---------------------------------------------------------
```

## Một điểm mình sẽ bổ sung cho vMLP

Thay vì hard-code từng loại biểu đồ, mình sẽ thiết kế **màn hình theo cơ chế plugin**. Mỗi `model_artifact` sẽ trả về một danh sách các **evaluation widgets** mà frontend chỉ việc render theo `type`.

Ví dụ:

```json
{
  "summary_metrics": {...},
  "sections": [
    {
      "title": "Training Curves",
      "widgets": [
        { "type": "line_chart", "artifact": "loss.json" },
        { "type": "line_chart", "artifact": "accuracy.json" }
      ]
    },
    {
      "title": "Evaluation",
      "widgets": [
        { "type": "confusion_matrix", "artifact": "confusion.json" },
        { "type": "roc_curve", "artifact": "roc.json" },
        { "type": "pr_curve", "artifact": "pr.json" }
      ]
    },
    {
      "title": "Explainability",
      "widgets": [
        { "type": "feature_importance", "artifact": "feature_importance.json" },
        { "type": "shap_summary", "artifact": "shap_summary.png" }
      ]
    }
  ]
}
```

Như vậy, khi sau này thêm các loại bài toán mới (LLM, recommendation, anomaly detection...) hoặc thêm một biểu đồ mới (Calibration Curve, Lift Chart, Embedding UMAP...), bạn chỉ cần bổ sung một widget renderer mới mà không phải sửa cấu trúc màn hình. Đây là cách mở rộng tốt hơn nhiều so với việc thiết kế UI cố định cho từng loại mô hình.
