"use client";

import Image from "next/image";
import Link from "next/link";

import styles from "./navbar.module.css"
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../utilities/firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";

export default function Navbar() {
    // init user state
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });

        // clean up subscription and unmount
        return () => unsubscribe();
    }, [] /* No dependencies, never rerun */);

    return (
        <nav className={styles.nav}>
            <Link href="/">
                <div>
                    <Image width={90} height={20} 
                        src="/youtube-logo.svg" alt="YouTube Logo" />
                </div>
            </Link>
            <SignIn user={user} />
        </nav>
    );
}
