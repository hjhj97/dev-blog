---
title: Cloudinary API + Next.js 로 이미지 업로드 자동화 (2 of 2)
date: "2025-01-24"
description: 블로그에 올릴 이미지의 업로드를 자동화하는 웹페이지 만들기
category: React
---

## 기능 추가하기

지난 포스팅에서 언급했다시피 기본으로 제공하는 업로드 기능에서 다음 5가지 기능을 추가해보고자 한다.

1. 파일 동시에 여러개 업로드 허용
2. 업로드 전에 파일 미리보기
3. 파일명 수정할 수 있도록 하기
4. 업로드 후 이미지 경로 받아오기
5. 이미지 경로를 마크다운 문법으로 변환

#### 파일 여러개 업로드 / 미리보기 / 파일명 수정하기

먼저 1,2,3번의 기능을 구현해보자. 3개의 기능이 모두 연관되어 있으므로 한번에 구현할 것이다. 파일을 업로드 하는 로직들은 `useFileUploader.ts` hook으로 분리하여 작성했다. 이 안에서 로컬 파일을 브라우저에 업로드하는 역할을 담당하는 `handleFileChange` 함수를 보자.

```ts
// useFileUploader.ts
...
const [files, setFiles] = useState<File[]>([]);
const [previewUrls, setPreviewUrls] = useState<PreviewUrl[]>([]);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return
  setIsUploaded(false)

  const selectedFiles = Array.from(e.target.files)
  setFiles(selectedFiles)

  const previews: PreviewUrl[] = []
  selectedFiles.forEach(file => {
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
      previews.push({
        url: fileReader.result as string,
        name: file.name,
        originalName: file.name,
        isEditing: false,
      })
      if (previews.length === selectedFiles.length) {
        setPreviewUrls(previews)
      }
    }
    fileReader.readAsDataURL(file)
  })
}
...
```

<br />

파일을 업로드 하기 위해서 `<input type="file">` 태그를 사용하며 `multiple` 속성을 추가하면 여러개의 파일을 동시에 업로드할 수 있다. 그러면 `onChange` 이벤트 핸들러에서 여러개의 파일을 받아올 수 있다. 이 때 받아온 파일은 `FileList` 는 유사배열 형태의 타입이다.

원래는 `File` 객체를 `FormData` 에 `append`한 뒤 `POST` 요청의 `body`에 담아 보내도 업로드되지만, 이번에는 이미지를 업로드 하기 전에 미리보기를 보여주고 파일명을 수정하는 기능을 제공해야 하므로 이미지 파일의 Base64 URL을 따로 뽑아내야 한다.

일단 `Array.from()` 메서드를 사용하여 배열로 변환하여 `FileList` 타입을 `File[]` 타입으로 변환한다. `File` 타입 자체로는 브라우저에서 이미지 미리보기를 지원하지 않으므로 `FileReader` 객체와 `readAsDataURL()` 메서드를 사용하여 이미지를 Base64 형태의 URL로 뽑아낸다.

`FileReader` 객체는 비동기 방식으로 동작하므로 `onloadend` 이벤트 핸들러를 작성한다. 이 때 이미지의 URL을 뽑아내려면 `FileReader.result` 값을 사용한다. 그리고 파일명이 바뀔 수 있음을 염두에 두려면 원본 파일명인 `originalName`와 바뀐 파일명 `name` 속성을 추가해야 한다. 또한 파일명을 수정할 수 있도록 하기 위해 `isEditing` 속성을 추가했다. 이 값이 `true` 라면 수정이 가능하도록 `<input>` 태그를 활성화시킨다.

`File[]` 배열을 순회하면서 이 속성들을 `previewUrls` 배열에 하나씩 push 한다. 이 때 모든 파일을 다 읽어왔다면 `setPreviewUrls()` 함수를 호출하여 `previewUrls` 배열을 업데이트한다. `previewUrls` 배열은 `PreviewList` 컴포넌트에서 `prop`으로 받아와 미리보기 이미지를 표시하고 파일명을 수정할 수 있도록 한다.

<details>
<summary>
<code>PreviewList.tsx</code> 컴포넌트
</summary>

