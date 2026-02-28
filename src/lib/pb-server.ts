import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';

/**
 * PocketBase SDK 서버 사이드 전용 인스턴스 유틸리티 (Server Components / Actions용)
 */
export async function getPocketBase() {
    const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');

    // SSR 환경에서 쿠키를 통해 인증 상태를 복원합니다.
    const cookieStore = cookies();
    const authCookie = cookieStore.get('pb_auth');

    if (authCookie) {
        pb.authStore.loadFromCookie(authCookie.value);
    }

    // 매 요청 시 인증 유효성을 확인합니다.
    try {
        if (pb.authStore.isValid) {
            await pb.collection('users').authRefresh();
        }
    } catch (_) {
        pb.authStore.clear();
    }

    return pb;
}
