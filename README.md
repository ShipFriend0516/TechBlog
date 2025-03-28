# TechBlog

![TechBlog Banner](https://via.placeholder.com/800x200?text=TechBlog)

## 프로젝트 개요

NextJS를 기반으로 한 개인 기술 블로그와 포트폴리오 웹 애플리케이션입니다. 테크 관련 게시물을 작성하고 개인 프로젝트를 전시하는 공간으로 활용됩니다.

## 기술 스택

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **UI Components**: 
  - [React Icons](https://react-icons.github.io/react-icons/)
  - [React Lottie Player](https://github.com/LottieFiles/react-lottie-player)
- **Markdown Editor**: [@uiw/react-md-editor](https://uiwjs.github.io/react-md-editor/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with [Mongoose](https://mongoosejs.com/))
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **File Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **HTTP Client**: [Axios](https://axios-http.com/)

### DevOps & Testing
- **Testing Framework**: [Jest](https://jestjs.io/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Linting & Formatting**: 
  - [ESLint](https://eslint.org/)
  - [Prettier](https://prettier.io/)

## 디렉토리 구조

```
TechBlog/
├── app/                  # Next.js App Router 구조
│   ├── admin/            # 관리자 페이지
│   ├── api/              # 백엔드 API 로직
│   ├── config/           # 설정 파일
│   ├── docs/             # 문서화 관련
│   ├── entities/         # 엔티티 정의
│   ├── hooks/            # React 커스텀 훅
│   ├── lib/              # 유틸리티 함수들
│   ├── middlewares/      # 미들웨어
│   ├── models/           # MongoDB 모델 정의
│   ├── portfolio/        # 포트폴리오 페이지
│   ├── posts/            # 블로그 포스트 관련 페이지
│   ├── public/           # 정적 파일
│   ├── series/           # 시리즈 글 관련 페이지
│   ├── stores/           # Zustand 스토어
│   └── types/            # TypeScript 타입 정의
├── .github/              # GitHub 워크플로우
└── __test__/             # 테스트 파일
```

## 주요 기능

- **블로그 게시물 관리**: 마크다운 에디터를 통한 블로그 포스팅
- **포트폴리오 전시**: 개인 프로젝트 소개 및 전시
- **시리즈 관리**: 연결된 포스트를 시리즈로 그룹화
- **관리자 대시보드**: 콘텐츠 관리를 위한 관리자 페이지
- **SEO 최적화**: 정적 사이트맵 생성 및 메타데이터 관리

## 설치 및 실행

### 사전 요구사항
- Node.js 18.x 이상
- MongoDB 데이터베이스

### 설치

```bash
# 저장소 클론
git clone https://github.com/ShipFriend0516/TechBlog.git

# 디렉토리 이동
cd TechBlog

# 의존성 설치
npm install
# 또는
yarn install
```

### 환경 변수 설정
`.env.local` 파일을 생성하고 다음과 같이 설정하세요:

```
# MongoDB 연결 정보
MONGODB_URI=

# NextAuth 설정
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Vercel Blob 설정 (이미지 업로드용)
BLOB_READ_WRITE_TOKEN=
```

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 확인할 수 있습니다.

### 빌드 및 테스트

```bash
# 타입 체크
npm run type-check

# 테스트 실행
npm run test

# 프로덕션 빌드
npm run build
```

## 기여 방법

1. 이 저장소를 포크합니다.
2. 새 브랜치를 생성합니다: `git checkout -b feature/새기능`
3. 변경사항을 커밋합니다: `git commit -m '새로운 기능 추가'`
4. 포크한 저장소에 푸시합니다: `git push origin feature/새기능`
5. Pull Request를 생성합니다.

## 라이센스

이 프로젝트는 [MIT 라이센스](LICENSE)를 따릅니다.

---

⭐ 이 프로젝트가 유용하다고 생각되면 스타를 눌러주세요!
