# lagrange-interpolation

[lagrange-interpolation.rbq.dev](https://lagrange-interpolation.rbq.dev)

## 这是什么？

这是一个用于生成拉格朗日插值函数的 LaTeX 公式的工具，灵感来源于[知乎](https://www.zhihu.com/question/454829651/answer/1839728258)

仅需填写函数值即可生成对应的公式。支持 Web UI 和 REST API 两种使用方式

## REST API

### 请求端点

```
POST /api
```

### 请求格式

```json
{
  "points": [
    {
      "k": 0,
      "v": 1
    },
    {
      "k": 1,
      "v": 2
    },
    {
      "k": 2,
      "v": 4
    }
  ]
}
```

### 参数说明

- `points` (必需): 数据点数组
  - `k`: 输入值（x 坐标）
  - `v`: 输出值（y 坐标）

**要求**:
- 所有 `k` 值必须唯一（不能重复）
- `k` 和 `v` 都必须是有限的数字
- 至少包含一个数据点

### 响应格式

**成功响应** (200):
```json
{
  "success": true,
  "latex": "\\begin{align*} \n f(x) = ... \\end{align*}",
  "data": [
    {"k": 0, "v": 1},
    {"k": 1, "v": 2},
    {"k": 2, "v": 4}
  ]
}
```

**错误响应** (400/405/500):
```json
{
  "error": "错误描述信息",
  "details": "详细错误信息"
}
```

### 错误码

| 状态码 | 描述 |
|--------|------|
| 200 | 成功 |
| 400 | 请求格式错误或数据验证失败 |
| 405 | 不支持的 HTTP 方法 |
| 500 | 服务器错误 |

### 使用示例

#### cURL

```bash
curl -X POST http://localhost:8788/api \
  -H "Content-Type: application/json" \
  -d '{
    "points": [
      {"k": 0, "v": 1},
      {"k": 1, "v": 2},
      {"k": 2, "v": 4}
    ]
  }'
```

#### JavaScript/Fetch

```javascript
const response = await fetch('/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    points: [
      { k: 0, v: 1 },
      { k: 1, v: 2 },
      { k: 2, v: 4 }
    ]
  })
});

const data = await response.json();
console.log(data.latex);
```

#### Python

```python
import requests

response = requests.post(
    'http://localhost:8788/api',
    json={
        'points': [
            {'k': 0, 'v': 1},
            {'k': 1, 'v': 2},
            {'k': 2, 'v': 4}
        ]
    }
)

print(response.json()['latex'])
```

## 拉格朗日插值原理

拉格朗日插值多项式是一种通过已知的离散数据点来构造一个多项式的方法。给定 n+1 个数据点 (x₀, y₀), (x₁, y₁), ..., (xₙ, yₙ)，拉格朗日插值多项式为：

```
L(x) = Σ(i=0 to n) yᵢ * ∏(j=0 to n, j≠i) [(x - xⱼ) / (xᵢ - xⱼ)]
```

## 许可证

MIT