```tsx
// PreviewList.tsx
import type { PreviewUrl } from "./hooks/useFileUploader"

type PreviewListProps = {
  previewUrls: PreviewUrl[]
  setPreviewUrls: React.Dispatch<React.SetStateAction<PreviewUrl[]>>
  startEdit: (index: number) => void
  confirmEdit: (index: number, newName: string) => void
  cancelEdit: (index: number) => void
  handleDeleteFile: (index: number) => void
  handleDeleteAll: () => void
  isUploaded: boolean
}

function PreviewList({
  previewUrls,
  setPreviewUrls,
  startEdit,
  confirmEdit,
  cancelEdit,
  handleDeleteFile,
  handleDeleteAll,
  isUploaded,
}: PreviewListProps) {
  const handleNameChange = (fileIndex: number, newValue: string) => {
    setPreviewUrls(
      previewUrls.map((url, i) =>
        i === fileIndex ? { ...url, name: newValue } : url
      )
    )
  }

  return (
    <div>
      <div>
        <button type="button" onClick={handleDeleteAll} disabled={isUploaded}>
          Delete All
        </button>
      </div>
      <div>
        {previewUrls.map((preview, index) => (
          <div key={preview.name}>
            <img src={preview.url} alt={`Preview ${index + 1}`} />
            <div>
              {preview.isEditing ? (
                <EditMode
                  preview={preview}
                  index={index}
                  handleNameChange={handleNameChange}
                  confirmEdit={confirmEdit}
                  cancelEdit={cancelEdit}
                />
              ) : (
                <PreviewMode
                  preview={preview}
                  index={index}
                  startEdit={startEdit}
                  handleDeleteFile={handleDeleteFile}
                  isUploaded={isUploaded}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
...
export default PreviewList
```

</details>

#### 데모

![preview images](https://res.cloudinary.com/dxnnrbhbk/image/upload/v1737652954/blog/assets/demo1.gif)

#### 업로드 후 경로 받아오기 / 마크다운 문법으로 변환

API를 호출하여 업로드에 성공하면 응답값으로 업로드 경로인 `secure_url` 을 받을 수 있다. 구글 드라이브와 같은 타 클라우드 플랫폼에서는 공유용 URL로 들어가보면 웹페이지에 에디터 모드가 씌워진 형태라 불편했는데, Cloudinary에서 제공하는 URL은 순수하게 저장된 경로를 알려주므로 편리하다.

이 경로를 HTML과 마크다운 문법으로 변환하여 클립보드에 복사하는 기능을 추가해보자. 이는 `window` 객체 중에서 `navigator.clipboard.writeText()` 메서드를 사용하면 된다. (`write()` 메서드를 사용하더라도 무관하다. 차이는 `wrtie()` 메서드는 이미지 같은 다양한 포맷의 파일의 복사를 지원해준다는 점이다.)

```tsx
// CopyButton.tsx
interface CopyButtonProps {
  text: string
  children?: React.ReactNode
  onCopy?: () => void
}

export default function CopyButton({
  text,
  children,
  onCopy,
}: CopyButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      onCopy?.()
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <button title={text} onClick={handleCopy}>
      {children || "Copy"}
    </button>
  )
}
```

그리고 이 컴포넌트를 사용하여 버튼을 누르면 클립보드에 복사하는 기능을 추가했다. HTML과 Markdown 문법으로 변환하는 함수는 각각 `convertToHtml()`과 `convertToMarkdown()` 함수를 작성했다.

```tsx
// UploadResult.tsx
function UploadResult() {
  const convertToHtml = (url: string) => `<img src="${url}" alt="preview images" />`;
  const convertToMarkdown = (url: string) => `![preview images](${url})`;
  ...

  return (
    <div>
      ...
      {fileUrls.map((url) => (
        <div key={url}>
          <img src={url} alt='preview images'/>
          <CopyButton text={url} onCopy={() => setCopied(true)}>
            <span>URL</span>
          </CopyButton>
          <CopyButton text={convertToHtml(url)} onCopy={() => setCopied(true)}>
            <span>HTML</span>
          </CopyButton>
          <CopyButton text={convertToMarkdown(url)} onCopy={() => setCopied(true)}>
            <span>Markdown</span>
          </CopyButton>
        </div>
      ))}
    </div>
  )
}
...
```

#### 데모

![preview images](https://res.cloudinary.com/dxnnrbhbk/image/upload/v1737653198/blog/assets/demo2.gif)

내가 원하던대로 파일을 여러개 업로드하고 미리보기를 볼 수 있으며, 파일명을 수정할 수 있고, 업로드 후 이미지 경로를 받아올 수 있으며, 이를 마크다운 문법으로 변환할 수 있게 되었다.

Cloudinary 콘솔에 들어가면 이처럼 내가 업로드한 이미지들을 한번에 확인해볼 수 있다.

![result](https://res.cloudinary.com/dxnnrbhbk/image/upload/v1737696160/blog/assets/result.png)

이 프로젝트의 소스코드는 [Github](https://github.com/hjhj97/next-cloudinary-image-uploader)에서 확인할 수 있다.

## 예외 처리

시간이 된다면 다음과 같은 예외 처리도 구현해보고자 한다.

1. 파일 업로드 실패 처리
2. 중복되는 파일명 처리
3. 파일 포맷 검증
4. 파일 크기 검증
