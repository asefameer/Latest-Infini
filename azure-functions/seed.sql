-- ═══════════════════════════════════════════════════════
-- Infinity Platform — Azure SQL Seed Data
-- Run after schema.sql to populate with mock data
-- ═══════════════════════════════════════════════════════

-- Categories
INSERT INTO Categories (id, slug, name, description, image, productCount) VALUES
('cat-1', 'apparel', 'Apparel', 'Premium streetwear and fashion pieces crafted for the bold.', '/placeholder.svg', 4),
('cat-2', 'accessories', 'Accessories', 'Statement accessories that complete your look.', '/placeholder.svg', 3),
('cat-3', 'footwear', 'Footwear', 'Engineered for performance and style.', '/placeholder.svg', 2),
('cat-4', 'limited-drops', 'Limited Drops', 'Exclusive releases. Once they''re gone, they''re gone.', '/placeholder.svg', 3);

-- Brands
INSERT INTO Brands (id, name, tagline, heroImage, logoImage, description, story, color) VALUES
('nova', 'NOVA', 'Light Beyond Limits', '/assets/trinity-nova.jpg', '/assets/trinity-nova-logo.jpg',
 'NOVA is the creative soul of Infinity. Born from the intersection of art and technology, NOVA represents the light that guides us beyond the familiar into the extraordinary.',
 '[{"heading":"The Genesis","body":"NOVA was born in the streets of Dhaka, where creativity pulses through every alley and rooftop. We saw a generation hungry for expression — not just through words, but through what they wear, where they gather, and how they move through the world.","image":"/assets/nova-01.png"},{"heading":"Design Philosophy","body":"Every NOVA piece is a conversation between minimalism and rebellion. We strip away the unnecessary to reveal what matters: bold silhouettes, premium materials, and details that reward close attention. Our design language speaks in contrasts — light and shadow, structure and flow.","image":"/assets/nova-02.png"},{"heading":"The Community","body":"NOVA is more than a brand — it''s a collective. Our community of artists, musicians, and creators shape every collection through collaboration. When you wear NOVA, you carry the energy of a movement."}]',
 'var(--infinity-cyan)'),

('live-the-moment', 'Live The Moment', 'Every Second Counts', '/assets/trinity-live-the-moment.jpg', '/assets/trinity-ltm-logo.jpg',
 'Live The Moment captures the essence of presence. In a world of constant distraction, LTM creates spaces and pieces that anchor you in the now.',
 '[{"heading":"The Philosophy","body":"In Bangladesh''s relentless pace, we found that the most powerful luxury is presence. Live The Moment was created to serve as a constant reminder: the most valuable thing you own is this moment.","image":"/assets/ltm-01.png"},{"heading":"Crafted for Experience","body":"Every LTM product is designed to enhance real-world experiences. From festival-ready accessories to pieces that transition seamlessly from dawn yoga sessions to midnight conversations. Functionality meets feeling.","image":"/assets/ltm-02.png"},{"heading":"Moments That Matter","body":"Our events are designed as catalysts for connection. Sunrise sessions, rooftop screenings, intimate gatherings — each one an invitation to be fully present with yourself and your community."}]',
 'var(--infinity-purple)'),

('x-force', 'X-Force', 'Defy. Disrupt. Dominate.', '/assets/trinity-xforce.jpg', '/assets/trinity-xforce-logo.jpg',
 'X-Force channels raw energy into refined performance. Built for those who push boundaries — in sport, in style, in life.',
 '[{"heading":"Built Different","body":"X-Force was forged in the crucible of competition. We studied athletes, fighters, runners — anyone who refuses to accept limits. Then we built gear that matches their intensity without compromising on style.","image":"/assets/xforce-01.png"},{"heading":"Performance Meets Street","body":"The line between athletic wear and street style has been erased. X-Force occupies this space with technical fabrics, engineered fits, and designs that perform whether you''re in the gym or on the street.","image":"/assets/xforce-02.png"},{"heading":"The X-Force Movement","body":"Our urban runs, fitness challenges, and community events bring together people who believe in pushing past comfortable. X-Force isn''t just what you wear — it''s how you show up."}]',
 'var(--infinity-pink)');

