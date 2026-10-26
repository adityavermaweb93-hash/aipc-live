export interface ScheduleEvent {
  title: string;
  session?: string;
  type: 'general' | 'session' | 'break';
}

export interface AccommodationOption {
  id: string;
  title: string;
  occupancy: string;
  guestCount: number;
  price: string;
  featured?: boolean;
  badge?: string;
  features: string[];
  registerUrl: string;
}

export interface BookItem {
  img: string;
}

export interface GallerySlide {
  items: {
    src: string;
    alt: string;
    className: string;
  }[];
}

export interface FaqItem {
  question: string;
  answerHtml: string;
}

export const conferenceData = {
  meta: {
    year: "2026",
    dates: "Sep 29 – Oct 1, 2026",
    targetDate: "September 29, 2026 14:00:00",
    venueShort: "GCC Hotel, Mumbai",
    forText: "Men who love the Church",
    englishDisclaimer: "*THE ALL INDIA PASTORS’ CONFERENCE IS AN ENGLISH CONFERENCE, \nSO PLEASE PLAN TO REGISTER AND ATTEND ONLY IF YOU ARE WELL-VERSED IN ENGLISH.",
  },
  header: {
    logo: "/assets/AIPC-White-1.png",
    navLinks: [
      { label: "ABOUT", href: "#about" },
      { label: "THEME", href: "#theme" },
      { label: "PRICING", href: "#pricing" },
      { label: "CONTACT", href: "/contact-us" },
    ],
    donationBtn: {
      label: "Donation",
      href: "/Donation",
    },
    floatingMenu: [
      { label: "About", href: "#about" },
      { label: "Theme", href: "#theme" },
      { label: "Programme Schedule", href: "#schedule" },
      { label: "Accommodation", href: "#pricing" },
      { label: "Free Books", href: "#book" },
      { label: "Gallery", href: "#gallery" },
      { label: "Venue", href: "#venue" },
      { label: "FAQ", href: "#faq" },
      { label: "Organisers", href: "/partners", mobileOnly: true },
      { label: "Contact", href: "/contact-us", mobileOnly: true },
    ]
  },
  hero: {
    preTitle: "Organised By Equip Indian Churches",
    mainHeading1: "AIPC",
    mainHeading2: "2026",
    subtitlePre: "“Living as ",
    subtitleHighlight: "Exiles",
    subtitlePost: "”",
    description: "Expositions in 1 Peter",
    tagline: "A Conference for Indian Churches by Indians.",
    registerBtnText: "Register Now",
    registerBtnUrl: "/registration-2026",
    learnMoreBtnText: "Learn More",
    learnMoreBtnUrl: "#theme",
    bgImage: "/assets/DSCF0834-scaled.jpg",
  },
  about: {
    preTitle: "A Conference for Indian Churches by Indians",
    mainHeadingPre: "Where Men are ",
    mainHeadingSpan: "Equipped",
    mainHeadingPost: " & Renewed",
    p1: "AIPC is a gathering of men who love the church from across India — a space to be grounded in God's Word, renewed in spirit, and connected with fellow labourers.",
    p2: "Organised By Equip Indian Churches, this conference brings hundreds of men under one roof for teaching, fellowship, and prayer.",
    secureBtnText: "Secure Your Seat",
    secureBtnUrl: "/registration-2026",
    stats: [
      { number: "600+", label: "Men" },
      { number: "25+", label: "States" },
      { number: "3", label: "Days" }
    ],
    slides: [
      "/assets/DSCF0777-scaled.jpg",
      "/assets/DSCF0678-scaled.jpg",
      "/assets/DSCF1193-scaled.jpg",
      "/assets/DSCF0657-scaled.jpg"
    ]
  },
  theme: {
    preTitle: "Conference Theme 2026",
    mainHeadingPre: "“Living as ",
    mainHeadingSpan: "Exiles",
    mainHeadingPost: "”",
    subtitle: "Expositions in 1 Peter",
    quoteText: "“The grass withers,\n    and the flower falls,\nbut the word of the Lord remains forever.\nAnd this word is the good news that was preached to you.”",
    quoteRef: "1 Peter 1:24-25",
    p1: "This year's conference draws from Peter's letter to the elect exiles of the Dispersion — reframed as messages to the churches and leaders of the Church in India today.",
    p2: "Together, we will sit under the Word, wrestle with its demands, and be prepared — as Exiles living for Christ in this world.",
    tags: [
      "Biblical Exposition",
      "Exiles",
      "Shepherding",
      "Suffering",
      "Hope",
      "Holiness"
    ]
  },
  speakers: {
    preHeading: "Speakers",
    mainHeadingItalic: "Faithful Pastors",
    mainHeadingRest: " From Local Churches",
    footnote: "*Similar to previous editions of the conference, we do not want to attract participants towards specific preachers. Rather, we invite participants who want to be challenged by God's Word, confident that the preachers are biblically qualified pastors who will handle God's precious word with care."
  },
  schedule: {
    subTitle: "SCHEDULE",
    titlePre: "Three Days of The \n",
    titleItalic: "Word & Fellowship",
    days: {
      day1: {
        date: "Sep 29",
        dayLabel: "DAY 01",
        label: "Day 1",
        events: [
          { title: "Arrival & Check-in", type: "general" },
          { title: "Welcome/Introduction", type: "general" },
          { session: "Session 01", title: "Living as Exiles with a Living Hope", type: "session" },
          { title: "Tea Break", type: "break" },
          { title: "Panel Discussion", type: "general" },
          { session: "Session 02", title: "Pursuing Holiness in an Unholy World", type: "session" },
          { title: "Dinner", type: "break" }
        ] as ScheduleEvent[]
      },
      day2: {
        date: "Sep 30",
        dayLabel: "DAY 02",
        label: "Day 2",
        events: [
          { session: "Session 03", title: "Living as God's Chosen People", type: "session" },
          { session: "Session 04", title: "Following Christ Through Suffering", type: "session" },
          { title: "Tea Break", type: "break" },
          { title: "Breakout Session", type: "general" },
          { title: "Lunch", type: "break" },
          { session: "Session 05", title: "Living for the Will of God", type: "session" },
          { title: "Panel Discussion", type: "general" },
          { session: "Session 06", title: "Rejoicing in the Midst of Trials", type: "session" },
          { title: "Dinner", type: "break" }
        ] as ScheduleEvent[]
      },
      day3: {
        date: "Oct 01",
        dayLabel: "DAY 03",
        label: "Day 3",
        events: [
          { session: "Session 07", title: "Clothed with Humility", type: "session" },
          { title: "Tea Break", type: "break" },
          { title: "Panel Discussion", type: "general" },
          { title: "Closing Lunch", type: "break" },
          { title: "Departure", type: "general" }
        ] as ScheduleEvent[]
      }
    }
  },
  pricing: {
    subTitle: "Registration Fees",
    mainHeadingPre: "Choose Your ",
    mainHeadingSpan: "Accommodation",
    earlyBirdNote: "FIRST-COME-FIRST-SERVED BASIS!",
    cards: [
      {
        id: "quadruple",
        title: "Quadruple Sharing",
        occupancy: "Max 4 Guests",
        guestCount: 4,
        price: "3,999",
        badge: "Early Bird",
        features: [
          "2 nights accommodation",
          "Conference sessions",
          "All meals included",
          "Free books"
        ],
        registerUrl: "/registration-2026"
      },
      {
        id: "triple",
        title: "Triple Sharing",
        occupancy: "Max 3 Guests",
        guestCount: 3,
        price: "5,999",
        featured: true,
        badge: "Early Bird",
        features: [
          "2 nights accommodation",
          "Conference sessions",
          "All meals included",
          "Free books"
        ],
        registerUrl: "/registration-2026"
      },
      {
        id: "double",
        title: "Double Sharing",
        occupancy: "Max 2 Guests",
        guestCount: 2,
        price: "9,999",
        badge: "Early Bird",
        features: [
          "2 nights accommodation",
          "Conference sessions",
          "All meals included",
          "Free books"
        ],
        registerUrl: "/registration-2026"
      }
    ] as AccommodationOption[],
    registrationNote: "Registration is open only to Indian participants. \n*PLEASE REGISTER ONLY IF YOU ARE COMFORTABLE TO COMMUNICATE IN ENGLISH\nPLEASE NOTE THAT THE INEXPENSIVE QUADRUPLE SHARING SEATS WILL BE FILLED UP FIRST AND ARE AVAILABLE ON A FIRST-COME-FIRST-SERVED BASIS!"
  },
  books: {
    complimentaryLabel: "COMPLIMENTARY",
    titlePre: "Free ",
    titleItalic: "Books",
    years: ["2026", "2024", "2023", "2022", "2021", "2020", "2019"],
    booksData: {
      "2026": [
        { img: "/assets/Union-with-christ.jpg" },
        { img: "/assets/The-compelling-Community.jpg" },
        { img: "/assets/More-than-words.jpg" },
        { img: "/assets/Love.jpg" },
        { img: "/assets/esv.jpeg" },
        { img: "/assets/image.jpg" },
        { img: "/assets/nicene-creed.jpeg" }
      ],
      "2024": [
        { img: "/assets/aipc-revelation-for-you.jpg" },
        { img: "/assets/Revelation-The-Final-Word.jpg" },
        { img: "/assets/The-First-and-the-Last.jpg" },
        { img: "/assets/Dont-waste-your-life.jpg" },
        { img: "/assets/Book_Word-Centered-Church_page-0001-1.jpg" },
        { img: "/assets/ESV-Concise-Study-Bible.jpg" },
        { img: "/assets/Book_Your-Old-Testament-Sermon-Needs-to-Get-Saved-1_page-0001-1.jpg" },
        { img: "/assets/Book_No-Quick-Fix_page-0001-1.jpg" },
        { img: "/assets/Brothers-We-Are-Not-Professionals-1.jpg" },
        { img: "/assets/Book_The-heroic-boldness-of-martin-luther_page-0001-1.jpg" },
        { img: "/assets/Book_The-Christmas-Book-Story.jpg" }
      ],
      "2023": [
        { img: "/assets/EXP03BH_3d_x650_y255_2400x.png" },
        { img: "/assets/gcp_original.fa088f17c0a013284c4ef8c7c2cfc8ba.jpg" },
        { img: "/assets/manifesto_hb_original.77c6c4611886f91322aca9068d3c798e.jpg" },
        { img: "/assets/THE-TRINITY.png" },
        { img: "/assets/PREACHING-1.png" },
        { img: "/assets/THE-PERSON-OF-CHRIST-1.png" },
        { img: "/assets/NKJV-Reformation-Study-Bible.jpg" }
      ],
      "2022": [
        { img: "/assets/The-Missionary-Fellowship-of-William-Carey.jpg" },
        { img: "/assets/The-Gospel-2-EIC.png" },
        { img: "/assets/Church-Leadership.jpg" },
        { img: "/assets/What-Is-the-Mission-of-the-Church.jpg" },
        { img: "/assets/The-Supremacy-of-God.jpg" },
        { img: "/assets/Let-The-Nations-Be-Glad.jpg" }
      ],
      "2021": [
        { img: "/assets/1-thess.jpg" },
        { img: "/assets/suffering.jpg" },
        { img: "/assets/call.jpg" },
        { img: "/assets/suffering_tripp.jpg" },
        { img: "/assets/readthis_original.7fd0575260711c682777fdc5ab8b9d44.jpg" },
        { img: "/assets/surprised.jpg" },
        { img: "/assets/gentle.jpg" }
      ],
      "2020": [
        { img: "/assets/Where-is-God-in-a-Coronavirus-World.jpg" },
        { img: "/assets/Training-Isaac-Adams.jpg" },
        { img: "/assets/Conscience.jpg" },
        { img: "/assets/habits-of-grace.jpg" },
        { img: "/assets/Caring-For-One-Another-1.jpg" },
        { img: "/assets/Character-Matters.jpg" }
      ],
      "2019": [
        { img: "/assets/Conversion_large.jpg" },
        { img: "/assets/The_Gospel_large.jpg" },
        { img: "/assets/Sound_Doctrine_large.jpg" }
      ]
    } as Record<string, BookItem[]>
  },
  organisers: {
    label: "ORGANISED BY",
    titlePre: "Conference ",
    titleEm: "Organiser",
    organiser: {
      name: "Equip Indian Churches",
      logo: "/assets/EIC_Favicon.png",
      description: "Equip Indian Churches is a ministry where several pastors have partnered together with a desire to help provide direction and momentum to Biblical gospel growth.",
      url: "https://equipindianchurches.com",
      urlDisplay: "equipindianchurches.com"
    },
    partnersLabel: "PARTNERSHIPS",
    partnersTitlePre: "Our ",
    partnersTitleEm: "Partners",
    partnersDescription: "We are grateful to partner with ministries that share our desire to serve the church and see the Gospel faithfully proclaimed.",
    partnersList: [
      {
        name: "For The Truth",
        logo: "/assets/cropped-for-social-media-icon-1.png",
        url: "https://forthetruth.in",
        urlDisplay: "forthetruth.in",
        description: "A publishing ministry that exists to print, publish and distribute resources for the church."
      },
      {
        name: "Truth:78",
        logo: "/assets/Transparent_Truth78_Logo.avif",
        url: "https://truth78.org",
        urlDisplay: "truth78.org",
        description: "A ministry focused on helping the next generation know, honor, and treasure God, setting their hope in Christ alone."
      }
    ],
    knowMoreUrl: "/partners"
  },
  gallery: {
    subtitle: "HIGHLIGHTS",
    titlePre: "Glimpses of ",
    titleSpan: "AIPC",
    slides: [
      {
        items: [
          { src: "/assets/Screenshot-2026-05-01-at-7.31.21-AM-scaled.png", alt: "AIPC 1", className: "item-1" },
          { src: "/assets/VAL00001-scaled-2.jpg", alt: "AIPC 2", className: "item-2" },
          { src: "/assets/Main-Session_Harshit-scaled-2.jpg", alt: "AIPC 3", className: "item-3" },
          { src: "/assets/FTT_Mumabi.jpg", alt: "AIPC 4", className: "item-4" },
          { src: "/assets/VAL00115-scaled.jpg", alt: "AIPC 5", className: "item-5" },
          { src: "/assets/Singing-scaled.jpg", alt: "AIPC 6", className: "item-6" }
        ]
      },
      {
        items: [
          { src: "/assets/aipc-breakout1-4-scaled.jpg", alt: "AIPC 7", className: "item-1" },
          { src: "/assets/DSC_0023-scaled.jpg", alt: "AIPC 8", className: "item-2" },
          { src: "/assets/IMG-20240925-WA0044.jpg", alt: "AIPC 9", className: "item-3" },
          { src: "/assets/IMG_5150-scaled.jpg", alt: "AIPC 10", className: "item-4" },
          { src: "/assets/IMG_5199-scaled.jpg", alt: "AIPC 11", className: "item-5" },
          { src: "/assets/IMG-20240925-WA0145.jpg", alt: "AIPC 12", className: "item-6" }
        ]
      },
      {
        items: [
          { src: "/assets/FTT_Mumabi.jpg", alt: "AIPC 13", className: "item-1" },
          { src: "/assets/VAL00074-1-scaled.jpg", alt: "AIPC 14", className: "item-2" },
          { src: "/assets/DSC_4159-scaled-1.jpg", alt: "AIPC 15", className: "item-3" },
          { src: "/assets/VAL00115-scaled.jpg", alt: "AIPC 16", className: "item-4" },
          { src: "/assets/Singing_Ben-scaled.jpg", alt: "AIPC 17", className: "item-5" },
          { src: "/assets/DSC_0022-1-scaled.jpg", alt: "AIPC 18", className: "item-6" }
        ]
      }
    ] as GallerySlide[]
  },
  venue: {
    subTitle: "Location",
    titlePre: "Conference ",
    titleSpan: "Venue",
    mainCard: {
      name: "GCC Hotel & Club",
      address: "Mira Road (East), Mumbai - 401107, Maharashtra",
      image: "/assets/unnamed.webp"
    },
    mapCard: {
      title: "GCC Hotel & Club",
      subtitle: "Mira Road (East), Mumbai",
      mapUrl: "https://maps.app.goo.gl/59srRmRwi4KEZCAcA",
      linkText: "Open in Google Maps"
    },
    helpCard: {
      title: "Need Help Getting There?",
      description: "Register first, and we will keep you updated for further information.",
      btnText: "Register & Get Updates",
      btnUrl: "/registration-2026"
    },
    transport: [
      {
        mode: "By Train",
        desc: "The closest railway station to the venue is MIRA ROAD.",
        url: "/travel-instruction"
      },
      {
        mode: "By Air",
        desc: "The best way to reach the venue from either airport is to take a cab (Uber or Ola).",
        url: "/travel-instruction"
      },
      {
        mode: "By Cab",
        desc: "Uber & Ola available from stations and airport to GCC Hotel.",
        url: "/travel-instruction"
      }
    ]
  },
  faq: {
    subTitle: "FAQ'S",
    titlePre: "Common ",
    titleSpan: "Questions",
    column1: [
      {
        question: "Who can register for this conference?",
        answerHtml: "Registration is open only to Indian christians. Participants from other countries are not eligible to register for this conference."
      },
      {
        question: "Why should anyone attend this conference?",
        answerHtml: "The All India Pastors’ Conference is a great opportunity for pastors and men aspiring to ministry to enjoy singing together, sit under faithful preaching by Indian pastors, fellowship with brothers from churches across the country, receive helpful resources for ministry, and encourage one another."
      },
      {
        question: "What is unique about this conference?",
        answerHtml: "The All India Pastors’ Conference is a collaborative indigenous initiative, led by Indian pastors of evangelical churches from different parts of India who belong to the Reformed tradition."
      },
      {
        question: "How many times has this conference been held before?",
        answerHtml: "So far, the conference has happened 7 times (Once in Lucknow, twice in Hyderabad, twice online, and twice in Mumbai). This year’s conference will be the 8th All India Pastors’ Conference."
      },
      {
        question: "When will AIPC 2026 take place?",
        answerHtml: "The dates for this year’s conference are 29 September to 01 October , 2026. Check-in starts at 12:00 noon on the 29th. The conference will end after lunch on the 01 October (3:00 pm)."
      }
    ],
    column2: [
      {
        question: "Where will AIPC 2026 take place?",
        answerHtml: "AIPC 2026 will take place in GCC Hotel and Club, Mira Road, Mumbai, Maharashtra."
      },
      {
        question: "How can I reach GCC Hotel and Club?",
        answerHtml: '<p>Please click this link to get the exact location and directions:</p><p style="margin-top: 10px;"><strong>Directions</strong> | <a href="https://maps.google.com/maps/dir//GCC+Hotel+and+Club+Off+Mira+Bhayandar+Road+92%2F1,+GCC+Club+Rd,+Mira+Road+Mira+Bhayandar,+Maharashtra+401107,+India/@19.282918,72.8783137,14z/data=!4m5!4m4!1m0!1m2!1m1!1s0x3be7b95b222fffff:0x3c2e08264d2ad1f8" target="_blank" rel="noopener noreferrer">GCC Hotel and Club</a></p>'
      },
      {
        question: "How important is it for participants to be versed in English?",
        answerHtml: "All the sessions and panel discussions and resources will be in English, and so this conference is only for men who can communicate in English."
      },
      {
        question: "What are the options for accommodation?",
        answerHtml: '<p>There are 3 options for accommodation.</p><p>In <a href="#pricing">“Quadruple Sharing”</a>, each room will be shared by 4 participants.</p><p>In <a href="#pricing">“Triple Sharing”</a>, each room will be shared by 3 participants.</p><p>In <a href="#pricing">“Double Sharing”</a>, each room will be shared by 2 participants.</p>'
      },
      {
        question: "How early can participants check-in on the Sept 29th?",
        answerHtml: "The check-in time starts at 12:00 noon on the Sept 29th."
      }
    ],
    moreFaqsUrl: "/faqs"
  },
  contact: {
    badge: "Get in touch",
    titlePre: "Contact ",
    titleSpan: "Us",
    formAction: "https://formspree.io/f/info@aipc.live",
    email: "info@aipc.live",
    phone: "+91 98867 69948, +91 89700 65890",
    venueAddress: "GCC Hotel & Club, Mira Road (East),\nMumbai – 401107",
    whatsappUrl: "https://wa.me/919886769948?text=Hi%2C%20I%20want%20to%20know%20more%20about%20the%20AIPC%20and%20registration",
  },
  footer: {
    bgImage: "/assets/red-grunge.svg",
    links: [
      { label: "FAQ’s", href: "/faqs" },
      { label: "Contact", href: "/contact-us" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms and Conditions", href: "/t-c" },
      { label: "Cancellations & Refunds", href: "/cancellations-refunds" },
    ]
  }
};
