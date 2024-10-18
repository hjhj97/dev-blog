---
title: Nuxt3의 렌더링 모드
date: "2024-10-18"
description: Nuxt의 SSR, CSR, ISR, SWR, SSG에 대해 알아보자
category: Vue
---

> 이 포스팅은 [Comparing Nuxt 3 Rendering Modes: SWR, ISR, SSR, SSG, SPA](https://blog.risingstack.com/nuxt-3-rendering-modes/)를 기반으로 재구성했습니다.
>
> 이 프로젝트의 데모 페이지는 [이곳](https://nuxt-rendering-test-clhqu1bfq-hjhj97s-projects.vercel.app/) 에서 확인할 수 있습니다.

## 기본 환경설정

이번 프로젝트에서는 `Nuxt3`가 제공하는 5가지의 렌더링 모드를 살펴보고자 한다. 각 페이지마다 2종류의 timestamp를 표시할 것이다.

> 1. HTML이 서버에서 렌더링된 시간
> 2. hydration을 완료한 시간(=브라우저에서 페이지를 완성한 시간)

예를들어 SSR페이지에서는 아래와 같이 표시한다.

```html
<!--ssr.vue-->
<template>
  <div>
    <h1>SSR</h1>
    <p>Server Rendered Time {{ data }}</p>
    <p>Hydration Time : {{ new Date().toUTCString() }}</p>
  </div>
</template>
<script setup lang="ts">
  const { data } = await useFetch("/api/hello")
</script>
```

그리고 이를 확인하기 위해 `/server/api/hello.ts` 경로상에 현재 시간을 반환하는 간단한 API 함수를 작성하여 각 페이지에서 호출하려고 한다.

```ts
// /server/api/hello.ts
export default defineEventHandler(event => {
  return new Date().toUTCString()
})
```

각 페이지별로 렌더링 모드를 설정하기 위해서는 `nuxt.config.ts` 의 `routeRules` 객체 안에 경로별로 명시해주면 된다(자세한건 아래에서 설명 예정)

```ts
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    "/isr-5": { isr: 3 },
    "/isr-no-ttl": { isr: true },
    "/swr-5": { swr: 5 },
    "/swr-no-ttl": { swr: true },
    "/csr": { ssr: false },
    "/prerender": { prerender: true },
  },
})
```

## CSR(SPA)

첫 번재로 Clinet Side Rendering(Single Page Application)을 살펴보자.  
CSR은 클라이언트(브라우저)가 렌더링을 담당하기 때문에 서버는 번들파일만 전달할 뿐, HTML파일을 렌더링하는 데에는 관여하지 않는다. 개발자도구의 Network 탭에서 보내준 doc파일을 확인하더라도 텅 비어있는 HTML 파일만 전달받았는 사실을 알 수 있다. 따라서 Server Rendered Time은 존재하지 않는다(첨부한 이미지에서 Server Render Time은 클라이언트에서 호출된 것이다)

![nuxt-csr](https://github.com/user-attachments/assets/10cafdef-206e-4309-81fd-6bc9a069c32c)
한편 Hydration Time은 클라이언트 사이드에서 API를 직접 호출하여 DOM을 그렸으므로 API 응답시간과 일치한다고 볼 수 있다.

`nuxt.config.ts` 에서는 설정하고자 하는 경로상에 `{ ssr : false }` 로 설정하면 된다.

```ts
  routeRules: {
    ...
    "/csr": { ssr: false },
  },
```

## SSR

Server Side Rendering은 말 그대로 서버에서 직접 HTML을 렌더링하여 클라이언트에게 전달한 뒤에 클릭과 같은 상호작용을 위해서 hydration 과정이 진행된다.

![nuxt-ssr](https://github.com/user-attachments/assets/d976c00e-ad39-496e-805c-0823a11654dc)

페이지에 접속하면 최초로 전달받은 HTML파일(이미지 우측에 개발자도구에서 보이는 시간)상으로는 Rendered Time과 Hydration Time이 일치하는 것처럼 보인다.  
하지만 사람들에게 실제로 보이는 화면(이미지 좌측)에서는 미세하게 Hydration Time이 Rendered Time보다 느리다는 걸 확인해볼 수 있는데, 이는 HTML파일을 받으면 브라우저에서 hydration이 진행되기 때문에 `new Date()`가 한번 더 실행되어 DOM에 다시 반영되기까지의 딜레이라고 생각해볼 수 있다.

`nuxt.config.ts` 에서는 설정하고자 하는 경로상에 `{ ssr : true }` 로 설정하면 된다.

```ts
  routeRules: {
    ...
    "/ssr": { ssr: true },
  },
```

## SSG

Static Site Generation 은 빌드 당시에만 HTML이 렌더링되며 그 이후에는 재접속하더라도 리렌더링되지 않는다. 따라서 Rendered Time은 빌드된 시점으로 고정되어 있다.
![nuxt-ssg](https://github.com/user-attachments/assets/c02fabeb-052a-43b3-a284-b6f3e279da34)

`nuxt.config.ts` 에서는 설정하고자 하는 경로상에 `{ prerender : true }` 로 설정하면 된다.

```ts
  routeRules: {
    ...
    "/ssg": { prerender: true },
  },
```

## SWR

Stale While Reavalidate은 SSG와 SSR의 특성을 섞어놓은 방식이다. 기본적으로는 SSG처럼 정적 페이지를 제공하지만, 개발자가 지정해놓은(혹은 미지정) 주기마다 다시 페이지를 빌드하여 최신 버전의 정적 페이지로 업데이트 해놓는다. 만약 주기를 지정해놓지 않으면(No TTL) 컨텐츠의 내용이 바뀌기 전까지는 캐싱한다.

`Nuxt.js`의 SWR은 `Next.js`의 ISR 개념과 유사하다.(`Nuxt.js`의 ISR과는 조금 차이가 있는데 밑에서 설명하겠다).

### No TTL

![swr-no-ttl](https://github.com/user-attachments/assets/ae4aab8c-830c-4876-994b-3e07d9de58db)

TTL을 설정해놓지 않으면 컨텐츠가 바뀔 때마다 페이지가 새롭게 빌드된다. 이 예제에서는 페이지가 1초마다 바뀌므로 그때마다 새롭게 페이지가 빌드된다.

### 5 seconds TTL

![swr-ttl](https://github.com/user-attachments/assets/d66e54b6-97c9-4c80-be79-324600ea5a80)

5초 주기로 설정해놓게 되면 5초동안 접속하는 요청에 대해서는 동일한 정적 페이지를 서빙하게 된다. 실질적으로 변경되는 부분은 HTTP의 `Cache-Control`에서 `max-age=5`에 해당한다. 5초가 지난 이후의 요청에 대해서는 우선 캐싱되어있는 stale 상태의 페이지를 서빙하고, 백그라운드에서는 새로운 버전의 페이지를 준비한다. 빌드가 완료되고 난 이후에는 새로운 버전의 페이지를 받을 수 있게 된다.

업데이트 여부를 판단하는 원리를 간단하게 설명하자면 다음과 같다.  
각 페이지는 버전별로 고유한 값을 가지는 `Etag` 를 HTTP의 헤더로 전달받게 된다. 이후에 재요청을 보내게 되면 요청헤더에 `If-None-Match` 속성에 현재 페이지 버전의 `Etag` 값을 담아서 서버로 보낸다.  
 서버에서는 이 `Etag` 값과 최신 페이지 버전의 `Etag` 값을 비교하여 동일한 버전이라면 '현재 페이지를 그대로(캐싱된 값) 사용해도 좋다'라는 의미로 `304 Not Modified` 를 응답으로 보낸다.  
단, 여기서 5초가 지난 상태라면 백그라운드에서는 새로운 데이터(페이지)를 재생성하도록 요청을 보낸다. 재생성이 완료되면 새로운 `Etag`가 생성될 것이므로 이후 요청에서는 새로운 페이지로 교체된다.

`nuxt.config.ts` 에서는 설정하고자 하는 경로상에 `{ swr : number | boolean }` 로 설정하면 된다.

```ts
  routeRules: {
    ...
    "/swr-no-ttl": { swr: true },
    "/swr-5": { swr: 5 },
  },
```

## ISR

ISR은 큰 틀에서는 SWR과 거의 유사하지만 중요한 차이점은 Vecel 이나 Netlify에서 제공해주는 CDN 캐시를 활용한다는 점이다. 만약 `true` 값으로 설정되면 CDN 캐시에 저장되어 있는 컨텐츠를 다음 배포전까지 사용하게 된다. 특정 플랫폼에 종속적인 렌더링 모드이므로 해당 플랫폼을 사용하는것이 아니라면 SWR과 차이는 없다.

`nuxt.config.ts` 에서는 설정하고자 하는 경로상에 `{ isr : number | boolean }` 로 설정하면 된다.

```ts
  routeRules: {
    ...
    "/isr-5": { isr: 5 },
    "/isr-no-ttl": { isr: true },
  },
```

## Reference

- https://blog.risingstack.com/nuxt-3-rendering-modes/
- https://nuxt.com/docs/guide/concepts/rendering
