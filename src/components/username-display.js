import { useUser } from '@/context/UserContext';
import Link from "next/link"

export function UsernameDisplay() {
    const { currentUsername } = useUser();
    return (
        currentUsername ? (
            <div className="p-5">
                <h1 className="text-5xl font-bold">Hi, {currentUsername} 👋 </h1>
            </div>
        ) : (
            <div className="p-5">
                <h1 className="text-5xl font-bold">
                    <Link
                        href="/Login"
                        className="text-sm font-medium hover:text-[#000080] text-[#333333]"
                        prefetch={false}>
                        Click here to login
                    </Link>
                </h1>
            </div>
        )

    );
}
