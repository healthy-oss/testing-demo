'use client';

import { useState } from 'react';
import { getClientPocketBase } from '@/lib/pocketbase';
import { useRouter } from 'next/navigation';
import { LogIn, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const pb = getClientPocketBase();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const authData = await pb.collection('users').authWithPassword(email, password);

            // 로그인 정보를 DB에 업데이트 (last_active 필드)
            await pb.collection('users').update(authData.record.id, {
                last_active: new Date().toISOString(),
            });

            // login_logs 컬렉션에 로그 기록
            try {
                await pb.collection('login_logs').create({
                    user: authData.record.id,
                    user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
                });
            } catch (logErr) {
                console.error('Failed to log login:', logErr);
            }

            // Cookie를 설정합니다 (Middleware에서 인식하기 위함)
            document.cookie = pb.authStore.exportToCookie({ httpOnly: false, secure: false, sameSite: 'Lax' });

            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <div className="glass p-8 w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Groth Demo</h1>
                    <p className="text-gray-400">계정에 로그인하여 계속하세요</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">이메일</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-blue-500 transition-colors"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">비밀번호</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-blue-500 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium w-full flex items-center justify-center space-x-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                        <span>{loading ? '로그인 중...' : '로그인'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
