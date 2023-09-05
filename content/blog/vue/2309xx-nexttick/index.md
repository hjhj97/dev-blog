---
title: nextTick()은 언제쓸까?
date: "2023-09-10T22:12:03.284Z"
description:
category: Vue
---

## nextTick()이란?

[Vue 공식문서](https://vuejs.org/api/general.html#nexttick)에서는 이렇게 설명하고 있다.

> When you mutate reactive state in Vue, the resulting DOM updates are not applied synchronously. Instead, Vue buffers them until the "next tick" to ensure that each component updates only once no matter how many state changes you have made.  
> `nextTick()` can be used immediately after a state change to wait for the DOM updates to complete. You can either pass a callback as an argument, or await the returned Promise.

> Vue에서 반응형 변수의 값을 변경할 때, 그 결과는 DOM에 동기적으로 반영되지 않는다. 대신 Vue는 각 컴포넌트가 몇번이나 변경되었느냐와 상관없이, "next Tick"까지 버퍼에 담아놓아서 반드시 한번만 업데이트 됨을 보장한다.  
> `nextTick()`은 DOM의 업데이트가 완료될 때까지 기다리는 데 사용할 수 있다. 콜백함수나 `Promise`를 await할 수도 있다.

스크립트단에서 적용된 코드가 곧바로 DOM에 적용되지 않는다는 사실은 vue뿐만 아니라 react를 접해본 사람이라면 생소한 얘기는 아닐 것이다. 라이브러리에서 최적화를 위하여 화면을 그리는 렌더링 과정은 batch로 처리되기 때문이다. 그래서 CSR 라이브러리를 처음 공부하는 시기에는 내가 생각했던 렌더링 결과와 다르게 나와서 당황했던 경험이 다들 한번씩은 있을 것이다.

즉 스크립트단의 로직이 다 처리되기 이전에 DOM에 곧바로 반영해야할 때 사용하는 함수가 바로 `nextTick()`이다.

## 언제 사용할까?

사실 `nextTick()`함수의 사용빈도가 많지는 않지만, 가끔씩 필요한 상황은 있기 때문에 이런 함수의 존재여부를 알고있다는 자체만으로도 도움이 된다.

1.
