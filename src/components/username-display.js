import { useUser } from '@/context/UserContext';
import Link from "next/link"

export function UsernameDisplay() {
    const { username, isLoading } = useUser();
    return (
        username ? (
            <div className="p-5">
                <h1 className="text-5xl font-bold">
                    <Link
                            className="text-5xl font-bold hover:text-[#000080] text-[#333333]"
                            href="/Login"
                            prefetch={false}>
                            Hi, {username} 👋 
                    </Link>
                </h1>
            </div>
        ) : (!isLoading &&
            <div className="p-5">
                <h1 className="text-5xl font-bold">
                    <Link
                        href="/Login"
                        className="text--5xl font-bold hover:text-[#000080] text-[#333333]"
                        prefetch={false}>
                        Click here to login
                    </Link>
                </h1>
            </div>
        )

    );
}
