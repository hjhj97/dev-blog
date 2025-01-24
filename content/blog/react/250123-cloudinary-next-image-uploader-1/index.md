---
title: Cloudinary API + Next.js 로 이미지 업로드 자동화 (1 of 2)
date: "2025-01-23"
description: 블로그에 올릴 이미지의 업로드를 자동화하는 웹페이지 만들기
category: React
---

## 무엇이 문제인가

현재 개발 블로그에서 사용되는 각종 asset 파일(이미지, 움짤 gif 등)들을 저장하는데 크게 2가지 방식을 사용하고 있다. 각각의 장점과 단점을 가지고 있다.

#### 1. 레포지토리 자체 저장

가장 쉽고 간단한 방법은 개발 블로그 레포지토리(`Gatsby` 기반)에 asset 파일을 그대로 저장하는 것이다. 이 방식의 장점은 내가 Github에 제때 push만 잘 해놓으면 서버에 저장되기 때문에 맥북을 잃어버리더라도 이미지가 유실될 걱정을 하지 않아도 된다. 하지만 치명적인 단점은 이미지를 많이 저장할수록 빌드 결과물의 용량이 점점 커진다는 것이다.

실제로 포스팅을 36개 작성한 현재 시점에서 프로젝트 빌드한 결과물이 `public` 폴더에 담기게 되는데 그 용량이 28.4MB에 달한다. 그 안에서도 asset,폰트 파일이 담겨있는 `static` 파일의 용량이 18MB이다.

![image-size](https://res.cloudinary.com/dxnnrbhbk/image/upload/v1737519985/blog/assets/%08image-size.png)

결코 작지 않은 용량이다. 앞으로 블로그에 올릴 이미지를 계속 이 방식으로 저장한다면 빌드가 점점 무거워질 것이다. 때문에 1번 방식은 블로그 개설 초창기에 사용하다가 이후에는 아래 설명할 2번 방식을 사용하고 있다.

#### 2. Github 임시 업로드

2번 방식은 Github의 클라우드 서버를 이용하는 것이다. 물론 Github이 이미지 업로드 클라우드 서비스를 정식으로 제공하지는 않는다. 그래서 약간의 꼼수를 이용할 것이다. (꼼수라고 하기엔 누구나 다 알고 있지만)

Github에서 commit,issue,PR을 작성할 때 마크다운용 에디터 모드로 전환되는데, 그 때 이미지를 Drag & Drop 하게 되면 자동으로 이미지가 Github 서버에 저장되며 URL이 담긴 마크다운 문법까지 자동으로 완성해준다.

![github-upload](https://res.cloudinary.com/dxnnrbhbk/image/upload/v1737520954/blog/assets/github-upload.gif)

이 방식의 경우 asset을 클라우드 서버에 저장해놓기 때문에 빌드 결과물의 용량에는 영향을 미치지 않는다. 1번 방식의 단점을 해소할 수 있다.

다만 이 방식도 단점이 존재하는데, 파일을 관리하는 주체가 내가 아닌 Github에게 있다는 점이다. 때문에 Github이 어느 순간 파일을 삭제해버리면 내 입장에서는 이미지를 찾을 수 없게 된다. 또한 구글 드라이브처럼 정식 클라우드 서비스가 아니기 때문에, 파일을 일괄적으로 관리할 수 있는 콘솔 기능은 지원하지 않는다.

## 어떻게 개선할 것인가

1번과 2번 방식 모두 장점과 단점이 존재하는데, 단점은 모두 지우고 장점만 모아놓은 서비스를 만드려고 한다.  
즉 '**파일을 안전하게 백업**' + '**클라우드 서버에 저장**' + '**이미지 업로드 자동화**'를 챙기고자 하는 것이 목표이다.

가장 쉽게 생각할 수 있는 방법은 클라우드 서비스를 이용하면 된다. 구글 드라이브, Dropbox, 네이버 MYBOX 등 여러 서비스를 체험해보며 다음 일련의 과정을 직접 테스트 해보았다.

> 이미지 업로드 → 이미지가 저장된 URL 추출 → 마크다운 문법으로 변환

그런데 생각보다 step의 수가 많아져서 깔끔하지 않았다. 클라우드 서비스에서 제공하는 URL은 실제 데이터가 저장된 경로가 아닌, 클라우드에서 제공하는 공유/에디터 기능이 씌워진 형태로 제공해주는 경우가 대부분이었다.  
따라서 개발자도구에서 `<img>` 태그를 찾아 이미지 경로를 추출해야 했는데 이는 너무 번거롭다고 판단했다. 또한 2번 방식처럼 이미지 주소를 곧바로 마크다운 문법으로 변환해주지 않아 내가 직접 변환해야 했다.

좀 더 개발자 친화적으로 내가 원하는 기능만 커스텀할 수 있는 서비스를 찾다보니 [Cloudinary](https://cloudinary.com/)가 있었다. Cloudinary에서는 업로드를 위한 API를 제공해주며 리턴값으로 이미지 경로를 알려주기 때문에 이를 기반으로 마크다운 문법으로 변환해주는 기능을 구현해보기로 했다.

Cloudinary에서 제공하는 프레임워크별로 보일러 플레이트 [레포지토리](https://github.com/cloudinary-community/cloudinary-examples)가 있어 나는 이 중에서 하나를 fork해서 사용하기로 했다. 이 중에는 React/Vue 와 같은 CSR과 Next/Nuxt 와 같은 SSR 프레임워크를 제공하고 있었다.

[Cloudinary API 문서](https://cloudinary.com/documentation/image_upload_api_reference)를 찾아보면 업로드 API를 호출하기 위해서는 `POST` 메소드의 `Body` 에 들어가는 파라미터로 `API_KEY`와 `API_SECRET`를 기반으로 생성되는 `SIGNATURE` 가 필요하다. CSR 에서는 `API_SECRET`을 환경변수로 넣어서 페이지를 서빙하면 브라우저에 노출될 수밖에 없다. 이는 보안상 취약점이 될 수 있기 때문에 서버에서 실행하여 숨길 수 있는 SSR 프레임워크를 사용하는 것이 좋겠다고 판단했다. 나는 `Next.js` 를 사용하기로 했다.

프로젝트의 보일러 플레이트는 [이곳](https://github.com/cloudinary-community/cloudinary-examples/tree/main/examples/nextjs-upload-formdata)에서 fork 해왔다. 서버를 띄우고 본인의 cloudinary 와 연동하기 위해서는 `env.example` 파일에 명시된 환경변수를 설정해주면 된다. 그리고 서버를 띄우면 기본적인 파일 업로드를 할 수 있는 웹페이지가 만들어진다. 이 상태에서는 파일을 하나씩밖에 업로드할 수 없으며, 파일 미리보기도 지원하지 않는다.

여기서 내가 추가하고 싶은 기능은 다음과 같다.

1. 파일 동시에 여러개 업로드 허용
2. 업로드 전에 파일 미리보기
3. 파일명 수정할 수 있도록 하기
4. 업로드 후 이미지 경로 받아오기
5. 이미지 경로를 마크다운 문법으로 변환

구체적으로 어떻게 구현할 것인지는 다음 포스팅에서 다루도록 하겠다.

## Reference

- https://cloudinary.com/documentation/image_upload_api_reference
- https://github.com/cloudinary-community/cloudinary-examples/tree/main/examples/nextjs-upload-formdata
