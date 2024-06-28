import { useUser } from '@/context/UserContext';
import Link from "next/link"

export function UsernameDisplay() {
    const { username, isLoading } = useUser();
    return (
        username ? (
            <div className="p-5">
                <h1 className="text-5xl font-bold">Hi, {username} 👋 </h1>
            </div>
        ) : (!isLoading &&
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