-- Products
INSERT INTO Products (id, slug, name, brand, category, price, compareAtPrice, currency, images, description, specs, variants, tags, inStock, isNew, isTrending) VALUES
('p-1','nova-eclipse-hoodie','Eclipse Hoodie','nova','apparel',4500,5200,'BDT','["/placeholder.svg"]',
 'Oversized silhouette meets technical fabric. The Eclipse Hoodie features a hidden kangaroo pocket and reflective infinity logo detailing.',
 '[{"label":"Material","value":"100% Organic Cotton"},{"label":"Fit","value":"Oversized"},{"label":"Weight","value":"380 GSM"}]',
 '[{"id":"v-size","name":"Size","type":"size","options":["S","M","L","XL"]},{"id":"v-color","name":"Color","type":"color","options":["Obsidian","Fog","Midnight Blue"]}]',
 '["trending","new"]',1,1,1),

('p-2','nova-phantom-tee','Phantom Tee','nova','apparel',2200,NULL,'BDT','["/placeholder.svg"]',
 'Minimalist cut with maximal impact. Premium pima cotton with a subtle tonal logo.',
 '[{"label":"Material","value":"Pima Cotton"},{"label":"Fit","value":"Regular"}]',
 '[{"id":"v-size","name":"Size","type":"size","options":["S","M","L","XL","XXL"]},{"id":"v-color","name":"Color","type":"color","options":["Black","White","Cement"]}]',
 '["trending"]',1,0,1),

('p-3','ltm-aura-jacket','Aura Jacket','live-the-moment','apparel',7800,NULL,'BDT','["/placeholder.svg"]',
 'Water-resistant tech shell with inner fleece lining. Designed to move with you from city to trail.',
 '[{"label":"Material","value":"Nylon / Fleece"},{"label":"Water Resistance","value":"5000mm"}]',
 '[{"id":"v-size","name":"Size","type":"size","options":["M","L","XL"]},{"id":"v-color","name":"Color","type":"color","options":["Forest","Charcoal"]}]',
 '["new"]',1,1,0),

('p-4','xforce-titan-joggers','Titan Joggers','x-force','apparel',3800,NULL,'BDT','["/placeholder.svg"]',
 'Four-way stretch performance joggers with zippered pockets and tapered fit.',
 '[{"label":"Material","value":"Polyester Blend"},{"label":"Fit","value":"Tapered"}]',
 '[{"id":"v-size","name":"Size","type":"size","options":["S","M","L","XL"]},{"id":"v-color","name":"Color","type":"color","options":["Black","Slate"]}]',
 '["trending"]',1,0,1),

('p-5','nova-infinity-cap','Infinity Cap','nova','accessories',1800,NULL,'BDT','["/placeholder.svg"]',
 'Structured 6-panel cap with embroidered infinity symbol. Adjustable strap.',
 '[{"label":"Material","value":"Cotton Twill"}]',
 '[{"id":"v-color","name":"Color","type":"color","options":["Black","Navy","Sand"]}]',
 '[]',1,0,0),

('p-6','ltm-wrist-band','Pulse Wristband','live-the-moment','accessories',900,NULL,'BDT','["/placeholder.svg"]',
 'Woven nylon wristband with magnetic clasp. Festival-ready.',
 '[{"label":"Material","value":"Nylon"}]',
 '[{"id":"v-color","name":"Color","type":"color","options":["Neon Cyan","Violet","Black"]}]',
 '[]',1,0,0),

('p-7','xforce-runner-v1','Runner V1','x-force','footwear',8500,NULL,'BDT','["/placeholder.svg"]',
 'Lightweight mesh upper with EVA midsole. Engineered for urban movement.',
 '[{"label":"Upper","value":"Engineered Mesh"},{"label":"Sole","value":"EVA + Rubber"}]',
 '[{"id":"v-size","name":"Size","type":"size","options":["40","41","42","43","44"]},{"id":"v-color","name":"Color","type":"color","options":["Black/Cyan","White/Grey"]}]',
 '["new","trending"]',1,1,1),

