---
title: Vue에서 한글을 입력할 때 생기는 2가지 이슈
date: "2025-01-06"
description: IME로 인한 이슈와 해결 방안
category: Vue
keywords: Vue,한글,IME
---

## 문제의 원인

한글은 영어와 같은 언어와 달리 조합형 언어이기 때문에 글자를 입력할 때 조합이 완성되기 전까지는 글자가 화면에 표시되지 않는다. 이러한 특성 때문에 한글 입력 시 몇 가지 이슈가 존재한다.

예를 들어 사용자가 `안전` 이라는 글자를 입력하려는 상황을 가정해보자.  
사용자는 키보드로 `'ㅇ'` - `'ㅏ'` - `'ㄴ'` - `'ㅈ'` - `'ㅓ'` - `'ㄴ'` 순으로 총 6번을 입력할 것이다. 설명상 편의를 위해 `'ㅇ'(1)` - `'ㅏ'(2)` - `'ㄴ'(3)` - `'ㅈ'(4)` - `'ㅓ'(5)` - `'ㄴ'(6)` 으로 인덱싱을 매겨보자.

컴퓨터 입장에서는 2번째 입력까지는 `아` 라는 글자 조합이 완성된 상태이다. 여기서 3번째 `ㄴ`이 들어왔을 때 `ㄴ`을 현재 글자(`아`)의 받침(종성)으로 간주할 것인지, 다음 글자의 초성으로 간주할 것인지 알 수 없다는 문제가 생긴다. 이 때문에 우선 임시로 `ㄴ`을 받침으로 넣어두고(`안`), 4번째 글자의 입력에 따라 어떻게 처리할지 결정하게 된다.

4번째 글자는 `ㅈ`이다. 이로써 3번째 글자인 `ㄴ`은 받침으로 처리하는 것은 확정되었다. 만약 `ㅈ`이 아닌 모음이 입력되었다면 `안`에서 `ㄴ`은 받침이 아닌, 다음 글자의 초성으로 처리될 것이다.  
하지만 여전히 `ㅈ`은 `ㄴ`과 결합하여 `ㄵ` 이라는 받침으로 처리될 여지가 있다. 따라서 4번째 입력까지도 `앉`일지, `안ㅈ`일지 알 수 없는 상태이며 5번째 글자의 종류에 의존적이게 된다. 자음이 온다면 `앉`으로, 모음이 온다면 `안ㅈ`로 처리될 것이다.

5번째 입력으로 모음인 `ㅓ`을 받음으로써 비로소 4번째 글자`ㅈ`은 첫 글자의 `ㄵ` 받침이 아닌 다음 글자의 초성(`안저`)으로서 처리될 수 있는 것이다.

