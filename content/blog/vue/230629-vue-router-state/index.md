---
title: vue-router를 통한 페이지간 state 전달
date: "2023-06-29T22:12:03.284Z"
description: vue에서 state전달은 어떻게 할까?
category: Vue
---

_2023-04-24에 작성된 [원문](https://ps-hjhj97.tistory.com/227)을 수정한 버전입니다_

## 페이지에 state를 전달하는 방법

react에서는 페이지 이동 시 state를 전달하기 위해서는 `react-router-dom`에서 `<Link>` 컴포넌트 또는 `useNaviate()` 훅을 통해 전달이 가능하다.  
반면에 vue에서는 직접적인 전달 방법이 존재하지 않아 개발자 자체적으로 방법을 찾아야 했다. 생각해볼 수 있는 방법으로는

1. `vuex`와 같은 전역상태 저장소에 넣어두고 꺼내쓰기  
   => 일회용 데이터를 위해서 전역상태에 임시 데이터를 넣고 싶지는 않았다.
2. `router.push()`를 하는 코드 직후에 `window.pushState(state)`를 추가해서 페이지가 이동되면 꺼내쓴다  
   => 그나마 현실적인 방법이다. 다만 history를 두번으로 push하기 때문에 똑같은 페이지가 히스토리에 스택에 두번 들어가게 된다.
3. 이동하려는 URL에 쿼리스트링으로 데이터 값을 담아서 전달 하기  
   => URL이 괜히 길어지는데다가, 보안상 민감한 데이터는 쿼리스트링에 담기 조심스럽다.

## 해결방법

이런 불편함 때문인지 vue git의 rfc에도 글이 몇 개 올라와 있었고, 드디어 2022년 7월에 `vue-router@4.1.0`버전에서 정식 기능으로 추가되었다([링크](https://github.com/vuejs/router/releases/tag/v4.1.0)).

방법은 간단하다. router에 params를 넣는 방식처럼 state도 객체 형태로 적어주기만 하면 된다.

```javascript
router.push({name 'NextPage', state : { isDetailsOpen : true }})
```

<br />

다만 꺼낼 때는 `state`값을 `useRoute()`에서 뽑아내는 게 아니라, `windiw.history.state`에서 직접 꺼내야한다.

```javascript
const { isDetailsOpen } = window.history?.state || false
```

사실 정식기능으로 추가되었다고는 하더라도 `window.history`객체의 state 힘을 빌리는 정도에 불과하기 때문에 위에서 언급한 임시 해결방법 2번과 거의 유사하다고 볼 수 있다. 또한 이 방법을 사용한다고 하더라도 보안에 민감한 데이터를 전달하기엔 역시나 찝찝한 구석이 있다. 그냥 다음 페이지에의 상태(모달 오픈 여부 등)만 전달하는 데 사용할 수 있을 것 같다.
