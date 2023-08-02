---
title: 모바일 환경에서 모달 닫기
date: "2023-08-03T22:12:00.000Z"
description: (Feat. 뒤로가기와의 싸움)
category: Vue
---

_2023-03-09에 작성된 [원문](https://ps-hjhj97.tistory.com/222)을 수정한 버전입니다_

## 모달 닫기

모바일 환경에서 모달창이 떠 있는 상태에서 모달을 닫는 방법은 여러가지가 있을 수 있다.

첫 번째 방법은 모달 창 내부에 별도의 `X`버튼을 표시해서 이 영역을 터치하면 닫히게 하는 방법이 있다. 가장 직관적인 방법이지만 버튼을 위한 별도의 공간을 확보해야 하기 때문에 디자인상 의도치 않은 공간을 차지한다는 단점이 있다.

이런 단점을 해결하기 위한 두 번째 방법은 모달 바깥의 영역을 터치를 감지했을 때 모달을 닫는 방법이 있다. 다만 이 방법 역시 명시적인 '닫기'버튼이 보이지 않기 때문에 이러한 UI/UX가 낯선 사용자에게는 모달을 어떻게 닫아야 하는지 헤맬 수도 있다는 단점이 있다.

세 번째 방법은 (안드로이드 환경에서) 뒤로가기 버튼을 눌렀을 때 모달이 닫히게 하는 방법이다. 이 방법의 경우, 모달창과 직접적인 상호작용이 일어나지 않으므로 개발자 입장에서는 뒤로가기 이벤트를 감지해야 하는 등 꽤나 까다로운 작업이다. 이번 글에서는 그 방법에 대해서 설명하겠다.

## 뒤로가기

'뒤로가기'를 눌렀을 때 모달창이 닫히게 만들기 위해서는, 모달창이 열려있는 상태를 `window`객체의 `history`에 저장(push)해야 한다. 이때 사용하는 함수가 `window.history.pushState()`함수이다. 이 함수에 대한 [자세한 설명](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)은 MDN을 참고하기 바란다.

`pushState()`함수의 첫 번째 인자로는 `state`를 전달해야 하는데, 정해진 양식이 있는 것이 아니라 개발자가 식별할 수 있는 정보를 담아서 객체 형태로 넘기기만 하면 된다. 나는 `{state : 'modal'}` 객체를 넣었다. 두 번째 인자는 아무 의미는 없지만 생략할 수는 없으므로 빈 문자열이나 `undefined`를 넣으면 된다.

```jsx
<template>
  <div>
    <p>Hello World</p>
    <button @click="openModal">open</button>

    <!-- Modal -->
    <teleport to="#modal" v-if="isModalOpen">
      <Modal @close-modal="closeModal" />
    </teleport>
  </div>
</template>

<script setup>
  const isModalOpen = ref(false);

  const openModal = () => {
    isModalOpen.value = true;
  };
  const closeModal = () => {
    isModalOpen.value = false;
  };
</script>
```

이전 포스팅에서 `<teleport>`안의 코드는 `Modal.vue`라는 별도의 컴포넌트로 분리해두었다.

```jsx
// Modal.vue
<template>
  <div class="modal">
    <div class="modal-content">
      <p>This is Modal</p>
      <button @click="closeModal">X</button>
    </div>
  </div>
</template>
<script setup>
  const emit = defineEmits(['close-modal']);
  onMounted(() => {
    window.history.pushState({ state: 'modal' }, undefined);
  });
  const closeModal = () => {
    emit('close-modal');
  };
</script>
```

<br />

이제 버튼을 누르면 모달이 열리면서 `history`에 `{state:'modal'}`이 추가됨을 확인할 수 있다. 하지만 여기서 뒤로가기를 누르더라도 모달이 닫히지는 않는다. 왜냐하면 `isModalOpen`값은 여전히 `true`이기 때문이다. 따라서 '뒤로가기'가 실행되면 `closeModal`함수가 실행되게끔 만들어야 한다.

자바스크립트에서 뒤로가기 이벤트를 감지하려면 `popstate`라는 함수를 이벤트리스너에 등록해야 한다. 따라서 `onMounted`함수에 아래와 같이 추가한다.

```jsx
onMounted(() => {
  window.history.pushState({ state: "modal" }, undefined)
  window.addEventListener("popstate", closeModal)
})
```

이제 '뒤로가기'를 누르면 모달창도 닫힌고, `history`도 다시 `pop`된다.

**하지만 아직 한 가지 문제점이 남아있다.** '뒤로가기'를 누르지 않고 그냥 `X`버튼을 눌러서 닫게 되면 모달을 닫히지만, `history`가 `pop`되지 못하고 쌓여있게 된다. 즉 모달은 닫혀 있지만 `window.history`를 찍어보면 `{state:'modal'}`인 상태로 남아있다는 것이다.

즉 모달이 닫힐 때 '뒤로가기'를 눌러서 닫힌 건지,`X`버튼을 눌러서 닫힌 건지 구분해주어야 한다. 따라서 `closeModal`함수의 인자로 뒤로가기가 눌렸는지를 확인하는 인자를 받도록 수정한다.

```jsx
const closeModal = (isBackward = false) => {
  if (!isBackward) {
    history.back()
  }
  emit("close-modal")
}
```

버튼을 눌러서 닫았다면 `isBackward`값이 `false`로 들어와 `history.back()`를 호출하여 상태를 한단계 `pop`해주면 된다.

<img src="https://raw.githubusercontent.com/hjhj97/blog.gatsby/main/content/blog/vue/images/vue-modal-backward.gif"  />

전체코드는 아래와 같다.

```jsx
// Modal.vue
<template>
  <div class="modal">
    <div class="modal-content">
      <p>This is Modal</p>
      <button @click="closeModal(false)">X</button>
    </div>
  </div>
</template>

<script setup>
  const emit = defineEmits(['close-modal']);

  onMounted(() => {
    window.history.pushState({ state: 'modal' }, undefined);
    window.addEventListener('popstate', () => closeModal(true));
  });
  onUnmounted(() => {
    window.removeEventListener('popstate', () => closeModal(true));
  });
  const closeModal = (isBackward = false) => {
    if (!isBackward) {
      history.back();
    }
    emit('close-modal');
  };
</script>
```
