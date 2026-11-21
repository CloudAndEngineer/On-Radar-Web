# 온 레이더 관리자 웹

React, TypeScript, Vite로 만든 복지사 대시보드 프론트엔드입니다. 현재 화면은 UI 시안에 맞춘 목업 데이터로 동작하며, API 연결 시 `src/api`의 목업 구현을 실제 Core API 호출로 전환하면 됩니다.

## 시작하기

```bash
npm install
npm run dev
```

## 주요 경로

- `/` 대상자 현황 대시보드
- `/seniors/:seniorId` 어르신 상세, 생활 패턴, 알림 진행 및 공유 타임라인

## 환경 변수

`.env.example`을 `.env`로 복사해 사용합니다.

- `VITE_CORE_API_URL`: Spring Boot Core API 기본 주소 (기본값 `http://localhost:8080/api`)
- `VITE_USE_MOCK`: `true`이면 시드 목업 데이터 사용, `false`이면 API 호출

## 폴더 구조

```text
src/
├── api/          # HTTP 클라이언트와 기능별 API
├── components/   # 공통 레이아웃, 상태 배지
├── data/         # 화면 개발용 목업 데이터
├── pages/        # 대시보드와 어르신 상세 화면
├── types/        # API 계약 타입
├── router.tsx
└── styles.css
```

백엔드 연동 때는 로그인 토큰과 SSE 연결, 상세·패턴·타임라인 응답 계약을 팀 API 명세에 맞춰 추가해야 합니다.
