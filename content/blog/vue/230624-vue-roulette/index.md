---
title: Vue에서 CSS,JS를 이용한 룰렛 구현
description:
date: "2023-06-24T22:12:00.000Z"
category: "vue"
---

_2022-11-12 에 작성된 [원문](https://ps-hjhj97.tistory.com/214)을 수정한 버전입니다_

## 룰렛 이벤트

다들 온라인이나 오프라인에서 룰렛(회전판)을 돌려서 나온 상품을 추첨받는 경험 한 번씩 있을 것이다. 현실에서의 룰렛은 공평한 물리법칙에 내 운명을 맡기면 되지만, 웹페이지(프론트엔드)상에서 구현할 때는 룰렛을 어떻게 돌아가게 만들고 어떤 영역을 가리키도록 해야할까? 마침 진행 중인 프로젝트에서 룰렛을 구현해야 했는데 구글링이나 오픈소스에는 내가 원하는 기능이 없어서 직접 구현하게 되었다.

#### 요구조건

css의 animation에서 rotate를 활용하면 되는데 구현해야 할 요구조건은 아래와 같다.

1. 사용자가 버튼을 누르면 백엔드 API가 호출되고 리턴값으로 당첨영역을 받는다. 이 영역의 위치에 따라 회전 각도를 조절해야한다.
2. 현실에서 룰렛이 회전하는 것처럼, 처음에는 천천히 돌다가 점점 가속도가 붙어서 빨라지고 마지막에는 느려지다 멈춘다.

```jsx
// Roulette.vue
<template>
  <div class="container">
    <!-- 룰렛 화살표 -->
    <div class="arrow">▼</div>

    <!-- 회전하는 룰렛 이미지 -->
    <img src="@/assets/roulette.png" class="roulette_content" />

    <!-- 룰렛을 돌리기 시작하는 버튼 -->
    <button @click="onClickStart">Start</button>
  </div>
</template>
```

템플릿은 간단하게 3개밖에 없다. 룰렛 화살표는 필수는 아니고 당첨된 영역을 확인하기 용이하도록 만들었다.

다음은 스크립트(Vue3 Composition api)이다.

```jsx
// Roulette.vue
<script>
export default {
  setup(){
    const onClickStart = () => {
      const {startRoulette} = useRoulette();
      startRoulette();
    }
    return{
      onClickStart,
    }
  }
}
</script>
```

`setup()`함수에서는 버튼을 눌렀을 때 동작하는 함수만 정의하고, `useRoulette()` hook을 실행하면 된다.

다음은 가장 핵심인 `useRoulette()` hook이다. 코드는 굉장히 복잡해보이는데 사실 대부분 사용자가 입맛에 따라 정의하는 하이퍼파라미터이다. 하이퍼파라미터는 변수명을 대문자로 표기하였다.
원리는 간단하다. 룰렛은 원형이니 중심각이 360도이다. 따라서 360/(영역의 개수) 를 계산하여 각 영역당 중심각의 크기를 구할 수 있다. 그리고 해당 영역이 몇 번째인지 알고 있으면 그만큼 룰렛을 rotate시키면 되는 것이다. 그래서 회전시켜야 하는 각도 값을 `rouletteAngle`변수에 저장하여 style property에 `--roulette-angle`로 저장시키면 css에서도 이 값을 가져다 쓸 수 있는 방식이다.
다만 요구조건 2에서 룰렛이 돌아가는 속도를 시간에 따라 결정해야하므로 cubic-bezier 커브를 정의하였고 `MIN_ROTATION, ROTATION_SECOND` 변수를 정의하여 돌아가다가 서서히 멈추는 애니메이션처럼 보이도록 하였다.

```js
// useRoulette.js
const useRoulette = () => {
  const POINT_ARRAY = ["red", "blue", "green", "yellow"]
  // 룰렛의 내용, 12시 방향부터 반시계방향
  const MIN_ROTATION = 3
  // 룰렛을 최소 몇 바퀴 돌릴 것인지 결정
  const ROTATION_SECOND = 2
  // 몇 초동안 돌릴 것인지

  const numberOfSection = POINT_ARRAY.length
  // 룰렛에 적힌 영역의 개수
  const pick = Math.floor(Math.random() * numberOfSection)
  // [0, section - 1]범위에 랜덤한 인덱스를 뽑음, 서버에서 영역을 정해준다면 필요없음
  const degPerSection = 360 / numberOfSection
  // 하나의 섹션당 각도가 몇 도인지 계산함.
  const rouletteAngle = 360 * MIN_ROTATION + degPerSection * pick
  // 최소 MIN_ROTATION만큼은 돌고난 후에, pick 영역을 가르키도록 함

  const startRoulette = () => {
    const rouletteEl = document.querySelector(".roulette_content")
    rouletteEl.style.animationName = "spin"
    rouletteEl.style.animationDuration = `${ROTATION_SECOND * 1000}ms`
    rouletteEl.style.animationTimingFunction =
      "cubic-bezier(0.37, 0.06, 0.63, 0.98)"
    //처음에는 빠르게 돌다가 끝에 가면 천천히 돌아가도록 함
    rouletteEl.style.animationFillMode = "forwards"
    // 룰렛이 멈춘 후에 상태 유지

    document.documentElement.style.setProperty(
      "--roulette-angle",
      rouletteAngle + "deg"
    )
    //css의 root에 선언해놓은 변수에 값 할당함.

    const toId = setTimeout(() => {
      alert(POINT_ARRAY[pick])
      clearTimeout(toId)
    }, (ROTATION_SECOND + 0.3) * 1000)
    // 룰렛 멈추고나서 alert창 표시
  }
  return {
    startRoulette,
  }
}
```

```css
/* roulette.css */
<style>
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(var(--roulette-angle));
		}
	}
</style>

```

이 코드는 룰렛의 한 영역당 중심각이 모두 동일하다는 전제에서만 정상 작동한다. 만약 특정 영역의 확률은 낮추고, 다른 영역을 높이려면 랜덤값을 뽑는 `pick` 변수 부분을 조정해야 할 것 같다.
