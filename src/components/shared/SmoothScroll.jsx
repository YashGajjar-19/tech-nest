import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function SmoothScroll({ children }) {
    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.08, // Smoother and less snappy to avoid jumpy feeling
            wheelMultiplier: 1, // Normalized wheel to stop unnatural acceleration jumps
            smoothWheel: true,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        let rafId;

        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
