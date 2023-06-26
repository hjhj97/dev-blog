---
title: Vue 에서 스크롤 위치 저장
description:
date: "2023-06-26T22:12:00.000Z"
category: Vue
---

_2023-03-09 에 작성된 [원문](https://ps-hjhj97.tistory.com/220)을 수정한 버전입니다_

SPA(Single Page Application)에서 이전 페이지의 스크롤 위치를 기억해두었다가 재방문 했을 때 그 자리에 위치해야 하는 경우가 있다. 이를 구현하기 위한 방법을 알아보자.

## 1. vue-router의 savedPosition 활용

vue-router의 `createRouter()`함수의 인자로 `scrollBehavior`함수를 넣을 수 있다.

이 함수에서 return 해주는 값에 따라서 페이지를 이동할 때마다 해당 값만큼 스크롤이 이동하게 된다. (쉽게 얘기하면 `window.scrollTo` 함수가 페이지 이동할 때마다 호출된다고 생각하면 된다.)  
예를 들어 아래 코드와 같이 `{top : 100}`을 리턴하다면 매 페이지 이동 시 수직 스크롤이 100px 내려져 있는 상태가 된다.

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 100 }
  },
})
```

<br />
<br />

그렇다면 스크롤 위치를 저장하고 해당 위치로 돌아가려면 어떻게 해야할까?

`scrollBehavior`함수는 아래와 같이 인자로 `to`, `from`, `savedPosistion` 이렇게 3개를 받는다. `to`는 다음으로 이동할 페이지의 정보, `from`은 이전에 어느 페이지로부터 왔는지에 대한 정보이다.

그리고 `savedPosition`에 우리가 원하는 정보가 들어있다.

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior(to, from, savedPosition) {
    // 기존 위치 존재하면 그 위치 반환
    if (savedPosition) {
      return savedPosition
    }
  },
})
```

영상으로 직접 확인해보자.

![scrollBehavior](https://github.com/hjhj97/blog.gatsby/tree/main/content/blog/vue/images/save-scroll/save-scroll-1.gif)

콘솔로 `savedPosition`을 찍어보면 그 정체는 `{top: number,left : number}`형태라는 걸 알 수 있다.

다만 `savedPosition` 값은 사용자가 **뒤로가기/앞으로가기** 를 누를 때만 값이 활성화되고 vue-router를 활용하여 페이지 이동할 때는 값이 null값으로 반환되어서 위치를 저장할 수 없다. 만약 뒤로가기/앞으로가기 누를 때 뿐만 아니라 모든 경우에 대해서 스크롤 위치를 저장하기 위해서는 아래 2번 방법을 사용해야한다.

## 2. Web Storage(sessionStorage) 활용

두 번째 방법은 Web Storage를 활용하여 스크롤 위치를 동적으로 기억해 놓는 것이다. Web Storage는 크게 `localStorage`와 `sessionStorage`가 있는데 차이는 브라우저를 닫았을 때 데이터가 날리느냐 마냐의 차이이다. 보통 웹사이트의 특정 기간동안 '로그인상태 유지' 기능이 활성화한다면 브라우저가 꺼져도 유지되야 하므로 `localStorage`에 저장하는게 적합하다. 스크롤 위치 정보의 경우 브라우저를 껐다가 다시 실행했을 경우에는 초기화 시키는게 적합하므로 `sessionStorage`에 저장하기로 했다.

1. 페이지를 이동할 때마다 현재 페이지의 스크롤 위치를 저장해두어야 한다.
   따라서 vue-router의 `beforeEach()`함수에서 떠나는 페이지(from)의 스크롤 위치인 `window.scrollY` 값을 `sessionStorage`에 key-value 형태로 저장한다. key값은 현재 페이지의 이름, value값은 스크롤 위치 값이다.

   이때 Web Storage에는 string형태의 데이터만 저장할 수 있으므로 저장할 때는 `JSON.stringify()`로, 값을 꺼낼 때는 `JSON.parse()`함수를 거쳐야 한다.

   ```javascript
   router.beforeEach((_, from) => {
     const prevInfo = JSON.parse(window.sessionStorage.getItem("scrollInfo"))

     const key = from.name
     if (key) {
       const scrollObj = { [key]: window.scrollY }
       window.sessionStorage.setItem(
         "scrollInfo",
         JSON.stringify({ ...prevInfo, ...scrollObj })
       )
     }
   })
   ```

2. 특정 페이지에 진입하면 `scrollInfo`에서 이전에 저장되어 있는 스크롤 위치가 있는지 확인한 후, 있다면 그 위치로 이동시킨다.

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    const prevInfo = JSON.parse(window.sessionStorage.getItem("scrollInfo"))
    if (!prevInfo) return
    const savedPosition = prevInfo[to.name] || 0

    return { top: savedPosition }
  },
})
```

콘솔로 `prevInfo`를 찍어보면 다음과 아래와 같이 나온다.

![sessionStorage](https://github.com/hjhj97/blog.gatsby/tree/main/content/blog/vue/images/save-scroll/save-scroll-2.gif)

## Reference

(https://in0407.tistory.com/11)
