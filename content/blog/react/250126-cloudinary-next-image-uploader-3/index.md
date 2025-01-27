---
title: 이미지 업로드 자동화 에러 핸들링/개선 사항
date: "2025-01-26"
description: 업로드할 때 발생할 수 있는 에러를 처리하고 개선사항을 적용해보자
category: React
---

## 예외 처리

지난 포스팅에서 언급했던 4가지 예외 처리를 고려해보자.

1. 파일 업로드 실패 처리(네트워크 문제)
2. 중복되는 파일 처리
3. 파일 포맷 검증
4. 파일 크기 검증

#### 1. 파일 업로드 실패 처리

현재 서비스에서는 업로드 도중 네트워크가 끊기게 될 경우 무한 로딩 상태에 빠지게 된다. 사용자는 네트워크에 문제가 생겼다는 걸 인지하기 전까지는 하염없이 로딩을 기다려야 하기 때문에 UX에 악영향을 끼치게 된다.  
이를 해결하기 위해서 timeout 시간을 설정하여 이 시간 내에 업로드를 완료하지 못할 경우 업로드를 중단하고 사용자에게 에러를 띄우려고 한다.

`AbortController`와 `setTimeout`을 사용하여 업로드 시간을 제한하고 이 시간 내에 업로드가 완료되지 않을 경우 업로드를 중단하고 사용자에게 에러를 띄우는 방식으로 해결했다.

```ts
// useFileUpload.ts
...
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT)

try {
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    signal: controller.signal,
  })
  clearTimeout(timeoutId)

  const result: { secure_url: string } = await response.json()
  if (!result) throw new Error("Failed to upload file")
  uploadedUrls.push(result.secure_url)
} catch (error) {
  if (error instanceof Error) {
    if (error.name === "AbortError") {
      alert("Upload timeout exceeded. Please try again.")
      throw new Error("Upload Timeout")
    }
    throw error
  }
}
...
```

개발자도구의 Network Throttle을 Offline으로 설정해놓고 10초가 넘으면 아래와 같이 에러 alert가 표시된다.

