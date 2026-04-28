/**
 * One Third Residence Taiwan — i18n (zh-TW / en)
 * Usage: add data-i18n="key" to any element.
 * HTML content (with tags): data-i18n-html="key"
 * Input placeholders: data-i18n-ph="key"
 */
(function () {

  /* ── English translation dictionary ───────────────────── */
  const EN = {
    // ── Navigation ──────────────────────────────────────────
    'nav.home':       'Home',
    'nav.properties': 'Properties',
    'nav.booking':    'Reservations',
    'nav.contact':    'Contact',
    'nav.faq':        'FAQ',

    // ── Shared buttons / labels ──────────────────────────────
    'btn.consult':    'Schedule a Consultation',
    'btn.free':       'Schedule a Free Consultation',
    'btn.view-all':   'View All Properties',
    'btn.contact':    'Contact Us',
    'btn.explore':    'Explore Properties',
    'btn.book':       'Book Your Stay',
    'btn.submit':     'Send Message',
    'btn.inquiry':    'Send Enquiry',
    'btn.back':       '← Back to Listings',

    // ── Status badges ────────────────────────────────────────
    'status.available':   'Available',
    'status.coming-soon': 'Coming Soon',
    'status.sold':        'Sold',

    // ── Footer ───────────────────────────────────────────────
    'footer.text':           'Premium Hakuba Village resort property — offering sales, rental management and vacation booking.',
    'footer.col.services':   'Services',
    'footer.col.about':      'About',
    'footer.col.contact':    'Contact',
    'footer.link.properties':'Properties',
    'footer.link.booking':   'Vacation Booking',
    'footer.link.rental':    'Rental Management',
    'footer.link.home':      'About Us',
    'footer.link.faq':       'FAQ',
    'footer.link.contact':   'Contact Us',

    // ── index.html ───────────────────────────────────────────
    'home.hero.eyebrow':   'Hakuba Village · Nagano, Japan',
    'home.hero.title':     'Own a Piece of <em>Hakuba Powder</em><br>From Bed to Slope in One Step',
    'home.hero.subtitle':  'Premium Japanese Resort Property · Full-Service Property Management',

    'home.svc.eyebrow':    'Our Services',
    'home.svc.title':      'From Investment to Vacation,<br>We Have You Covered',
    'home.svc.subtitle':   'One Third Residence Taiwan offers a one-stop solution for Hakuba resort properties — transparent, stress-free, and tailored for you.',
    'home.svc1.title':     'Property Sales & Brokerage',
    'home.svc1.text':      "We represent C.M. Phoenix's premier Hakuba listings, providing complete property information, legal consultation, and full purchase assistance.",
    'home.svc2.title':     'Rental Management',
    'home.svc2.text':      'After purchase, entrust us with short- or long-term rental management. Our team handles cleaning, maintenance, guest reception, and monthly revenue reporting.',
    'home.svc3.title':     'Vacation Booking',
    'home.svc3.text':      'Not ready to buy? Stay in a Hakuba villa first and experience first-hand what it feels like to step from bed directly onto fresh powder snow.',

    'home.about.eyebrow':  'About One Third Residence Taiwan',
    'home.about.title':    'Rooted in Japanese Real Estate,<br>Connecting Taiwan & Japan',
    'home.about.text1':    "One Third Residence (Taiwan) Co., Ltd is the exclusive Taiwan partner of Japan's C.M. Phoenix Group, specializing in premium Hakuba Village resort property sales and management.",
    'home.about.text2':    "Our bilingual team spans Taiwan and Japan, guiding buyers through every step — legal compliance, fund transfers, and final handover — all in your language.",
    'home.about.stat1':    'Flagship Properties',
    'home.about.stat2':    'Years of Japanese Property Expertise',
    'home.about.stat3':    'Bilingual Service',
    'home.about.btn':      'Schedule a Consultation',

    'home.feat.eyebrow':   'Featured Listings',
    'home.feat.title':     'Hakuba Village Premier Estates',
    'home.feat.subtitle':  'Each property is meticulously curated, delivering an unrivaled ski-in/ski-out lifestyle and a compelling investment case.',

    'home.why.eyebrow':    'Why Choose Us',
    'home.why.title':      'Your Trusted Partner in Japanese Real Estate',
    'home.why1.title':     'Direct Parent Group Authorization',
    'home.why1.text':      "As C.M. Phoenix's exclusive Taiwan representative, we offer first-hand access to listings and the most favourable acquisition terms.",
    'home.why2.title':     'Full Chinese-Language Service',
    'home.why2.text':      'From initial consultation to contract, banking, and handover — our bilingual team is with you at every step.',
    'home.why3.title':     'Transparent Legal & Tax Guidance',
    'home.why3.text':      'We help you understand foreign ownership rules, tax structures, and international fund transfer processes, empowering informed investment decisions.',
    'home.why4.title':     'Comprehensive Post-Purchase Management',
    'home.why4.text':      'After purchase, delegate all rental operations to us. Our local expert team handles everything so you enjoy steady rental income effortlessly.',

    'home.cta.eyebrow':    'Get In Touch',
    'home.cta.title':      'Begin Your Hakuba Property Journey',
    'home.cta.text':       'Whether you are exploring Japanese real estate for the first time or ready to invest, our experts are here to guide you.',

    // ── properties.html ──────────────────────────────────────
    'props.eyebrow':       'Hakuba Village · Nagano, Japan',
    'props.title':         'Properties',
    'props.subtitle':      "Explore C.M. Phoenix's premier ski resort estates",
    'props.filter.all':    'All',
    'props.filter.avail':  'Available',
    'props.filter.soon':   'Coming Soon',
    'props.filter.villa':  'Villa',
    'props.filter.resort': 'Resort',
    'props.cta.eyebrow':   'Interested?',
    'props.cta.title':     'Schedule a Private Viewing',
    'props.cta.text':      'We offer one-on-one consultations covering property specs, purchase process, and investment return analysis.',

    // ── property.html (detail) ───────────────────────────────
    'prop.breadcrumb.home':       'Home',
    'prop.breadcrumb.properties': 'Properties',
    'prop.spec.beds':    'Bedrooms',
    'prop.spec.baths':   'Bathrooms',
    'prop.spec.area':    'Floor Area',
    'prop.spec.floors':  'Floors',
    'prop.spec.year':    'Year Built',
    'prop.spec.loc':     'Location',
    'prop.features':     'Property Highlights',
    'prop.inq.title':    'Enquire About This Property',
    'prop.inq.name':     'Your Name *',
    'prop.inq.phone':    'Phone Number *',
    'prop.inq.email':    'Email Address',
    'prop.inq.msg':      'Message',
    'prop.inq.ph':       'Please describe your enquiry — purchase process, investment return, property specifications…',
    'prop.inq.btn':      'Send Enquiry',
    'prop.inq.reply':    'We typically respond within 1 business day',
    'prop.inq.direct':   'Direct Contact',
    'prop.related.eyebrow': 'Other Properties',
    'prop.related.title':   'You May Also Like',

    // ── booking.html ─────────────────────────────────────────
    'booking.hero.eyebrow':  'Hakuba Village · Nagano',
    'booking.hero.title':    'Hakuba <em>Reservations</em>',
    'booking.hero.subtitle': 'Book a premium ski-in/ski-out villa and discover powder paradise',
    'booking.why.eyebrow':   'Why Stay in Hakuba',
    'booking.why.title':     'From Bed to Powder Snow<br>in One Step',
    'booking.why.text':      "Our Hakuba Goryu Toomi slope-front villas put you directly on Japan's finest powder runs — no shuttle, no queue, just a few steps from the warmth of your living room to the white world beyond.",
    'booking.f1.title':      'Premium Furnishings & Amenities',
    'booking.f1.text':       'Every villa features designer furniture, premium bedding, and a fully-equipped modern kitchen — zero compromise on comfort.',
    'booking.f2.title':      'Concierge Services',
    'booking.f2.text':       'Ski equipment delivery to your door, station transfers, private chef reservations, and professional ski instructor arrangements.',
    'booking.f3.title':      'Perfect for Families & Groups',
    'booking.f3.text':       'Spacious open-plan living areas and multiple bedrooms make our villas ideal for family trips and group getaways.',
    'booking.widget.eyebrow':  'Book Now',
    'booking.widget.title':    'Select Your Dates',
    'booking.widget.subtitle': 'Complete your reservation securely through the official 1/3rd Hakuba booking system.',
    'booking.widget.fallback': 'If the embedded booking system is not loading, please',
    'booking.widget.link':     'visit the booking site directly',
    'booking.notice.eyebrow':  'Reservation Notes',
    'booking.notice.title':    'Before You Arrive',
    'booking.checkin.label':   'Check-in / Check-out',
    'booking.checkin.text':    'Check-in: from 15:00<br>Check-out: by 11:00',
    'booking.cancel.label':    'Cancellation Policy',
    'booking.cancel.text':     'Please refer to the cancellation terms shown in the booking system, which may vary by room type and date.',
    'booking.transport.label': 'Getting There',
    'booking.transport.text':  'Station transfer available on request, or self-drive. The villa is adjacent to Hakuba Goryu ski resort.',
    'booking.extras.label':    'Additional Services',
    'booking.extras.text':     'Ski equipment delivery, ski lessons, and private chef dining can be arranged after booking.',
    'booking.notice.q':        'Have questions?',

    // ── phoenix.html ─────────────────────────────────────────
    'phoenix.hero.eyebrow':    'Parent Group · Japan',
    'phoenix.hero.subtitle':   'Redefining luxury resort living in Hakuba Village',
    'phoenix.about.eyebrow':   'About C.M. Phoenix',
    'phoenix.about.title':     'Redefining<br>Hakuba Living',
    'phoenix.about.text1':     "C.M. Phoenix is a boutique resort property developer headquartered in Nagano Prefecture, Japan, specializing in the design, development, and operation of premier Hakuba Village ski resort properties.",
    'phoenix.about.text2':     'Their flagship brand "1/3rd Hakuba" is built around the philosophy: "From bed to powder snow, mere steps away" — creating an unparalleled alpine living experience for guests and owners alike.',
    'phoenix.about.text3':     "All C.M. Phoenix properties are positioned directly alongside the Hakuba Goryu Toomi ski run, letting ski enthusiasts immerse themselves in Hakuba's landscape in the most direct, luxurious way possible.",
    'phoenix.about.btn':       'Visit Official Website',
    'phoenix.brand.eyebrow':   'Brand Philosophy',
    'phoenix.brand.title':     'The 1/3rd Philosophy',
    'phoenix.brand.subtitle':  '"1/3rd" echoes a skier\'s dream: imagine spending one-third of your life on snow.',
    'phoenix.c1.title':        'Artisan Design',
    'phoenix.c1.text':         'Every property is crafted by professional interior designers, with each material and furniture choice pursuing excellence and aesthetic consistency.',
    'phoenix.c2.title':        'Prime Location',
    'phoenix.c2.text':         'All properties sit adjacent to Hakuba Goryu ski resort — steps from the slopes, letting every day begin with the most beautiful mountain views.',
    'phoenix.c3.title':        'Professional Management',
    'phoenix.c3.text':         'C.M. Phoenix provides comprehensive property management, giving owners peace of mind while delivering stable rental income and asset appreciation.',
    'phoenix.timeline.eyebrow':'Development Pipeline',
    'phoenix.timeline.title':  '1/3rd Hakuba Property Series',
    'phoenix.cta.eyebrow':     'Become an Owner',
    'phoenix.cta.title':       'Invest in Hakuba, Own a Lifestyle Asset',
    'phoenix.cta.text':        'A Hakuba property is not just a real estate investment — it is a statement of lifestyle. Let One Third Residence Taiwan help you claim your own piece of Hakuba.',
    'phoenix.cta.btn1':        'View Properties',
    'phoenix.cta.btn2':        'Book a Consultation',

    // ── contact.html ─────────────────────────────────────────
    'contact.hero.eyebrow':    'Contact Us',
    'contact.hero.title':      'Contact Us',
    'contact.hero.subtitle':   'We look forward to hearing from you — property enquiries, reservations, or anything else.',
    'contact.info.eyebrow':    'Get In Touch',
    'contact.info.title':      'Your Enquiry Is Always Welcome',
    'contact.info.text':       "Whether you have questions about Japanese property ownership or would like to learn about a Hakuba vacation, our expert team will respond promptly.",
    'contact.label.phone':     'Phone',
    'contact.label.email':     'Email',
    'contact.label.location':  'Office Locations',
    'contact.label.hours':     'Business Hours',
    'contact.label.line':      'Line / WeChat',
    'contact.hours.text':      'Mon – Fri: 09:00 – 18:00<br>Weekends & Holidays: By appointment',
    'contact.line.text':       'Follow our official Line account for the latest listings and offers.',
    'contact.form.title':      'Send a Message',
    'contact.form.subtitle':   'Fill in the form below and we will be in touch shortly.',
    'contact.form.name':       'Your Name *',
    'contact.form.phone':      'Phone Number *',
    'contact.form.email':      'Email Address',
    'contact.form.subject':    'Subject',
    'contact.form.message':    'Message *',
    'contact.form.privacy':    'I consent to One Third Residence Taiwan processing my personal data in accordance with the privacy policy.',
    'contact.subj.purchase':   'Property Purchase Enquiry',
    'contact.subj.rental':     'Rental Management',
    'contact.subj.booking':    'Vacation Booking',
    'contact.subj.phoenix':    'C.M. Phoenix Enquiry',
    'contact.subj.other':      'Other',
    'contact.taiwan':          'Taiwan:',
    'contact.japan':           'Japan:',
    'contact.taiwan.office':   'Taiwan Office:',
    'contact.japan.base':      'Japan Base: Hakuba Village, Nagano',
    'contact.reply':           'We typically respond within 1 business day',
    'contact.pending':         'To be updated',

    // ── faq.html ─────────────────────────────────────────────
    'faq.hero.eyebrow':    'Frequently Asked Questions',
    'faq.hero.title':      'FAQ',
    'faq.hero.subtitle':   "Can't find your answer? Contact our expert consultants.",
    'faq.cat.all':         'All',
    'faq.cat.purchase':    'Purchase',
    'faq.cat.rental':      'Rental',
    'faq.cat.booking':     'Booking',
    'faq.cat.legal':       'Legal & Tax',
    'faq.cta.text':        'Still have questions? Our consultants are happy to help.',
    'faq.cta.btn':         'Contact an Expert',

    'faq.q1':  'Can foreigners (Taiwanese) purchase real estate in Japan?',
    'faq.a1':  "<p>Yes. Japan's real estate market is essentially fully open to foreign nationals. Taiwanese residents can purchase property — including land and buildings — on the same terms as Japanese citizens. No long-term residency or special visa is required.</p><p>One Third Residence Taiwan will guide you through the entire process, from document preparation to legal consultation and international fund transfers.</p>",
    'faq.q2':  'What is the complete process for purchasing a Hakuba property?',
    'faq.a2':  "<p>The overall process is as follows:</p><p><strong>1. Consultation &amp; Property Selection</strong> — Confirm your target property with an advisor.</p><p><strong>2. Letter of Intent (買付証明書)</strong> — Submit a formal purchase intent.</p><p><strong>3. Fund Preparation &amp; Transfer</strong> — Arrange and remit the purchase funds.</p><p><strong>4. Sales Contract</strong> — Sign and pay the deposit (typically 10% of purchase price).</p><p><strong>5. Settlement &amp; Handover (決済)</strong> — Pay the balance and complete ownership transfer registration.</p><p><strong>6. Key Handover</strong> — Officially become the owner.</p><p>The process typically takes 1–3 months, with full bilingual support throughout.</p>",
    'faq.q3':  'What additional costs are involved in purchasing a property?',
    'faq.a3':  "<p>In addition to the purchase price, the following fees typically apply:</p><p>• <strong>Brokerage Commission</strong>: Capped by Japanese law at 3% + ¥60,000 (tax incl.).</p><p>• <strong>Registration Fees</strong>: Judicial scrivener fees and registration licence tax.</p><p>• <strong>Real Property Acquisition Tax</strong>: A one-time tax at purchase, based on the assessed value.</p><p>• <strong>Fixed Asset Tax</strong>: Annual tax based on assessed value.</p><p>• <strong>Management / Maintenance Fees</strong>: Varies by property type.</p><p>We will provide a detailed cost estimate for your specific property — please consult our advisors.</p>",
    'faq.q4':  'Is it possible to obtain a Japanese bank mortgage?',
    'faq.a4':  "<p>It is generally difficult for foreign nationals to obtain a Japanese bank mortgage. Most Japanese lenders require permanent residency or long-term resident status.</p><p>The most common approach is a full cash purchase, or financing arranged through a Taiwanese financial institution. We can help you evaluate the most appropriate funding option.</p>",
    'faq.q5':  'What does the rental management service include?',
    'faq.a5':  "<p>Our rental management service covers:</p><p>• <strong>Short-Term Rental Operations</strong>: Airbnb and platform listing management.</p><p>• <strong>Guest Reception</strong>: Check-in/check-out coordination and guest support.</p><p>• <strong>Cleaning Service</strong>: Professional cleaning and restocking after every checkout.</p><p>• <strong>Facility Maintenance</strong>: Routine repairs and scheduled upkeep.</p><p>• <strong>Revenue Settlement</strong>: Monthly income reports and remittance.</p><p>• <strong>Emergency Response</strong>: 24-hour emergency contact and resolution.</p>",
    'faq.q6':  'How is the rental management fee calculated?',
    'faq.a6':  "<p>Fees are typically a fixed percentage of rental income (commission-based). The specific rate depends on the scope of services and property conditions.</p><p>We recommend a one-on-one consultation so our advisor can provide a detailed projection based on your property.</p>",
    'faq.q7':  'Can I block dates for personal use while enrolled in rental management?',
    'faq.a7':  "<p>Absolutely. Owners can notify us in advance to block specific dates for personal use. During those periods, the property will not accept reservations.</p><p>For peak season (December–March ski season), we recommend notifying us at least 3 months in advance.</p>",
    'faq.q8':  'Which villas are currently available to book?',
    'faq.a8':  "<p>The Slopefront Villa is currently open for reservations, located directly alongside the Toomi slope at Hakuba Goryu.</p><p>Slopefront Villa 2 and 1/3rd Village are still under construction or in planning and will open for bookings upon completion. Please contact us for the latest updates.</p>",
    'faq.q9':  'When is the Hakuba ski season?',
    'faq.a9':  "<p>Hakuba Village's ski season typically runs from <strong>late December through late March</strong>, sometimes extending into early April. The best snow conditions are usually in January and February.</p><p>Hakuba also offers excellent summer activities (June–September) including hiking and mountain biking — a year-round destination.</p>",
    'faq.q10': 'How do I get to Hakuba from Taiwan?',
    'faq.a10': "<p>Recommended route:</p><p><strong>Taoyuan Airport → Nagoya / Tokyo Narita / Tokyo Haneda</strong> → Shinkansen or limited express to Nagano Station → Bus or shuttle to Hakuba Village (approx. 50 min).</p><p>The drive from Nagano Station takes about 50–60 minutes. Station transfer can be arranged during your stay.</p>",
    'faq.q11': 'What taxes must I pay as a Japanese property owner?',
    'faq.a11': "<p>Annual taxes include:</p><p>• <strong>Fixed Asset Tax</strong>: Approx. 1.4% of assessed value.</p><p>• <strong>City Planning Tax</strong>: Approx. 0.3% in applicable areas (confirm for Hakuba).</p><p>• <strong>Rental Income Tax</strong>: Non-resident rate approx. 20.42%.</p><p>• <strong>Taiwan Income Tax</strong>: Overseas income must be declared per Taiwanese tax law.</p><p>Tax situations vary — we recommend consulting a specialist and can refer you to qualified tax professionals.</p>",
    'faq.q12': 'What are the Minpaku (short-term rental) regulations in Japan?',
    'faq.a12': "<p>Japan's Minpaku New Law (2018) permits licensed short-term rentals, capped at 180 nights per year (some municipalities impose stricter limits).</p><p>Hakuba Village has relatively favourable Minpaku regulations. All C.M. Phoenix properties are properly licensed, and our management service ensures full regulatory compliance.</p>",
    'faq.q13': 'What taxes are due when I sell the property?',
    'faq.a13': "<p>Upon selling Japanese real estate:</p><p>• <strong>Capital Gains Tax (譲渡所得税)</strong>: Under 5 years (short-term) approx. 39.63%; over 5 years (long-term) approx. 20.315%.</p><p>• <strong>Taiwan Income Tax</strong>: Overseas capital gains must be declared per Taiwanese tax law.</p><p>We recommend engaging a Japanese tax accountant (税理士) for detailed calculation.</p>",

    // ── Shared unit labels (used in JS-rendered templates) ───
    'unit.beds':  'Bed',
    'unit.baths': 'Bath',
    'prop.loading': 'Loading…',
    'prop.status.available':   'Available',
    'prop.status.coming-soon': 'Coming Soon',
    'prop.status.img-soon':    'Coming Soon',
    'prop.status.img-updating':'Image Updating',
    'prop.spec.beds.label':    'Bedrooms',
    'prop.spec.baths.label':   'Bathrooms',
    'prop.spec.area.label':    'Floor Area',
    'prop.spec.floors.label':  'Floors',
    'prop.spec.year.label':    'Year Built',
    'prop.spec.loc.label':     'Location',
    'prop.features.title':     'Property Highlights',
    'prop.inq.title':          'Enquire About This Property',
    'prop.inq.name.label':     'Your Name *',
    'prop.inq.phone.label':    'Phone Number *',
    'prop.inq.email.label':    'Email Address',
    'prop.inq.msg.label':      'Message',
    'prop.inq.name.ph':        'Enter your name',
    'prop.inq.phone.ph':       'Enter your phone number',
    'prop.inq.msg.ph':         'Purchase process, investment return, property specifications…',
    'prop.inq.reply':          'We typically respond within 1 business day',
    'prop.inq.direct.title':   'Direct Contact',
    'prop.contact.btn':        'Go to Contact Page',
    'prop.related.eyebrow':    'Other Properties',
    'prop.related.title':      'You May Also Like',
    'props.no-results':        'No properties in this category yet. Check back soon.',
    'contact.form.ph.name':    'Your name',
    'contact.form.ph.msg':     'Please describe your question or needs. Our team will provide the most appropriate advice…',
    'contact.subj.select':     'Please select',
    'home.about.text1':        'One Third Residence (Taiwan) Co., Ltd is the exclusive Taiwan partner of Japan\'s C.M. Phoenix Group, specializing in premium Hakuba Village resort property sales and management.',
    'home.about.text2':        'Our bilingual team spans Taiwan and Japan, guiding buyers through every step — legal compliance, fund transfers, and final handover — all in your language.',
    'home.why1.text':          'As C.M. Phoenix\'s exclusive Taiwan representative, we offer first-hand access to listings and the most favourable acquisition terms.',
    'home.why2.text':          'From initial consultation to contract, banking, and handover — our bilingual team is with you at every step.',
    'home.why3.text':          'We help you understand foreign ownership rules, tax structures, and international fund transfer processes, empowering informed investment decisions.',
    'home.why4.text':          'After purchase, delegate all rental operations to us. Our local expert team handles everything so you enjoy steady rental income effortlessly.',
    'home.cta.text':           'Whether you are exploring Japanese real estate for the first time or ready to invest, our experts are here to guide you.',
    'booking.f1.text':         'Every villa features designer furniture, premium bedding, and a fully-equipped modern kitchen — zero compromise on comfort.',
    'booking.f2.text':         'Ski equipment delivery to your door, station transfers, private chef reservations, and professional ski instructor arrangements.',
    'booking.f3.text':         'Spacious open-plan living areas and multiple bedrooms make our villas ideal for family trips and group getaways.',
    'booking.why.text':        'Our Hakuba Goryu Toomi slope-front villas put you directly on Japan\'s finest powder runs — no shuttle, no queue, just a few steps from the warmth of your living room to the white world beyond.',
    'settings.hero.video.label': 'Hero Video URL',
    'settings.hero.video.ph':    'https://example.com/hakuba-promo.mp4',

    // ── page-hero for inner pages ─────────────────────────────
    'page.contact.eyebrow':  'Contact Us',
    'page.contact.title':    'Contact Us',
    'page.faq.eyebrow':      'Frequently Asked Questions',
    'page.faq.title':        'FAQ',
    'page.props.eyebrow':    'Hakuba Village · Nagano, Japan',
    'page.props.title':      'Properties',
  };

  /* ── Core apply function ───────────────────────────────── */
  window.i18nCurrent = localStorage.getItem('otr-lang') || 'zh';

  function applyLang(lang) {
    window.i18nCurrent = lang;
    localStorage.setItem('otr-lang', lang);
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-TW';

    // Text nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      if (!el._zhText) el._zhText = el.textContent;
      const val = lang === 'en' ? EN[el.dataset.i18n] : (el.dataset.zh || el._zhText);
      if (val !== undefined) el.textContent = val;
    });
    // HTML nodes (allow tags like <em>, <br>, <p>)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      if (!el._zhHtml) el._zhHtml = el.innerHTML;
      const val = lang === 'en' ? EN[el.dataset.i18nHtml] : (el.dataset.zh || el._zhHtml);
      if (val !== undefined) el.innerHTML = val;
    });
    // Placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      if (!el._zhPh) el._zhPh = el.placeholder;
      const val = lang === 'en' ? EN[el.dataset.i18nPh] : (el.dataset.zh || el._zhPh);
      if (val !== undefined) el.placeholder = val;
    });

    // Update lang button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.textContent = lang === 'en' ? '中文' : 'EN';
      btn.setAttribute('aria-label', lang === 'en' ? '切換至中文' : 'Switch to English');
    });

    // Fire event so other scripts can react (e.g. property card renderer)
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  /* ── Init on DOM ready ─────────────────────────────────── */
  function init() {
    const lang = window.i18nCurrent;

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.textContent = lang === 'en' ? '中文' : 'EN';
      btn.addEventListener('click', () => {
        applyLang(window.i18nCurrent === 'zh' ? 'en' : 'zh');
      });
    });

    if (lang === 'en') applyLang('en');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose helper for JS-rendered content
  window.t = function (key) {
    if (window.i18nCurrent === 'en' && EN[key]) return EN[key];
    return null; // caller uses default Chinese
  };

})();
