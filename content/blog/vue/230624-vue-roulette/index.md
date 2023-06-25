---
title: CSS,JS를 이용한 룰렛 구현
description:
date: "2023-06-24T22:12:00.000Z"
category: JS
---

_2022-11-12 에 작성된 [원문](https://ps-hjhj97.tistory.com/214)을 수정한 버전입니다_

## 룰렛 이벤트

다들 온라인이나 오프라인에서 룰렛(회전판)을 돌려서 나온 상품을 추첨받는 경험 한 번씩 있을 것이다. 현실에서의 룰렛은 공평한 물리법칙에 내 운명을 맡기면 되지만, 웹페이지(프론트엔드)상에서 구현할 때는 룰렛을 어떻게 돌아가게 만들고 어떤 영역을 가리키도록 해야할까? 마침 진행 중인 프로젝트에서 룰렛을 구현해야 했는데 구글링이나 오픈소스에는 내가 원하는 기능이 없어서 직접 구현하게 되었다.

#### 요구조건

1. 사용자가 버튼을 누르면 백엔드 API가 호출되고 리턴값으로 당첨영역을 받는다. 이 영역의 위치에 따라 회전 각도를 조절해야한다.

2. 현실에서 룰렛이 회전하는 것처럼, 처음에는 천천히 돌다가 점점 가속도가 붙어서 빨라지고 마지막에는 느려지다 멈춘다.

#### 구현 방식

가장 쉽게 생각해볼 수 있는 방법은 css animation을 활용하여 rotate시키는 방법이다.
아래와 같이 `spin`이라는 keyframs를 정의하고 `rotate(360deg)`를 부여하면 한 element를 한바퀴 돌릴 수 있다.

```css
/* roulette.css */
.roulette_content {
  animation-name: spin;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
```

하지만 **요구조건 1**에서 언급했다시피 당첨영역, 즉 회전 각도는 고정된 값이 아니라 서버에서 리턴받는 값에 따라서 동적으로 변해야 한다. 그래서 나는 `js`단에서 css keyframes에 접근하여 rotate각도를 직접 수정할 수 있는지를 찾아보았다. 예를 들어 DOM element의 `backgroundColor`나 `fontSize`는 `querySelector()`함수를 이용해 접근할 수 있는 것처럼 animation도 그런 작업이 가능한 지 궁금했다.

결론부터 얘기하자면, 가능은 하지만 방법이 너무 복잡했다.[(링크)](https://stackoverflow.com/questions/59573722/how-can-i-set-a-css-keyframes-in-javascript)  
`insertRule()`함수를 이용해서 넣는 방식이었는데 keyframe부분을 직접 문자열로 하드코딩해야하기 때문에 너무 억지인 것 같아서 다른 방법을 찾아보기로 하였다.

#### css var()를 활용한 방식

다른 방법으로 생각해낸 건 아래와 같이 css의 var()를 활용해서 :root에서 선언해놓은 변수 값을 keyframes에서 갖다 쓰는 방식이다. root 영역의 값은 `js`단에서 `setProperty()`함수를 활용해서 조작할 수 있기 때문에 이 방식이 더 낫다고 판단하였다.

```css
/*roulette.css*/
.roulette_content {
  animation-name: spin;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(var(--roulette-angle));
    }
  }
}
```

#### 룰렛의 파라미터

룰렛을 돌리기 전에 결정되어야 할 파라미터가 몇 가지가 있다.

1. 룰렛을 최소 몇 바퀴 돌릴 것인지
2. 룰렛을 몇 초 동안 돌릴 것인지
3. 룰렛 안에 채워져 있는 컨텐츠

이 3가지가 채워지고나면 룰렛을 돌릴 수 있게 된다.

원리는 간단하다. 룰렛의 중심각이 360도이다. 따라서 `360/(영역의 개수)` 를 계산하면 룰렛의 각 영역당 중심각의 크기`(=degPerSection)`를 구할 수 있다.  
그리고 당첨된 영역`(=pick)`이 (반시계방향 기준)몇 번째인지 구하여 `degPerSection * pick` 값이 룰렛을 회전시켜야하는 각도 값`(=rouletteAngle)`이 된다.
이 값을 root에 `--roulette-angle`로 저장시키면 `var()`함수를 이용하여 keyframes에서도 이 값을 가져다 쓸 수 있는 방식이다.

그래서 `startRoulette()`함수를 실행시키면 `rouletteAngle`값이 정해지고 이 값은 다시 :root의 `roulette-angle`으로 채워져서 spin animation이 작동하게 된다.

```jsx
const useRoulette = () => {
  const POINT_ARRAY = ["red", "blue", "green", "yellow"]
  // 룰렛의 내용, 12시 방향부터 반시계방향
  const MIN_ROTATION = 3
  // 룰렛을 최소 몇 바퀴 돌릴 것인지
  const ROTATION_SECOND = 2
  // 몇 초동안 돌릴 것인지

  const numberOfSection = POINT_ARRAY.length
  // 룰렛에 적힌 영역의 개수
  const degPerSection = 360 / numberOfSection
  // 하나의 섹션당 각도가 몇 도인지 계산함.
  let pickedSection
  // 당첨된 영역

  const setRouletteProperty = () => {
    const pick = Math.floor(Math.random() * numberOfSection)
    // [0, section - 1]범위에 랜덤한 인덱스를 뽑음, 서버에서 영역을 정해준다면 필요없음
    pickedSection = POINT_ARRAY[pick]
    // 당첨된 영역 값 대입
    const rouletteAngle = 360 * MIN_ROTATION + degPerSection * pick
    // 최소 MIN_ROTATION만큼은 돌고난 후에, pick 영역을 가르키도록 함

    document.documentElement.style.setProperty(
      "--roulette-angle",
      rouletteAngle + "deg"
    )
    //css의 root에 선언해놓은 변수에 값 할당함.

    const rouletteEl = document.querySelector(".roulette_content")
    rouletteEl.style.animationDuration = `${ROTATION_SECOND * 1000}ms`
    // 애니메이션(룰렛회전) 지속시간 적용
  }

  const startRoulette = () => {
    setRouletteProperty()

    const toId = setTimeout(() => {
      alert(pickedSection)
      clearTimeout(toId)
    }, ROTATION_SECOND * 1000)
  }
  return {
    startRoulette,
  }
}
```

```css
/* roulette.css */
.roulette_content {
  animation-name: spin;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(var(--roulette-angle));
  }
}
```

## 구현

<iframe src="https://codesandbox.io/embed/vue3-roulette-cu4617?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Vue3-roulette"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
