import React from 'react';
import { BadgeCheck, CalendarDays } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function ProfileHeader({ profile }) {
    if (!profile) return null;

    const joinDate = profile.created_at 
        ? new Date(profile.created_at).getFullYear()
        : new Date().getFullYear();

    // Default username logic if database doesn't have it initialized
    const displayName = profile.username || profile.email?.split('@')[0] || "Unknown User";

    return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pt-10 pb-8 border-b border-border-subtle">
            {/* AVATAR */}
            <div className="shrink-0 relative group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-bg-surface border-4 border-bg-main shadow-premium-md flex items-center justify-center relative z-10 transition-transform duration-500 ease-out group-hover:scale-105">
                    {profile.avatar_url ? (
                        <img 
                            src={profile.avatar_url} 
                            alt={`${displayName}'s avatar`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-linear-to-tr from-brand to-purple-500 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold uppercase">
                            {displayName.charAt(0)}
                        </div>
                    )}
                </div>
                {/* Glow behind avatar */}
                <div className="absolute inset-0 bg-brand/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* INFO */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left pt-2">
                <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-h2 font-bold tracking-tight text-white mb-0">{displayName}</h1>
                    {profile.role && ['admin', 'super_admin', 'editor'].includes(profile.role) && (
                        <BadgeCheck size={20} className="text-brand shrink-0" />
                    )}
                </div>
                
                {/* Bio */}
                <p className="text-body text-text-secondary max-w-xl mb-4 leading-relaxed">
                    {profile.bio || "Tech enthusiast and devices explorer."}
                </p>

                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-auto">
                    <Badge variant="outline" className="text-text-muted hover:border-brand/30 transition-colors">
                        <CalendarDays size={14} className="mr-1" />
                        Member since {joinDate}
                    </Badge>
                    <Badge variant="primary" className="bg-brand/10 text-brand">
                        Novice
                    </Badge>
                </div>
            </div>
        </div>
    );
}
