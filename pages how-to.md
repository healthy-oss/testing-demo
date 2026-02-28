# Cloudflare Pages 배포 가이드 (Next.js 14.2+)

이 가이드는 현재 프로젝트를 Cloudflare Pages에 배포하고 PocketBase와 연결하는 방법을 설명합니다.

## 1. 사전 준비
- Cloudflare 계정 및 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) 설치.
- 실행 중인 PocketBase 서버 및 Cloudflare Tunnel (또는 공인 도메인).

Cloudflare Pages 대시보드에서 프로젝트를 생성할 때 다음 설정을 반드시 확인하십시오:

- **Framework preset**: `Next.js`
- **Build command**: `npm run build`
- **Build output directory**: `.vercel/output/static`
- **Node.js version**: `18.x` 또는 `20.x` 이상

## 3. 환경 변수 설정
Cloudflare Pages의 **Settings > Functions > Compatibility flags**에서 `nextjs_compute_js` 가 활성화되어 있어야 합니다. 그 후 다음 환경 변수를 설정하십시오:

| 변수명 | 설명 | 비고 |
| :--- | :--- | :--- |
| `POCKETBASE_URL` | PocketBase 서버의 주소 | 예: `https://pb.yourdomain.com` |
| `NEXT_PUBLIC_POCKETBASE_URL` | 클라이언트 사이드 SDK용 주소 | 위와 동일하게 설정 가능 |

## 4. 로컬 테스트 및 배포 (CLI 사용 시)
로컬에서 Cloudflare 환경을 시뮬레이션하거나 직접 배포하려면 다음 명령어를 사용합니다.

```bash
# 로컬 빌드 및 프리뷰
npm run build
npx wrangler pages dev .vercel/output/static

# 수동 배포 (GitHub 연동이 아닌 경우)
npx wrangler pages deploy .vercel/output/static
```

## 5. 중요: 배포 명령어 에러 수정
만약 빌드 로그에서 `Executing user deploy command: npx wrangler deploy`와 같은 에러가 발생하며 중단된다면:
1. Cloudflare Pages 대시보드 **Settings > Build & deployments**로 이동합니다.
2. **Build settings** 섹션을 확인합니다.
3. 빌드 명령어(`Build command`)에 `&& npx wrangler deploy`가 포함되어 있다면 제거하고 `npm run build`만 남겨둡니다.
4. 별도의 **Deploy command** 설정이 있다면 비워두십시오. Cloudflare Pages는 빌드 성공 후 자동으로 결과물을 배포합니다.

---
> [!NOTE]
> PocketBase의 `pb_schema.json`을 사용하여 서버의 컬렉션을 먼저 최신화한 후 배포를 진행하는 것을 권장합니다.
