import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Smartphone, Laptop, Watch, Headphones, Tv } from "lucide-react";

// Feature Components
import Hero from "@/components/home/hero/Hero";
import Categories from "@/components/home/Categories";
import TrendingDevices from "@/components/sections/TrendingDevices";
import Features from "@/components/sections/Features";
import AIPreview from "@/components/sections/AIPreview";
import LatestNews from "@/components/sections/LatestNews";
import CompareHighlight from "@/components/sections/CompareHighlight";
import Stats from "@/components/sections/Stats";
import CTA from "@/components/sections/CTA";

import { getProducts } from "@/services/apiProducts";

const CATEGORIES = [
    { name: "Phones", icon: <Smartphone size={ 14 } /> },
    { name: "Laptops", icon: <Laptop size={ 14 } /> },
    { name: "Watches", icon: <Watch size={ 14 } /> },
    { name: "Audio", icon: <Headphones size={ 14 } /> },
    { name: "Displays", icon: <Tv size={ 14 } /> },
];

export default function Home ()
{

    const [ products, setProducts ] = useState( [] );
    const [ loading, setLoading ] = useState( true );


    useEffect( () =>
    {
        getProducts().then( ( data ) =>
        {
            setProducts( data || [] );
            setLoading( false );
        } );
    }, [] );

    return (
        <div className="flex flex-col min-h-screen bg-bg-main selection:bg-hyper-cyan selection:text-black">

            {/* HERO SECTION */ }
            <Hero />

            {/* CATEGORIES / EXPLORE DEVICES */ }
            <Categories />

            {/* WHY TECH NEST */ }
            <Features />

            {/* AI PREVIEW */ }
            <AIPreview />

            {/* LATEST NEWS & REVIEWS */ }
            <LatestNews />

            {/* COMPARISON HIGHLIGHT */ }
            <CompareHighlight />

            {/* TRENDING DEVICES */}
            <TrendingDevices products={ products } loading={ loading } />

            {/* COMMUNITY STATS */}
            <Stats />

            {/* FINAL CTA */}
            <CTA />

        </div>
    );
}