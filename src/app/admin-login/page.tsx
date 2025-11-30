import AuthForm from '@/components/auth-form'

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="w-full max-w-md p-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">NewsMate Admin</h1>
                    <p className="text-slate-400 mt-2">Restricted Access</p>
                </div>
                <AuthForm redirectTo="/admin" />
            </div>
        </div>
    )
}