![error2](https://res.cloudinary.com/dxnnrbhbk/image/upload/v1737787649/blog/assets/error2.png)

아직 API가 하나밖에 없는 작은 규모의 서비스기 때문에 `useFileUpload` 훅에서 예외처리를 하고 있지만, 나중에 API가 많아진다면 공통함수로 분리하는 편이 낫겠다.

#### 2. 중복되는 파일 처리

파일명을 바꿀 수 있는 기능을 추가했기 때문에 여러개의 파일의 이름을 동일하게 수정할 수도 있다. 실제로 업로드 해보면 어떤 결과가 나올까?

![error1](https://res.cloudinary.com/dxnnrbhbk/image/upload/v1737785178/blog/assets/%08error1.png)

기묘한 결과가 나왔다.  
 업로드를 성공하긴 했다. 파일의 저장 경로를 보면 v로 시작하는 값이 다름을 확인할 수 있다. 각기 다른 경로에 저장된 것이다. 여러 이미지 파일들로 업로드 테스트해본 결과 이미지가 저장되는 경로는 다음과 같은 규칙성이 있다.

```css
res.cloudinary.com/{클라우드이름}/image/upload/{업로드시간}/{저장경로}/{파일명}
```

하지만 실제 업로드 된 이미지를 보면 둘이 완전히 동일한 이미지이다. 하나의 파일이 다른 하나의 파일로 덮어 씌워진 것이다. 아무래도 동일한 파일명으로 업로드를 시도하면 고장이 나는 것 같다. 동일한 파일명으로 업로드하는 건 버튼을 누르기 전에 프론트엔드에서 방어 로직을 추가하는 것이 좋겠다.

```ts
// useFileUpload.ts
...
const checkDuplicateFileName = (newName: string, currentIndex: number) => {
  for (let i = 0; i < previewUrls.length; i++) {
    if (i === currentIndex) continue
    if (previewUrls[i].name === newName) return true
  }
  return false
}

const confirmEdit = (index: number, newName: string) => {
  if (checkDuplicateFileName(newName, index)) {
    alert("This file name already exists. Please enter a different name.")
    return
  }

  ...
}
```

파일명을 수정하는 `confirmEdit` 에서 중복되는 파일명을 검증하는 `checkDuplicateFileName`함수를 추가했다. 동일한 파일명으로 업로드를 시도하려는 경우 alert가 뜨면서 파일명을 수정하도록 유도할 수 있다.

![error3](https://res.cloudinary.com/dxnnrbhbk/image/upload/v1737811251/blog/assets/error3.png)

#### 3. 파일 포맷 검증

현재 업로드 가능한 파일의 포맷은 이미지(gif 포함)파일만 가능하다. 그 외의 파일 포맷은 업로드를 막기 위해서 방어로직을 추가해보자.

우선 프론트엔드에서는 `<input>` 태그의 속성으로 `accept`를 추가하여 파일 포맷을 제한할 수 있다. 만약 이미지 파일만 업로드 가능하도록 하고 싶다면 다음과 같이 설정하면 된다.

```tsx
<input type="file" accept="image/*" />
```

이러면 파일탐색기에서 이미지 파일만 선택할 수 있게 된다.

하지만 프론트엔드에서만 방어한다고 능사가 아니다. 프론트엔드를 우회하여 업로드할 수도 있으므로 백엔드에서 또한 파일 포맷을 검증하는 로직을 추가하자.

```ts
// api/upload.ts
...
const result = await new Promise<UploadApiResponse>((resolve, reject) => {
  cloudinary.uploader
    .upload_stream(
      {
        resource_type: "image",
        folder: uploadsFolder,
        public_id: filename.split(".")[0],
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"], // 허용 파일 포맷 지정
      },
      (error, result) => {
        if (error || !result) reject(error)
        else resolve(result)
      }
    )
    .end(Buffer.from(fileBuffer))
})
```

#### 4. 파일 크기 검증

마지막으로 파일 크기를 검증하는 로직을 추가해보자. 이 역시 프론트엔드와 백엔드에서 모두 검증해야 한다.

프론트엔드에서는 `File` 객체의 `size` 속성을 사용하여 파일 크기를 알아낼 수 있다. 파일 최대 용량을 10MB로 제한하고 싶다면 다음과 같이 설정하면 된다.

```ts
// useFileUpload.ts
...
 const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
 const checkOverSizeFile = (files: File[]) => {
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      alert('Files cannot exceed 10MB in size.');
      return true;
    }
    return false;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ...
    if (checkOverSizeFile(selectedFiles)) {
      e.target.value = '';
      return;
    }
    ...
```

마찬가지로 백엔드에서도 `chunk_size` 속성을 사용하여 업로드할 최대 파일 크기를 제한할 수 있다.

```ts
// api/upload.ts
...
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'image',
            folder: uploadsFolder,
            public_id: filename.split('.')[0],
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            chunk_size: MAX_FILE_SIZE, // 최대 파일 크기 제한
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result);
          }
        )
        .end(Buffer.from(fileBuffer));
    });
    ...
```

## 그 밖의 개선사항

#### 1. 파일을 선택한 상태에서 다른 파일을 추가할 수 있도록 하기

현재 기존에 파일이 올라가 있는 상태에서 새로운 파일만 따로 추가할 수가 없어서, 새로고침 후 처음부터 업로드 해야하는 불편함이 있다. 새 파일이 선택되면 덮어씌우지 말고 기존 파일들과 병합시키도록 하자.

```ts
// useFileUpload.ts
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ...

    // Merge newly selected files with existing files if any
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    const previews: PreviewUrl[] = [];
    selectedFiles.forEach((file) => {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        previews.push({
          url: fileReader.result as string,
          name: file.name,
          originalName: file.name,
          isEditing: false,
        });
        if (previews.length === selectedFiles.length) {
          // Merge newly selected files with existing files if any
          setPreviewUrls((prevPreviewUrls) => [
            ...prevPreviewUrls,
            ...previews,
          ]);
        }
      };
      fileReader.readAsDataURL(file);
    });
  };
```

#### 2. 업로드 완료 후 리셋 기능

업로드를 완료하고 나서 파일 선택 영역을 초기화하는 기능을 추가해보자. 정석적인 방법은 `useFileUpload` 훅에서 파일 관련 변수들을 초기화하는 함수를 추가하면 되지만, 간단하게 생각하면 그냥 페이지를 새로고침 시키면 된다.

```ts
// useFileUpload.ts
...
const clearFiles = () => {
  window.location.reload()
}
...
```

## 앞으로 더 생각해볼 것들

#### 안전하게 public 배포(인증 프로세스?)

현재 상태로 Public 배포를 하면 모든 사용자가 이미지를 업로드할 수 있게 된다. 이를 방지하기 위해서는 인증 프로세스를 추가해야 하는데 어차피 나 혼자만 쓸거니깐 최대한 간소화시키고 싶다. 그 전까지는 번거롭지만 로컬서버에서 띄워서 업로드해야겠다.

#### 이전에 올린 asset 파일들 모두 Cloudinary로 마이그레이션 자동화

앞으로 올릴 asset 파일들은 모두 Cloudinary로 업로드할 예정이다. 이전에 올린 파일들은 모두 Cloudinary로 마이그레이션 자동화해야하는데 꽤나 번거로운 작업이다.

#### 파일 업로드 진행률 표시

파일을 업로드하는 동안 진행률을 표시해주는 것이 좋을 것 같다.