이처럼 **_한글은 입력 당시에는 글자의 조합을 확신할 수 없으며, 뒤따르는 글자 입력에 의존적_** 이라는 특성을 지니고 있다. 키보드에 있는 자판의 수보다 입력해야하는 글자의 종류가 많은 경우에 이러한 문제가 발생하게 되며, 이를 해결하기 위한 방법을 [IME(Input Method Editor)](https://ko.wikipedia.org/wiki/%EC%9E%85%EB%A0%A5%EA%B8%B0) 라고 한다.

## 이로 인한 현상

IME 문제로 인하여 Vue(자바스크립트)에서는 아래와 같은 2가지 상황이 발생하게 된다.

### 1. 글자의 조합이 완성되기 전까지 JS에 반영되지 않음

Vue에서 제공하는 양방향 바인딩 디렉티브 `v-model`을 사용할 때 문제가 발생한다.  
위에서 살펴본 사례처럼 4번째 입력(`ㅈ`)까지도 조합을 확신할 수 없다. 이처럼 `v-model`에서는 조합을 확신할 수 없는 상태에서는 글자를 반영하지 않으며, 5번째 입력이 들어와 첫 글자가 확정되는 순간에야 비로소 글자를 반영하게 된다.

![vmodel](https://github.com/user-attachments/assets/2babad70-e2ce-4464-9f46-5b6855f2bd19)

위 영상에서 보다시피 `앉` 을 입력할 때까지도 글자의 조합을 확신할 수 없는 상태이기 때문에 데이터가 화면에 반영되지 않는다. 5번째 글자인 `ㅓ` 입력되는 순간에 비로소 화면에 반영된다.

### 2. `maxlength` 속성에서 마지막 글자가 넘침

2번째 현상은 현재 입력 중인 글자(=조합이 확정되지 않는 글자)는 `length` 로 카운트하지 않는다는 것이다. 때문에 `input` 태그에서 `maxlength` 값을 설정해놓으면 마지막 한 글자가 넘쳐 보이는 현상이 발생한다. 해당 `input`의 `focus` 가 해제되면 정상적으로 돌아오지만 사용자 입장에서는 버그라고 느낄 여지가 있다.

![vmodel2](https://github.com/user-attachments/assets/d9ad8b41-fb62-4469-a1bd-0f278b6d13f4)

위 영상에서 `input` 태그에 `maxlength=2` 속성을 설정해놓았다. 따라서 정확히 2글자만 입력되기를 기대하지만 실제로는 3글자가 입력되는 것처럼 보이고 있다.

이 현상의 원인이 IME 의 영향도 있지만, 구글링을 해보니 유니코드로 인한 문제일 수도 있자는 [블로그 포스팅](https://mygumi.tistory.com/398)을 찾을 수 있었다. 알파벳과 같은 영어 문자는 유니코드상에서 1바이트로 처리되지만, 한글과 같은 복합 문자는 2바이트로 처리되기 때문에 이러한 현상이 발생하는 것으로 보인다.

## 해결방법

위 2가지 문제를 해결하기 위해서는 `v-model` 디렉티브를 사용하지 않고 직접 이벤트를 받아 처리해야만 한다. 이는 내가 예전에 작성한 [포스팅](https://juheon.dev/vue/230701-vmodel-and-custom-component-1/)에서 다룬 적이 있다. 당시에는 `modelValue`를 `props`로 받고, `update:modelValue`를 `emit` 하는 방식으로 처리했었다.  
이 방법도 여전히 유효하지만 이번에는 `Vue` 의 `3.4` 버전부터 제공되는 `defineModel` 을 사용하여 해결해보자.

```tsx
const model = defineModel<string>({ default: "" })
```

[공식문서](https://ko.vuejs.org/api/sfc-script-setup.html#definemodel)의 설명에 따르면 "`v-model` 을 통해 사용될 수 있는 양방향 바인딩 `prop`을 선언하는 데 사용될 수 있습니다. 내부적으로, 이 매크로는 모델 `prop`과 해당하는 값 업데이트 이벤트를 선언합니다." 라고 한다.  
즉 번거롭게 `prop`과 `emit`을 선언할 필요 없이, `model` 변수를 직접 조작하면 부모 컴포넌트에서 내려온 `v-model` 이 자동으로 반영된다는 것이다.

<details>
<summary>
  소스 코드
</summary>

```tsx
// Parent.vue
<script setup lang="ts">
const MAX_LENGTH = 2;
const msg = ref("")
</script>

<template>
  <MyInput v-model="msg" />
  <p>{{msg.length}} / {{MAX_LENGTH}}</p>
  <h1>{{msg}}</h1>
</template>
```

```tsx
// MyInput.vue
<script setup lang="ts">
const model = defineModel<string>({default : ""})
const handleInput = (e : Event) => {
    const newValue = e.target!.value
    model.value = newValue;
}
const handleSubmit = () => {
    alert(model.value)
}
</script>

<template>
    <form @submit.prevent=handleSubmit>
        <input :value="model" @input="handleInput($event)" />
        <button type="submit">Submit</button>
    </form>
</template>
```

</details>
     
<br />

이렇게 하면 첫 번째 문제는 해결되었지만 두 번째 문제였던 `maxlength` 속성에서 마지막 글자가 넘침 현상은 여전히 발생한다. 이를 해결하기 위해선 `watch`를 사용하여 `model` 문자열의 길이를 체크하고, 제한 길이를 초과할 경우 `substring` 함수를 사용하여 자르면 된다.

![custom2](https://github.com/user-attachments/assets/ce934d25-cc0b-4f07-bde5-506e338f1bb3)

<details>
<summary>
  소스 코드
</summary>

```tsx
// MyInput.vue
<script setup lang="ts">
const model = defineModel<string>({default : ""})
const attrs = useAttrs();
const MAX_LENGTH = Number(attrs.maxlength ?? Infinity)

const handleInput = (e : Event) => {
    const newValue = e.target!.value
    model.value = newValue;
}
const handleSubmit = () => {
    alert(model.value)
}
watch(model, ()=>{
  if(!model.value)  return;
  if(model.value.length > MAX_LENGTH){
    model.value = model.value.substring(0,MAX_LENGTH)
  }
})
</script>

<template>
    <form @submit.prevent=handleSubmit>
        <input :value="model" @input="handleInput($event)" :maxlength="MAX_LENGTH" />
        <button type="submit">Submit</button>
    </form>
</template>
```

</details>

### Demo

<iframe src="https://play.vuejs.org/#eNqdVG1r20AM/ivqMagDib23T5njtuvC1rF2Yy1jHwzDSc6JO/ts7iVNMf7v0+ns5AKjlPqTT3p0zyOdpJZdNE24NZxNWayWsmg0KK5NA2Um1rOUaZWyJBVF1dRSw/XjlWiMhlzWFZyGUX+2F5zuQS1InkPXg5wrFctaKLzg4vefb/Obz3dfYAZvPwzmSq3xjGFBylI2svg4cnKQHA+aV02ZaU4ngPhkMoF4VWzxDPjFmzfJJ55nptSwnVT1ipdxhLbeW5Do3oFJIV3KYFplu5KLtd6g6SAMPREFxpElgMmETmQ5Zrw0SmOK8y0X2qcbqvQywoGMLE3SthgcurCugwja9hDadXHUuFikJ6g19VJsEb3CsTG+JtY7L9bhvaoFPnlLMLasq6Youfze6ALfI2VTII/1ZWVZP3wlm5aGjwf7csOXf/9jv1c7a0vZD8kVl1uesr1PZ3LNtXPPb2/4Dv/3TqyVKRH9hPMnV3VprEYH+2jECmV7OFJ7RX1YiPWdmu80F2pIygq1yI7wKcPevHwi9YPcd+F7iktFh1X0uv55Y9OCUfxCa6nG8JDp5eZoOnAK9nNg+wUnYcXzQvBr6mOlJaaSBC0aqcFt5inrcEpcUGYvxqCBIxjt5+po3G5MteAyIHi4b0U4O4Mr7AlR6EcaPBe5yWxpXR/PIODISn0+glkyVMghBX/4lZWGI4yHrmQn4dZaHIpycgaEDGiUiNU8Zrs1i6ogOp8lw9fRgXcLqqRQqqRzjDFkllBAkQcnPhhwrWgjBRKS0/P1UwWJV6dRz3qs2g9SZuGeJHg99uKG/qAaHq0vf3nRfshrWcE53oPZho3ktq4zvwQ90NtdU+K2m8QqwY1xTnY0eA8VvKKrRs9YNf3lC6N1LUA/NvZupwgb16mII+ceZEdWt83nsFRY9w9AthMl" style="width:100%; height:800px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Reference

- https://ko.vuejs.org/api/sfc-script-setup.html#definemodel
- https://mygumi.tistory.com/398
