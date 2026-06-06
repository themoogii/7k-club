"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Camera, Circle, CheckCircle2, LoaderCircle, Sparkles, Stamp } from "lucide-react";

const items = [
  {
    icon: CalendarDays,
    label: "Club Calendar",
    title: "Club Calendar",
    description: "Weekly club runs staged like cultural drops, not generic workout rows.",
    video: "https://res.cloudinary.com/dy4bqxt8p/video/upload/v1779622196/new107_qhrklf.mp4",
    card: {
      heading: "Club Calendar",
      badge: "Live",
      goal: "Turn weekly runs into cultural drops with RSVP, stamps, and share cards.",
      tasks: [
        { title: "Publish weekly rhythm", meta: "Completed in 4.2s", status: "completed" },
        { title: "Sync RSVP cards", meta: "Completed in 8.1s", status: "completed" },
        { title: "Stage club route", meta: "In progress... 18s", status: "progress" },
        { title: "Unlock stamp reward", meta: "Pending", status: "pending" },
      ],
    },
  },
  {
    icon: Camera,
    label: "Race Photos",
    title: "Race Photo Archive",
    description: "High-quality race archives with AI bib search and full-resolution downloads.",
    video: "https://res.cloudinary.com/dy4bqxt8p/video/upload/v1779621768/new105_meaomd.mp4",
    card: {
      heading: "Race Photo Archive",
      badge: "AI Bib",
      goal: "Store thousands of high-quality race photos and let runners search by bib.",
      tasks: [
        { title: "Select race archive", meta: "Completed in 3.1s", status: "completed" },
        { title: "Tag start / finish line", meta: "Completed in 5.4s", status: "completed" },
        { title: "Detect bib numbers", meta: "In progress... 24s", status: "progress" },
        { title: "Release HQ downloads", meta: "Pending", status: "pending" },
      ],
    },
  },
  {
    icon: Stamp,
    label: "Run Passport",
    title: "Run Passport",
    description: "Collect city, race, club, and ritual stamps as proof your legs have lore.",
    video: "https://res.cloudinary.com/dy4bqxt8p/video/upload/v1779622220/new108_k1a47m.mp4",
    card: {
      heading: "Run Passport",
      badge: "Collectible",
      goal: "Convert cities, races, club runs, and rituals into collectible digital stamps.",
      tasks: [
        { title: "Check city location", meta: "Completed in 2.3s", status: "completed" },
        { title: "Verify club attendance", meta: "Completed in 5.1s", status: "completed" },
        { title: "Mint stamp sticker", meta: "In progress... 12s", status: "progress" },
        { title: "Share passport card", meta: "Pending", status: "pending" },
      ],
    },
  },
  {
    icon: Sparkles,
    label: "Runner Identity",
    title: "Runner Identity",
    description: "Translate running behavior into archetype, aura stats, and social signal.",
    video: "https://res.cloudinary.com/dy4bqxt8p/video/upload/v1779622271/02_u2efg7.mp4",
    card: {
      heading: "Runner Identity",
      badge: "Generated",
      goal: "Translate behavior into identity: archetype, aura stats, rhythm, and club signal.",
      tasks: [
        { title: "Read run rhythm", meta: "Completed in 1.9s", status: "completed" },
        { title: "Classify archetype", meta: "Completed in 6.7s", status: "completed" },
        { title: "Generate aura stats", meta: "In progress... 16s", status: "progress" },
        { title: "Export story card", meta: "Pending", status: "pending" },
      ],
    },
  },
];

export default function ClippedVideoTab() {
  const [activeTab, setActiveTab] = useState(0);
  const activeItem = items[activeTab];

  return (
    <section className="overflow-hidden bg-[#f5f5f3] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 grid items-start gap-14 md:grid-cols-2">
          <h2 className="max-w-2xl text-[46px] font-bold leading-[50px] tracking-tight text-[#131313]">
            Run systems that feel like a drop.
          </h2>
          <p className="max-w-lg text-[18px] leading-[32px] text-[#666]">
            A cinematic control room for 7K club runs, race archives, city stamps, and runner identity.
          </p>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="absolute bottom-16 left-2 z-20">
          <div className="w-[240px] rounded-[28px] border border-[#e8e8e8] bg-white p-3 shadow-xl">
            <div className="flex flex-col gap-2">
              {items.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(index)}
                    className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-300 ${
                      activeTab === index
                        ? "border-[#266347] bg-[#f4fbf7]"
                        : "border-transparent hover:border-[#266347] hover:bg-[#f8fffb]"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${activeTab === index ? "text-[#266347]" : "text-[#131313] group-hover:text-[#266347]"}`} />
                    <span className={`text-[15px] font-medium ${activeTab === index ? "text-[#266347]" : "text-[#131313] group-hover:text-[#266347]"}`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="relative h-[690px] overflow-hidden rounded-[34px]"
          style={{ clipPath: "polygon(0 0, 92% 0, 100% 12%, 100% 100%, 30% 100%, 22% 88%, 0 88%)" }}
        >
          <AnimatePresence mode="wait">
            <motion.video
              key={activeItem.video}
              src={activeItem.video}
              autoPlay
              muted
              loop
              playsInline
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.card.heading}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.35 }}
                className="w-[320px] rounded-[26px] border border-white/30 bg-white/80 p-5 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[18px] font-semibold text-[#131313]">{activeItem.card.heading}</h3>
                  <span className="rounded-md bg-[#eef8f2] px-2 py-1 text-[11px] text-[#266347]">{activeItem.card.badge}</span>
                </div>
                <div className="mt-4 rounded-xl border border-[#e7e7e7] p-3">
                  <p className="text-[11px] text-[#777]">Goal</p>
                  <p className="mt-1 text-[13px] leading-[20px] text-[#131313]">{activeItem.card.goal}</p>
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  {activeItem.card.tasks.map((task) => (
                    <div key={task.title} className="flex items-start gap-2">
                      <div className="mt-[2px]">
                        {task.status === "completed" && <CheckCircle2 className="h-4 w-4 text-[#266347]" />}
                        {task.status === "progress" && <LoaderCircle className="h-4 w-4 text-[#266347]" />}
                        {task.status === "pending" && <Circle className="h-4 w-4 text-[#bdbdbd]" />}
                      </div>
                      <div>
                        <p className={`text-[13px] ${task.status === "completed" ? "text-[#666] line-through" : task.status === "progress" ? "font-medium text-[#266347]" : "text-[#999]"}`}>
                          {task.title}
                        </p>
                        <p className="text-[11px] text-[#999]">{task.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
