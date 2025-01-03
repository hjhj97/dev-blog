---
title: v-memo 개념과 활용법
date: "2024-12-12"
description: v-memo와 v-once 개념과 활용법에 대해 알아보자
category: Vue
---

Vue의 3.2 버전부터 추가된 신규 디렉티브인 `v-memo` 에 대해서 살펴보도록 하자.

## `v-memo` 란?

[공식문서](https://ko.vuejs.org/api/built-in-directives#v-memo) 상의 설명은 아래와 같다.

> 템플릿의 하위 트리를 메모합니다. 엘리먼트와 컴포넌트 모두에 사용할 수 있습니다. 디렉티브는 메모이제이션을 위해 비교할 의존성 값의 고정된 길이의 배열을 요구합니다. 배열의 모든 값이 마지막 렌더링과 같으면 전체 하위 트리에 대한 업데이트를 생략합니다

‘의존성 배열’ 이라는 용어는 리액트를 접해보았다면 익숙하게 받아들일 수 있을 것이다. `useEffect`, `useMemo`, `useCallback` 와 같은 훅에서 사용되는 그 ‘의존성 배열’과 일맥상통하다. **의존성 배열 안에 들어있는 값이 변하지 않는 한, 해당 디렉티브가 선언된 DOM노드를 메모이제이션함으로써 리렌더링 비용을 아낀다**는 것이 핵심이다.

## 언제 사용할까?

그렇다면 어떤 경우에 사용하면 좋을까? 공식문서 상에서는 `v-for` 를 사용하여 리스트 렌더링을 해야하는 경우, `props` 일부가 변경되어 리스트 전체가 리렌더링 되는 상황을 `v-memo` 를 사용함으로써 방지할 수 있다고 한다.

내가 작성한 예시코드에서는 이러한 상황을 모킹하기 위해 리스트의 각 원소 안에 현재 시각을 표시하는 `new Date().getTime()` 함수를 호출하였다. 그리고 `activeId` 값을 변화시켜가면서 각 원소별로 이 값이 어떻게 변하는지 살펴보려고 한다.

<details>
<summary>예시코드</summary>

```tsx
<script setup>
  import { ref } from "vue"

  const activeId = ref(0)
  const list = ref([
    { id: 0, title: "first" },
    { id: 1, title: "second" },
    { id: 2, title: "third" },
    { id: 3, title: "fourth" },
    { id: 4, title: "fifth" },
  ])
</script>

<template>
  <div>
    <button @click="activeId--">-</button>
    <span>activeId : {{activeId}}</span>
    <button @click="activeId++">+</button>
  </div>

  <div>
    <h2>without v-memo</h2>
    <ul>
      <li
        v-for="item in list"
        :key="item.id"
        :class="{highlighted : item.id === activeId}"
      >
        {{item.title}}
        <span>: {{new Date().getTime()}}</span>
      </li>
    </ul>
  </div>

  <div>
    <h2>v-once (v-memo="[ ]")</h2>
    <ul>
      <li
        v-for="item in list"
        :key="item.id"
        v-memo="[]"
        :class="{highlighted : item.id === activeId}"
      >
        {{item.title}}
        <span>: {{new Date().getTime()}}</span>
      </li>
    </ul>
  </div>

  <div>
    <h2>v-memo</h2>
    <ul>
      <li
        v-for="item in list"
        :key="item.id"
        v-memo="[item.id === activeId]"
        :class="{highlighted : item.id === activeId}"
      >
        {{item.title}}
        <span>: {{new Date().getTime()}}</span>
      </li>
    </ul>
  </div>
</template>

<style>
  .highlighted {
    background-color: #ccc;
  }
</style>
```

</details>

### 작동영상

![v-memo](https://github.com/user-attachments/assets/e3e56afd-4fdb-4da7-b449-3e7994a7fb3b)

#### Vue Playground

<iframe src="https://play.vuejs.org/#eNrNVbty2zAQ/JUbpLA0ejm2K4bS5OXCKZJM4s5wIYOgCAsEOABIycPhv+fAp6R47MaFC2kOt4fD7pI4luRLls2LnJOAhJYZkTmw3OXZiiqRZto4KMHwGCqIjU7hDEvPqKKKaWUdrJkTBb+JYOmLRufjTx0iBf412TuqAEoRQQDnUyec5AElsTDWUVJNB/BjD1qOTaJj9KJHXSLMCXg59NW5cckxenVwajyA92MvhKpw0QhHybhwPM3k2nFcAYSRKOoAw4fcOa3gM5OCbZeUdNpnM0pWs3DR4F21zdZq1dsTQFl2i6rCAz36St/JBPtOjvqGi47PKbnkYrUTLtG5g2KW8lSHC0y1YC7bCGMpsCDWBg8SKBWEqh8VJRBs+VObnQv0FyBgcm0t5spEbBKJP8e9lrYElstl/wZUSLY7BH0v65ra9qoa8o0t3g3Fd/AdbR6N5xvubkWK0YkzXq8UnYhFq6LzoE0fe1DMtGIcRo0HyPzunpLxG3hx1PD9G/OfLW/0Sgw2PCf13Vvj7024OLjhuLTuSfpwfsi39LUPa7bdGJ2raMa01CaAD4wxnHBIDg9t95EpcRbHVSw280erFQ7SejclTKeZkNz8ypzAmUgJamiI4SWXUu9+1Dlncl7Po3pPwtn2mfyj3fscJb8Nt9wUnJIec2uDdjTw9d+ffI9xD6Y6yiVWvwD+4VbL3HNsyr6iYqR9UFezvak/B0Jtbu313nFlO1GeqK9spiol+In49oL0ge7l/Kreh46S6h/O+RdJ" style="width:100%; height:800px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### v-memo 미적용

`v-memo` 를 적용하지 않은 경우엔 `activeId` 값이 변경될 때마다 모든 원소의 (현재 시각)값이 변하고 있음을 확인할 수 있다. 이는 같은 파일안에 있는 `activeId` 값이 반응형 변수인 `ref` 로 선언되어 있기에 이 값이 변할 때마다 리스트가 리렌더링되기 때문이다.

### v-once (v-memo=”[ ]”)

`v-memo` 의 의존성 배열을 비워둘 경우 `v-once` 와 동일한 효과를 발휘한다. 즉 최초 mount 시에만 렌더링 되며 그 이후에는 반응형 변수의 값이 변하여 리렌더링이 일어나더라도 `v-memo` (`v-once`) 로 감싸져있는 부분은 변하지 않는다. 따라서 `activeId` 값을 어떻게 변경한들, 현재 시간은 그대로이다.

### v-memo 적용

`v-memo` 의존성 배열에 `item.id === activeId` 라고 명시했다. 즉 원소의 `id` 값과 `activeId` 값의 일치여부가 변경될 때만 리렌더링이 되도록 지정하고, 그 외에 경우엔 메모이제이션하여 리렌더링을 방지했다.  
예를 들어 `activeId` 값이 1 → 2로 변할 때는 오직 `first` 와 `second` 에 해당하는 아이템에서만 현재 시각이 변하며, 그 외 원소에서는 값을 그대로 유지하게 된다.

### React.memo 와의 비교

`v-memo` 는 `React.memo` 와 비슷하게 사용할 수 있는 디렉티브라고 볼 수 있다. 다만 차이점이라면 `React.memo` 는 컴포넌트에 적용되는 반면, `v-memo` 는 엘리먼트에 적용된다는 점이다. 즉 `v-memo`가 훨씬 더 유연하며 넓은 범위에서 사용할 수 있는 디렉티브라고 볼 수 있다.

## Reference

- https://ko.vuejs.org/api/built-in-directives#v-memo
- https://learnvue.co/articles/v-once-v-memo
