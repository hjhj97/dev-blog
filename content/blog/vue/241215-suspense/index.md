---
title: Vue의 <Suspense> 컴포넌트 파헤치기
date: "2024-12-15"
description: Suspense 컴포넌트 사용법과 에러 핸들링
category: Vue
---

## `<Suspense>` 컴포넌트

Vue에서 제공하는 내장 컴포넌트 중에서 `<Suspense>` 가 있다. 비동기 `setup` 혹은 비동기 컴포넌트의 데이터가 준비 완료되기 전까지 `fallback` 템플릿을 보여주는 기능으로, React 진영의 `<Suspense>` 와 사실상 동일하다고 볼 수 있다.

Vue 버전 `3.5.13` 기준으로 아직까지는 experimental 기능이지만, github에 올라오는 discussion 에 따르면 조만간 정식 기능으로서 추가될 것으로 보인다(2년동안 그러고 있다는 건 비밀).

그렇다면 어떻게 사용하는지에 대해서 알아보자.

[공식문서](https://vuejs.org/guide/built-ins/suspense.html#suspense)에 따르면, `<Suspense>` 가 기다릴 수 있는 2가지 유형의 의존성이 있다. 사실 2가지로 나뉘어 있다기 보단, 1번 조건(`async setup`)을 만족하면 자동적으로 2번 조건(`async component`)이 충족된다에 가깝다.

### 1. `async setup`

Vue3의 Composition API에서는 기본적으로 `setup(){...}` 함수 안에 비즈니스 로직을 작성하게 된다. 만약 함수 내부에서 `await` 문을 사용하여 비동기 함수를 호출하고 싶다면 `async setup` 와 같이 작성하면 된다. `script setup` 을 사용하고 있더라도 동일하게 `Top-level await` 를 하면 된다.

<details>
<summary>예시코드</summary>

```jsx
  // AsyncChild.vue
  <script>
  export default {
  	async setup(){
  		const fetchData = () => {...}
  		await fetchData();
  	}
  	...
```

```jsx
  <script setup>
  const fetchData = () => {...}
  await fetchData();
  ...
```

</details>

### 2. `async component` (비동기 컴포넌트)

`defineAsyncComponent` 함수와 동적 `import` 문을 조합하면 비동기 컴포넌트를 얻을 수 있다. 비동기 컴포넌트를 `<Suspense>` 문의 default slot으로 넣게되면 로딩이 완료되기 전까지는 fallback slot 으로 넣은 템플릿을 보여주다가, 완료되면 비동기 컴포넌트를 보여준다.

<details>
<summary>예시코드</summary>

```jsx
// Parent.vue
<template>
  <div>
    <h2>Hello!</h2>
    <Suspense>
      <AsyncChild />
      <template #fallback>
        Loading...
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncChild = defineAsyncComponent(() => import('./AsyncChild.vue'))
</script>

```

</details>

## 로딩 UI 만들기

### 단순 텍스트 UI

이를 토대로 서버로부터 API를 요청하고 응답받기까지 걸리는 시간동안 보여줄 로딩 UI를 구성해보자.
API를 요청하는 `fetchData` 함수에서 로딩시간에 해당하는 3000ms 는 다음과 같이 모킹했다.

```jsx
const fetchData = async () => {
  await new Promise(resolve => setTimeout(resolve, 3000))
  list.value = data
}
```

그리고 나는 `async setup` 의 `Top-level await` 를 이용하여 부모 컴포넌트에서 `<Suspense>` 안에 집어넣었다.

<details>
<summary>AsyncList.vue</summary>

```jsx
// AsyncList.vue
<script setup>
import {ref} from 'vue'

const data = [
{id : 0, title: 'This is first'},
 {id : 1, title: 'This is second'},
 {id : 2, title: 'This is third'}]
const list = ref(null)

const fetchData = async() => {
  await new Promise(resolve => setTimeout(resolve,3000))
  list.value = data;
}
await fetchData();
</script>

<template>
  <div class="container">
    <ul>
      <li v-for="item in list" :key="item.id">{{item.title}}</li>
    </ul>
  </div>
</template>
```

</details>

<details>
<summary>Parent.vue</summary>

```jsx
// Parent.vue
<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() => import('./AsyncList.vue'))
</script>

<template>
  <div>
    <h2>Hello!</h2>
    <Suspense>
      <AsyncComponent />
      <template #fallback>
        Loading...
      </template>
    </Suspense>
  </div>
</template>
```

</details>
여기까지 구현하고 나서 결과물을 살펴보자.  페이지를 새로고침해보면 3초간 Loading...  텍스트가 표시되다가 데이터가 나오는 걸 확인할 수가 있다.

### 작동영상

![suspense](https://github.com/user-attachments/assets/c65b5008-dad7-4c1a-aa33-6a6c52b9d3a2)

### Vue Playground

<iframe src="https://play.vuejs.org/#eNqFU1Fv0zAQ/itHeGgqlaRsPJWs0oBJgCaYWN8IDya5tF5dO7KdtFOU/87ZabK2K1uUB/u7z77vzvc1wXVZRnWFwSxITKZ5acGgrcp5KvmmVNpCAzkWXOK1eZTZZ0WgRGmhhUKrDYzo7OhjKlOZKWksnLCuzh4OwzFczaFLEI6i2IdvubFOymg8TmUSd2pIB20sbkrBLNIOIMl57Re0XF3Mv6IQ6k0S03IP3lemRGlw7nYAHUr4ibb4NN5ngbcFE+Ivy9b7G913q1jO5TKKooEfH8lywJDZ64w7oUe8YBJYQ60q+DJ6MEpS3xtHToOMhHGB+mdpObUyDWbgIy5GctT2u8esrnDS49kKs/UZ/MHsHJYGdxoN6hrTYIhZppdou/DN/Q/c0XoIblReCWK/EPyFRonKaexonyqZk+wDnlf7zT8udWxhbnaWmtIX5YQ6Zuv5aUAv7t7kf6U/yb2MPvhzqWypi0cj88L0aiwOR/VpUnNmGc3n71Q2PIcZTCdguRU4g9FixQ3QX3Bt7MgL7Tjvn3MM0nX5IeniOcmuuCbOnz63IN2Um7SFshKC5r2PFGiz1ZdOGnMldlbx7WBbxi1I3MId1cMNhvS6StToGFT3gm9QVbZHJ5fT6dR5CXy+qGaiIqovnBxLfewuHFKGY2/kzhOvGBAywYy5cmMrLSOH0wD0NqjE4JtEcKjfFUoTk9MlwKUXkwYwW+PjHo14Tqebxq9979o2iQUffLW/8YyjgvYfHHmRWw==" style="width:100%; height:800px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### 스켈레톤 UI

단순히 Loading 텍스트만 표시되는 건 심심하니 스켈레톤 UI를 적용하여 사용자에게 컨텐츠가 표시될 영역에 대한 힌트를 제공해주는 것 또한 가능하다.

<details>
<summary>Skeleton.vue</summary>

```jsx
    // Skeleton.vue
    <template>
      <div class="container">
        <ul>
          <li v-for="i in 3" :key="i" class="item"></li>
        </ul>
      </div>
    </template>
    <style scoped>
    .container{
      padding : 10px;
      border-radius: 10px;
      width : 100%;
      background-color: #eaeaea;
    }
    ul{
      display: flex;
      flex-direction: column;
      gap : 16px;
    }
    li{
      width : 400px;
      height: 30px;
      background-color: #bcbcbc;
      border-radius: 8px;
      list-style-type: none;
      animation: pulse 2s infinite;
    }

    @keyframes pulse{
      0%{
        background-color: #ccc;
      }
      50%{
        background-color: #ddd;
      }
      100%{
        background-color: #ccc;
      }
    }
    </style>
```

</details>

### 작동영상

![skeleton](https://github.com/user-attachments/assets/2443c7f5-0f52-4493-b824-083586a5ddb6)

### Vue Playground

<iframe src="https://play.vuejs.org/#eNqtVdtuEzEQ/ZVhqyqp1FxoC0IhrShQCRCCivaN5cFdzyZuHXtle9NEUf6dsb27uTS9SKDNgz1zPHM8Z8ZZJOdF0Z2WmAySoc2MKBxYdGVxlioxKbRxsACOuVB4bucq+6TJqFA5WEJu9ARadLb1vgFf3aFEp1Xl7PZqg8/RSlWqMq2sg61gpztztNsHcHoGMXSbggX3d2FdiHZwkKphL5ImurRxOCkkc0g7gCEX07Cg5fjo7AtKqV8Ne7SsjFelLVBZPPM7gGgl+xa33ra/zgJ7OZPyhmV3VcQYta5Ar7EOexvEvKHJHZj2ItUNXHKYOEvFysWoe2u1IoEWHpwmGVETEs3PwgkqZpoMIHi8jwjp+2/B5kyJh7U9G2N2t8N+a2feliaXBi2aKaZJ43PMjNBF98XVD5zRunFONC8loZ9w/kKrZek5RtjHUnGivYYLbL8GeYUaXduLmaOi1JfyRD1yGfBpQpp7VR67+orucfcknEvVkqq40TRPtLnBfL2nV73KmWPUob9TtRAcBtA/BCecxAG0rsfCAv1yYaxrBaIR8/ohxiKF4+ugo4cgNxaGMH/q3JJ4U27i1lallNTxtSdHl40/R2rMXzEOSygHu2fCgcJ7uKT7CIttUlfLKXoE3ftaTFCXrrYeHvf7fT9NEPJ1p0yWBA0Xp9GmOsaATcr2AZmruj83gpBJZu2pb1vlGM04NUA9BqVczYgUMO3k2hBSUBAQKpBJExjc4byydgWn04tFWIfaLZfDnhTNXFURd04Uba2bSwQaqwI5WboNp1A2P8ojo6lNO5mW2gxgj6P/6Lbk1Yaj6RjGRWlJ4X4xC/aCcU7d21ioXKUM8biwlHs+gFxixPpFhwuDme/fAVCacqKCa8QK3zdHdQwpQgxfg06g3XHzglpF0asUDoxRjMaOur1JS0p4YLhqeEDWH1/q/P8lj9fmeE0YWtZRvDAU4MWaPKNIVVtfmLrcj8lwL7gbB2B/PwIfqonMf/+s0dstjerUJ/2azJY2O8ncZP7bdad31aHHtWf0arFIryilRTii14P+KhTVP1JL1QdSJzdsgjZiAtX+fvVe7iCUZZENnQZ48xSSc75C+oK/KOhGhybLv7jq1co=" style="width:100%; height:800px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## 에러 핸들링

`<Suspense>` 안에서 에러가 발생할 경우 어떻게 에러 핸들링을 해야 하는지도 알아보자.

위에서 설명한 로딩 UI에서 `defineAsyncComponent` 함수를 사용할 때 인자로 동적 `import` 문을 사용했지만 `errorComponent` 속성 또는 `onError` 속성을 설정하면 에러를 핸들링 하는 것도 가능하다.

그 밖의 속성들은 공식문서 상에서 아래와 같이 확인할 수 있다.

```tsx
function defineAsyncComponent(
  source: AsyncComponentLoader | AsyncComponentOptions
): Component

type AsyncComponentLoader = () => Promise<Component>

interface AsyncComponentOptions {
  loader: AsyncComponentLoader
  loadingComponent?: Component
  errorComponent?: Component
  delay?: number
  timeout?: number
  suspensible?: boolean
  onError?: (
    error: Error,
    retry: () => void,
    fail: () => void,
    attempts: number
  ) => any
}
```

- `errorComponent` 를 설정하면 에러가 발생했을 때 `loader` 에 넣은 비동기 컴포넌트 대신 다른 컴포넌트를 지정할 수 있다.
- `onError` 는 에러가 발생했을 때 호출되는 콜백 함수이다. 인자로 4개를 받게 된다.
  - `error` : `Error` 객체이다. 에러에 대한 정보를 담고 있다.
  - `retry` : 요청을 재시도한다.
  - `fail` : 더이상 `retry` 하지 않고 실패로 간주한다.
  - `attempts` : 현재까지 시도한 횟수이다.
- 그래서 아래 예시코드와 같이 최대 3번까지 `retry` 시도 후, 실패처리하는 로직을 작성할 수도 있다.

```tsx
onError: (error, retry, fail, attempts) => {
  alert(`error, ${attempts} times`)
  if (attempts < 3) {
    // 최대 3번까지 재시도
    retry()
  } else fail()
}
```

### Vue Playground

<iframe src="https://play.vuejs.org/#eNqtVs1uI0UQfpXaWVYeS/4jXhAanIgFIgFCsCK5MUjbmamxO2n3jLp7nFiWpT1wQGIlXmDFlQsnJA68EslDUN09PXEcOxsEGsvuqfq66uv6a6+iF1U1WNQYJdFEZ4pXBjSaujpKJZ9XpTKwghwLLvGFXsrss5KEEqWBNRSqnEOH9nY+bsEnFyjQlLJRDoZBYH10WtixUqVqMe6tAaRyOISslNrAlsPDnTziuAuHR+DtxmTMqb/m2jiD3W4q/421VSoBRMlyVJCAt+1kAIrCoiRIvISXRJxrjGOFuhQL7Ck8x8w4NEXvlM+xrAM1r4s77pSdbg8ORqOR5WWNrnv2F63qllvi4+NUpfSxSgBiB+tZImrZg4Jx0QNmDM4rozeZ2gOXAgcOH79qtr23Ctg1GGKoXzUceBEHDUxg3G2sAFAmbv58e/3mNYyv//jp77/e3Pz2Gm5+/f3m57fXv/wYUI5OHM4DKDQ6bnGXysLK7Pc6lWuCTIa+xqi66MX6FMwgvQFMcr5wC1rODo6+QCHKJ5MhLRvhSa0rlBqPvNvgfrKV2OG2PniBpwUT4oxlF41FbzUU7LCVToZ3iFlB69sxHXqqd3BRLzKaAl/w6eBcl5L6ycUxjTKixgWqbyvDKTFplIQ8pRERKi+/cjKjanQZd3tmmF3skJ/rKytLo5dUeagWmEatzjA1RePVxyff4BWtW+W8zGtB6AeU39lari1HD/u0ljnR3sA5tl+6TuNyeqqPrwwFJRzKEnWpdvg0ovazWdl39Fu648HzUCIUxTv9+8BUUlhsjiBbUL7Rc2YYtff3qVzxnPpm1KNyNwIT6JzOuAb6FFxp03FEPeb9+xiNZC7fBB3cB5kZV4T5IfgWxJt8E7dY1kJQxQdNgSabfe6pMXvEjdnCLhk3uwdLMz32TZYGNG4niiUwWDBRo51w5I56kALrPbQcXGuG5nxHT0ImmNaHto6lYTQxqSJCX9TitmkEh0W/KBUhORkBLh2ZNILkApeNdMBz2r1aubUL5no9GQreNlpjcWeL0as2S4FAfVZhTpJBy8nF0fb2VJVUt/2sFKVK4GmO9nGD6KxUNNX7iuW81pTyUXXl5BXLcyrnVkLhqoWzl3NNvpcJFAI91i76OVeUEirohCatqOfSqaassoV0EGwI7u8SikHf0e6bZUW1I2lMuQ0z5NOZofJv3VImLNAd1U2UzcuTWuH/So/NzXgjMbQMVmxiyMCjc/KOjDSxtYEJ4d6Xhkuem5kDjp554P1sIrPPf87Rh1s5Cq6fjwKZrdzsJHOW2WfXmT5qNu3PPaMxxjy9qrYX5gGNE7o7JMXfU0vlJ5SdQjG6qD3GUR09awboDkJZ5tnQboAPHkLmeX6LtAF/lNE7FUrV2f5tuzelH3fNh0vV/9t5sv9qXf8DnjqTFg==" style="width:100%; height:800px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Reference

- https://www.youtube.com/watch?v=2-jQ1v6X7vA
- https://ko.vuejs.org/guide/components/async
- https://ko.vuejs.org/guide/built-ins/suspense
- https://vuejs.org/api/general.html#defineasynccomponent
