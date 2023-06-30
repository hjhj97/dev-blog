---
title: v-model의 원리와 커스텀 컴포넌트 만들기
date: "2023-07-01T22:12:03.284Z"
description: v-model은 어떻게 작동할까?
category: Vue
---

_2023-04-04에 작성된 [원문](https://ps-hjhj97.tistory.com/226)을 수정한 버전입니다_

## 반복되는 `input` 태그

페이지를 개발할 때 여러 종류의 `input`태그가 필요하다. 예를 들어 '오늘의 집'의 주문 페이지를 살펴보자.

<div align="center" >
<img src="./input-tag-1.png" height="600" />
</div>
<!--![](./input-tag-1.png)-->

- 이름이나 주소같은 단순한 텍스트 : `<input type="text">`
- 문자가 아닌 오직 숫자만 입력받을 겨우 `<input type="number">`
- 전화번호 형식 `<input type="tel">`
- 이메일 형식 `<input type="email">`

  `type`속성으로만으로도 어느정도 해결할 수는 있지만,
  이러한 기능을 가진 `input` 태그들이 프로젝트에서 반복적으로 사용된다면 컴포넌트로 분리시켜 공통화하고 싶다는 생각이 든다. 그렇게 함으로써 각 `Input` 컴포넌트별로 특정 기능에만 집중하도록 분리할 수 있다. 그렇다면 커스텀 컴포넌트화 시키려면 어떻게 해야하는지 살펴보자.

  우선 vue에는 input태그에 `v-model`이라는 양방향 데이터 바인딩이라는 강력한 기능을 제공한다. 하지만 컴포넌트화 시켜서 부모-자식간의 관계가 형성되면 부모 컴포넌트에서 자식 컴포넌트로 `v-model`를 별도로 연결시켜주어야만 양방향 데이터 바인딩 기능을 유지할 수 있다.  
  방법은 어렵지 않다. 사실 부모 컴포넌트 입장에서는 컴포넌트화하기 이전 코드와 동일하게 `v-model="data"`를 걸어주기만 하면 된다. 이렇게만 하면 자식 컴포넌트의 `props`에서 자동으로 `modelValue`라는 이름으로 받을 수 있게 된다.  
  별도로 처리가 필요한건 자식 컴포넌트이다. 자식 컴포넌트에서는 `v-model="modelValue"`로 처리할 수 있으면 좋으련만, 아쉽게도 불가능하다. 왜냐하면 자식 컴포넌트에서 `props`의 값은 직접 변형이 불가능하기 때문이다. `v-model`은 input태그의 `value`와 `@input`이벤트를 동시에 처리해주는 디렉티브인데, `@input="modelValue = $event.target.value"`는 `props`의 값을 직접 변형하는 코드이기 때문이다. 이를 해결하기 위해서는 자식 컴포넌트 입장에서는 부모 컴포넌트에게 `emit()`으로 '값이 `$event.target.value`'로 변했다는 정보만 전달하고, 실질적인 값의 변형은 부모 컴포넌트에서 진행되야 한다.

#### MainPage.vue (parent)

```jsx
<template>
  <div>
    <InputNumber v-model="number" />
    <p>number : {{ number }}</p>
  </div>
  <div>
    <InputText v-model="text" />
    <p>text:{{ text }}</p>
  </div>
</template>

<script>
import InputNumber from "@/components/InputNumber.vue";
import InputText from "@/components/InputText.vue";
import { ref } from "vue";

export default {
  components: { InputNumber, InputText },
  setup() {
    let number = ref(0);
    let text = ref("");

    return {
      number,
      text,
    };
  },
};
</script>
```

#### InputNumber.vue (child)

```jsx
<template>
  <input
    type="number"
    placeholder="number"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
<script>
export default {
  props: {
    // 부모 컴포넌트에서 내려준 v-model 값
    modelValue: Number,
  },
};
</script>
```

#### InputText.vue (child)

```jsx
<template>
  <input
    type="text"
    placeholder="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
<script>
export default {
  props: {
    // 부모 컴포넌트에서 내려준 v-model 값
    modelValue: String,
  },
};
</script>
```

## input의 성격별로 컴포넌트를 나누자
