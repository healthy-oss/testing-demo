import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';

/**
 * PocketBase SDK 인스턴스를 요청별로 생성하는 유틸리티입니다.
 * LattePanda 환경에서 다중 사용자 간의 데이터 유출을 방지하기 위해 
 * 각 요청(Request)마다 새로운 인스턴스를 반환합니다.
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

/**
 * 클라이언트 컴포넌트용 PocketBase 인스턴스 (AuthStore 공유 금지)
 */
export function getClientPocketBase() {
    return new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');
}
