---
title: 왜 fetch 함수는 await를 2번 해야 하는걸까?
date: "2024-10-07T22:12:03.284Z"
description:
category: JS/TS
---

## `fetch` 함수

자바스크립트의 내장함수인 `fetch`를 사용하여 데이터를 갖고 오기 위해서는 아래 코드와 같이 `await`를 두번 사용해야 한다는 번거로움이 있다.

```javascript
const response = await fetch("/api")
const data = await response.json()
```

왜 굳이 이렇게 만들었을까 하는 의문이 생긴다. 처음부터 한 번의 `await`로 데이터를 갖고오게끔 만들면 더 편리했을텐데 말이다.

그 이유는 HTTP 요청의 특성을 생각해보면 짐작할 수 있다. HTTP 요청은 header와 body 로 구성되어 있다. header 상에는 요청 메소드의 종류와 응답결과, 상태코드 등이 담겨 있다. 보통 header의 용량이 body의 용량보다 작을 것이므로 더 먼저 응답결과를 받아볼 수 있다는 점을 염두에 두고 아래 공식 문서를 살펴보자.

mdn의 fetch [공식문서](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API#concepts_and_usage)에서는 아래와 같이 설명하고 있다.  
![fetch-mdn](./fetch-mdn.png)

> `fetch()` 메소드는 당신이 fetch 하려는 리소스가 있는 경로라는 한 개의 필수적인 인자만 받는다. 그것은 해당 요청을 resolve 할 수 있는 `Response`객체를 내놓는 `Promise`를 반환한다 - **서버가 header로 응답을 받자마자** - 설령 서버의 응답이 error 상태라 하더라도.

즉 `fetch()` 는 body는 신경쓰지 않고 일단 header만 도착하게 되면 응답할 수 있는 상태를 준비해준다는 것이다. 그리고 body안에 들어있는 데이터를 받기 위해서는 그때 비로소 `Response.json()`함수를 호출하면 된다는 뜻이다. 또한 만약에 header의 응답결과가 error 로 받았다면 우리는 body 를 아예 받지 않아도 되므로 네트워크 리소스를 절약할 수도 있다.

이처럼 fetch 메소드는 데이터를 받는 단계를 두 단계로 나눠놓는 이유는 HTTP 요청의 특성을 생각해보면 납득할 수 있다.

## Reference

- https://tomontheinternet.com/why-two-awaits/
- https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API#concepts_and_usage
