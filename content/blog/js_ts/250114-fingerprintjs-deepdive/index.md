---
title: fingerprint.js에 대해 알아보자
date: "2025-01-14"
description: fingerprint.js는 어떻게 유저를 식별해낼까?
category: JS/TS
---

## fingerprint 기법

fingerprint 기법은 브라우저에서 유저를 식별하는 방법 중 하나로 유저의 브라우저 정보, 운영체제, 화면 해상도, 폰트 등을 조합하여 유저를 식별해준다. 신뢰성을 100% 보장할 수는 없기 때문에 식별에 실패하더라도 큰 지장이 없는 광고 타겟팅을 위한 용도로 사용되곤 한다.

fingerprint 기법을 구현한 대표적인 오픈소스가 바로 [`fingerprint.js`](https://fingerprint.com/)이다. 이 외에도 npmjs에서 찾아보면 여러가지 라이브러리가 존재한다. 이 글에서는 fingerprint.js에 대해 알아보고 어떤 원리로 동작하는지, 어떤 문제가 있는지 알아보고자 한다.

참고로, `fingerprint.js`와 유료버전인 fingerprint Pro 의 데모 페이지는 [이곳](https://fingerprintjs-vue3-demo.vercel.app/)에서 확인할 수 있다.
(유료 버전은 free-trial 기간이 지나면 비활성화 될 수도 있다).

## 어떤 원리로 동작하는가?

`fingerprint.js`는 [github](https://github.com/fingerprintjs/fingerprintjs) 에 공개되어 있기 때문에 이를 분석해보며 어떻게 동작하는지 대략적으로 살펴보도록 하자.
공식문서에 나와있는 예시 코드는 아래와 같다.

```ts
import FingerprintJS from "@fingerprintjs/fingerprintjs"
export const getFingerprint = async () => {
  const fp = await FingerprintJS.load()
  const { visitorId, confidence, components } = await fp.get()
  return { visitorId, confidence, components }
}
```

`load` 함수를 통해 유저를 식별하는 함수를 비동기로 실행한 후, `get` 함수를 통해 받아오고 있다. 가장 먼저 프로젝트의 엔트리 포인트인 `/src/index.ts`를 찾아보자.

```ts
// /src/index.ts
import { load, ... } from './agent'
...
```

역시나 엔트리 포인트에서 `load` 함수를 찾을 수 있다. 계속해서 `agent.ts` 파일을 찾아보자.

`/src/agent.ts` 파일을 찾아보면 `load` 함수를 찾을 수 있다.

```ts
// /src/agent.ts
...
export async function load(
  options: Readonly<LoadOptions> = {}
): Promise<Agent> {
  if ((options as { monitoring?: boolean }).monitoring ?? true) {
    monitor()
  }
  const { delayFallback, debug } = options
  await prepareForSources(delayFallback)
  const getComponents = loadBuiltinSources({ cache: {}, debug })
  return makeAgent(getComponents, debug)
}

```

여러가지 처음 보는 함수와 변수들이 등장하여 혼란스럽지만 주목해서 봐야할 것은 `loadBuiltinSources` 함수이다. 이 함수를 통해 브라우저 정보, 운영체제, 화면 해상도, 폰트 등을 조합하여 유저를 식별하게 해준다. `loadBuiltinSources` 함수가 위치해 있는 `/src/sources/index.ts` 파일을 찾아보자.

```ts
// /src/sources/index.ts
...
export default function loadBuiltinSources(options: BuiltinSourceOptions): () => Promise<BuiltinComponents> {
  return loadSources(sources, options, [])
}
```

`loadBuiltinSources` 함수는 `loadSources` 함수를 호출하고 있다. 첫 번째 인자로 들어가는 `sources` 변수를 주목해서 봐야하는데, 코드의 양이 방대하여 접어놓도록 하겠다.

<details>
<summary>./src/sources/index.ts</summary>

```ts
// /src/sources/index.ts
import getAudioFingerprint from './audio'
import getFonts from './fonts'
import getPlugins from './plugins'
...
// import문 생략

export const sources = {
  fonts: getFonts,
  domBlockers: getDomBlockers,
  fontPreferences: getFontPreferences,
  audio: getAudioFingerprint,
  screenFrame: getScreenFrame,

  canvas: getCanvasFingerprint,
  osCpu: getOsCpu,
  languages: getLanguages,
  colorDepth: getColorDepth,
  deviceMemory: getDeviceMemory,
  screenResolution: getScreenResolution,
  hardwareConcurrency: getHardwareConcurrency,
  timezone: getTimezone,
  sessionStorage: getSessionStorage,
  localStorage: getLocalStorage,
  indexedDB: getIndexedDB,
  openDatabase: getOpenDatabase,
  cpuClass: getCpuClass,
  platform: getPlatform,
  plugins: getPlugins,
  touchSupport: getTouchSupport,
  vendor: getVendor,
  vendorFlavors: getVendorFlavors,
  cookiesEnabled: areCookiesEnabled,
  colorGamut: getColorGamut,
  invertedColors: areColorsInverted,
  forcedColors: areColorsForced,
  monochrome: getMonochromeDepth,
  contrast: getContrastPreference,
  reducedMotion: isMotionReduced,
  reducedTransparency: isTransparencyReduced,
  hdr: isHDR,
  math: getMathFingerprint,
  pdfViewerEnabled: isPdfViewerEnabled,
  architecture: getArchitecture,
  applePay: getApplePayState,
  privateClickMeasurement: getPrivateClickMeasurement,
  audioBaseLatency: getAudioContextBaseLatency,


  webGlBasics: getWebGlBasics,
  webGlExtensions: getWebGlExtensions,
}
...
export default function loadBuiltinSources(
  options: BuiltinSourceOptions
): () => Promise<BuiltinComponents> {
  return loadSources(sources, options, [])
}
```

</details>

보다시피 `sources` 변수 안에는 유저를 식별하기 위한 수많은 파라미터들(함수)로 구성되어 있다. 이 함수들이 `loadSources` 함수를 통해 실행되면서 유저를 식별하는 데이터를 추출하게 된다.

수많은 파라미터(판별 함수)가 있지만 이 글에서는 가장 대표적인 '설치된 폰트 판별' 과 'Canvas fingerprint' 에 대해 알아보도록 하겠다.

### 설치된 폰트 판별

디바이스마다 설치되어있는 폰트의 종류가 다르기 때문에(100%는 아니지만), 이를 통해 디바이스를 식별하려는 아이디어이다.

그런데 사실 일개 브라우저가 디바이스에 설치되어 있는 폰트 리스트를 갖고 오는 행위는 보안상 문제로 인하여 불가능하다(폰트도 엄연한 시스템 레벨의 데이터다). 하지만 약간의 꼼수를 발휘하면 설치된 폰트를 유추할 수 있는 방법이 있다.  
바로 test string을 HTML에 삽입하여 해당 문자열이 차지하는 영역의 `width`와 `height`값을 통해 폰트의 존재 여부를 판단하는 것이다. **폰트의 종류별로 렌더링되는 영역의 크기가 다르기 때문에**(100%는 아니지만) 이를 통해 특정 폰트의 설치 여부를 판단할 수 있다.

'A'라는 폰트가 설치되어 있는지 판단한다고 해보자. 만약 'A' 폰트가 설치되어 있지 않다면 디바이스에서 기본으로 설치되어있는 폰트가 설정된다. fingerprint.js에서는 이를 `baseFonts` 라고 부르며 `monospace`, `sans-serif`, `serif` 3종류의 폰트가 있다.  
 test string을 렌더링한 HTML의 영역이 만약 `baseFonts` 폰트 3종류 중 어느 한개라도 차지하는 영역과 일치한다면 'A' 폰트는 설치되지 않았으며, `baseFonts`가 렌더링된 것으로 간주한다. 반대로 3종류의 `baseFonts` 폰트가 차지하는 영역과 일치하지 않는다면 'A' 폰트가 렌더링(설치)된 것으로 간주한다.

이 로직을 머리에 담아두고 실제 [소스코드](https://github.com/fingerprintjs/fingerprintjs/blob/master/src/sources/fonts.ts)를 보자. `/src/sources/fonts.ts` 에서 찾을 수 있다.

<details>
<summary>./src/sources/fonts.ts</summary>

```ts
// /src/sources/fonts.ts
// 일부 주석은 삭제함
import { withIframe } from "../utils/dom"

const testString = "mmMwWLliI0O&1"
const textSize = "48px"
const baseFonts = ["monospace", "sans-serif", "serif"] as const

const fontList = [
  // This is android-specific font from "Roboto" family
  "sans-serif-thin",
  "ARNO PRO",
  "Agency FB",
  "Arabic Typesetting",
  "Arial Unicode MS",
  "AvantGarde Bk BT",
  "BankGothic Md BT",
  "Batang",
  "Bitstream Vera Sans Mono",
  "Calibri",
  "Century",
  "Century Gothic",
  "Clarendon",
  "EUROSTILE",
  "Franklin Gothic",
  "Futura Bk BT",
  "Futura Md BT",
  "GOTHAM",
  "Gill Sans",
  "HELV",
  "Haettenschweiler",
  "Helvetica Neue",
  "Humanst521 BT",
  "Leelawadee",
  "Letter Gothic",
  "Levenim MT",
  "Lucida Bright",
  "Lucida Sans",
  "Menlo",
  "MS Mincho",
  "MS Outlook",
  "MS Reference Specialty",
  "MS UI Gothic",
  "MT Extra",
  "MYRIAD PRO",
  "Marlett",
  "Meiryo UI",
  "Microsoft Uighur",
  "Minion Pro",
  "Monotype Corsiva",
  "PMingLiU",
  "Pristina",
  "SCRIPTINA",
  "Segoe UI Light",
  "Serifa",
  "SimHei",
  "Small Fonts",
  "Staccato222 BT",
  "TRAJAN PRO",
  "Univers CE 55 Medium",
  "Vrinda",
  "ZWAdobeF",
] as const

export default function getFonts(): Promise<string[]> {
  return withIframe(async (_, { document }) => {
    const holder = document.body
    holder.style.fontSize = textSize

    // div to load spans for the default fonts and the fonts to detect
    const spansContainer = document.createElement("div")
    spansContainer.style.setProperty("visibility", "hidden", "important")

    const defaultWidth: Partial<Record<string, number>> = {}
    const defaultHeight: Partial<Record<string, number>> = {}

    // creates a span where the fonts will be loaded
    const createSpan = (fontFamily: string) => {
      const span = document.createElement("span")
      const { style } = span
      style.position = "absolute"
      style.top = "0"
      style.left = "0"
      style.fontFamily = fontFamily
      span.textContent = testString
      spansContainer.appendChild(span)
      return span
    }

    // creates a span and load the font to detect and a base font for fallback
    const createSpanWithFonts = (fontToDetect: string, baseFont: string) => {
      return createSpan(`'${fontToDetect}',${baseFont}`)
    }

    // creates spans for the base fonts and adds them to baseFontsDiv
    const initializeBaseFontsSpans = () => {
      return baseFonts.map(createSpan)
    }

    // creates spans for the fonts to detect and adds them to fontsDiv
    const initializeFontsSpans = () => {
      // Stores {fontName : [spans for that font]}
      const spans: Record<string, HTMLSpanElement[]> = {}

      for (const font of fontList) {
        spans[font] = baseFonts.map(baseFont =>
          createSpanWithFonts(font, baseFont)
        )
      }

      return spans
    }

    // checks if a font is available
    const isFontAvailable = (fontSpans: HTMLElement[]) => {
      return baseFonts.some(
        (baseFont, baseFontIndex) =>
          fontSpans[baseFontIndex].offsetWidth !== defaultWidth[baseFont] ||
          fontSpans[baseFontIndex].offsetHeight !== defaultHeight[baseFont]
      )
    }

    // create spans for base fonts
    const baseFontsSpans = initializeBaseFontsSpans()

    // create spans for fonts to detect
    const fontsSpans = initializeFontsSpans()

    // add all the spans to the DOM
    holder.appendChild(spansContainer)

    // get the default width for the three base fonts
    for (let index = 0; index < baseFonts.length; index++) {
      defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth
      defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight
    }

    // check available fonts
    return fontList.filter(font => isFontAvailable(fontsSpans[font]))
  })
}
```

</details>
<br />

`fontList` 배열에 들어있는 폰트의 종류를 `testString` 문자열로 렌더링하여 `width`와 `height`를 측정한다.  
 그리고 `isFontAvailable`함수에서 이 측정값이 `baseFonts` 배열에 들어있는 폰트들의 `defaultWidth`와 `defaultHeight`와 하나라도 일치하지 않으면 `true`를 반환하여 해당 폰트는 설치된 것으로 간주한다.  
만약 폰트가 설치되어 있지 않다면 `baseFonts`에 들어있는 폰트들의 `defaultWidth`와 `defaultHeight`가 모두 일치할 것이므로 `false`를 반환할 것이다.

코드를 살펴보면 가질 수 있는 의문점이 하나 있다. HTML상에서 `testString` 이 렌더링 된다면 실제 사용자 눈에 직접 보일 수도 있지 않느냐 하는 점이다.  
이를 방지해주는 함수가 `withIframe` 함수이다. 이 함수는 외부 스크립트를 실행하는 것이 아닌 `iframe` 내부에서 실행하여 외부 HTML에는 영향을 받지 않도록 해준다. `getFonts` 함수의 리턴값도 `withIframe` 함수를 통해 실행되므로 실제 사용자 눈에 보이지 않는다.

이 방법의 장점 중 하나는 **브라우저의 종류에 영향을 받지 않는다**는 점이다. 아래 첨부한 이미지는 위에서부터 Chrome, Safari, Firefox 브라우저에서 내가 직접 개발하여 출시한 `font-fingerprint` [패키지](https://github.com/hjhj97/font-fingerprint)를 각각 실행한 결과이다. 보다시피 모든 브라우저에서 동일한 `Visitor ID`와 `font` 값이 나오고 있음을 확인할 수 있다.

![font-fingerprint](https://res.cloudinary.com/dxnnrbhbk/image/upload/v1737987532/blog/assets/demo.png)

[데모 페이지](https://hjhj97.github.io/font-fingerprint/)는 이곳에서 확인해볼 수 있다.

두 번째 방법인 Canvas fingerprint 에서도 언급하겠지만, 일부 fingerprint 에서 사용하는 파라미터는 같은 디바이스에서도 브라우저의 종류에 따라 결과값이 달라지기 때문에, 이로 인한 영향을 받지 않기 위해서는 설치된 폰트 리스트로만 판단하는 것이 좋다.

### Canvas fingerprint

Canvas fingerprint는 브라우저의 Canvas API를 통해 캔버스를 그리는 방식을 판별하는 기법이다. 캔버스에 동일한 geometry를 그리더라도 브라우저의 종류, GPU 등에 따라서 픽셀 단위에서는 다르게 그려질 수 있다.

fingerprint.js에서는 크게 `renderTextImage` 와 `renderGeometryImage` 2가지 함수를 통해 판별하고 있다. 이를 담당하고 있는 [소스코드](https://github.com/fingerprintjs/fingerprintjs/blob/master/src/sources/canvas.ts)는 `/src/sources/canvas.ts` 파일이다.

<details>
<summary>./src/sources/canvas.ts</summary>

```ts
// /src/sources/canvas.ts
// 일부 주석 제거
import { isSafariWebKit, isWebKit, isWebKit616OrNewer } from "../utils/browser"

export interface CanvasFingerprint {
  winding: boolean
  geometry: string
  text: string
}

export const enum ImageStatus {
  Unsupported = "unsupported",
  Skipped = "skipped",
  Unstable = "unstable",
}

export default function getCanvasFingerprint(): CanvasFingerprint {
  return getUnstableCanvasFingerprint(doesBrowserPerformAntifingerprinting())
}

export function getUnstableCanvasFingerprint(
  skipImages?: boolean
): CanvasFingerprint {
  let winding = false
  let geometry: string
  let text: string

  const [canvas, context] = makeCanvasContext()
  if (!isSupported(canvas, context)) {
    geometry = text = ImageStatus.Unsupported
  } else {
    winding = doesSupportWinding(context)

    if (skipImages) {
      geometry = text = ImageStatus.Skipped
    } else {
      ;[geometry, text] = renderImages(canvas, context)
    }
  }

  return { winding, geometry, text }
}

function makeCanvasContext() {
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  return [canvas, canvas.getContext("2d")] as const
}

function isSupported(
  canvas: HTMLCanvasElement,
  context?: CanvasRenderingContext2D | null
): context is CanvasRenderingContext2D {
  return !!(context && canvas.toDataURL)
}

function doesSupportWinding(context: CanvasRenderingContext2D) {
  context.rect(0, 0, 10, 10)
  context.rect(2, 2, 6, 6)
  return !context.isPointInPath(5, 5, "evenodd")
}

function renderImages(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
): [geometry: string, text: string] {
  renderTextImage(canvas, context)
  const textImage1 = canvasToString(canvas)
  const textImage2 = canvasToString(canvas)

  if (textImage1 !== textImage2) {
    return [ImageStatus.Unstable, ImageStatus.Unstable]
  }

  renderGeometryImage(canvas, context)
  const geometryImage = canvasToString(canvas)
  return [geometryImage, textImage1]
}

function renderTextImage(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) {
  canvas.width = 240
  canvas.height = 60

  context.textBaseline = "alphabetic"
  context.fillStyle = "#f60"
  context.fillRect(100, 1, 62, 20)

  context.fillStyle = "#069"
  context.font = '11pt "Times New Roman"'
  const printedText = `Cwm fjordbank gly ${
    String.fromCharCode(55357, 56835) /* 😃 */
  }`
  context.fillText(printedText, 2, 15)
  context.fillStyle = "rgba(102, 204, 0, 0.2)"
  context.font = "18pt Arial"
  context.fillText(printedText, 4, 45)
}

function renderGeometryImage(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) {
  canvas.width = 122
  canvas.height = 110
  context.globalCompositeOperation = "multiply"
  for (const [color, x, y] of [
    ["#f2f", 40, 40],
    ["#2ff", 80, 40],
    ["#ff2", 60, 80],
  ] as const) {
    context.fillStyle = color
    context.beginPath()
    context.arc(x, y, 40, 0, Math.PI * 2, true)
    context.closePath()
    context.fill()
  }

  context.fillStyle = "#f9c"
  context.arc(60, 60, 60, 0, Math.PI * 2, true)
  context.arc(60, 60, 20, 0, Math.PI * 2, true)
  context.fill("evenodd")
}

function canvasToString(canvas: HTMLCanvasElement) {
  return canvas.toDataURL()
}

function doesBrowserPerformAntifingerprinting() {
  // Safari 17
  return isWebKit() && isWebKit616OrNewer() && isSafariWebKit()
}
```

</details>
<br />

canvas를 그리기에 앞서 유저의 환경에서 canvas API를 지원하는지부터 판단한다.

우선 `doesBrowserPerformAntifingerprinting` 함수는 브라우저가 fingerprint 를 차단하는지 판단한다. 함수 내부를 살펴보면 `webkit` 환경으로 이뤄져있는 safari 17버전 이상의 브라우저에서는 해당 조건을 만족하기 때문에 `ImageStatus`는 `Skipped` 로 설정된다.

그런 다음 `isSupported` 함수를 통해서 `document` 객체에서 `canvas` 엘리먼트를 생성해주는지를 판단한다.

마지막으로 `doesSupportWinding` 함수를 통해서 브라우저가 캔버스를 그리는 방식을 판단한다. `Winding`이란 canvas에서 경로의 내부와 외부를 정의하는 방식으로, 구형 브라우저에서는 지원하지 않을 수도 있는 속성이라고 한다.

이제 본격적으로 canvas위에 그려보도록 하자.`renderTextImage` 함수를 살펴보면 다음과 같은 과정이 일어난다.

- 캔버스의 크기를 240x60으로 설정한다.
- 캔버스의 [textBaseline](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textBaseline)을 `alphabetic`로 설정한다.
- 직사각형을 그리고 색상을 `#f60`으로 색칠한다.
- 폰트의 크기,종류,색상을 설정하고 `printedText` 문자열을 캔버스에 그린다. 문자열 맨 끝에는 이모지를 붙인다.
- 이후에 비슷한 과정을 한번 더 반복한다.

일련의 과정을 거치고 나면 아래와 같은 이미지가 캔버스에 그려진다.
![image](https://res.cloudinary.com/dxnnrbhbk/image/upload/v1737983309/blog/assets/4d1c7159-9a23-4473-a039-7bfe3375bf2c_zjexik.png)

캔버스에 그려진 이미지를 `canvasToString` 함수 안에 `canvas.toDataURL` 함수를 통해 Base64 형태의 문자열로 변환한다. 내가 직접 크롬과 firefox 브라우저에서 각각 테스트해본 결과, 렌더링되는 이미지가 육안상으로는 동일하였으나 실제로 Base64로 인코딩된 데이터는 각기 다르게 나왔다.  
찾아보니 동일한 canvas 코드라도 실행한 브라우저의 종류에 따라서 폰트 렌더링, 안티앨리어싱 등에 따라서 결과값이 달라질 수 있다고 한다.

다음으로 `renderGeometryImage` 함수를 살펴보면 다음과 같은 과정이 일어난다.

- 캔버스의 크기를 122x110으로 설정한다.
- 3종류의 색상을 가진 원을 일부가 겹치도록 그려놓는다.(벤다이어그램처럼)
- 큰 원과 작은원을 다시 겹쳐놓는다.

이 과정을 거치면 아래와 같은 이미지가 캔버스에 그려진다.

<div>
<img src="https://res.cloudinary.com/dxnnrbhbk/image/upload/v1737983310/blog/assets/35fca6b5-e801-4940-b341-cd2277f8bc41_glhkux.png" alt="canvas-text-image" style="width: 240px">
</div>

과정을 통해 '브라우저가 원을 처리하는 방식'과 각기 다른 색상이 겹쳤을 때 '색의 혼합을 어떻게 처리하는지'를 판단하게 된다. 이 또한 브라우저의 종류에 따라 결과값이 달라질 수 있다.

## 어떤 문제(한계)가 있는가?

`fingerprint.js`의 가장 큰 한계(단점)은 바로 신뢰성이다.  
공식문서나 레퍼런스/커뮤니티에서 말하는 fingerprint 기법의 신뢰도는 40~60% 라고 한다. fingerprint의 가장 이상적인 목표는 컴퓨터(혹은 스마트폰)을 사용하고 있는 유저가 이전에 접속한 사람과 동일인물인지 아닌지를 식별하는 것이다.

하지만 위 2가지 판별함수에서 살펴보았다시피, 동일한 디바이스라 할지라도 브라우저의 종류에 따라 결과값이 달라질 수 있다. 즉 사용자가 마음만 먹으면 브라우저의 종류를 바꿈으로써 판별을 우회할 수 있다.  
실제 npm에는 fingerprint-injector 와 같이 접속한 환경을 의도적으로 조작할 수 있는 패키지도 이미 출시되어있다. 뿐만 아니라 브라우저의 종류뿐만 아니라 화면의 해상도에 영향받기도 하며, 폰트를 새로 설치하거나 삭제하더라도 식별값이 달라질 수 있다.

때문에 fingerprint.js의 유료 버전인 fingerprint Pro 에서는 신뢰도를 99%까지 끌어올려서 제공하고 있다. Pro 버전이 신뢰도가 높은 이유는 식별값을 클라이언트(브라우저)가 아닌 서버에서 생성하기 때문이다. 자세한 차이점은 [이곳](https://github.com/fingerprintjs/fingerprintjs/blob/master/docs/comparison.md)에서 확인해볼 수 있다.

## Reference

- https://hovav.net/ucsd/dist/canvas.pdf
- https://github.com/fingerprintjs/fingerprintjs
- https://dev.gmarket.com/94
- https://dev.fingerprint.com/docs/introduction#fingerprint-identification-vs-fingerprintjs
