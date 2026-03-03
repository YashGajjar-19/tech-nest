"use client";

import React from "react";
import { WizardProvider, useWizard } from "./WizardContext";
import { WizardSidebar } from "./WizardSidebar";
import { StepBrand } from "./StepBrand";
import { StepIdentity } from "./StepIdentity";
import { StepVariants } from "./StepVariants";
import { StepSpecs } from "./StepSpecs";
import { StepImages } from "./StepImages";
import { StepRelations } from "./StepRelations";
import { StepReview } from "./StepReview";

// ── Step renderer ─────────────────────────────────────────────

function WizardStep() {
  const { currentStep } = useWizard();

  switch (currentStep) {
    case 1:
      return <StepBrand />;
    case 2:
      return <StepIdentity />;
    case 3:
      return <StepVariants />;
    case 4:
      return <StepSpecs />;
    case 5:
      return <StepImages />;
    case 6:
      return <StepRelations />;
    case 7:
      return <StepReview />;
    default:
      return null;
  }
}

// ── Layout shell ──────────────────────────────────────────────

function WizardShell() {
  return (
    <div className="flex h-full -m-8">
      {/* Sidebar */}
      <WizardSidebar />

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full p-12">
          <WizardStep />
        </div>
      </div>
    </div>
  );
}

// ── Public export (wraps provider) ───────────────────────────

export function DeviceWizard({
  initialDeviceId,
  initialBrandId,
  initialBrandName,
}: {
  initialDeviceId?: string;
  initialBrandId?: string;
  initialBrandName?: string;
}) {
  return (
    <WizardProvider
      initialDeviceId={initialDeviceId}
      initialBrandId={initialBrandId}
      initialBrandName={initialBrandName}
    >
      <WizardShell />
    </WizardProvider>
  );
}
