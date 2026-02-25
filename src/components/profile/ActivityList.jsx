import React from 'react';
import { Activity, Smartphone } from 'lucide-react';

export default function ActivityList({ recentDevices = [] }) {
    // For MVP, we use recent saved devices as the activity proxy.
    // Later, this could interleave with comments, comparisons, etc.

    if (!recentDevices || recentDevices.length === 0) {
        return null;
    }

    return (
        <div className="pt-4 mb-20">
            <h3 className="text-h3 font-semibold mb-6 flex items-center gap-2">
                <Activity className="text-brand" size={24} />
                Recent Activity
            </h3>

            <div className="flex flex-col gap-4 relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-6 bottom-4 w-px bg-border-subtle" />

                {recentDevices.slice(0, 3).map((device, i) => (
                    <div key={i} className="flex gap-6 relative z-10 group">
                        {/* Timeline dot */}
                        <div className="w-12 h-12 rounded-2xl bg-bg-surface border border-border-subtle flex items-center justify-center shrink-0 group-hover:bg-brand/10 transition-colors">
                            <Smartphone className="text-text-secondary group-hover:text-brand transition-colors" size={20} />
                        </div>
                        
                        {/* Content */}
                        <div className="flex flex-col justify-center pt-1">
                            <p className="text-base text-text-primary">
                                <span className="text-text-muted mr-2">Saved</span>
                                <span className="font-semibold text-white">{device.name}</span>
                            </p>
                            <span className="text-sm text-text-muted mt-0.5">Recently</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
