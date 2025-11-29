import AuthForm from '@/components/auth-form'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-md p-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">NewsMate</h1>
                    <p className="text-slate-500 mt-2">Daily News Analytics & Recommendations</p>
                </div>
                <AuthForm />
            </div>
        </div>
    )
}