('p-8','xforce-slide-pro','Slide Pro','x-force','footwear',2200,NULL,'BDT','["/placeholder.svg"]',
 'Contoured footbed slides with embossed branding.',
 '[{"label":"Material","value":"EVA"}]',
 '[{"id":"v-size","name":"Size","type":"size","options":["40","41","42","43","44"]}]',
 '[]',1,0,0),

('p-9','nova-legacy-chain','Legacy Chain','nova','accessories',3200,3800,'BDT','["/placeholder.svg"]',
 'Stainless steel chain necklace with micro infinity pendant. 22-inch length.',
 '[{"label":"Material","value":"Stainless Steel"},{"label":"Length","value":"22 inches"}]',
 '[{"id":"v-color","name":"Color","type":"color","options":["Silver","Gold"]}]',
 '["limited"]',1,0,0),

('p-10','ltm-limitless-tee','Limitless Tee (LE)','live-the-moment','limited-drops',3500,NULL,'BDT','["/placeholder.svg"]',
 'Limited edition collaborative print tee. Only 200 pieces.',
 '[{"label":"Material","value":"Heavy Cotton"},{"label":"Edition","value":"200 pcs"}]',
 '[{"id":"v-size","name":"Size","type":"size","options":["M","L","XL"]}]',
 '["limited","new"]',1,1,0),

('p-11','xforce-drop-001','DROP-001 Jacket','x-force','limited-drops',12000,NULL,'BDT','["/placeholder.svg"]',
 'Technical windbreaker with magnetic closures. Numbered edition.',
 '[{"label":"Material","value":"Ripstop Nylon"},{"label":"Edition","value":"100 pcs"}]',
 '[{"id":"v-size","name":"Size","type":"size","options":["M","L"]}]',
 '["limited"]',1,0,0),

('p-12','nova-genesis-shorts','Genesis Shorts (LE)','nova','limited-drops',2800,NULL,'BDT','["/placeholder.svg"]',
 'Embroidered mesh shorts with drawstring waist. Festival exclusive.',
 '[{"label":"Material","value":"Mesh / Cotton"}]',
 '[{"id":"v-size","name":"Size","type":"size","options":["S","M","L","XL"]}]',
 '["limited"]',1,0,0);

-- Events
INSERT INTO Events (id, slug, title, brand, date, endDate, time, venue, city, bannerImage, description, lineup, schedule, ticketTiers, faq, isFeatured) VALUES
('e-1','nova-neon-nights','NOVA Neon Nights','nova','2026-04-15',NULL,'8:00 PM','Infinity Arena','Dhaka','/placeholder.svg',
 'An immersive night of electronic music and light installations. Featuring international DJs and local talent in a venue transformed by neon art.',
 '["DJ Prism","Aether Collective","Frequency Lab","SYNA"]',
 '[{"time":"8:00 PM","activity":"Gates Open"},{"time":"9:00 PM","activity":"DJ Prism"},{"time":"10:30 PM","activity":"Aether Collective"},{"time":"12:00 AM","activity":"Frequency Lab (Headline)"}]',
 '[{"id":"t-1","name":"General Admission","price":2500,"currency":"BDT","description":"Standard entry","remaining":200,"maxPerOrder":4},{"id":"t-2","name":"VIP","price":5000,"currency":"BDT","description":"Priority entry + lounge access","remaining":50,"maxPerOrder":2},{"id":"t-3","name":"Backstage Pass","price":12000,"currency":"BDT","description":"Full backstage + meet & greet","remaining":10,"maxPerOrder":1}]',
 '[{"question":"What is the age requirement?","answer":"This event is 18+. Valid ID required at entry."},{"question":"Can I get a refund?","answer":"Tickets are non-refundable but transferable up to 48 hours before the event."},{"question":"Is there parking?","answer":"Limited parking available. We recommend ride-sharing."}]',
 1),

