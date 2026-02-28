import { getPocketBase } from '@/lib/pocketbase';
import { Plus, Database, Cpu } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
    const pb = await getPocketBase();

    // 직접 데이터 페칭 (제한 없이)
    const records = await pb.collection('records').getFullList({
        sort: '-created',
    });

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                <div>
                    <h1 className="text-2xl font-bold">대시보드</h1>
                    <p className="text-gray-400 text-sm">LattePanda & Cloudflare Tunnel 최적화 시스템</p>
                </div>
                <div className="flex space-x-4">
                    <div className="flex items-center space-x-2 text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20">
                        <Cpu className="w-3 h-3" />
                        <span>Online</span>
                    </div>
                    <Link href="/new" className="btn-premium flex items-center space-x-2 text-sm">
                        <Plus className="w-4 h-4" />
                        <span>새 레코드</span>
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 space-y-4">
                    <div className="bg-blue-500/10 p-3 rounded-lg w-fit">
                        <Database className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-lg font-semibold">활성 레코드</h2>
                    <p className="text-3xl font-bold">{records.length}</p>
                </div>

                {/* Placeholder for other stats */}
                <div className="glass p-6 space-y-4 opacity-50">
                    <div className="bg-purple-500/10 p-3 rounded-lg w-fit">
                        <Cpu className="w-6 h-6 text-purple-400" />
                    </div>
                    <h2 className="text-lg font-semibold">CPU 사용률</h2>
                    <p className="text-3xl font-bold">--%</p>
                </div>

                <div className="glass p-6 space-y-4 opacity-50">
                    <div className="bg-orange-500/10 p-3 rounded-lg w-fit">
                        <Plus className="w-6 h-6 text-orange-400" />
                    </div>
                    <h2 className="text-lg font-semibold">구독 상태</h2>
                    <p className="text-3xl font-bold">Active</p>
                </div>
            </div>

            <section className="space-y-4">
                <h3 className="text-xl font-semibold">최근 레코드</h3>
                <div className="grid gap-4">
                    {records.length > 0 ? (
                        records.map((record) => (
                            <div key={record.id} className="glass p-6 flex justify-between items-center group transition-all hover:bg-white/10">
                                <div>
                                    <h4 className="font-medium text-lg">{record.title}</h4>
                                    <p className="text-sm text-gray-400">{new Date(record.created).toLocaleDateString()}</p>
                                </div>
                                <button className="text-gray-400 group-hover:text-white transition-colors">
                                    상세보기 →
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="glass p-12 text-center text-gray-500">
                            표시할 레코드가 없습니다.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
