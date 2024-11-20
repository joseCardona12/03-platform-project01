import { LoginForm } from "@/ui/organisms"
import Link from "next/link"

export const LoginTemplate = () => {
    return (
        <div className="min-h-screen flex  items-center justify-center ">
            <nav className="absolute top-1 left-2 text-base text-blue-600">
                <Link href={"/"}>Volver al inicio</Link>
            </nav>
            <div className="w-full max-w-md  p-6 bg-white rounded-lg shadow-md">
                <LoginForm />
            </div>
        </div>
    )
}