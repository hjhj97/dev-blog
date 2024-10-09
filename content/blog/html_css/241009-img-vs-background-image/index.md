---
title: <img>와 background-image 의 차이점
date: "2024-10-09"
description: img 태그와 background-image는 어떻게 다를까?
category: HTML/CSS
---

## `<img>` vs background-image

HTML상에 이미지를 첨부하는 방법에는 크기 `<img>` 태그와 CSS의 `background-image` 속성을 부여하는 2가지 방법이 있다. 이 둘의 차이점에 대해서 찾아보았다. stackoverflow 에 검색을 해보면 예전에도 비슷한 주제로 여러 사람들이 질문을 올린 글들을 찾아볼 수 있다. 그 중에서 가장 간단명료하게 정리해놓은 답변은 아래와 같다.

> - `<img>` : content
> - `background-image` : design

`<img>` 태그는 컨텐츠이고 `background-image`는 디자인 이라고 생각하면 된다는 뜻이다. 그렇다면 이 둘의 차이는 무엇일까?

일단 첫 번째로 접근성(accessibility)의 차이가 있다. 스크린리더로 웹페이지를 읽는 경우에 `img` 태그는 `alt` 속성을 참고하여 정보를 제공할 수 있는데 반해, `background-image`는 별도의 `alt` 속성이 존재하지 않기 때문에 이미지에 대한 정보를 알 수 없다. 따라서 이미지가 페이지의 컨텐츠에 중요한 맥락을 제공하는 경우라면 반드시 `img` 태그를 사용하도록 하자.

비슷한 원리로 SEO의 측면에서도 차이가 있다. 검색엔진이 이미지의 정보를 가져갈 때 `alt` 속성을 참고하므로 SEO에 유리한 쪽은 `<img>` 라고 할 수 있다. 반면 글의 내용과 관련없이 순전히 디자인 목적으로만 첨부된 이미지들은 `background-image` 로 설정하면 된다고 한다.

## Reference

- https://stackoverflow.com/questions/17288500/img-vs-background-image-css-in-performance
- https://stackoverflow.com/questions/492809/when-to-use-img-vs-css-background-image
- https://maheshkonne.medium.com/html-img-tag-vs-css-background-image-23f9e2e9c8aa