('e-2','ltm-sunrise-session','Sunrise Session','live-the-moment','2026-03-22',NULL,'5:30 AM','Patenga Beach','Chittagong','/placeholder.svg',
 'A dawn yoga and acoustic music session on the beach. Start your day with intention.',
 NULL,
 '[{"time":"5:30 AM","activity":"Arrival & Setup"},{"time":"6:00 AM","activity":"Sunrise Yoga"},{"time":"7:30 AM","activity":"Acoustic Set by Tidal"},{"time":"8:30 AM","activity":"Community Breakfast"}]',
 '[{"id":"t-4","name":"Early Bird","price":1200,"currency":"BDT","description":"Includes yoga mat & breakfast","remaining":80,"maxPerOrder":4},{"id":"t-5","name":"Premium","price":2500,"currency":"BDT","description":"Front row + wellness kit","remaining":20,"maxPerOrder":2}]',
 '[{"question":"Do I need to bring a yoga mat?","answer":"No, mats are provided with your ticket."},{"question":"What if it rains?","answer":"The event will be rescheduled. All tickets remain valid."}]',
 1),

('e-3','xforce-urban-run','X-Force Urban Run','x-force','2026-05-10',NULL,'6:00 AM','Hatirjheel','Dhaka','/placeholder.svg',
 'A 10K urban obstacle run through the city. Test your limits with the X-Force community.',
 NULL, NULL,
 '[{"id":"t-6","name":"Runner","price":1500,"currency":"BDT","description":"Entry + finisher medal + tee","remaining":500,"maxPerOrder":4},{"id":"t-7","name":"Elite Runner","price":3000,"currency":"BDT","description":"Timed entry + exclusive kit","remaining":100,"maxPerOrder":2}]',
 '[{"question":"Is this suitable for beginners?","answer":"Yes! All fitness levels are welcome."}]',
 0),

('e-4','nova-gallery-opening','NOVA Gallery: Infinite Perspectives','nova','2026-06-01',NULL,'7:00 PM','Bengal Gallery','Dhaka','/placeholder.svg',
 'A curated exhibition of digital art and immersive installations exploring the concept of infinity.',
 NULL, NULL,
 '[{"id":"t-8","name":"Gallery Entry","price":800,"currency":"BDT","description":"Exhibition access","remaining":300,"maxPerOrder":6},{"id":"t-9","name":"Collector Preview","price":3500,"currency":"BDT","description":"Early access + catalogue + wine","remaining":30,"maxPerOrder":2}]',
 '[{"question":"How long is the exhibition?","answer":"The exhibition runs for 3 weeks. Your ticket is valid for one entry."}]',
 0),

('e-5','ltm-rooftop-cinema','Rooftop Cinema Night','live-the-moment','2026-04-28',NULL,'7:30 PM','Sky Lounge, Banani','Dhaka','/placeholder.svg',
 'An open-air cinema experience under the stars. Curated film screening with gourmet food trucks.',
 NULL, NULL,
 '[{"id":"t-10","name":"Standard","price":1500,"currency":"BDT","description":"Entry + popcorn","remaining":100,"maxPerOrder":4},{"id":"t-11","name":"Couple","price":2500,"currency":"BDT","description":"Two seats + sharing platter","remaining":30,"maxPerOrder":2}]',
 '[{"question":"What film is being screened?","answer":"Film title will be announced 1 week before the event."}]',
 0);

-- CRM: Customers
INSERT INTO Customers (id, name, email, phone, segment, totalSpent, orderCount, lastActive, joinedAt, tags, notes) VALUES
('c1','Aya Nakamura','aya@example.com','+33 6 12 34 56 78','vip',4250,12,'2026-02-23','2024-06-15','["nova-fan","event-goer"]','Prefers limited editions.'),
('c2','Marcus Chen','marcus@example.com','+1 555 234 5678','regular',980,4,'2026-02-20','2025-01-10','["xforce-fan"]',''),
('c3','Léa Dupont','lea@example.com','+33 7 98 76 54 32','new',120,1,'2026-02-22','2026-02-01','["ltm-fan"]','Signed up via encounter event.'),
('c4','James Okafor','james@example.com','+44 7700 900123','inactive',560,3,'2025-10-05','2024-09-20','[]','Hasn''t returned in months.'),
('c5','Sofia Reyes','sofia@example.com','+34 612 345 678','vip',6100,18,'2026-02-24','2024-03-01','["nova-fan","event-goer","ambassador"]','Brand ambassador candidate.'),
('c6','Kenji Tanaka','kenji@example.com','+81 90 1234 5678','regular',740,5,'2026-02-18','2025-04-12','["xforce-fan"]','');

