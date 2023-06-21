---
title: 테스트 글
description: 테스트를 위한 포스트입니다
date: "2023-06-20T22:12:03.284Z"
---

이건 테스트 글입니다.

## Codeblock

#### javascript

```javascript
// this is javascript
const a = 1
const b = 2
const sum = () => {
  return a + b
}
sum()
```

#### typescript

```typescript
// this is typecript
const a: number = 1
const b: number = 2
const sum: number = () => {
  return a + b
}
sum()
```

#### html

```html
<!-- this is html -->
<div>Hello</div>
```

#### c

```c
// this is c
int a=1;
int b=2;
function sum(){
  return a + b;
}
sum();
```

#### jsx

```jsx
const App = () => {
  const [value, setValue] = useState(0)
  return <div>Hello {value}</div>
}
```

#### vue

```jsx
// this is vue
<template>
  <div>Hello {{a}}</div>
</template>


<script>
  export default{
    setup(){
      const a = ref(1);
      return{
        a
      }
    }
  }
  </script>
```

#### JSON

```json
{
  "string": "hello",
  "number": 1,
  "isValid": true,
  "array": [1, 2, 3]
}
```
