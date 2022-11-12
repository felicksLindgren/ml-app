import styles from '../../styles/Home.module.css'
import Link from 'next/link';
import dynamic from 'next/dynamic';

const FaceLandmarksDetection = dynamic(() => import('../../components/FaceLandmarksDetections'), {
    ssr: false
})

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
                <code style={{ marginBottom: '1rem' }}>Work in progress...</code>
                {/* <FaceMeshComponent></FaceMeshComponent> */}
                <FaceLandmarksDetection></FaceLandmarksDetection>
            </main>
        </div>
    )
}