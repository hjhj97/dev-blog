---
title: v-model 원리와 커스텀 컴포넌트 만들기 (2 of 2)
date: "2023-07-02T22:12:03.284Z"
description:
category: Vue
---

_2023-04-04에 작성된 [원문](https://ps-hjhj97.tistory.com/226)을 수정한 버전입니다_

[지난 포스팅](https://juheon.dev/vue/230701-vmodel-and-custom-component-1/)에서 `v-model`의 작동원리와 커스텀 컴포넌트를 만드는 방법에 대해서 살펴보았다. 이번 포스팅에서는 만들어진 컴포넌트에다 각각의 `input` 특성에 맞는 로직을 구현해보도록 하겠다.

## 기본 구조

부모 컴포넌트인 `MainPage.vue`와 전화번호를 위한 `InputContact.vue`, 이메일을 위한 `InputEmail.vue`를 자식 컴포넌트로 구성한다. 자식 컴포넌트는 지난 포스팅에서 다루었던 `MyInput.vue`를 베이스로 작성했다.

```
App.vue
└── MainPage.vue
  ├── InputContact.vue
  └── InputEmail.vue
```

연락처와 이메일과 관련된 변수는 당연히 `MainPage.vue`에서만 관리하고, 두 `Input*.vue`에는 `props`로 전달하여 데이터 처리 로직 수행 후, `emit('update:modelValue')`로 가공된 데이터를 넘겨주는 방식이다.

## 전화번호를 위한 input

전화번호를 입력하는 `input`을 생각해보자. 우선적으로 필요한 기능은 전화번호 사이마다 '-'를 넣어주는 기능이다. 예를 들어 사용자가 `01012345678`를 입력한다면 `input`은 `010-1234-5678`로 표시되도록 해야한다.

그래서 일단 전화번호 포맷팅을 수행하는 `formatContact()` 함수에 정규표현식을 사용하려고 한다. 전화번호 포맷팅 관련 정규표현식은 구글링을 해봐도 쉽게 찾을 수 있지만 내가 사용한 정규표현식은 아래와 같다.

```javascript
const formatContact = rawString => {
  const formatted = rawString
    .replace(/[^0-9]/g, "") // 숫자만 필터링하기
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3") // 3,4,4자리로 끊고 -로 구분
    .replace(/(\-{1,2})$/g, "") //아직 숫자 입력되기 전의 -는 가려주기
  return formatted
}
```

이 `formatContact`함수를 `@input`의 콜백함수에 넣어주고, `emit`함수를 호출할 때도 `formatted`된 값을 부모 컴포넌트(`MainPage.vue`)에 넘겨야한다.

#### InputContact.vue

```jsx
...

const emit = defineEmits(["update:modelValue"]);

const onInput = (e) => {
  const newValue = e.target.value;
    const formatted = formatContact(newValue);
    emit("update:modelValue", newValue);
};

const formatContact = (rawString) => {
  const formatted = rawString
    .replace(/[^0-9]/g, "") // 숫자만 필터링하기
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3") // 3,4,4자리로 끊고 -로 구분
    .replace(/(\-{1,2})$/g, ""); //아직 숫자 입력되기 전의 -는 가려주기
  return formatted;
};

```

`MainPage.vue`는 그냥 일반적인 `<input>` 태그를 다룰 때처럼만 작성하면 된다. 커스텀 컴포넌트로 변경했다고 한들, 부모 컴포넌트가 데이터 처리 로직에 관여해서 안되고 `Input*.vue`에서 `emit`되는 이벤트에만 의존하고 있어야 한다.

#### MainPage.vue

```jsx
<template>
  <div>
    <InputContact v-model="contact" />
    <p>contact : {{ contact }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import InputContact from "@/components/InputContact.vue";

const contact = ref("");
</script>
```

#### 선택적으로 포맷팅하고 싶다면?

위 코드에서는 전화번호가 항상 포맷팅되지만, 상황에 따라서는 포맷팅되지 않는 걸 원할 수도 있다. `props`로 `useFormat` 을 받아서 이 값이 `true`일 때만 포맷팅되도록 할 수도 있다.

#### InputContact.vue

```jsx
const props = defineProps({
  modelValue: String,
  useFormat: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(["update:modelValue"])

const onInput = e => {
  const newValue = e.target.value
  if (props.useFormat) {
    const formatted = formatContact(newValue)
    emit("update:modelValue", formatted)
  } else {
    emit("update:modelValue", newValue)
  }
}

const formatContact = rawString => {
  const formatted = rawString
    .replace(/[^0-9]/g, "") // 숫자만 필터링하기
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3") // 3자리,4자리,4자리로 끊고 -로 구분하기
    .replace(/(\-{1,2})$/g, "") //아직 숫자 입력되기 전의 -는 가려주기
  return formatted
}
```

#### MainPage.vue

```jsx
  <InputContact :useFormat="true" v-model="contact" />
```

## 이메일을 위한 input

이번에는 이메일을 입력받는 `InputEmail.vue`를 살펴볼텐데, 전화번호와는 다르게 유효성을 검증하는 기능을 하나 추가하려고 한다. 이메일 유효성을 검증하는데에도 역시 구글링해보면 정규표현식이 많이 나오긴 하지만 여기서는 편하게 `email-validator`라는 npm 패키지를 사용했다.

큰 틀에서는 `InputContact.vue`와 동일하나, `@input` 이벤트마다 유효성 검증을 거친 값을 부모 컴포넌트인 `MainPage.vue`에 `emit`으로 전달해주어야 한다. 따라서 나는 `emit('is-valid',유효성여부)`으로 지정했다.

```jsx
<template>
  <input type="email" :value="modelValue" @input="onInput" />
</template>

<script setup>
import { ref } from "vue";
import * as EmailValidator from "email-validator";

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue", "is-valid"]);

const onInput = (e) => {
  const newValue = e.target.value;
  const isEmailValid = checkEmailValid(newValue);
  emit("is-valid", isEmailValid);
  emit("update:modelValue", newValue);
};

const checkEmailValid = (email) => {
  return EmailValidator.validate(email);
};
</script>

```

그러면 `MainPage.vue`에서는 `emit`으로 보낸 값을 `@is-valid`로 받고 콜백함수에서 유효성 여부를 인자로 받을 수 있다. 콜백함수를 위한 별도의 함수를 하나 만들어도 되긴 하는데, 예제 상에서는 만들지 않고 `isEmailValid`라는 변수에 직접 넣어주는 방식을 선택하였다.

#### MainPage.vue

```jsx
<template>
  <div>
    <InputEmail v-model="email" @is-valid="(data) => (isEmailValid = data)" />
    <p>email : {{ email }}</p>
    <p>valid : {{ isEmailValid }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import InputEmail from "@/components/InputEmail.vue";

const email = ref("");

const isEmailValid = ref(null);
</script>
```

## 구현

<iframe src="https://codesandbox.io/embed/vue-custom-input-2-mcx2wv?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue-custom-input-2"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
