# Cloudflare Pages 배포 가이드 (Next.js 14.2+)

이 가이드는 현재 프로젝트를 Cloudflare Pages에 배포하고 PocketBase와 연결하는 방법을 설명합니다.

## 1. 사전 준비
- Cloudflare 계정 및 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) 설치.
- 실행 중인 PocketBase 서버 및 Cloudflare Tunnel (또는 공인 도메인).

## 2. 빌드 설정
Cloudflare Pages 대시보드에서 프로젝트를 생성할 때 다음 설정을 사용하십시오:

- **Framework preset**: `Next.js`
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Node.js version**: `20.x` 이상

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
npx wrangler pages dev .next

# 수동 배포
npx wrangler pages deploy .next
```

## 5. 주의 사항
- **Edge Runtime**: 현재 프로젝트는 Cloudflare의 Edge Runtime에서 최적으로 동작하도록 구성되어 있습니다.
- **TLS 1.3**: Next.js와 PocketBase 간의 통신은 반드시 HTTPS(TLS 1.3)를 통해 이루어지도록 설정하십시오.
- **Auth Cookie**: Middleware가 쿠키를 올바르게 인식하도록 `pb_auth` 쿠키가 `SameSite=Lax` 및 적절한 도메인 설정을 가지고 있는지 확인하십시오.

---
> [!NOTE]
> PocketBase의 `pb_schema.json`을 사용하여 서버의 컬렉션을 먼저 최신화한 후 배포를 진행하는 것을 권장합니다.
