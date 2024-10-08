---
title: 첫 번째 글
description: Gatsby로 블로그를 이사하고 올리는 첫 글
date: "2023-06-21T22:12:00.000Z"
category: Essay
---

## 블로그 이사

기존에 4년 반 동안 운영하던 [티스토리 블로그](https://ps-hjhj97.tistory.com)에서 이곳 Gatsby 블로그로 이사하였다.

이사하게된 배경에는 여러가지가 있지만, 가장 중요한 이유는 '개발과 관련된' 포스팅에 더 집중하기 위해서다. 티스토리 블로그는 이름과 URL에서부터 짐작되다시피, PS(Problem Solving)를 하면서 얻은 지식이나 문제 풀이 위주의 글들로 이루어져 있다. 처음 블로그를 개설할 당시만 하더라도 나는 아주 PS만 공부하고 있었으므로 추후에 개발 블로그로서 발전될 가능성을 염두에 두지 않았다.

그러다 시간이 흘러 내가 취업전선에 뛰어들게 되면서 점점 PS보다는 개발 공부에 투자하는 비중이 더 많아졌다. 처음에는 개발 공부에서 얻은 지식들도 기존 티스토리 블로그에 포스팅할 예정이었으나, 그 당시에는 익숙치 않아서인지 개발 포스팅은 글을 어떻게 써야할 지 감이 잡히지 않았다.  
문제풀이 글의 경우에는 '문제요약' > '문제접근' > '나의 생각' >'코드구현' 이라는 명확한 기승전결 포맷이 갖춰져 있음에 비해, 개발관련 글은 주제가 자유분방하다보니 이걸 어떻게 설명해야할지 도무지 갈피를 못잡았던 것 같다. 그래서 개발 포스팅은 차일피일 계속 미뤄지다가 작년에 회사 인턴을 시작하면서 '이제는 진짜 해야한다'라는 위기감을 느껴서 개발 포스트 몇 개 정도는 발행할 수 있었다.  
하지만 그럼에도 문제는 여전히 있었다. 일단 개발 포스팅을 스스로가 습관화하지는 못해서 업로드 주기가 불규칙하였으며(당초 목표는 한달에 약 3개 발행), 어쩌다가 의무감때문에 글을 쓰더라도 (지금 다시 읽어보면) 글의 퀄리티가 영 마음에 들지 않았기 때문이다.

마음 속에는 '열심히 글 써야지'라는 추상화된 생각이 자리잡고 있는데, 현실 속에서 이를 구현하고 있지 못하는 상황이었다. 고민 끝에 내린 해결책이 바로 '기술 블로그는 따로 분리하자' 였다. 아무래도 티스토리 블로그에는 이미 PS 글들로 가득 차 있었고, 자잘한 블로그 테마나 스킨들도 이에 맞춰져 있었기 때문인지 개발 글을 써도 뭔가 기술 블로그처럼 보이지가 않았다. 고민에 고민을 거듭한 끝에 결국 내가 떠올린 해결책은 바로..

> 이건...블로그를 옮겨야 해...

완전히 새로운 마음으로 제로베이스부터 다시 시작해야 되겠다고 마음을 먹었다. PS를 위한 티스토리 블로그는 PS를 위한 글만 작성하도록 스스로 원칙을 정했다. 블로그 운영에도 `단일 책임 원칙`을 적용했다고 보면 된다.

## 왜 하필 Gatsby?

새로운 개발 블로그를 개설할 때에는 여러가지 옵션이 있었다. 가장 간단한 방법은 다른 도메인의 개발용 티스토리 블로그를 개설할 수도 있었다. 하지만 또 다시 티스토리에서 운영하면 똑같은 나태함의 수순을 반복할 것 같아서 완전히 다른 플랫폼으로 옮겨야되겠다고 마음먹었다. 그래서 티스토리를 제외하고 보통 사람들이 운영하는 개발 블로그의 종류에는

- brunch
- velog
- medium
- github page

등이 있는데, 앞의 3가지는 플랫폼에서 미리 제공해주는 템플릿이 있고, 유저는 오직 글 작성에만 집중하면 되는 방식이다.
하지만 나는.... 나름 명색이 **프론트엔드 개발자**이다. 그렇다면 내가 직접 커스텀하고 개발할 수 있는 폭이 넓은 'github page'를 선택해야 하지 않을까? 하는 `근거는-없지만-당연히-그래야-할-것-같은-기분`이 들었다.

> 좋아, 그러면 일단 github page로 결정!

github page에서도 크게 선택이 두 가지로 나뉘는데 `jekyll`과 `gatsby`이다. 둘 다 정적 웹사이트 생성기이지만 약간의 차이는 있다. 내가 차이점에 대해서 정확히 조사한 건 아니지만 대략 찾아보고 느낀 점은 `jekyll`은 좀 불편하고, `gatsby`는 `react`기반이면서 커스텀할 수 있는 여지도 더 넓다는 것이다. 그리고 무엇보다 결정적인 요인은, 내가 다른 개발자분들의 기술 블로그를 ~염탐~ 구경해보면서 `gatsby`기반의 기술블로그가 훨씬 더 많았다는 점이다. 이쯤 되니 아, 나는 어쩔 수없이 `gatsby`를 선택해야 할 운명이야- 가 되어 버렸다.  
 그래서 이틀 전에 구글링으로 'gatsby 블로그 만드는 방법' 찾아보면서 후다닥 만들고 git에 배포까지 완료했다. 게다가 야심차게 가비아에서 `juheon.dev` 도메인까지 구입해서 연결했다. 1년에 3만원 남짓한 금액이지만 아무튼 내 돈주고 운영하는 블로그인만큼 조금의 강제성은 부여되지 않을까 기대해본다.

## 앞으로 어떻게 운영해야할까

우선 나 스스로 블로그에 글을 쓴다는 심리적인 허들을 낮출 필요가 있다. 현재 나는 은근히 글을 쓰는 데에 부담감을 짋어지고 있는 듯 하다. 좋은 글을 써야 한다는 압박 때문인지 주제는 정해놓고서도 쉽사리 글을 적지는 못하고 있다.  
사실 다른 개발자분들의 기술블로그를 구경하면서 다들 글을 너무 잘 쓰길래 스스로 기가 죽은 것 같은 기분을 느낀다. 그렇지만 처음부터 잘 쓰는 사람이 어디 있을까, 짧고 간결한 글이라도 좋으니깐 일단 글을 쓰는 일을 '습관화'하는 일이 1순위이다.
