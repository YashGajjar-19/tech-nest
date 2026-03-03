export default function HeroHeadline() {
  return (
    <div className="flex flex-col items-center justify-center mt-8 sm:mt-16 md:mt-20 text-center px-4">
      <h1 className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-text-primary">
        Decide your next tech
        <br className="hidden sm:block" /> device in minutes.
      </h1>
      <p className="mt-5 sm:mt-6 md:mt-8 max-w-xl mx-auto text-base sm:text-[17px] sm:text-lg text-text-secondary font-medium tracking-tight leading-relaxed">
        Specs, reviews, AI insights, real community knowledge — everything you
        need to choose with confidence.
      </p>
    </div>
  );
}
