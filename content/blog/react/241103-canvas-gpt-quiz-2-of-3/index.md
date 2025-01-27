---
title: Web Canvas API 활용하여 GPT와 캐치마인드 하기 (2 of 3)
date: "2024-11-03"
description: OpenAI API와 백엔드 연동하기
category: React
---

지난 포스팅에서는 프론트엔드에서 Canvas API를 활용하여 그림판 페이지를 만들었다. 이번 포스팅에서는 OpenAI API와 Express 기반의 백엔드 서버와 연동하는 과정을 다루고자 한다.

## OpenAI API 연동

OpenAI와 연동하기 위해서 [공식 사이트](https://openai.com/index/openai-api/)로 들어가서 가장 먼저 가격정책을 확인해보았다. 생성형 AI 모델의 API를 사용해보기는 이번이 처음이기 때문에 가격이 대략 어느정도인지 파악하기 위해서이다. 혹시나 멋모르고 API 호출을 왕창 했다가 비용이 과도하게 청구되는 참사는 미연에 방지해야 한다(예전에 AWS의 RDS를 처음 사용했을 때 5만원이 청구되었던 뼈아픈 경험이 있기 때문이다).

가격정책은 [이곳](https://openai.com/api/pricing/)에서 확인해 볼 수 있다. 제공하는 모델도 여러개이고, 텍스트냐 이미지냐에 따라서도 가격이 천차만별이기 때문에 감을 잡기가 쉽지 않았다. 이렇게 헷갈릴 때는 그냥 직접 사용해보면서 비용을 체감하는 편이 더 나은 것 같다. 계정을 로그인 하고 나서 API 키를 발급받아야 하는데, 이 과정은 공식 사이트에 잘 나와있으니 참고하면 된다.

참고로, 예전에는 제공했었던 무료크레딧 정책이 현재는 중단된 것으로 보인다. 구글링을 통해 각종 커뮤니티를 살펴보니 다들 직접 결제를 하고 나서 사용하는 추세였다. 신용카드를 등록하고 나면 크레딧을 충전할 수 있는데 최소 금액은 5달러이다. 그래서 나도 처음에는 5달러를 충전해 놓고 시작했다. 그러면 대시보드에서의 Usage 탭에서 현재 계정의 사용량과 남은 금액에 대한 정보를 볼 수 있다.
![dashboard](https://github.com/user-attachments/assets/6aae1d06-1690-416c-8529-d50df8dd62d6)

## Express API 서버 구성

이제 지난 포스팅에서 만들었던 프론트엔드 서버의 API 요청을 처리해줄 API 서버를 만들고자 한다. 서버는 Express를 사용하여 간단하게 구성할 것이다. 기본적인 예제 코드들은 [공식 사이트](https://platform.openai.com/docs/guides/text-generation)에서 제공해주기 때문에 참고하면 편리하다. 특히나 내가 원하는 프롬프트인 '이미지 파일을 전달하면 해당 이미지를 분석'하라는 내용도 아래와 같이 적혀있었다.

```js
...
const openai = new OpenAI()
const completion = await openai.chat.completions.create({
  model: "gpt-4o",
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
})
```

`url` 부분에는 이미지 경로 혹은 Base64 인코딩된 이미지 데이터를 넣어주면 되는데, 나는 프론트엔드에서 이미지를 받아올 것이기 때문에 이미지 데이터를 넣어줄 것이다. 추후에 유저가 원할 경우에 게시판 페이지에서 본인이 그린 이미지를 업로드할 수 있는 기능을 추가할 예정이지만, 현재로서는 모든 이미지를 서버에 업로드하는 로직은 부담스럽다고 생각했다.

위 예시코드를 `/api/chat` 엔드포인트로 감싸서 작성하면 다음과 같다.

```js
...
app.post("/api/chat", async (req, res) => {
  try {
    const { imageData } = req.body;

    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "What’s in this image? summarize it within 30 characters",
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
      model: "gpt-4o-mini",
    });

    res.json({
      response: chatCompletion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});
...
```

여기서 내가 생각했던 부분은 크게 2가지다.

#### 1. 프롬프트를 어떻게 작성할 것인가

이미지를 분석하여 텍스트로 요약해달라는 요청을 내려야 한다. 기본 예시 코드에서도 나와있다시피 `'What's in this image?'`라는 프롬프트를 사용하고 있다. 나는 이를 그대로 사용하기로 했다. 그러면서 뒤엔 30자 이내로 요약해달라는 요청을 추가하기로 했다. 별도의 제약을 걸지 않으면 생각보다 GPT가 투머치토크 성향이 있어서인지 너무 길게 답변을 해주는 경향이 있어서 그런 제약을 추가하기로 했다.

#### 2. 어떤 모델을 사용할 것인가

OpenAI API에서 제공하는 모델이 여러 종류이기 때문에 어떤 모델을 선택하느냐도 중요한 문제이다. 이 프로젝트에서는 이미지파일을 input으로 넣어야 하는데, 모델마다 이미지를 input 으로 받을 수 없는 모델도 존재하기 때문에 이런 모델들은 당연히 제외된다. 이미지를 받을 수 있는 모델들은 [공식 문서](https://platform.openai.com/docs/models)상에서 `multimodal model` 이라는 키워드를 찾아볼 수 있다. 대표적으로 `gpt-4o`과 `gpt-4o-mini`가 있다. 둘의 차이는 모델 사이즈와 가격에 있는데, 나는 모델 사이즈가 작고 가격이 저렴한 `gpt-4o-mini`를 선택하기로 했다.

![gpt-model-pricing](https://res.cloudinary.com/dxnnrbhbk/image/upload/v1737983310/blog/assets/5e5a8cf5-63b5-41d5-96d7-888a07376b64_ajxann.png)

## 프론트엔드에서 API 요청 보내기

이제 백엔드의 API 작업은 마쳤으니 다시 프론트엔드로 돌아가서 방금 만든 엔드포인트로 요청을 보내보자.
`useCanvas` 훅에서 `sendImage` 함수에서 Base64로 인코딩된 이미지 데이터를 백엔드로 보냈다. 참고로 웹페이지에서 ChatGPT를 사용하면 언어를 설정할 수 있다는 점과는 달리, OpenAI API 는 오직 영어로 된 답변만 지원하고 있다.

```ts
// api.ts
export const sendMessage = async (imageData: string) => {
  const apiResponse = await api.post<{ response: string }>("/chat", {
    imageData,
  });
  return apiResponse.data.response;
};


/* *********/
// useCanvas.ts
...
 const getBase64Image = () => {
    if (!canvasRef.current) return;
    return canvasRef.current.toDataURL("image/png");
  };

  const sendImage = async () => {
    const imageData = getBase64Image();
    if (!imageData) {
      throw new Error("Image data is not available");
    }

    try {
      setIsMessageLoading(true);
      const response = await sendMessage(imageData);
      console.log(response);
      setMessage(response);
    } catch (error) {
      alert("서버 오류가 발생했습니다." + error);
    } finally {
      setIsMessageLoading(false);
    }
  };
  ...
```

백엔드 Github는 [이곳](https://github.com/hjhj97/gpt-drawing-quiz.backend)에서 확인해볼 수 있다.

## 드디어 테스트!

드디어 프론트엔드와 백엔드의 모든 작업이 끝났다. 이제 직접 그림을 그려서 GPT가 내 그림을 제대로 분석해는지 확인해보자. 내가 그림은 썩 잘 그리는 편은 아니지만, 그래도 나름 남들이 알아볼 수 있을 정도로는 그릴 수 있다고 확신하기 때문에 GPT도 별 무리없이 맞출 수 있을 것이다.

집을 그려서 GPT한테 무엇인지 물어보도록 하자.

![gpt-answer-1](https://res.cloudinary.com/dxnnrbhbk/image/upload/v1737983312/blog/assets/2028f8ae-4415-4f45-9fbb-9a3db962fcc0_t9jmtz.png)

> GPT Think: Office desk with laptop.

응??? 이게 어딜봐서 책상 위에 있는 랩탑인거지?????

이건 그림을 대충 그렸으니 못 맞출 수도 있다. 조금 더 신중하게 다시 그려보도록 하자.

![gpt-answer-2](https://res.cloudinary.com/dxnnrbhbk/image/upload/v1737983311/blog/assets/37e9d201-d75e-4b8f-8349-0aabddb76987_zqk5zz.png)

> GPT Think: A minimalist cat drawing.

아니 왜.....

왜 이렇게 못 ~~그리는~~ 맞추는 것인지 다음 포스팅에서 알아보도록 하자...
