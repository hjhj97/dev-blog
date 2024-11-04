---
title: Web Canvas API 활용하여 GPT와 캐치마인드 하기 (3 of 3)
date: "2024-11-04"
description: 퀴즈 정확도 높여보기
category: React
---

## 여러가지 그림 테스트

지난 포스팅에서 프론트엔드와 백엔드를 연동하고 실제 그림을 그려서 문제를 맞추는 것까지 구현했다. 다만 내가 의도한 그림의 정답을 맞추지 못했는데, 다른 그림을 더 그려보고서 무엇을 잘 맞추고 못 맞추는지 경향성을 파악해보고 개선해보고자 한다.

![gpt-apple](https://github.com/user-attachments/assets/ce60344d-9167-44cd-8a16-4410aead7672)
다행히도 사과는 잘 맞췄다.

![gpt-grape](https://github.com/user-attachments/assets/239257a9-c73e-423d-a829-3d9e67e6e8e8)

포도도 맞췄다.
![gpt-melon](https://github.com/user-attachments/assets/1f4a26b2-008a-45c4-a7f2-fae7fafabfaa)
아쉽게도 수박은 맞추지 못했다.

![gpt-car](https://github.com/user-attachments/assets/3f14367f-d163-4aca-9c0a-0a6ea0a59bcd)

자동차를 그렸는데 고양이라고 추론한다.

![gpt-cat](https://github.com/user-attachments/assets/2f34f76c-af10-4b8f-9cc7-4c6d5d57b77c)

그런데 막상 고양이를 그렸는데도 못 맞췄다....
![gpt-animal](https://github.com/user-attachments/assets/bb6698ab-9cc4-4f9c-af30-be35028c73cf)
내가 그리고도 뭘 그렸는지 모르겠다. 곰과 돼지 중에서 그리고 싶었는데 잡종이 되어버렸다. 그런데 아무튼 동물인라는 사실 조차도 맞추지 못한다.

![gpt-human](https://github.com/user-attachments/assets/9e992cad-877f-4dc4-8426-3a6d036489c0)
사람을 그렸음에도 맞추지 못한다.

이 외에도 최소 20개의 각기 다른 키워드로 테스트를 해보면서 느낀 점은 다음과 같다.

- 색깔은 상당히 큰 힌트가 된다.
- 지나치게 추상화 된 그림은 맞출 확률이 떨어진다.
- gpt는 헷갈리는 이미지들은 고양이라고 대답하는 경향이 있다.(갖가지 고양이 이미지들로 학습이 된 모양이다)

~~앞으로 튜링테스트가 필요할 땐 여기서 해보자~~

## 개선할 방법이 없을까?

### 프롬프트 수정

가장 먼저 생각나는 방법은 프롬프트를 수정해보는 것이다. 현재 사용되고 있는 프롬프트는 아래와 같다.

```js
 messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What's in this image?" },
        {
          type: "image_url",
          image_url: {
            url: "https://{image_url}",
          },
        },
      ],
    },
  ],
```

공식문서와 구글링을 통해 여러 포스팅을 찾아보던 중, `role` 에 `system` 속성을 추가하여 사전에 구체적인 정보나 답변의 방향성을 제시해 준다면, 모델이 더 정확한 답을 추론할 수 있다는 글을 보았다. 그래서 아래와 같이 수정해보았다.

```js
 messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: "You are given a image file. This image is not real picture. It is a simple drawing, drawn by Canvas API.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "What’s in this image? Please summarize it within 30 characters",
            },
            {
              type: "image_url",
              image_url: {
                url: imageData,
              },
            },
          ],
        },
      ],
```

과연 이렇게 수정하면 정확도가 높아질까? 결론부터 얘기하면 별 차이가 없었다. 위에서 했던 테스트와 비슷한 결과가 나왔다.

### 파인 튜닝

OpenAI에서는 파인튜닝이라는 기능을 제공한다. 내가 직접 데이터를 준비하고 학습을 시켜서 모델을 조금 더 정확하게 만들 수 있는 것이다. [공식문서](https://platform.openai.com/docs/guides/fine-tuning)상에서 그 방법을 자세히 알려주고 있다. `JSONL` 형식의 데이터로, 최소 10개 이상의 학습 데이터가 필요하다. 나는 테스트하면서 실패했었던 그림을 위주로 학습 데이터 10개를 준비했다.

<details> 
<summary>학습 데이터</summary>

_참고로 `JSONL` 형식은 한 줄에 하나의 JSON 객체를 저장하는 텍스트 파일 형식이다. 기존 `JSON`파일과 대비하여 띄어쓰기나 줄바꿈에 민감하므로 주의하자_

```json
{"messages":[{"role":"system","content":"You are given a image file. This image is not real picture. It is a simple drawing, drawn by Canvas API."},{"role":"user","content":"What's in this image? Please summarize it within 30 characters"},{"role":"user","content":[{"type":"image_url","image_url":{"url":"https://github.com/user-attachments/assets/f2526a27-8b8d-4739-8fab-5e587914cca7"}}]},{"role":"assistant","content":"standing human"}]}
{"messages":[{"role":"system","content":"You are given a image file. This image is not real picture. It is a simple drawing, drawn by Canvas API."},{"role":"user","content":"What's in this image? Please summarize it within 30 characters"},{"role":"user","content":[{"type":"image_url","image_url":{"url":"https://github.com/user-attachments/assets/aa9c5a2a-58d7-4fb3-8832-a92bff1595c3"}}]},{"role":"assistant","content":"house"}]}
{"messages":[{"role":"system","content":"You are given a image file. This image is not real picture. It is a simple drawing, drawn by Canvas API."},{"role":"user","content":"What's in this image? Please summarize it within 30 characters"},{"role":"user","content":[{"type":"image_url","image_url":{"url":"https://github.com/user-attachments/assets/13165e76-fe33-4acb-af63-d2e352155da6"}}]},{"role":"assistant","content":"car"}]}
{"messages":[{"role":"system","content":"You are given a image file. This image is not real picture. It is a simple drawing, drawn by Canvas API."},{"role":"user","content":"What's in this image? Please summarize it within 30 characters"},{"role":"user","content":[{"type":"image_url","image_url":{"url":"https://github.com/user-attachments/assets/b50fc398-2aa3-44ad-bc8d-bb265c61d932"}}]},{"role":"assistant","content":"smile face"}]}
{"messages":[{"role":"system","content":"You are given a image file. This image is not real picture. It is a simple drawing, drawn by Canvas API."},{"role":"user","content":"What's in this image? Please summarize it within 30 characters"},{"role":"user","content":[{"type":"image_url","image_url":{"url":"https://github.com/user-attachments/assets/ed2d29e3-343b-4367-bb1d-c1a31bdb4894"}}]},{"role":"assistant","content":"grape"}]}
{"messages":[{"role":"system","content":"You are given a image file. This image is not real picture. It is a simple drawing, drawn by Canvas API."},{"role":"user","content":"What's in this image? Please summarize it within 30 characters"},{"role":"user","content":[{"type":"image_url","image_url":{"url":"https://github.com/user-attachments/assets/f0a0393f-ea8e-4b6b-87d2-56f3a5dbb3f6"}}]},{"role":"assistant","content":"apple"}]}
{"messages":[{"role":"system","content":"You are given a image file. This image is not real picture. It is a simple drawing, drawn by Canvas API."},{"role":"user","content":"What's in this image? Please summarize it within 30 characters"},{"role":"user","content":[{"type":"image_url","image_url":{"url":"https://github.com/user-attachments/assets/4c01e26b-f45c-46ab-9f46-516996974d38"}}]},{"role":"assistant","content":"laptop"}]}
{"messages":[{"role":"system","content":"You are given a image file. This image is not real picture. It is a simple drawing, drawn by Canvas API."},{"role":"user","content":"What's in this image? Please summarize it within 30 characters"},{"role":"user","content":[{"type":"image_url","image_url":{"url":"https://github.com/user-attachments/assets/f96edb43-017b-40f6-aea8-2a4466c73ef7"}}]},{"role":"assistant","content":"watermelon"}]}
{"messages":[{"role":"system","content":"You are given a image file. This image is not real picture. It is a simple drawing, drawn by Canvas API."},{"role":"user","content":"What's in this image? Please summarize it within 30 characters"},{"role":"user","content":[{"type":"image_url","image_url":{"url":"https://github.com/user-attachments/assets/03884c8e-a002-4dda-8e79-3f8daf9588fe"}}]},{"role":"assistant","content":"sword"}]}
{"messages":[{"role":"system","content":"You are given a image file. This image is not real picture. It is a simple drawing, drawn by Canvas API."},{"role":"user","content":"What's in this image? Please summarize it within 30 characters"},{"role":"user","content":[{"type":"image_url","image_url":{"url":"https://github.com/user-attachments/assets/f818024e-0246-4503-88c3-d455376a75da"}}]},{"role":"assistant","content":"cat"}]}
```

</details>
<br/ >
파인 튜닝은 대시보드에서 대시보드에서 파인 튜닝 탭을 들어가면 파인 튜닝을 진행할 수 있다. 파인 튜닝을 적용할 모델도 여러 종류가 있는데, 이미지를 학습시킬 수 있는 모델은 현시점에서는 오직 `gpt-4o` 모델만 가능했다. 그 외의 hyperparameter로 Batch-size나 epoch 수를 설정할 수도 있었지만, 이번에는 따로 설정하지 않고 auto 로 두었다.

그러고 나서 job을 생성하면 학습이 시작된다. 학습이 진행되는 동안에는 아래 화면과 같이 학습의 step별로 loss가 점점 줄어드는 걸 볼 수 있다.

![fine-tuning](https://github.com/user-attachments/assets/ca798d26-3e3b-4522-973a-e416e087ff31)

하나의 job은 총 100번의 step으로 이루어져 있으며 시간은 약 5분이 소요되었다. 학습이 완료된 모델은 `ft:gpt-4o-2024-08-06:personal:canvas-quiz:APlr42xm` 와 같이 고유한 모델명이 새롭게 부여되며, 백엔드에서 이 모델을 사용하도록 설정하면 된다.

> 참고로 파인튜닝 비용은 꽤나 비싼 편이므로 주의해야한다. 10개의 이미지 데이터를 학습시키는데 약 2달러가 소모된다. 일반 `gpt-4o-mini` 모델은 30회 호출당 약 0.1달러가 소모되었다.

### 파인튜닝 모델 테스트

이제 새롭게 만들어진 모델로 처음에 실패했던 그림을 다시 넣어보자.

![fine-tuning-house](https://github.com/user-attachments/assets/f1b43b10-aaf8-40bc-9c37-b82e8f611982)

드디어 집을 제대로 인식하기 시작했다!!

![fine-tuning-watermelon](https://github.com/user-attachments/assets/0293559d-deb4-4bb8-b7ba-2c2ddea661c8)
수박도 정상적으로 인식한다. 그럼 자동차는 어떨까?

![fine-tuning-car](https://github.com/user-attachments/assets/eb8cd6f7-5f84-4c43-b915-a34d8db5d80a)

> GPT Think : house

응??? 이게 어딜봐서 집이란 거지???

![fine-tuning-human](https://github.com/user-attachments/assets/83f762d2-3067-4435-a9f2-8d8ed09ff277)

사람을 그렸음에도 집이라고 인식해버렸다. 대체 왜 이런 일이 생기는 걸까?

### 파인튜닝 모델의 문제점

머신러닝을 조금이라도 공부해본 사람이라면 짐작하다시피, Overfitting 문제가 발생하고 있다는 걸 알 수 있다. 학습 데이터에 너무 치중되어 학습된 모델이라, 학습 데이터에 없는 데이터는 제대로 추론하지 못하는 경향이 있다. 이러한 문제를 해결하기 위해서는 더 많은 데이터를 학습시켜야만 한다. 학습 데이터를 만들기 위해서는 내가 손수 그림을 그려야 하는데, 이는 시간과 노력이 많이 소요되므로 다음으로 미뤄야겠다.

## 마무리

이로써 프론트엔드, 백엔드, (나름)최적화까지 모두 진행해보았다. 사실 대충 굴러가게끔만 만든 상태여서 상용에 배포하기 전까지는 몇가지 기능들을 더 다듬어야 할 것 같다. 앞으로 추가할 기능은 다음과 같다.

- 실행 취소(undo) 기능 추가
- 내가 그린 그림 게시판에 자랑하기
- OAuth 로그인 연동
- 상용 배포

그래도 머릿속으로만 떠돌던 아이디어를 직접 끄집어내서 구현해낸 프로젝트라서 뿌듯하다!
