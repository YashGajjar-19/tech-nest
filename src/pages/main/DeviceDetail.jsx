import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDeviceBySlug } from "@/services/apiDevices";
import { useAuth } from "@/context/AuthContext";
import { logDeviceView } from "@/services/apiPersonalization";

import DeviceSkeleton from "@/components/skeleton/DeviceSkeleton";
import NotFound from "@/pages/main/NotFound";

// Device Sections
import DeviceHero from "@/components/device/DeviceHero";
import Highlights from "@/components/device/Highlights";
import AISummary from "@/components/device/AISummary";
import SpecsTabs from "@/components/device/SpecsTabs";
import VariantTable from "@/components/device/VariantTable";
import MediaGallery from "@/components/device/MediaGallery";
import ReviewsSection from "@/components/device/ReviewsSection";
import CompareSuggestions from "@/components/device/CompareSuggestions";
import SimilarDevices from "@/components/device/SimilarDevices";

export default function DeviceDetail() {
    const { slug } = useParams();
    const { user } = useAuth();
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        getDeviceBySlug(slug)
            .then((data) => {
                setDevice(data);
                if (data && user) {
                    logDeviceView(user.id, data.id);
                }
            })
            .catch(() => setDevice(null))
            .finally(() => setLoading(false));
    }, [slug, user]);

    if (loading) return <DeviceSkeleton />;
    if (!device) return <NotFound />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32 animate-in fade-in duration-700">
            {/* HERO OVERVIEW */}
            <DeviceHero device={device} />

            {/* QUICK HIGHLIGHTS */}
            <Highlights device={device} />

            {/* AI SUMMARY */}
            <AISummary summary={device.ai_summary} />

            {/* SPECIFICATIONS */}
            <SpecsTabs device={device} />

            {/* VARIANTS & PRICING */}
            <VariantTable />

            {/* MEDIA GALLERY */}
            <MediaGallery device={device} />

            {/* REVIEWS */}
            <ReviewsSection />

            {/* COMPARISON SUGGESTIONS */}
            <CompareSuggestions />

            {/* SIMILAR DEVICES */}
            <SimilarDevices />
        </div>
    );
}