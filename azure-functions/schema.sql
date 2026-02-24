-- ============================================
-- Azure SQL Schema for Infinity Platform
-- Run this in Azure SQL Database after provisioning
-- ============================================

-- Products
CREATE TABLE Products (
  id            NVARCHAR(50)   PRIMARY KEY,
  slug          NVARCHAR(200)  NOT NULL UNIQUE,
  name          NVARCHAR(300)  NOT NULL,
  brand         NVARCHAR(50)   NOT NULL,
  category      NVARCHAR(50)   NOT NULL,
  price         INT            NOT NULL DEFAULT 0,
  compareAtPrice INT           NULL,
  currency      NVARCHAR(10)   NOT NULL DEFAULT 'BDT',
  images        NVARCHAR(MAX)  NOT NULL DEFAULT '[]',    -- JSON array
  description   NVARCHAR(MAX)  NOT NULL DEFAULT '',
  specs         NVARCHAR(MAX)  NOT NULL DEFAULT '[]',    -- JSON array
  variants      NVARCHAR(MAX)  NOT NULL DEFAULT '[]',    -- JSON array
  tags          NVARCHAR(MAX)  NOT NULL DEFAULT '[]',    -- JSON array
  inStock       BIT            NOT NULL DEFAULT 1,
  isNew         BIT            NOT NULL DEFAULT 0,
  isTrending    BIT            NOT NULL DEFAULT 0,
  createdAt     DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
  updatedAt     DATETIME2      NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX IX_Products_category ON Products (category);
CREATE INDEX IX_Products_brand ON Products (brand);
CREATE INDEX IX_Products_slug ON Products (slug);

-- Events
CREATE TABLE Events (
  id            NVARCHAR(50)   PRIMARY KEY,
  slug          NVARCHAR(200)  NOT NULL UNIQUE,
  title         NVARCHAR(300)  NOT NULL,
  brand         NVARCHAR(50)   NOT NULL,
  date          NVARCHAR(20)   NOT NULL,
  time          NVARCHAR(20)   NOT NULL,
  venue         NVARCHAR(300)  NOT NULL,
  city          NVARCHAR(100)  NOT NULL,
  bannerImage   NVARCHAR(500)  NOT NULL DEFAULT '',
  description   NVARCHAR(MAX)  NOT NULL DEFAULT '',
  ticketTiers   NVARCHAR(MAX)  NOT NULL DEFAULT '[]',    -- JSON array
  faq           NVARCHAR(MAX)  NOT NULL DEFAULT '[]',    -- JSON array
  lineup        NVARCHAR(MAX)  NOT NULL DEFAULT '[]',    -- JSON array
  schedule      NVARCHAR(MAX)  NOT NULL DEFAULT '[]',    -- JSON array
  isFeatured    BIT            NOT NULL DEFAULT 0,
  createdAt     DATETIME2      NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX IX_Events_brand ON Events (brand);
CREATE INDEX IX_Events_slug ON Events (slug);
CREATE INDEX IX_Events_date ON Events (date);

-- Discounts
CREATE TABLE Discounts (
  id            NVARCHAR(50)   PRIMARY KEY,
  code          NVARCHAR(50)   NOT NULL UNIQUE,
  description   NVARCHAR(300)  NOT NULL DEFAULT '',
  type          NVARCHAR(20)   NOT NULL,                 -- 'percentage' | 'fixed'
  value         INT            NOT NULL,
  currency      NVARCHAR(10)   NOT NULL DEFAULT 'BDT',
  appliesTo     NVARCHAR(20)   NOT NULL,                 -- 'products' | 'events' | 'tickets' | 'all'
  minPurchase   INT            NULL,
  maxUses       INT            NULL,
  usedCount     INT            NOT NULL DEFAULT 0,
  startDate     NVARCHAR(20)   NOT NULL,
  endDate       NVARCHAR(20)   NOT NULL,
  isActive      BIT            NOT NULL DEFAULT 1,
  createdAt     DATETIME2      NOT NULL DEFAULT GETUTCDATE()
);

CREATE UNIQUE INDEX IX_Discounts_code ON Discounts (code);

-- Categories
CREATE TABLE Categories (
  id            NVARCHAR(50)   PRIMARY KEY,
  slug          NVARCHAR(100)  NOT NULL UNIQUE,
  name          NVARCHAR(100)  NOT NULL,
  description   NVARCHAR(300)  NOT NULL DEFAULT '',
  image         NVARCHAR(500)  NOT NULL DEFAULT '',
  productCount  INT            NOT NULL DEFAULT 0
);

-- Brands
CREATE TABLE Brands (
  id            NVARCHAR(50)   PRIMARY KEY,
  name          NVARCHAR(100)  NOT NULL,
  tagline       NVARCHAR(300)  NOT NULL DEFAULT '',
  logo          NVARCHAR(500)  NOT NULL DEFAULT '',
  heroImage     NVARCHAR(500)  NOT NULL DEFAULT '',
  description   NVARCHAR(MAX)  NOT NULL DEFAULT '',
  accentColor   NVARCHAR(30)   NOT NULL DEFAULT ''
);

-- Banners
CREATE TABLE Banners (
  id            NVARCHAR(50)   PRIMARY KEY,
  title         NVARCHAR(200)  NOT NULL,
  imageUrl      NVARCHAR(500)  NOT NULL,
  link          NVARCHAR(300)  NOT NULL DEFAULT '',
  placement     NVARCHAR(30)   NOT NULL,                 -- 'hero' | 'editions' | 'encounter' | 'trinity'
  isActive      BIT            NOT NULL DEFAULT 1,
  [order]       INT            NOT NULL DEFAULT 1
);

CREATE INDEX IX_Banners_placement ON Banners (placement);

-- Customers
CREATE TABLE Customers (
  id            NVARCHAR(50)   PRIMARY KEY,
  name          NVARCHAR(200)  NOT NULL,
  email         NVARCHAR(255)  NOT NULL,
  phone         NVARCHAR(50)   NOT NULL DEFAULT '',
  avatar        NVARCHAR(500)  NULL,
  segment       NVARCHAR(20)   NOT NULL DEFAULT 'new',   -- 'vip' | 'regular' | 'new' | 'inactive'
  totalSpent    INT            NOT NULL DEFAULT 0,
  orderCount    INT            NOT NULL DEFAULT 0,
  lastActive    NVARCHAR(20)   NOT NULL,
  joinedAt      NVARCHAR(20)   NOT NULL,
  tags          NVARCHAR(MAX)  NOT NULL DEFAULT '[]',     -- JSON array
  notes         NVARCHAR(MAX)  NOT NULL DEFAULT ''
);

CREATE INDEX IX_Customers_segment ON Customers (segment);
CREATE INDEX IX_Customers_email ON Customers (email);

-- Conversations (Chatbot)
CREATE TABLE Conversations (
  id            NVARCHAR(50)   PRIMARY KEY,
  customerId    NVARCHAR(50)   NOT NULL,
  customerName  NVARCHAR(200)  NOT NULL,
  status        NVARCHAR(20)   NOT NULL DEFAULT 'open',   -- 'open' | 'resolved' | 'escalated'
  startedAt     NVARCHAR(30)   NOT NULL,
  lastMessageAt NVARCHAR(30)   NOT NULL,
  messages      NVARCHAR(MAX)  NOT NULL DEFAULT '[]',     -- JSON array of messages
  FOREIGN KEY (customerId) REFERENCES Customers(id)
);

CREATE INDEX IX_Conversations_status ON Conversations (status);
CREATE INDEX IX_Conversations_customerId ON Conversations (customerId);

-- Email Campaigns
CREATE TABLE EmailCampaigns (
  id              NVARCHAR(50)   PRIMARY KEY,
  name            NVARCHAR(200)  NOT NULL,
  subject         NVARCHAR(300)  NOT NULL,
  status          NVARCHAR(20)   NOT NULL DEFAULT 'draft', -- 'draft' | 'scheduled' | 'sent'
  segment         NVARCHAR(50)   NOT NULL,
  scheduledAt     NVARCHAR(30)   NULL,
  sentAt          NVARCHAR(30)   NULL,
  recipientCount  INT            NOT NULL DEFAULT 0,
  openRate        FLOAT          NULL,
  clickRate       FLOAT          NULL
);

-- Push Notifications
CREATE TABLE PushNotifications (
  id              NVARCHAR(50)   PRIMARY KEY,
  title           NVARCHAR(200)  NOT NULL,
  body            NVARCHAR(500)  NOT NULL,
  status          NVARCHAR(20)   NOT NULL DEFAULT 'draft', -- 'draft' | 'scheduled' | 'sent'
  segment         NVARCHAR(50)   NOT NULL,
  scheduledAt     NVARCHAR(30)   NULL,
  sentAt          NVARCHAR(30)   NULL,
  recipientCount  INT            NOT NULL DEFAULT 0
);

-- Knowledge Base Articles
CREATE TABLE KBArticles (
  id            NVARCHAR(50)   PRIMARY KEY,
  title         NVARCHAR(300)  NOT NULL,
  category      NVARCHAR(100)  NOT NULL,
  content       NVARCHAR(MAX)  NOT NULL DEFAULT '',
  isPublished   BIT            NOT NULL DEFAULT 0,
  updatedAt     NVARCHAR(20)   NOT NULL
);

CREATE INDEX IX_KBArticles_category ON KBArticles (category);
