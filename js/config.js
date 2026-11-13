/**
 * AXION COACHING — Central Website Configuration
 * ---------------------------------------------------------------------------
 * Update brand name, tagline, logo paths, colours, contact details,
 * founders, coaches, transformations, and testimonials in this
 * single file. All HTML pages read from window.SITE_CONFIG automatically.
 */

window.SITE_CONFIG = {
  brandName: "AXION COACHING",
  brandShort: "AXION",
  tagline: "BUILT BY DISCIPLINE. DRIVEN BY PROGRESS.",
  supportingStatement: "YOUR GOALS. YOUR LOCATION. OUR COACHING.",
  coreMessage: "WE BRING PROFESSIONAL FITNESS COACHING TO YOU.",

  logo: {
    darkBgPath: "assets/logo/axion-mark-light.svg",
    lightBgPath: "assets/logo/axion-mark.svg",
  },

  colors: {
    midnight: "#111820",
    charcoal: "#1b2430",
    white: "#ffffff",
    accentRed: "#d43a3a",
    steel: "#929ba5",
    lightGrey: "#f3f4f5",
  },

  contact: {
    phoneDisplay: "[Phone Number — Update in js/config.js]",
    whatsappDisplay: "[WhatsApp Number — Update in js/config.js]",
    /**
     * Enter international digits only without '+' or spaces when live
     * (example: "9198XXXXXXXX"). While blank, WhatsApp buttons open the
     * pre-filled WhatsApp message composer cleanly.
     */
    whatsappDigits: "",
    emailDisplay: "[Email Address — Update in js/config.js]",
    serviceCities: "[Service Cities & Coverage Zones — Pending Launch Announcement]",
    locationPolicy:
      "Mobile personal coaching model: trainers meet clients at agreed homes, residential gyms, outdoor spaces, or coach remotely online. No walk-in commercial studio address is maintained.",
    /**
     * Social Media Profile URLs (Central Configuration)
     * Replace the temporary placeholder URLs below with official profiles when live.
     */
    socialLinks: [
      {
        id: "instagram",
        label: "Instagram",
        handle: "@[instagram-placeholder]",
        url: "https://www.instagram.com/axioncoaching_placeholder/",
      },
      {
        id: "facebook",
        label: "Facebook",
        handle: "[Facebook Page Placeholder]",
        url: "https://www.facebook.com/axioncoaching.placeholder",
      },
      {
        id: "youtube",
        label: "YouTube",
        handle: "[YouTube Channel Placeholder]",
        url: "https://www.youtube.com/@axioncoaching-placeholder",
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        handle: "[LinkedIn Page Placeholder]",
        url: "https://www.linkedin.com/company/axion-coaching-placeholder/",
      },
    ],
  },

  founders: [
    {
      label: "Co-Founder 01",
      ownership: "Equal Co-Founder (50% Ownership)",
      name: "[Founder 01 Name — Editable Placeholder]",
      role: "Co-Founder & Coaching Operations [Placeholder]",
      qualifications: "[Verified certifications & coaching credentials to be added]",
      bio: "Reserved for verified founder biography, coaching background, and leadership focus.",
    },
    {
      label: "Co-Founder 02",
      ownership: "Equal Co-Founder (50% Ownership)",
      name: "[Founder 02 Name — Editable Placeholder]",
      role: "Co-Founder & Client Experience [Placeholder]",
      qualifications: "[Verified certifications & coaching credentials to be added]",
      bio: "Reserved for verified founder biography, training philosophy, and operational focus.",
    },
  ],

  coaches: [
    {
      id: "coach-01",
      photo: "assets/images/coach-01.jpeg",
      photoAlt: "AXION COACHING Coach 01 portrait",
      photoPosition: "50% 14%",
      name: "[Coach Profile 01 — Editable Sample]",
      role: "Home Personal Training & Strength Specialist [Placeholder]",
      bio: "Reserved for verified coach biography, coaching background, and training philosophy [Placeholder].",
      qualifications: "[Verified Coaching Certification(s) — Pending Upload]",
      experience: "[X+ Years Experience — Pending]",
      specialisations: ["Home Personal Training", "Strength & Conditioning", "Fat Loss"],
      languages: "English · Hindi · [Regional Language]",
      areasServed: "[Target City / PIN Codes — Pending Confirmation]",
      availability: "Morning & Evening Slots (Placeholder)",
      modes: ["Home", "Outdoor", "Partner"],
    },
    {
      id: "coach-02",
      photo: "assets/images/coach-02.jpeg",
      photoAlt: "AXION COACHING Coach 02 physique and conditioning profile",
      photoPosition: "50% 8%",
      name: "[Coach Profile 02 — Editable Sample]",
      role: "Outdoor Conditioning, Partner & Online Coach [Placeholder]",
      bio: "Reserved for verified coach biography, coaching background, and conditioning focus [Placeholder].",
      qualifications: "[Verified Coaching Certification(s) — Pending Upload]",
      experience: "[X+ Years Experience — Pending]",
      specialisations: ["Outdoor Conditioning", "Strength & Conditioning", "Online Coaching"],
      languages: "English · Hindi · [Regional Language]",
      areasServed: "[Target City / PIN Codes] & Remote Online",
      availability: "Morning, Evening & Weekend Slots (Placeholder)",
      modes: ["Outdoor", "Home", "Online", "Partner"],
    },
  ],

  transformations: [
    {
      clientLabel: "Client Story 01 [Placeholder]",
      goal: "Weight Loss & Conditioning",
      format: "Home Personal Training",
      timeframe: "[Timeframe Pending Verification]",
      story:
        "Slot reserved for a verified client progress summary describing starting routine, consistency milestones, and sustainable training habits.",
      quote:
        '"[Verified client quote to be added once genuine client consent and imagery are uploaded.]"',
    },
    {
      clientLabel: "Client Story 02 [Placeholder]",
      goal: "Strength & Muscle Gain",
      format: "Home / Residential Gym",
      timeframe: "[Timeframe Pending Verification]",
      story:
        "Slot reserved for a verified strength progression story documenting technique quality, progressive overload, and weekly adherence.",
      quote:
        '"[Verified client quote to be added once genuine client consent and imagery are uploaded.]"',
    },
    {
      clientLabel: "Client Story 03 [Placeholder]",
      goal: "Partner Fitness & Consistency",
      format: "Partner & Online Hybrid",
      timeframe: "[Timeframe Pending Verification]",
      story:
        "Slot reserved for a verified partner training case study highlighting shared accountability around busy professional schedules.",
      quote:
        '"[Verified client quote to be added once genuine client consent and imagery are uploaded.]"',
    },
  ],

  testimonials: [
    {
      quote:
        '"Client feedback slot reserved for genuine verified reviews. No testimonials are fabricated prior to real client onboarding."',
      author: "[Verified Client Name — Placeholder 01]",
      context: "Home Personal Training · [City Pending]",
    },
    {
      quote:
        '"Client feedback slot reserved for genuine verified reviews covering remote programming, check-ins, and coach responsiveness."',
      author: "[Verified Client Name — Placeholder 02]",
      context: "Online Fitness Coaching · [Location Pending]",
    },
    {
      quote:
        '"Client feedback slot reserved for genuine verified partner coaching reviews once client stories are collected."',
      author: "[Verified Client Name — Placeholder 03]",
      context: "Partner Training · [City Pending]",
    },
  ],
};