-- CRM: Conversations
INSERT INTO Conversations (id, customerId, customerName, status, startedAt, lastMessageAt, messages) VALUES
('conv1','c1','Aya Nakamura','resolved','2026-02-23T14:00:00Z','2026-02-23T14:12:00Z',
 '[{"id":"m1","role":"customer","content":"Hi, when does the Nova Spring drop?","timestamp":"2026-02-23T14:00:00Z"},{"id":"m2","role":"bot","content":"The Nova Spring collection launches March 15! Would you like me to notify you?","timestamp":"2026-02-23T14:00:05Z"},{"id":"m3","role":"customer","content":"Yes please!","timestamp":"2026-02-23T14:01:00Z"},{"id":"m4","role":"bot","content":"Done! You''ll receive an email on launch day. Anything else?","timestamp":"2026-02-23T14:01:03Z"},{"id":"m5","role":"customer","content":"No, thanks!","timestamp":"2026-02-23T14:12:00Z"}]'),

('conv2','c2','Marcus Chen','open','2026-02-24T09:30:00Z','2026-02-24T09:35:00Z',
 '[{"id":"m6","role":"customer","content":"I need to return my X-Force hoodie, it''s the wrong size.","timestamp":"2026-02-24T09:30:00Z"},{"id":"m7","role":"bot","content":"I''m sorry about that! Could you share your order number so I can help?","timestamp":"2026-02-24T09:30:04Z"},{"id":"m8","role":"customer","content":"Order #ORD-2026-0045","timestamp":"2026-02-24T09:32:00Z"},{"id":"m9","role":"bot","content":"I''ve found your order. Let me connect you with an agent for the return process.","timestamp":"2026-02-24T09:32:06Z"},{"id":"m10","role":"agent","content":"Hi Marcus! I''ll process your return right away. Which size do you need?","timestamp":"2026-02-24T09:35:00Z"}]'),

('conv3','c3','Léa Dupont','escalated','2026-02-22T16:00:00Z','2026-02-22T16:20:00Z',
 '[{"id":"m11","role":"customer","content":"My ticket for the LTM Paris event isn''t showing in my account.","timestamp":"2026-02-22T16:00:00Z"},{"id":"m12","role":"bot","content":"Let me check that for you. What email did you use to purchase?","timestamp":"2026-02-22T16:00:05Z"},{"id":"m13","role":"customer","content":"lea@example.com","timestamp":"2026-02-22T16:01:00Z"},{"id":"m14","role":"bot","content":"I can''t find a ticket under that email. This needs human review — escalating now.","timestamp":"2026-02-22T16:01:08Z"}]');

-- CRM: Knowledge Base Articles
INSERT INTO KBArticles (id, title, category, content, isPublished, updatedAt) VALUES
('kb1','Shipping & Delivery Information','Orders','We ship worldwide. Standard delivery takes 5-7 business days. Express delivery is available in select countries for 2-3 business days.',1,'2026-02-20'),
('kb2','Return & Exchange Policy','Orders','Items can be returned within 30 days of delivery. Items must be unworn with tags attached. Exchanges are subject to availability.',1,'2026-02-18'),
('kb3','Event Ticket Cancellation','Events','Tickets can be cancelled up to 48 hours before the event for a full refund. Within 48 hours, a 50% refund applies.',1,'2026-02-15'),
('kb4','Size Guide','Products','Our sizing follows EU standards. Please refer to the size chart on each product page for specific measurements.',1,'2026-02-10'),
('kb5','Loyalty Program (Draft)','General','Earn points with every purchase. VIP members get early access and exclusive discounts.',0,'2026-02-22');

