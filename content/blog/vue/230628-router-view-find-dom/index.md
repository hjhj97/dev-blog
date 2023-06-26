---
title: router-view 에서 DOM을 찾지 못하는 문제
date: "2023-06-28T22:12:03.284Z"
description:
category: Vue
---

_2023-04-04에 작성된 [원문](https://ps-hjhj97.tistory.com/225)을 수정한 버전입니다_

## router-view안에 있는 DOM은 왜 못 찾지?

vue로 프론트엔드 개발을 하던 도중, `App.vue` 에서 `router-view`안에 들어있는 특정 DOM에 접근해야 할 일이 생겼다(정확히 말하자면 태그에 특정 class가 존재 유무를 확인해야 했다).  
 따라서 `document.querySelector('.특정클래스')`함수를 호출하여 해당 DOM에 접근하려고 시도했는데 결과는 예상과 달리 `null`로 반환되었다. (파일 구조는 아래와 같이 구성되어있다.)

#### NavBar.vue

```jsx
<template>
  <nav>
    <router-link :to="{ name: 'Home' }">Home</router-link>
  </nav>
</template>
```

#### Home.vue

```jsx
<template>
  <h1 class="home">This is home</h1>
</template>
```

#### App.vue

```jsx
<template>
  <NavBar />
  <router-view />
</template>

<script>
...
export default {
  components: { NavBar },
  setup() {
    onMounted(async () => {
      const homeEl = document.querySelector(".home");
      const navEl = document.querySelector("nav");

      console.log(homeEl); // not found
      console.log(navEl); // found
    });
  },
};
</script>


```

`router-view`내부에 있는 DOM요소('home' 클래스)에 접근하는 건데 왜 못 찾는 걸까? 혹시나 하는 마음에 똑같이 글로벌 범위로 사용되는 `<nav>`를 찾아보았을 때는 잘 찾고 있었다.

내 경험상 vue에서 특정 DOM을 찾지 못하는 문제에 부딪혔을 때는 일단 `setTimeout`으로 딜레이를 걸어서 찾으면 해결되는 경우가 많았다. 그래서 일단 아래와 같이 코드를 수정해보았다.

#### App.vue

```jsx
<script>
export default {
  setup() {
    onMounted(() => {
      setTimeout(()=>{
        const homeEl = document.querySelector(".home");
        const navEl = document.querySelector("nav");

        console.log(homeEl); // found
        console.log(navEl); // found
      },1000)
    });
  },
};
</script>

```

아니나 다를까, 시간을 두고 DOM을 찾았더니 성공하였다. 우선 가장 무식한(비효율적인) 방법으로는 문제를 해결하기는 했다.

문제의 원인은 `router-view`가 **mount 될 때까지 미세하게나마 시간이 소요되기 때문**이었다.  
 따라서 `App.vue`에서 `onMounted()`가 호출되는 시점에는 `router-view` 의 `Home.vue` 는 아직 mount되기 이전이었기 때문에 DOM에 접근할 수 없었던 것이다. 그에 반해 `<nav>`는 `router-view` 내부에 있지 않고 `App.vue`에 독립적으로 존재하기 때문에 mount되는 시간이 훨씬 짧아 접근이 가능하다.

## 해결책은 router.isReady()

개발할 때는 워낙 빠릿하게 작동해서 눈치채기는 어렵지만 사실 router가 mount되기까지의 딜레이는 결코 무시할 수 없는 수준으로 꽤 긴 시간이다. 그렇다면 앞으로도 계속 `setTimeout`으로 강제 딜레이를 넣어줘야 하는 걸까? 당연히 아니다.`vue-router`에서는 이런 문제가 발생할 줄 알고 미리 `router.isReady()`라는 비동기 함수를 만들어 놓았다.[공식문서](https://router.vuejs.org/guide/migration/#replaced-onready-with-isready)

문제를 해결한 코드를 먼저 보자.

#### App.vue

```jsx
export default {
  components: { NavBar },
  setup() {
    onMounted(async () => {
      await router.isReady() // Added!
      const homeEl = document.querySelector(".home")
      const navEl = document.querySelector("nav")

      console.log(homeEl) // found
      console.log(navEl) // found
    })
  },
}
```

<br />

코드는 `querySelector`로 찾기 전에 `await router.isReady()` 딱 한 줄만 추가했다.

이 함수는 쉽게 얘기하면 `router-view` 내부의 파일들이 DOM으로 mount 될 때 까지 기다려주는 역할이다. 모두 mount가 완료되었다면 resolve 해줌으로써 `querySelector`로 접근할 수 있게 된다.

## 구현

<iframe src="https://codesandbox.io/embed/vue-router-isready-tlqd83?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue-router-isReady"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
