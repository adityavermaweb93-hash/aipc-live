import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export interface EditionSummary {
  id: string;
  year: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isActivePublic: boolean;
  themeTitle: string;
  themeSubtitle?: string | null;
  venueCity: string;
  datesDisplay: string;
  registrationCount: number;
  packageCount: number;
  sessionCount: number;
  updatedAt: Date;
}

/**
 * List all conference editions ordered by year descending
 */
export async function listEditions(): Promise<EditionSummary[]> {
  const editions = await prisma.conferenceEdition.findMany({
    orderBy: { year: 'desc' },
    include: {
      _count: {
        select: {
          registrations: true,
          packages: true,
        },
      },
      scheduleDays: {
        include: {
          _count: {
            select: { sessions: true },
          },
        },
      },
    },
  });

  return editions.map((ed) => {
    const totalSessions = ed.scheduleDays.reduce(
      (acc, day) => acc + day._count.sessions,
      0
    );

    return {
      id: ed.id,
      year: ed.year,
      title: ed.title,
      slug: ed.slug,
      status: ed.status,
      isActivePublic: ed.isActivePublic,
      themeTitle: ed.themeTitle,
      themeSubtitle: ed.themeSubtitle,
      venueCity: ed.venueCity,
      datesDisplay: ed.datesDisplay,
      registrationCount: ed._count.registrations,
      packageCount: ed._count.packages,
      sessionCount: totalSessions,
      updatedAt: ed.updatedAt,
    };
  });
}

/**
 * Get active public edition or fallback to most recent published
 */
export async function getActiveEdition() {
  let active = await prisma.conferenceEdition.findFirst({
    where: { isActivePublic: true },
    include: {
      sections: { orderBy: { sortOrder: 'asc' } },
      packages: { where: { isEnabled: true }, orderBy: { sortOrder: 'asc' } },
      partners: { orderBy: { sortOrder: 'asc' } },
      faqs: { where: { isEnabled: true }, orderBy: { sortOrder: 'asc' } },
      albums: {
        orderBy: { sortOrder: 'asc' },
        include: { photos: { orderBy: { sortOrder: 'asc' } } },
      },
      scheduleDays: {
        orderBy: { dayNumber: 'asc' },
        include: {
          sessions: {
            where: { isEnabled: true },
            orderBy: { sortOrder: 'asc' },
            include: { speakerAssignment: { include: { speaker: true } } },
          },
        },
      },
      speakers: {
        orderBy: { sortOrder: 'asc' },
        include: { speaker: true },
      },
    },
  });

  if (!active) {
    active = await prisma.conferenceEdition.findFirst({
      where: { status: 'PUBLISHED' },
      orderBy: { year: 'desc' },
      include: {
        sections: { orderBy: { sortOrder: 'asc' } },
        packages: { where: { isEnabled: true }, orderBy: { sortOrder: 'asc' } },
        partners: { orderBy: { sortOrder: 'asc' } },
        faqs: { where: { isEnabled: true }, orderBy: { sortOrder: 'asc' } },
        albums: {
          orderBy: { sortOrder: 'asc' },
          include: { photos: { orderBy: { sortOrder: 'asc' } } },
        },
        scheduleDays: {
          orderBy: { dayNumber: 'asc' },
          include: {
            sessions: {
              where: { isEnabled: true },
              orderBy: { sortOrder: 'asc' },
              include: { speakerAssignment: { include: { speaker: true } } },
            },
          },
        },
        speakers: {
          orderBy: { sortOrder: 'asc' },
          include: { speaker: true },
        },
      },
    });
  }

  return active;
}

/**
 * Get a specific edition by year or slug
 */