-- CRM: Email Campaigns
INSERT INTO EmailCampaigns (id, name, subject, status, segment, scheduledAt, sentAt, recipientCount, openRate, clickRate) VALUES
('em1','Nova Spring Launch','🔥 Nova Spring is HERE','sent','nova-fan',NULL,'2026-02-15',2450,42.3,18.7),
('em2','VIP Early Access','Exclusive: Early Access for VIPs','scheduled','vip','2026-03-01',NULL,890,NULL,NULL),
('em3','Win-back Inactive Users','We miss you! Here''s 20% off','draft','inactive',NULL,NULL,340,NULL,NULL),
('em4','X-Force Drop Teaser','Something BIG is coming...','sent','xforce-fan',NULL,'2026-02-10',1800,38.1,12.4);

-- CRM: Push Notifications
INSERT INTO PushNotifications (id, title, body, status, segment, scheduledAt, sentAt, recipientCount) VALUES
('pn1','Flash Sale Live!','50% off selected items for the next 4 hours.','sent','all',NULL,'2026-02-20',5200),
('pn2','Your tickets are ready','Download your LTM Paris tickets now.','sent','event-goer',NULL,'2026-02-21',310),
('pn3','New X-Force arrivals','Check out the latest X-Force collection.','scheduled','xforce-fan','2026-03-05',NULL,1800);

-- Orders
INSERT INTO Orders (id, customerId, customerEmail, customerName, status, paymentMethod, paymentStatus, subtotal, discount, shippingCost, total, currency, promoCode, items, shippingAddress, notes, createdAt, updatedAt) VALUES
('ORD-2026-0001','c1','aya@example.com','Aya Nakamura','delivered','stripe','paid',6700,0,150,6850,'BDT',NULL,
 '[{"productId":"p-1","productName":"Eclipse Hoodie","productSlug":"nova-eclipse-hoodie","quantity":1,"price":4500,"selectedVariants":{"Size":"M","Color":"Obsidian"},"image":"/placeholder.svg"},{"productId":"p-2","productName":"Phantom Tee","productSlug":"nova-phantom-tee","quantity":1,"price":2200,"selectedVariants":{"Size":"M","Color":"Black"},"image":"/placeholder.svg"}]',
 '{"id":"a1","label":"Home","fullName":"Aya Nakamura","phone":"+33 6 12 34 56 78","line1":"12 Rue de Rivoli","city":"Paris","district":"Île-de-France","postalCode":"75001"}',
 '','2026-02-10T14:30:00Z','2026-02-15T09:00:00Z'),

('ORD-2026-0045','c2','marcus@example.com','Marcus Chen','processing','stripe','paid',3800,0,150,3950,'BDT',NULL,
 '[{"productId":"p-4","productName":"Titan Joggers","productSlug":"xforce-titan-joggers","quantity":1,"price":3800,"selectedVariants":{"Size":"L","Color":"Black"},"image":"/placeholder.svg"}]',
 '{"id":"a2","label":"Home","fullName":"Marcus Chen","phone":"+1 555 234 5678","line1":"450 Broadway","city":"New York","district":"NY","postalCode":"10013"}',
 '','2026-02-22T09:15:00Z','2026-02-22T09:15:00Z'),

('ORD-2026-0052','c5','sofia@example.com','Sofia Reyes','shipped','bkash','paid',12000,2400,0,9600,'BDT','NOVA20',
 '[{"productId":"p-11","productName":"DROP-001 Jacket","productSlug":"xforce-drop-001","quantity":1,"price":12000,"selectedVariants":{"Size":"M"},"image":"/placeholder.svg"}]',
 '{"id":"a3","label":"Home","fullName":"Sofia Reyes","phone":"+34 612 345 678","line1":"Calle Gran Vía 28","city":"Madrid","district":"Madrid","postalCode":"28013"}',
 'VIP customer — expedite shipping','2026-02-23T16:00:00Z','2026-02-24T10:30:00Z');
