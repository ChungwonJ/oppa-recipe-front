# 오빠레시피 (Oppa Recipe)

> **사진 한 장으로 찾는 가장 정확한 영상 레시피**
> 사용자가 올린 음식 사진을 AI가 분석하여 관련 유튜브 쇼츠를 매칭하고, 핵심 레시피를 추출해주는 스마트 가이드입니다.

<br/>

## Project Links
- **Live Demo**: [https://oppa-recipe.shop](https://oppa-recipe.shop)
- **Backend Repo**: [https://github.com/ChungwonJ/oppa-recipe-back](https://github.com/ChungwonJ/oppa-recipe-back)

<br/>

## Tech Stack
- **Framework**: Next.js (Pages Router)
- **Language**: TypeScript
- **Styling**: SCSS / Tailwind CSS
- **Network**: Axios
- **Test**: Jest
- **Deployment**: Vercel

<br/>

## Key Features & Trouble Shooting

### 1. 리스트 렌더링 성능 최적화 (13% 단축)
- **문제**: 저장된 레시피 리스트가 늘어남에 따라 컴포넌트 재렌더링 시 시각적인 버벅임 발생.
- **해결**: `React.memo`를 사용하여 부모 컴포넌트 변경 시 불필요한 자식 컴포넌트(Recipe Card)의 재렌더링을 차단.
- **결과**: React Profiler 측정 기준, 렌더링 소요 시간 **273.2ms에서 236.6ms로 약 13% 개선**.

### 2. Silent Refresh 인증 시스템 (Axios Interceptor)
- **문제**: AccessToken 만료 시 사용자 세션이 끊겨 UX 저하 및 API 요청 실패 발생.
- **해결**: Axios `responseInterceptor`를 구축하여 **401 Unauthorized** 에러 발생 시 자동으로 `HttpOnly Cookie` 기반의 `RefreshToken`을 활용해 토큰을 재발급받는 로직 구현.

### 3. Jest를 이용한 로직 검증
- **내용**: Mock Service Worker 개념을 활용하여, 실제 서버 없이도 401 에러 상황에서의 **토큰 자동 갱신 및 API 재시도(Retry) 로직**이 정상 동작하는지 테스트 코드로 검증 완료.

<br/>

##  Project Structure
OPPA-RECIPE-FRONT/
├── __tests__/      # Jest 테스트 파일
├── components/     # 재사용 가능한 UI 컴포넌트
├── lib/            # Axios 인스턴스, 인터셉터 등 핵심 로직
├── pages/          # Next.js Pages Router
├── public/         # 이미지, 파비콘 등 정적 자원
├── styles/         # SCSS 스타일 파일
├── types/          # 공통 TypeScript Interface & Type
├── .env.local      # 환경 변수 설정
├── jest.config.js  # Jest 설정 파일
├── next.config.ts  # Next.js 설정 파일
└── package.json    # 종속성 및 스크립트 관리