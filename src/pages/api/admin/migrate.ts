import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getConferenceData } from '@/lib/conferenceStore';
import { getRegistrationsAsync } from '@/lib/registrationsStore';
import { getQueriesAsync } from '@/lib/queriesStore';

const DDL_STATEMENTS = [
  // Enums
  `DO $$ BEGIN CREATE TYPE "EditionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `DO $$ BEGIN CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'EDITOR', 'REGISTRATION_MANAGER', 'MEDIA_MANAGER', 'VIEWER'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `DO $$ BEGIN CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `DO $$ BEGIN CREATE TYPE "QueryStatus" AS ENUM ('PENDING', 'REPLIED', 'ARCHIVED'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,

  // 1. ConferenceEdition
  `CREATE TABLE IF NOT EXISTS "ConferenceEdition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "status" "EditionStatus" NOT NULL DEFAULT 'DRAFT',
    "isActivePublic" BOOLEAN NOT NULL DEFAULT false,
    "themeTitle" TEXT NOT NULL,
    "themeSubtitle" TEXT,
    "themeScripture" TEXT,
    "themeReference" TEXT,
    "themeSummary" TEXT,
    "themeTags" TEXT[],
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "datesDisplay" TEXT NOT NULL,
    "venueName" TEXT NOT NULL,
    "venueCity" TEXT NOT NULL,
    "venueState" TEXT,
    "venueAddress" TEXT NOT NULL,
    "venueMapUrl" TEXT,
    "targetCountdown" TIMESTAMP(3) NOT NULL,
    "heroPreTitle" TEXT,
    "heroTagline" TEXT,
    "heroBgImageUrl" TEXT,
    "heroVideoUrl" TEXT,
    "aboutPreTitle" TEXT,
    "aboutHeading" TEXT,
    "aboutP1" TEXT,
    "aboutP2" TEXT,
    "aboutStats" JSONB,
    "aboutSlides" TEXT[],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoOgImageUrl" TEXT,
    "canonicalUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,

  // 2. EditionSection
  `CREATE TABLE IF NOT EXISTS "EditionSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "editionId" TEXT NOT NULL REFERENCES "ConferenceEdition"("id") ON DELETE CASCADE,
    "sectionKey" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "showInNav" BOOLEAN NOT NULL DEFAULT true,
    "navLabel" TEXT,
    "customTitle" TEXT,
    "customSubtitle" TEXT,
    "layoutVariant" TEXT NOT NULL DEFAULT 'default',
    "desktopVisible" BOOLEAN NOT NULL DEFAULT true,
    "mobileVisible" BOOLEAN NOT NULL DEFAULT true,
    "configJson" JSONB,
    CONSTRAINT "EditionSection_editionId_sectionKey_key" UNIQUE ("editionId", "sectionKey")
  );`,

  // 3. Speaker
  `CREATE TABLE IF NOT EXISTS "Speaker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "church" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "bio" TEXT,
    "photoUrl" TEXT,
    "websiteUrl" TEXT,
    "socialLinks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,

  // 4. SpeakerAssignment
  `CREATE TABLE IF NOT EXISTS "SpeakerAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "editionId" TEXT NOT NULL REFERENCES "ConferenceEdition"("id") ON DELETE CASCADE,
    "speakerId" TEXT NOT NULL REFERENCES "Speaker"("id") ON DELETE CASCADE,
    "isKeynote" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "topicTitle" TEXT,
    CONSTRAINT "SpeakerAssignment_editionId_speakerId_key" UNIQUE ("editionId", "speakerId")
  );`,

  // 5. ProgrammeDay
  `CREATE TABLE IF NOT EXISTS "ProgrammeDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "editionId" TEXT NOT NULL REFERENCES "ConferenceEdition"("id") ON DELETE CASCADE,
    "dayNumber" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dateDisplay" TEXT NOT NULL,
    "dayLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,

  // 6. ProgrammeSession
  `CREATE TABLE IF NOT EXISTS "ProgrammeSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayId" TEXT NOT NULL REFERENCES "ProgrammeDay"("id") ON DELETE CASCADE,
    "sessionCode" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "sessionType" TEXT NOT NULL,
    "location" TEXT,
    "speakerAssignmentId" TEXT REFERENCES "SpeakerAssignment"("id") ON DELETE SET NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true
  );`,

  // 7. AccommodationPackage
  `CREATE TABLE IF NOT EXISTS "AccommodationPackage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "editionId" TEXT NOT NULL REFERENCES "ConferenceEdition"("id") ON DELETE CASCADE,
    "packageKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "occupancy" TEXT NOT NULL,
    "guestCount" INTEGER NOT NULL DEFAULT 3,
    "priceAmount" DECIMAL(10, 2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "badgeText" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "features" TEXT[],
    "totalCapacity" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true
  );`,

  // 8. PartnerMinistry
  `CREATE TABLE IF NOT EXISTS "PartnerMinistry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "editionId" TEXT NOT NULL REFERENCES "ConferenceEdition"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
  );`,

  // 9. GalleryAlbum & GalleryPhoto
  `CREATE TABLE IF NOT EXISTS "GalleryAlbum" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "editionId" TEXT NOT NULL REFERENCES "ConferenceEdition"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
  );`,
  `CREATE TABLE IF NOT EXISTS "GalleryPhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "albumId" TEXT NOT NULL REFERENCES "GalleryAlbum"("id") ON DELETE CASCADE,
    "photoUrl" TEXT NOT NULL,
    "altText" TEXT,
    "caption" TEXT,
    "gridSlot" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
  );`,

  // 10. FaqItem & Announcement
  `CREATE TABLE IF NOT EXISTS "FaqItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "editionId" TEXT NOT NULL REFERENCES "ConferenceEdition"("id") ON DELETE CASCADE,
    "question" TEXT NOT NULL,
    "answerHtml" TEXT NOT NULL,
    "columnNumber" INTEGER NOT NULL DEFAULT 1,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true
  );`,
  `CREATE TABLE IF NOT EXISTS "Announcement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "editionId" TEXT NOT NULL REFERENCES "ConferenceEdition"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "badgeText" TEXT,
    "imageUrl" TEXT,
    "actionUrl" TEXT,
    "actionLabel" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0
  );`,

  // 11. Registration
  `CREATE TABLE IF NOT EXISTS "Registration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "editionId" TEXT NOT NULL REFERENCES "ConferenceEdition"("id") ON DELETE RESTRICT,
    "regCode" TEXT NOT NULL UNIQUE,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "age" TEXT,
    "gender" TEXT NOT NULL DEFAULT 'Male',
    "church" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "street" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "zip" TEXT,
    "packageId" TEXT REFERENCES "AccommodationPackage"("id") ON DELETE SET NULL,
    "planTitle" TEXT NOT NULL,
    "amount" DECIMAL(10, 2) NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentReference" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,

  // 12. ContactQuery
  `CREATE TABLE IF NOT EXISTS "ContactQuery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "editionId" TEXT REFERENCES "ConferenceEdition"("id") ON DELETE SET NULL,
    "queryCode" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "status" "QueryStatus" NOT NULL DEFAULT 'PENDING',
    "replyNotes" TEXT,
    "repliedAt" TIMESTAMP(3),
    "repliedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,

  // 13. AdminUser, ActivityLog, ContentRevision, MediaAsset
  `CREATE TABLE IF NOT EXISTS "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'EDITOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE TABLE IF NOT EXISTS "ActivityLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT REFERENCES "AdminUser"("id") ON DELETE SET NULL,
    "userEmail" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE TABLE IF NOT EXISTS "ContentRevision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "editionId" TEXT NOT NULL REFERENCES "ConferenceEdition"("id") ON DELETE CASCADE,
    "authorId" TEXT REFERENCES "AdminUser"("id") ON DELETE SET NULL,
    "snapshot" JSONB NOT NULL,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE TABLE IF NOT EXISTS "MediaAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "blobUrl" TEXT NOT NULL UNIQUE,
    "folder" TEXT NOT NULL DEFAULT 'general',
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "altText" TEXT,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const auth = req.headers.authorization;
  if (auth !== 'Bearer AIPC@2025#Admin') {
    return res.status(401).json({ error: 'Unauthorized: valid Admin passkey required.' });
  }

  try {
    // 1. Run DDL Statements to create tables if they do not exist
    for (const sql of DDL_STATEMENTS) {
      await prisma.$executeRawUnsafe(sql);
    }

    // 2. Fetch current live conference data from JSON / Blob store
    const confData = await getConferenceData();
    const year = confData.meta?.year || '2026';

    // 3. Upsert Conference Edition (AIPC 2026 / current edition)
    let edition = await prisma.conferenceEdition.findUnique({
      where: { year },
    });

    if (!edition) {
      edition = await prisma.conferenceEdition.create({
        data: {
          year,
          title: `AIPC ${year}`,
          slug: year,
          status: 'PUBLISHED',
          isActivePublic: true,
          themeTitle: confData.theme?.mainHeadingSpan || 'Living as Exiles',
          themeSubtitle: confData.theme?.subtitle || 'Expositions in 1 Peter',
          themeScripture: confData.theme?.quoteText || '',
          themeReference: confData.theme?.quoteRef || '1 Peter 1:24-25',
          themeSummary: `${confData.theme?.p1 || ''}\n\n${confData.theme?.p2 || ''}`,
          themeTags: confData.theme?.tags || ['Biblical Exposition', 'Exiles', 'Shepherding'],
          startDate: new Date('2026-09-29T12:00:00Z'),
          endDate: new Date('2026-10-01T15:00:00Z'),
          datesDisplay: confData.meta?.dates || 'Sep 29 – Oct 1, 2026',
          venueName: confData.venue?.mainCard?.name || 'GCC Hotel & Club',
          venueCity: 'Mumbai',
          venueState: 'Maharashtra',
          venueAddress: confData.venue?.mainCard?.address || 'Mira Road (East), Mumbai - 401107',
          venueMapUrl: confData.venue?.mapCard?.mapUrl || '',
          targetCountdown: new Date(confData.meta?.targetDate || '2026-09-29T14:00:00Z'),
          heroPreTitle: confData.hero?.preTitle || 'Organised By Equip Indian Churches',
          heroTagline: confData.hero?.tagline || 'A Conference for Indian Churches by Indians.',
          heroBgImageUrl: confData.hero?.bgImage || '/assets/DSCF0834-scaled.jpg',
          aboutPreTitle: confData.about?.preTitle || 'A Conference for Indian Churches by Indians',
          aboutHeading: 'Where Men are Equipped & Renewed',
          aboutP1: confData.about?.p1 || '',
          aboutP2: confData.about?.p2 || '',
          aboutStats: confData.about?.stats || [
            { number: '600+', label: 'Men' },
            { number: '25+', label: 'States' },
            { number: '3', label: 'Days' },
          ],
          aboutSlides: confData.about?.slides || [],
          seoTitle: `AIPC ${year} – All India Pastors’ Conference`,
          seoDescription: `All India Pastors' Conference ${year}`,
        },
      });

      // 4. Seed Standard Sections
      const defaultSections = [
        { sectionKey: 'hero', displayName: 'Hero Countdown & Banner', sortOrder: 1 },
        { sectionKey: 'about', displayName: 'About & Highlights', sortOrder: 2 },
        { sectionKey: 'theme', displayName: 'Theme & Scripture', sortOrder: 3 },
        { sectionKey: 'speakers', displayName: 'Keynote Speakers', sortOrder: 4 },
        { sectionKey: 'schedule', displayName: 'Programme Schedule', sortOrder: 5 },
        { sectionKey: 'pricing', displayName: 'Accommodation Packages', sortOrder: 6 },
        { sectionKey: 'books', displayName: 'Complimentary Books', sortOrder: 7 },
        { sectionKey: 'organisers', displayName: 'Organisers & Partners', sortOrder: 8 },
        { sectionKey: 'gallery', displayName: 'Photo Gallery', sortOrder: 9 },
        { sectionKey: 'venue', displayName: 'Venue & Transport', sortOrder: 10 },
        { sectionKey: 'faq', displayName: 'Frequently Asked Questions', sortOrder: 11 },
        { sectionKey: 'contact', displayName: 'Contact & Inquiries', sortOrder: 12 },
      ];

      for (const sec of defaultSections) {
        await prisma.editionSection.create({
          data: {
            editionId: edition.id,
            sectionKey: sec.sectionKey,
            displayName: sec.displayName,
            sortOrder: sec.sortOrder,
            isEnabled: true,
            showInNav: true,
          },
        });
      }

      // 5. Seed Accommodation Packages
      const packages = confData.pricing?.cards || [];
      for (let i = 0; i < packages.length; i++) {
        const pkg = packages[i];
        const numPrice = parseFloat((pkg.price || '0').replace(/,/g, ''));
        await prisma.accommodationPackage.create({
          data: {
            editionId: edition.id,
            packageKey: pkg.id || `pkg-${i}`,
            title: pkg.title || 'Sharing',
            occupancy: pkg.occupancy || 'Guests',
            guestCount: pkg.guestCount || 3,
            priceAmount: isNaN(numPrice) ? 5999 : numPrice,
            badgeText: pkg.badge || null,
            isFeatured: !!pkg.featured,
            features: pkg.features || [],
            sortOrder: i,
          },
        });
      }

      // 6. Seed Organisers & Partners
      if (confData.organisers?.organiser) {
        await prisma.partnerMinistry.create({
          data: {
            editionId: edition.id,
            name: confData.organisers.organiser.name || 'Equip Indian Churches',
            logoUrl: confData.organisers.organiser.logo || '/assets/EIC_Favicon.png',
            description: confData.organisers.organiser.description || '',
            websiteUrl: confData.organisers.organiser.url || 'https://equipindianchurches.com',
            isPrimary: true,
            sortOrder: 0,
          },
        });
      }

      const partners = confData.organisers?.partnersList || [];
      for (let i = 0; i < partners.length; i++) {
        const p = partners[i];
        await prisma.partnerMinistry.create({
          data: {
            editionId: edition.id,
            name: p.name,
            logoUrl: p.logo || '',
            description: p.description || '',
            websiteUrl: p.url || '',
            isPrimary: false,
            sortOrder: i + 1,
          },
        });
      }

      // 7. Seed FAQs
      const col1 = confData.faq?.column1 || [];
      for (let i = 0; i < col1.length; i++) {
        await prisma.faqItem.create({
          data: {
            editionId: edition.id,
            question: col1[i].question,
            answerHtml: col1[i].answerHtml,
            columnNumber: 1,
            sortOrder: i,
          },
        });
      }
      const col2 = confData.faq?.column2 || [];
      for (let i = 0; i < col2.length; i++) {
        await prisma.faqItem.create({
          data: {
            editionId: edition.id,
            question: col2[i].question,
            answerHtml: col2[i].answerHtml,
            columnNumber: 2,
            sortOrder: i,
          },
        });
      }

      // 8. Seed Photo Gallery
      const slides = confData.gallery?.slides || [];
      for (let s = 0; s < slides.length; s++) {
        const album = await prisma.galleryAlbum.create({
          data: {
            editionId: edition.id,
            title: `Slide ${s + 1}`,
            sortOrder: s,
          },
        });
        const items = slides[s].items || [];
        for (let p = 0; p < items.length; p++) {
          await prisma.galleryPhoto.create({
            data: {
              albumId: album.id,
              photoUrl: items[p].src,
              altText: items[p].alt || `AIPC Photo ${p + 1}`,
              gridSlot: items[p].className || `item-${p + 1}`,
              sortOrder: p,
            },
          });
        }
      }
    }

    // 9. Migrate Attendee Registrations from JSON/Blob
    const rawRegistrations = await getRegistrationsAsync();
    let migratedRegs = 0;
    for (const reg of rawRegistrations) {
      const exists = await prisma.registration.findUnique({
        where: { regCode: reg.id },
      });
      if (!exists) {
        await prisma.registration.create({
          data: {
            editionId: edition.id,
            regCode: reg.id,
            firstName: reg.firstName,
            lastName: reg.lastName || '',
            email: reg.email,
            phone: reg.phone,
            age: reg.age || '',
            gender: reg.gender || 'Male',
            church: reg.church,
            designation: reg.designation,
            street: reg.street || '',
            city: reg.city,
            state: reg.state,
            country: reg.country || 'India',
            zip: reg.zip || '',
            planTitle: reg.planTitle || 'Conference Registration',
            amount: reg.amount || 5999,
            paymentStatus: reg.paymentStatus === 'confirmed' ? 'CONFIRMED' : 'PENDING',
            paymentReference: reg.paymentReference || '',
            notes: reg.notes || '',
            createdAt: reg.createdAt ? new Date(reg.createdAt) : new Date(),
          },
        });
        migratedRegs++;
      }
    }

    // 10. Migrate Contact Queries from JSON/Blob
    const rawQueries = await getQueriesAsync();
    let migratedQueries = 0;
    for (const q of rawQueries) {
      const exists = await prisma.contactQuery.findUnique({
        where: { queryCode: q.id },
      });
      if (!exists) {
        await prisma.contactQuery.create({
          data: {
            editionId: edition.id,
            queryCode: q.id,
            name: q.name,
            email: q.email,
            phone: q.phone || '',
            message: q.message,
            status: q.status === 'replied' ? 'REPLIED' : 'PENDING',
            replyNotes: q.replyNotes || '',
            repliedAt: q.repliedAt ? new Date(q.repliedAt) : null,
            repliedBy: q.repliedBy || null,
            createdAt: q.createdAt ? new Date(q.createdAt) : new Date(),
          },
        });
        migratedQueries++;
      }
    }

    // 11. Seed Initial Super Admin User if none exists
    const superAdminEmail = 'admin@aipc.live';
    let adminUser = await prisma.adminUser.findUnique({
      where: { email: superAdminEmail },
    });

    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('AIPC@2025#Admin', salt);
      adminUser = await prisma.adminUser.create({
        data: {
          name: 'AIPC Super Admin',
          email: superAdminEmail,
          passwordHash,
          role: 'SUPER_ADMIN',
          isActive: true,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'PostgreSQL database initialized, schema applied, and production data migrated successfully!',
      stats: {
        editionYear: edition.year,
        editionId: edition.id,
        migratedRegistrations: migratedRegs,
        migratedQueries: migratedQueries,
        superAdminCreated: !!adminUser,
      },
    });
  } catch (err: any) {
    console.error('Migration error:', err);
    return res.status(500).json({
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
}
