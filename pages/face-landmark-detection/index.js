import styles from '../../styles/Home.module.css'
import Link from 'next/link';

export default function FaceLandmarkDetection() {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h2
                    style={{
                        fontWeight: "normal"
                    }}>
                    <Link style={{ fontWeight: "bold" }} href={'/'}>Home</Link> / Face Landmark Detection 🤓
                </h2>
                <code>Work in progress...</code>
            </main>
        </div>
    )
}