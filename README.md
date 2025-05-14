# TechBlog
 

## 프로젝트 개요

NextJS를 기반으로 한 개인 기술 블로그와 포트폴리오 웹 애플리케이션입니다. 테크 관련 게시물을 작성하고 개인 프로젝트를 전시하는 공간으로 활용하는 프로젝트

### 블로그 기능
![image](https://github.com/user-attachments/assets/240cc1a5-5ad6-4921-bbef-ee1cd76fa379)

### 블로그 작성 기능
![image](https://github.com/user-attachments/assets/4bb0c223-cfa2-4414-9a47-59883820d08b)


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