export async function getEditionByYearOrSlug(yearOrSlug: string) {
  return await prisma.conferenceEdition.findFirst({
    where: {
      OR: [{ year: yearOrSlug }, { slug: yearOrSlug }, { id: yearOrSlug }],
    },
    include: {
      sections: { orderBy: { sortOrder: 'asc' } },
      packages: { orderBy: { sortOrder: 'asc' } },
      partners: { orderBy: { sortOrder: 'asc' } },
      faqs: { orderBy: { sortOrder: 'asc' } },
      albums: {
        orderBy: { sortOrder: 'asc' },
        include: { photos: { orderBy: { sortOrder: 'asc' } } },
      },
      scheduleDays: {
        orderBy: { dayNumber: 'asc' },
        include: {
          sessions: {
            orderBy: { sortOrder: 'asc' },
            include: { speakerAssignment: { include: { speaker: true } } },
          },
        },
      },
      speakers: {
        orderBy: { sortOrder: 'asc' },
        include: { speaker: true },
      },
    },
  });
}

/**
 * Set an edition as the active published edition on the website
 */
export async function setActiveEdition(editionId: string) {
  return await prisma.$transaction([
    prisma.conferenceEdition.updateMany({
      where: { isActivePublic: true },
      data: { isActivePublic: false },
    }),
    prisma.conferenceEdition.update({
      where: { id: editionId },
      data: { isActivePublic: true, status: 'PUBLISHED' },
    }),
  ]);
}

/**
 * Duplicate an existing edition's reusable setup without copying registrations or queries
 */
export async function duplicateEdition(
  sourceEditionId: string,
  newYear: string,
  newTitle: string,
  newCity: string,
  newVenueName: string
) {
  const source = await prisma.conferenceEdition.findUnique({
    where: { id: sourceEditionId },
    include: {
      sections: true,
      packages: true,
      partners: true,
      faqs: true,
      albums: {
        include: { photos: true },
      },
      scheduleDays: {
        include: { sessions: true },
      },
    },
  });

  if (!source) {
    throw new Error(`Source edition not found with ID ${sourceEditionId}`);
  }

  // Check if year already exists
  const existing = await prisma.conferenceEdition.findUnique({
    where: { year: newYear },
  });
  if (existing) {
    throw new Error(`Edition for year ${newYear} already exists.`);
  }

  // Create new draft edition
  const newEdition = await prisma.conferenceEdition.create({
    data: {
      year: newYear,
      title: newTitle || `AIPC ${newYear}`,
      slug: newYear,
      status: 'DRAFT',
      isActivePublic: false,
      themeTitle: source.themeTitle,
      themeSubtitle: source.themeSubtitle,
      themeScripture: source.themeScripture,
      themeReference: source.themeReference,
      themeSummary: source.themeSummary,
      themeTags: source.themeTags,
      startDate: new Date(`${newYear}-10-01T12:00:00Z`),
      endDate: new Date(`${newYear}-10-03T15:00:00Z`),
      datesDisplay: `Dates to be announced, ${newYear}`,
      venueName: newVenueName || source.venueName,
      venueCity: newCity || source.venueCity,
      venueState: source.venueState,
      venueAddress: source.venueAddress,
      venueMapUrl: source.venueMapUrl,
      targetCountdown: new Date(`${newYear}-10-01T14:00:00Z`),
      heroPreTitle: source.heroPreTitle,
      heroTagline: source.heroTagline,
      heroBgImageUrl: source.heroBgImageUrl,
      heroVideoUrl: source.heroVideoUrl,
      aboutPreTitle: source.aboutPreTitle,
      aboutHeading: source.aboutHeading,
      aboutP1: source.aboutP1,
      aboutP2: source.aboutP2,
      aboutStats: source.aboutStats as Prisma.InputJsonValue,
      aboutSlides: source.aboutSlides,
      seoTitle: `AIPC ${newYear} – All India Pastors’ Conference`,
      seoDescription: `All India Pastors' Conference ${newYear} in ${newCity}`,
      sections: {
        create: source.sections.map((s) => ({
          sectionKey: s.sectionKey,
          displayName: s.displayName,
          sortOrder: s.sortOrder,
          isEnabled: s.isEnabled,
          showInNav: s.showInNav,
          navLabel: s.navLabel,
          customTitle: s.customTitle,
          customSubtitle: s.customSubtitle,
          layoutVariant: s.layoutVariant,
          desktopVisible: s.desktopVisible,
          mobileVisible: s.mobileVisible,
          configJson: s.configJson ? (s.configJson as Prisma.InputJsonValue) : Prisma.JsonNull,
        })),
      },
      packages: {
        create: source.packages.map((pkg) => ({
          packageKey: pkg.packageKey,
          title: pkg.title,
          occupancy: pkg.occupancy,
          guestCount: pkg.guestCount,
          priceAmount: pkg.priceAmount,
          currency: pkg.currency,
          badgeText: pkg.badgeText,
          isFeatured: pkg.isFeatured,
          features: pkg.features,
          totalCapacity: pkg.totalCapacity,
          sortOrder: pkg.sortOrder,
          isEnabled: pkg.isEnabled,
        })),
      },
      partners: {
        create: source.partners.map((p) => ({
          name: p.name,
          logoUrl: p.logoUrl,
          description: p.description,
          websiteUrl: p.websiteUrl,
          isPrimary: p.isPrimary,
          sortOrder: p.sortOrder,
        })),
      },
      faqs: {
        create: source.faqs.map((f) => ({
          question: f.question,
          answerHtml: f.answerHtml,
          columnNumber: f.columnNumber,
          sortOrder: f.sortOrder,
          isEnabled: f.isEnabled,
        })),
      },
      albums: {
        create: source.albums.map((album) => ({
          title: album.title,
          sortOrder: album.sortOrder,
          photos: {
            create: album.photos.map((photo) => ({
              photoUrl: photo.photoUrl,
              altText: photo.altText,
              caption: photo.caption,
              gridSlot: photo.gridSlot,
              sortOrder: photo.sortOrder,
            })),
          },
        })),
      },
    },
  });

  return newEdition;
}

