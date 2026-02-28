'use client';

import { useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6">
            <div className="glass p-12 text-center max-w-md">
                <h1 className="text-3xl font-bold mb-4 gradient-text">System Error</h1>
                <p className="text-gray-400 mb-8">
                    죄송합니다. 요청을 처리하는 중에 오류가 발생했습니다.
                </p>
                <button
                    onClick={() => reset()}
                    className="btn-premium flex items-center justify-center space-x-2 w-full"
                >
                    <RefreshCcw className="w-5 h-5" />
                    <span>다시 시도하기</span>
                </button>
            </div>
        </div>
    );
}
