---
title: vue-chart에서 비동기 통신 후 화면에 반영하기
date: "2023-06-27T22:12:03.284Z"
description: 서버 통신 후에 화면을 리렌더링 하는 방법
category: Vue
---

_2023-03-09에 작성된 [원문](https://ps-hjhj97.tistory.com/221)을 수정한 버전입니다_

## 문제상황

vue3 환경에서 chart.js 라이브러리를 사용하여 차트 데이터를 화면에 그리려고 한다. 그냥 바닐라 JS를 활용할 수도 있겠지만, 더 편리한 방법으로는 vue 기반으로 래핑해놓은 [vue-chart-3](https://vue-chart-3.netlify.app/)를 활용하려고 한다. 그래서 공식문서 [데모 페이지](https://codesandbox.io/s/demo-vue-chart-3-ugynm?from-embed=&file=/src/App.vue)에 나와있는 대로 따라하려고 하니 문제가 하나 생겼다.

내가 화면에 보여줄 데이터는 서버와 비동기 통신을 통해서 받아온 다음에 그려야 한다. 그런데 데모 소스코드 상에서는 데이터가 아래와 같이 그냥 하드코딩 되어 있었다.

```jsx
    // <template>
    <DoughnutChart :chartData="testData" />
    ...

    // <script>
    const dataValues = ref([30, 40, 60, 70, 5]);
    const dataLabels = ref(["Paris", "Nîmes", "Toulon", "Perpignan", "Autre"]);
    const testData =  {
      labels: dataLabels.value,
      datasets: [
        {
          data: dataValues.value,
        },
      ],
    };
```

실제 chart.js를 활용하는 사례에서는 데이터를 하드코딩해서 넣는 경우보단, 비동기로 넣는 경우가 더 일반적이다. 하지만 chart.js는 차트를 그리는 데 필요한 데이터를 받으면 곧바로 `<canvas>`로 그려버리기 때문에, 그 이후에는 비동기로 데이터가 도착한다고 한들 차트가 변하지 않는다는 문제가 있다.

예를 들어 아래 코드와 같이 비동기 통신을 가장한 `fetchData`함수가 `onMounted`에서 실행된다 하더라도 차트는 그려지지 않는다.

```javascript
const dataValues = ref([])
const dataLabels = ref([])

onMounted(() => {
  fetchData().then(res => {
    dataValues.value = res.map(item => item.data)
    dataLabels.value = res.map(item => item.label)
  })
})

const testData = {
  labels: dataLabels.value,
  datasets: [
    {
      data: dataValues.value,
    },
  ],
}

const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        { data: 10, label: "a" },
        { data: 30, label: "b" },
        { data: 15, label: "c" },
        { data: 5, label: "d" },
        { data: 20, label: "e" },
      ])
    }, 1000)
  })
}
```

## 해결방법

이를 해결하기 위해서는 차트의 props에 해당하는 `testData`에 반응성을 주입시켜야 한다. 그러면 `fetchData`에서 1초 뒤에 값을 받아오고 나서 `testData`도 받아온 값으로 업데이트된다.  
 `testData`에 반응성을 부여하려면 `computed` 를 사용하여 감싸주면 된다.

```javascript
// Before
const testData = {
  labels: dataLabels.value,
  datasets: [
    {
      data: dataValues.value,
    },
  ],
}

// After
const testData = computed(() => {
  return {
    labels: dataLabels.value,
    datasets: [
      {
        data: dataValues.value,
      },
    ],
  }
})
```

## 구현

<iframe src="https://codesandbox.io/embed/vue-chart-3nbvlh?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue-chart"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