/**
 * Format PostgreSQL edition entity into the legacy conference JSON structure
 * for backward compatibility across all existing public components
 */
export function formatEditionToConferenceData(edition: any, baseData: any = null) {
  if (!edition) return null;
  const base = baseData || {};

  // Group FAQs by column
  const col1 = (edition.faqs || [])
    .filter((f: any) => f.columnNumber === 1 && f.isEnabled)
    .map((f: any) => ({ question: f.question, answerHtml: f.answerHtml }));

  const col2 = (edition.faqs || [])
    .filter((f: any) => f.columnNumber === 2 && f.isEnabled)
    .map((f: any) => ({ question: f.question, answerHtml: f.answerHtml }));

  // Primary organiser & partners
  const primaryPartner = (edition.partners || []).find((p: any) => p.isPrimary);
  const secondaryPartners = (edition.partners || []).filter((p: any) => !p.isPrimary);

  // Gallery slides
  const slides = (edition.albums || []).map((album: any) => ({
    items: (album.photos || []).map((photo: any) => ({
      src: photo.photoUrl,
      alt: photo.altText || 'AIPC Photo',
      className: photo.gridSlot || 'item-1',
    })),
  }));

  // Accommodation cards
  const cards = (edition.packages || []).map((pkg: any) => ({
    id: pkg.packageKey,
    title: pkg.title,
    occupancy: pkg.occupancy,
    guestCount: pkg.guestCount,
    price: Number(pkg.priceAmount).toLocaleString('en-IN'),
    badge: pkg.badgeText || undefined,
    featured: pkg.isFeatured,
    features: pkg.features || [],
    registerUrl: `/registration-${edition.year}`,
  }));

  const brandAcronym =
    base.meta?.brandAcronym ||
    base.hero?.mainHeading1 ||
    edition.title?.split(' ')[0] ||
    'AIPC';

  const brandFullName =
    base.meta?.brandFullName ||
    base.meta?.conferenceTitle ||
    "All India Pastors' Conference";

  return {
    sections: Array.isArray(edition.sections) && edition.sections.length > 0
      ? edition.sections.map((s: any) => ({
          key: s.sectionKey,
          title: s.title || s.sectionKey,
          subtitle: s.subtitle || '',
          isEnabled: s.isEnabled,
          sortOrder: s.sortOrder,
          desktopVisible: s.desktopVisible !== false,
          mobileVisible: s.mobileVisible !== false,
          layoutVariant: s.layoutVariant || 'default',
        }))
      : (base.sections || []),
    meta: {
      year: edition.year,
      brandAcronym,
      brandFullName,
      dates: edition.datesDisplay || base.meta?.dates,
      targetDate: edition.targetCountdown ? new Date(edition.targetCountdown).toISOString() : (base.meta?.targetDate || ''),
      venueShort: `${edition.venueName}, ${edition.venueCity}`,
      forText: base.meta?.forText || 'Men who love the Church',
      englishDisclaimer:
        base.meta?.englishDisclaimer ||
        '*THE ALL INDIA PASTORS’ CONFERENCE IS AN ENGLISH CONFERENCE, \nSO PLEASE PLAN TO REGISTER AND ATTEND ONLY IF YOU ARE WELL-VERSED IN ENGLISH.',
    },
    header: {
      logo: base.header?.logo || (edition as any).logoUrl || '/assets/AIPC-White-1.png',
      navLinks: base.header?.navLinks || [
        { label: 'ABOUT', href: '#about' },
        { label: 'THEME', href: '#theme' },
        { label: 'PRICING', href: '#pricing' },
        { label: 'CONTACT', href: '/contact-us' },
      ],
      donationBtn: base.header?.donationBtn || {
        label: 'Donation',
        href: '/Donation',
      },
      floatingMenu: base.header?.floatingMenu || [
        { label: 'About', href: '#about' },
        { label: 'Theme', href: '#theme' },
        { label: 'Programme Schedule', href: '#schedule' },
        { label: 'Accommodation', href: '#pricing' },
        { label: 'Free Books', href: '#book' },
        { label: 'Gallery', href: '#gallery' },
        { label: 'Venue', href: '#venue' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Organisers', href: '/partners', mobileOnly: true },
        { label: 'Contact', href: '/contact-us', mobileOnly: true },
      ],
    },
    hero: {
      preTitle: edition.heroPreTitle || base.hero?.preTitle || 'Organised By Equip Indian Churches',
      mainHeading1: brandAcronym,
      mainHeading2: edition.year,
      subtitlePre: base.hero?.subtitlePre || '“',
      subtitleHighlight: edition.themeTitle || base.hero?.subtitleHighlight || 'Living as Exiles',
      subtitlePost: base.hero?.subtitlePost || '”',
      description: edition.themeSubtitle || base.hero?.description || 'Expositions in 1 Peter',
      tagline: edition.heroTagline || base.hero?.tagline || 'A Conference for Indian Churches by Indians.',
      registerBtnText: base.hero?.registerBtnText || 'Register Now',
      registerBtnUrl: `/registration-${edition.year}`,
      learnMoreBtnText: base.hero?.learnMoreBtnText || 'Learn More',
      learnMoreBtnUrl: '#theme',
      bgImage: edition.heroBgImageUrl || base.hero?.bgImage || '/assets/DSCF0834-scaled.jpg',
    },
    about: {
      preTitle: edition.aboutPreTitle || base.about?.preTitle || 'A Conference for Indian Churches by Indians',
      mainHeadingPre: base.about?.mainHeadingPre || 'Where Men are ',
      mainHeadingSpan: base.about?.mainHeadingSpan || 'Equipped',
      mainHeadingPost: base.about?.mainHeadingPost || ' & Renewed',
      p1: edition.aboutP1 || base.about?.p1 || '',
      p2: edition.aboutP2 || base.about?.p2 || '',
      secureBtnText: base.about?.secureBtnText || 'Secure Your Seat',
      secureBtnUrl: `/registration-${edition.year}`,
      stats: edition.aboutStats || base.about?.stats || [
        { number: '600+', label: 'Men' },
        { number: '25+', label: 'States' },
        { number: '3', label: 'Days' },
      ],
      slides: edition.aboutSlides || base.about?.slides || [],
    },
    theme: {
      preTitle: `Conference Theme ${edition.year}`,
      mainHeadingPre: base.theme?.mainHeadingPre || '“',
      mainHeadingSpan: edition.themeTitle || base.theme?.mainHeadingSpan || 'Living as Exiles',
      mainHeadingPost: base.theme?.mainHeadingPost || '”',
      subtitle: edition.themeSubtitle || base.theme?.subtitle || 'Expositions in 1 Peter',
      quoteText: edition.themeScripture || base.theme?.quoteText || '',
      quoteRef: edition.themeReference || base.theme?.quoteRef || '',
      p1: edition.themeSummary || base.theme?.p1 || '',
      p2: base.theme?.p2 || '',
      tags: edition.themeTags || base.theme?.tags || ['Biblical Exposition', 'Exiles'],
    },
    speakers: base.speakers || {
      preHeading: 'Speakers',
      mainHeadingItalic: 'Faithful Pastors',
      mainHeadingRest: ' From Local Churches',
      footnote:
        "*Similar to previous editions of the conference, we do not want to attract participants towards specific preachers. Rather, we invite participants who want to be challenged by God's Word, confident that the preachers are biblically qualified pastors who will handle God's precious word with care.",
    },
    schedule: base.schedule || {
      subTitle: 'SCHEDULE',
      titlePre: 'Three Days of The \n',
      titleItalic: 'Word & Fellowship',
      days: {
        day1: {
          date: 'Sep 29',
          dayLabel: 'DAY 01',
          label: 'Day 1',
          events: [
            { title: 'Arrival & Check-in', type: 'general' },
            { title: 'Welcome/Introduction', type: 'general' },
            { session: 'Session 01', title: 'Living as Exiles with a Living Hope', type: 'session' },
            { title: 'Tea Break', type: 'break' },
            { title: 'Panel Discussion', type: 'general' },
            { session: 'Session 02', title: 'Pursuing Holiness in an Unholy World', type: 'session' },
            { title: 'Dinner', type: 'break' },
          ],
        },
        day2: {
          date: 'Sep 30',
          dayLabel: 'DAY 02',
          label: 'Day 2',
          events: [
            { session: 'Session 03', title: "Living as God's Chosen People", type: 'session' },
            { session: 'Session 04', title: 'Following Christ Through Suffering', type: 'session' },
            { title: 'Tea Break', type: 'break' },
            { title: 'Breakout Session', type: 'general' },
            { title: 'Lunch', type: 'break' },
            { session: 'Session 05', title: 'Living for the Will of God', type: 'session' },
            { title: 'Panel Discussion', type: 'general' },
            { session: 'Session 06', title: 'Rejoicing in the Midst of Trials', type: 'session' },
            { title: 'Dinner', type: 'break' },
          ],
        },
        day3: {
          date: 'Oct 01',
          dayLabel: 'DAY 03',
          label: 'Day 3',
          events: [
            { session: 'Session 07', title: 'Clothed with Humility', type: 'session' },
            { title: 'Tea Break', type: 'break' },
            { title: 'Panel Discussion', type: 'general' },
            { title: 'Closing Lunch', type: 'break' },
            { title: 'Departure', type: 'general' },
          ],
        },
      },
    },
    pricing: {
      subTitle: base.pricing?.subTitle || 'Registration Fees',
      mainHeadingPre: base.pricing?.mainHeadingPre || 'Choose Your ',
      mainHeadingSpan: base.pricing?.mainHeadingSpan || 'Accommodation',
      earlyBirdNote: base.pricing?.earlyBirdNote || 'FIRST-COME-FIRST-SERVED BASIS!',
      cards: cards.length > 0 ? cards : (base.pricing?.cards || []),
      registrationNote:
        base.pricing?.registrationNote ||
        'Registration is open only to Indian participants. \n*PLEASE REGISTER ONLY IF YOU ARE COMFORTABLE TO COMMUNICATE IN ENGLISH\nPLEASE NOTE THAT THE INEXPENSIVE QUADRUPLE SHARING SEATS WILL BE FILLED UP FIRST AND ARE AVAILABLE ON A FIRST-COME-FIRST-SERVED BASIS!',
    },
    books: base.books || {
      complimentaryLabel: 'COMPLIMENTARY',
      brandTag: brandAcronym,
      titlePre: 'Free ',
      titleItalic: 'Books',
      years: ['2026', '2024', '2023', '2022', '2021', '2020', '2019'],
      booksData: {},
    },
    organisers: {
      label: base.organisers?.label || 'ORGANISED BY',
      titlePre: base.organisers?.titlePre || 'Conference ',
      titleEm: base.organisers?.titleEm || 'Organiser',
      organiser: {
        name: primaryPartner?.name || base.organisers?.organiser?.name || 'Equip Indian Churches',
        logo: primaryPartner?.logoUrl || base.organisers?.organiser?.logo || '/assets/EIC_Favicon.png',
        description: primaryPartner?.description || base.organisers?.organiser?.description || '',
        url: primaryPartner?.websiteUrl || base.organisers?.organiser?.url || 'https://equipindianchurches.com',
        urlDisplay: base.organisers?.organiser?.urlDisplay || 'equipindianchurches.com',
      },
      partnersLabel: base.organisers?.partnersLabel || 'PARTNERSHIPS',
      partnersTitlePre: base.organisers?.partnersTitlePre || 'Our ',
      partnersTitleEm: base.organisers?.partnersTitleEm || 'Partners',
      partnersDescription:
        base.organisers?.partnersDescription ||
        'We are grateful to partner with ministries that share our desire to serve the church and see the Gospel faithfully proclaimed.',
      partnersList: secondaryPartners.length > 0
        ? secondaryPartners.map((p: any) => ({
            name: p.name,
            logo: p.logoUrl,
            url: p.websiteUrl,
            urlDisplay: (p.websiteUrl || '').replace(/^https?:\/\//, ''),
            description: p.description,
          }))
        : (base.organisers?.partnersList || []),
      knowMoreUrl: base.organisers?.knowMoreUrl || '/partners',
    },
    gallery: {
      subtitle: base.gallery?.subtitle || 'HIGHLIGHTS',
      titlePre: base.gallery?.titlePre || 'Glimpses of ',
      titleSpan: base.gallery?.titleSpan || brandAcronym,
      slides: slides.length > 0 ? slides : (base.gallery?.slides || []),
    },
    venue: base.venue || {
      preTitle: 'VENUE',
      titlePre: 'Conference ',
      titleHighlight: 'Location',
      mainCard: {
        name: `${edition.venueName}, ${edition.venueCity}`,
        dates: edition.datesDisplay,
        address: edition.venueAddress,
        mapUrl: edition.venueMapUrl || 'https://maps.google.com',
      },
      cards: [],
    },
    faq: {
      preTitle: base.faq?.preTitle || 'FAQ',
      title: base.faq?.title || 'Frequently Asked Questions',
      col1: col1.length > 0 ? col1 : (base.faq?.col1 || []),
      col2: col2.length > 0 ? col2 : (base.faq?.col2 || []),
    },
    contact: base.contact || {
      preTitle: 'CONTACT',
      titlePre: 'Secretariat ',
      titleSpan: 'Inquiries',
      phone: '+91 80979 50949',
      whatsapp: '+91 80979 50949',
      email: 'aipc@equipindianchurches.com',
    },
    footer: base.footer || {
      bgImage: '/assets/VAL00115-scaled.jpg',
      links: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms & Conditions', href: '/t-c' },
        { label: 'Cancellations & Refunds', href: '/cancellations-refunds' },
        { label: 'Travel Instructions', href: '/travel-instruction' },
        { label: 'Contact Us', href: '/contact-us' },
      ],
    },
  };
}
