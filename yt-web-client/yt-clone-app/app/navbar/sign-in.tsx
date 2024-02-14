import { signInWithGoogle, signOut } from '../utilities/firebase/firebase';
import styles from './signIn.module.css';
import { User } from 'firebase/auth';

interface SignInProps {
    user: User | null;
}

export default function SignIn({ user }: SignInProps) {
    
    return (
        <div>
            { user ? (
                <button className={styles.signin} onClick={signOut}>
                    Sign Out
                </button>
            ) : (
                <button className={styles.signin} onClick={signInWithGoogle}>
                    Sign In
                </button>
            )}
        </div>
    );
}