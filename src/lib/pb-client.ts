import PocketBase from 'pocketbase';

/**
 * 클라이언트 컴포넌트 전용 PocketBase 인스턴스 유틸리티
 */
export function getClientPocketBase() {
    return new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');
}
