-- CMS tables for App Service API (Azure SQL)

IF OBJECT_ID('dbo.SiteContent', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.SiteContent (
    id NVARCHAR(50) NOT NULL PRIMARY KEY,
    section NVARCHAR(100) NOT NULL,
    content_key NVARCHAR(100) NOT NULL,
    content_value NVARCHAR(MAX) NOT NULL,
    content_type NVARCHAR(30) NOT NULL DEFAULT 'text',
    sort_order INT NOT NULL DEFAULT 0,
    CONSTRAINT UQ_SiteContent_SectionKey UNIQUE (section, content_key)
  );
END;

IF OBJECT_ID('dbo.NavigationItems', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.NavigationItems (
    id NVARCHAR(50) NOT NULL PRIMARY KEY,
    location NVARCHAR(50) NOT NULL,
    label NVARCHAR(120) NOT NULL,
    href NVARCHAR(300) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_visible BIT NOT NULL DEFAULT 1,
    parent_id NVARCHAR(50) NULL
  );

  CREATE INDEX IX_NavigationItems_LocationOrder ON dbo.NavigationItems(location, sort_order);
END;

IF OBJECT_ID('dbo.HomepageBanners', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.HomepageBanners (
    id NVARCHAR(50) NOT NULL PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    tagline NVARCHAR(400) NOT NULL DEFAULT '',
    image_url NVARCHAR(600) NOT NULL,
    link NVARCHAR(400) NOT NULL DEFAULT '',
    accent_color NVARCHAR(30) NOT NULL DEFAULT '',
    sort_order INT NOT NULL DEFAULT 0,
    is_active BIT NOT NULL DEFAULT 1
  );

  CREATE INDEX IX_HomepageBanners_OrderActive ON dbo.HomepageBanners(sort_order, is_active);
END;

IF OBJECT_ID('dbo.CustomerAccounts', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.CustomerAccounts (
    id NVARCHAR(50) NOT NULL PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    passwordHash NVARCHAR(512) NOT NULL,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt NVARCHAR(30) NOT NULL,
    updatedAt NVARCHAR(30) NOT NULL
  );

  CREATE UNIQUE INDEX IX_CustomerAccounts_Email ON dbo.CustomerAccounts(email);
END;

IF OBJECT_ID('dbo.Customers', 'U') IS NOT NULL
BEGIN
  IF COL_LENGTH('dbo.Customers', 'lastActive') IS NOT NULL
  BEGIN
    ALTER TABLE dbo.Customers ALTER COLUMN lastActive NVARCHAR(40) NOT NULL;
  END;

  IF COL_LENGTH('dbo.Customers', 'joinedAt') IS NOT NULL
  BEGIN
    ALTER TABLE dbo.Customers ALTER COLUMN joinedAt NVARCHAR(40) NOT NULL;
  END;
END;
