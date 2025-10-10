import Image from "next/image";
import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { login, logout } from "@/utils/auth";
import { BadgePlus, LogOut } from "lucide-react";

const Navbar = async () => {
  const session = await auth();
  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.png" alt="YC Directory" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5 text-16-medium text-black">
          {session && session?.user ? (
            <>
              <Link href="/startup/create">
                <span className="max-sm:hidden">Create</span>
                <BadgePlus className="sm:hidden size-6" />
              </Link>

              <form action={logout}>
                <button type="submit" className="cursor-pointer">
                  <span className="max-sm:hidden">Logout</span>
                  <LogOut className="sm:hidden size-6 mt-1 text-red-500" />
                </button>
              </form>
              <Link href={`/user/${session?.id}`}>
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={session?.user?.image || "/default-avatar.png"}
                  alt={session?.user?.name || "Avatar"}
                />
              </Link>
            </>
          ) : (
            <form action={login}>
              <button type="submit">
                <span>Login</span>
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
