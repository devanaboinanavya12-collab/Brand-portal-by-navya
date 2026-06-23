    const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:5001' : '';

    function escapeHtml(str) {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function escapeForJsAttr(str) {
      if (!str) return '';
      const jsEscaped = str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
      return escapeHtml(jsEscaped);
    }
    // ═══════════════════════════════════════════
    //  DATA
    // ═══════════════════════════════════════════

    const ORGANISATIONS = [
      { id: 'Bio Factor', name: 'Bio Factor', icon: '🔬', sector: 'Technology', sectorKey: 'sector_technology', color: '#58a6ff', accent: '#1f6feb' },
      { id: 'Ferty Base', name: 'Ferty Base', icon: '🌾', sector: 'Retail & FMCG', sectorKey: 'sector_retail_fmcg', color: '#3fb950', accent: '#238636' },
      { id: 'Aqua', name: 'Aqua', icon: '💧', sector: 'Financial Services', sectorKey: 'sector_financial_services', color: '#d29922', accent: '#9e6a03' },
      { id: 'One Health Centre', name: 'One Health Centre', icon: '🏥', sector: 'Healthcare', sectorKey: 'sector_healthcare', color: '#f85149', accent: '#6e1936' },
      { id: 'Water Links', name: 'Water Links', icon: '🚰', sector: 'Education', sectorKey: 'sector_education', color: '#a371f7', accent: '#7c3aed' },
      { id: 'Beyond Organic', name: 'Beyond Organic', icon: '🥬', sector: 'Logistics & Supply', sectorKey: 'sector_logistics_supply', color: '#39d353', accent: '#1a7f37' },
    ];

    const LANGUAGES = [
      { id: 'en', name: 'English', flag: '🇬🇧', native: 'English' },
      { id: 'mr', name: 'Marathi', flag: '🇮🇳', native: 'मराठी' },
      { id: 'te', name: 'Telugu', flag: '🇮🇳', native: 'తెలుగు' },
      { id: 'hi', name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
      { id: 'ta', name: 'Tamil', flag: '🇮🇳', native: 'தமிழ்' },
      { id: 'kn', name: 'Kannada', flag: '🇮🇳', native: 'ಕನ್ನಡ' },
      { id: 'gu', name: 'Gujarati', flag: '🇮🇳', native: 'ગુજરાતી' },
    ];

    const COMMON_FOLDERS = [
      {
        name: 'Marketing', children: [
          { name: 'Flyers', children: [{ name: '2025', files: 8 }, { name: '2024 Archive', files: 12 }] },
          { name: 'Brochures', children: [{ name: 'Products', files: 5 }, { name: 'Corporate', files: 3 }] },
          { name: 'Posters', children: [{ name: 'Events', files: 4 }, { name: 'Retail POS', files: 6 }] },
          { name: 'Digital', children: [{ name: 'Social Media', files: 15 }, { name: 'Email Headers', files: 7 }] },
          { name: 'Print', children: [{ name: 'Retail', files: 9 }, { name: 'Outdoor', files: 4 }] }
        ]
      },
      {
        name: 'Campaigns', children: [
          { name: 'Seasonal', children: [{ name: 'Summer', files: 10 }, { name: 'Winter', files: 8 }, { name: 'Festive', files: 14 }] },
          { name: 'In-Store', children: [{ name: 'POS Materials', files: 22 }, { name: 'Window Displays', files: 7 }] },
          { name: 'Promotions', children: [{ name: 'Flyers', files: 16 }, { name: 'Leaflets', files: 9 }] },
          { name: 'Digital', children: [{ name: 'Social Media', files: 31 }, { name: 'Email', files: 12 }] }
        ]
      },
      {
        name: 'Corporate', children: [
          { name: 'Brand Assets', children: [{ name: 'Logos', files: 4 }, { name: 'Templates', files: 11 }] },
          { name: 'Client Comms', children: [{ name: 'Brochures', files: 9 }, { name: 'Presentations', files: 17 }] },
          { name: 'Regulatory', children: [{ name: 'Compliance Docs', files: 6 }, { name: 'Disclosures', files: 8 }] },
          { name: 'Events', children: [{ name: 'Banners', files: 5 }, { name: 'Signage', files: 3 }] }
        ]
      },
      {
        name: 'Healthcare Mktg', children: [
          { name: 'Awareness', children: [{ name: 'Posters', files: 13 }, { name: 'Leaflets', files: 18 }] },
          { name: 'Patient Info', children: [{ name: 'Brochures', files: 21 }, { name: 'Flyers', files: 9 }] },
          { name: 'Staff Comms', children: [{ name: 'Internal Posters', files: 6 }, { name: 'Newsletters', files: 4 }] },
          { name: 'Digital', children: [{ name: 'Social Media', files: 24 }, { name: 'Web Banners', files: 11 }] }
        ]
      },
      {
        name: 'Education', children: [
          { name: 'Recruitment', children: [{ name: 'Prospectus', files: 7 }, { name: 'Open Day', files: 5 }] },
          { name: 'Campus', children: [{ name: 'Posters', files: 19 }, { name: 'Banners', files: 8 }] },
          { name: 'Courses', children: [{ name: 'Leaflets', files: 27 }, { name: 'Brochures', files: 14 }] },
          { name: 'Events', children: [{ name: 'Graduation', files: 6 }, { name: 'Conferences', files: 9 }] }
        ]
      },
      {
        name: 'Logistics Mktg', children: [
          { name: 'Client Facing', children: [{ name: 'Brochures', files: 8 }, { name: 'Proposals', files: 12 }] },
          { name: 'Fleet Branding', children: [{ name: 'Vehicle Wraps', files: 5 }, { name: 'Uniforms', files: 3 }] },
          { name: 'Trade Shows', children: [{ name: 'Banners', files: 10 }, { name: 'Displays', files: 6 }] },
          { name: 'Digital', children: [{ name: 'Social Media', files: 18 }, { name: 'Email', files: 9 }] }
        ]
      }
    ];

    // Folder structures — each org has its own tree
    const ORG_FOLDERS = {
      "Bio Factor": COMMON_FOLDERS,
      "Ferty Base": COMMON_FOLDERS,
      "Aqua": COMMON_FOLDERS,
      "One Health Centre": COMMON_FOLDERS,
      "Water Links": COMMON_FOLDERS,
      "Beyond Organic": COMMON_FOLDERS
    };

    function getLeafPaths(folders, prefix = '') {
      let paths = [];
      folders.forEach(f => {
        const path = prefix ? `${prefix}/${f.name}` : f.name;
        paths.push(path);
        if (f.children) {
          paths = paths.concat(getLeafPaths(f.children, path));
        }
      });
      return paths;
    }

    const ORG_FOLDER_PATHS = {};
    for (const orgId in ORG_FOLDERS) {
      ORG_FOLDER_PATHS[orgId] = getLeafPaths(ORG_FOLDERS[orgId]);
    }

    // Brand colors — per org
    const ORG_BRAND_COLORS = {
      "Bio Factor": [{ name: 'Bio Factor Blue', hex: '#1E40AF', use: 'Primary brand' }, { name: 'Sky', hex: '#0EA5E9', use: 'Secondary' }, { name: 'Amber', hex: '#F59E0B', use: 'CTA accent' }, { name: 'Dark', hex: '#1E293B', use: 'Text' }],
      "Ferty Base": [{ name: 'Ferty Base Green', hex: '#16A34A', use: 'Primary brand' }, { name: 'Lime', hex: '#84CC16', use: 'Fresh accent' }, { name: 'Cream', hex: '#FEF9C3', use: 'Backgrounds' }, { name: 'Earth', hex: '#78350F', use: 'Contrast' }],
      "Aqua": [{ name: 'Gold', hex: '#B45309', use: 'Premium brand' }, { name: 'Navy', hex: '#1E3A5F', use: 'Trust & authority' }, { name: 'Silver', hex: '#94A3B8', use: 'Secondary' }, { name: 'White', hex: '#F8FAFC', use: 'Clean backgrounds' }],
      "One Health Centre": [{ name: 'One Health Centre Red', hex: '#DC2626', use: 'Urgency & care' }, { name: 'Calm Blue', hex: '#2563EB', use: 'Trust & medical' }, { name: 'Soft Green', hex: '#10B981', use: 'Health & wellbeing' }, { name: 'Light', hex: '#F0FDF4', use: 'Clean panels' }],
      "Water Links": [{ name: 'Water Links Purple', hex: '#7C3AED', use: 'Knowledge & creativity' }, { name: 'Teal', hex: '#0D9488', use: 'Innovation' }, { name: 'Warm Yellow', hex: '#F59E0B', use: 'Energy & youth' }, { name: 'Charcoal', hex: '#1F2937', use: 'Readable text' }],
      "Beyond Organic": [{ name: 'Beyond Organic Teal', hex: '#0F766E', use: 'Primary brand' }, { name: 'Orange', hex: '#EA580C', use: 'Energy & speed' }, { name: 'Steel', hex: '#475569', use: 'Industrial' }, { name: 'White', hex: '#F8FAFC', use: 'Clean layouts' }],
    };

    // UI translations for 4 languages
    const T = {
      en: {
        dashboard: 'Dashboard', materials: 'Materials Library', approvals: 'Approvals', upload: 'Upload Material',
        users: 'User Access', brand: 'Brand Guidelines', activity: 'Activity Log',
        folders: 'Folders', admin: 'Admin', welcome: 'Welcome back', overview: 'marketing materials overview',
        pending: 'Pending approval', approved: 'Approved', revision: 'Needs Revision', total: 'Total materials',
        designed_by: 'Designed by', uploaded: 'Uploaded', status: 'Status', campaign: 'Campaign',
        approve: 'Approve', request_revision: 'Request Revision', close: 'Close', submit: 'Submit for Approval',
        all_types: 'All Types', search_placeholder: 'Search by name, designer, type…',
        recent_materials: 'Recent Materials',
        material_name_1: 'Summer Sale Flyer', material_name_2: 'Q3 Product Brochure', material_name_3: 'Event Announcement Poster', material_name_4: 'Retail POS Banner', material_name_5: 'Social Media Bundle', material_name_6: 'Leaflet — New Services',
        admin_section: 'Admin',
        folder_label: 'Folder', lang_name: 'English',
        login_error_password: 'Please enter your password.', login_error_invalid: 'Invalid username or password.',
        login_subtitle: 'Sign in to continue to your portal', login_user: 'User', login_password: 'Password', login_button: 'Sign in',
        signed_in_as: 'Signed in as {user}', switched_to: 'Switched to {org}', viewing_as: 'Viewing as: {user}', logged_out: 'You have been logged out', language_changed: 'Language changed to {lang}',
        switch_user_view: 'Switch User View', logout: 'Logout',
        selected: 'selected', file_ready_submit: 'File ready — fill in details and submit', enter_material_name: 'Please enter a material name', running_precheck: '🤖 Running AI brand pre-check for {org}…', precheck_complete: '✅ Pre-check complete — Score 81/100', sent_to_approvers: '"{name}" sent to approvers at {org} 📨',
        edit_access_button: 'Edit Access', access_saved: 'Access permissions saved', save_changes: 'Save Changes', configure_access_for: 'Configure folder access for this user within {org}.', comment_added: 'Comment added',
        version_compare_info: 'Version compare — full build feature', material_fully_approved: '"{material}" fully approved! 🎉', revision_requested: 'Revision requested on "{material}"', approval_recorded: 'Approval recorded ✅', revision_request_sent: 'Revision request sent ⚠️',
        "org_Bio Factor": 'Bio Factor', "org_Ferty Base": 'Ferty Base', "org_Aqua": 'Aqua', "org_One Health Centre": 'One Health Centre', "org_Water Links": 'Water Links', "org_Beyond Organic": 'Beyond Organic',
        user_admin: 'Admin', user_ceo: 'CEO', user_coo: 'COO', user_director: 'Director',
        role_admin: 'Admin', role_ceo: 'CEO', role_coo: 'COO', role_director: 'Director', role_user: 'User',
        perm_upload: 'Upload', perm_approve: 'Approve', perm_delete: 'Delete', perm_manage_users: 'Manage Users', perm_all_folders: 'All Folders', perm_view_all: 'View All', perm_final_approve: 'Final Approve', perm_manage_campaigns: 'Manage Campaigns', perm_assigned_folders: 'Assigned Folders', perm_view_brand_guide: 'View Brand Guide',
        sector_technology: 'Technology', sector_retail_fmcg: 'Retail & FMCG', sector_financial_services: 'Financial Services', sector_healthcare: 'Healthcare', sector_education: 'Education', sector_logistics_supply: 'Logistics & Supply',
        select_org_subtitle: 'Select your organisation to continue', select_lang_subtitle: 'Select working language',
        continue_to_language: 'Continue to Language →', back: '← Back', enter_portal: 'Enter Portal →', selection_flow_path: 'Organisation → Language → Portal',
        switch_org: 'Switch Organisation', switch_lang: 'Switch Language', upload_new: '+ Upload New',
        material_name: 'Material Name', type: 'Type', campaign_project: 'Campaign / Project', designer_notes: 'Designer Notes',
        folder_location: 'Folder Location', upload_title: 'Upload New Material', upload_description: 'Submit a design for review — AI pre-check runs automatically',
        click_to_select: 'Click to select a file', file_types_hint: 'PDF, PNG, JPG, AI, PSD — up to 50MB',
        precheck_title: '🤖 AI Pre-check', precheck_description: 'Your design will be automatically checked against brand guidelines before reaching approvers.', precheck_color_compliance: '✅ Color palette compliance', precheck_logo_placement: '✅ Logo placement & safe zone', precheck_typography_consistency: '✅ Typography consistency', precheck_previous_approved: '✅ Comparison with previous approved designs', precheck_score: '✅ Brand guidelines score (0–100)',
        workflow_title: '📋 Workflow', workflow_step1: 'Upload + AI pre-check', workflow_step2: 'CEO, COO & Director notified', workflow_step3: 'Each approver: Approve / Revision', workflow_step4: 'All approve → Published to library',
        filter_flyers: '🖼 Flyers', filter_brochures: '📄 Brochures', filter_leaflets: '📃 Leaflets', filter_posters: '🪧 Posters', filter_banners: '🏳 Banners', filter_approved: '✅ Approved',
        type_flyer: 'Flyer', type_brochure: 'Brochure', type_leaflet: 'Leaflet', type_poster: 'Poster', type_banner: 'Banner', type_social: 'Social Media Graphic',
        no_materials_stage: 'No materials in this stage', user_access: 'User Access Control', folder_access_matrix: 'Folder Access Matrix',
        brand_guidelines: 'Brand Guidelines', color_palette: '🎨 Color Palette', typography: '🔤 Typography', logo_rules: '📐 Logo Rules', imagery: '🖼 Imagery',
        brand_typography_display: 'DISPLAY', brand_typography_body: 'BODY', brand_typography_caption: 'CAPTION', brand_typography_display_font: '{org} Display Font', brand_typography_body_example: 'Inter Regular — 16px, 1.6 line height', brand_typography_caption_example: 'Inter Light — 12px, tracking +0.3',
        brand_logo_clearspace: '✅ Minimum clearspace: 2× logo height on all sides', brand_logo_minimum_size: '✅ Minimum size: 80px digital / 20mm print', brand_logo_approved_bg: '✅ Approved bg: White, Brand Primary, Brand Dark', brand_logo_no_stretch: '❌ Do not stretch, rotate, or recolor', brand_logo_no_busy_bg: '❌ Do not place on busy photographic backgrounds',
        brand_imagery_quality: '✅ High-quality licensed photography only', brand_imagery_values: '✅ Reflect brand values: modern, inclusive, professional', brand_imagery_color_grade: '✅ Color-grade to align with brand palette', brand_imagery_avoid_cliched: '❌ Avoid clichéd stock imagery', brand_imagery_no_watermark: '❌ No watermarked or low-resolution images',
        activity_log: 'Activity Log', view: 'View', view_only: 'View only', flagged: 'Flagged', metadata: 'METADATA', approval_status: 'APPROVAL STATUS', brand_score: 'Brand Score', version_history: 'VERSION HISTORY', comments: 'COMMENTS', add_comment_placeholder: 'Add a comment…', post: 'Post', category: 'Category', notes: 'Notes', priority: 'Priority', priority_high: 'High — Must fix before approval', priority_medium: 'Medium — Should fix', priority_low: 'Low — Minor suggestion', compare: 'Compare', access_full: 'Full Access', access_view: 'View Only', access_none: 'No Access',
        activity_uploaded: '{actor} uploaded "{material}"', activity_uploaded_version: '{actor} uploaded "{material} {version}"', activity_approved: '{actor} approved "{material}"', activity_revision: '{actor} requested revision on "{material}" — {reason}', activity_system_flagged: 'System: AI pre-check flagged {count} issues (score: {score}/100)', activity_access_granted: '{actor} granted {subject} upload access to {folder}',
        reason_brand_color_issue: 'Brand color issue', reason_logo_incorrect: 'Logo incorrect',
        folder_marketing: 'Marketing', folder_flyers: 'Flyers', folder_2025: '2025', folder_2024_archive: '2024 Archive', folder_brochures: 'Brochures', folder_products: 'Products', folder_corporate: 'Corporate', folder_posters: 'Posters', folder_events: 'Events', folder_retail_pos: 'Retail POS', folder_digital: 'Digital', folder_social_media: 'Social Media', folder_email_headers: 'Email Headers', folder_print: 'Print', folder_retail: 'Retail', folder_outdoor: 'Outdoor', folder_campaigns: 'Campaigns', folder_seasonal: 'Seasonal', folder_summer: 'Summer', folder_winter: 'Winter', folder_festive: 'Festive', folder_in_store: 'In-Store', folder_pos_materials: 'POS Materials', folder_window_displays: 'Window Displays', folder_promotions: 'Promotions', folder_leaflets: 'Leaflets', folder_email: 'Email', folder_brand_assets: 'Brand Assets', folder_logos: 'Logos', folder_templates: 'Templates', folder_client_comms: 'Client Comms', folder_presentations: 'Presentations', folder_regulatory: 'Regulatory', folder_compliance_docs: 'Compliance Docs', folder_disclosures: 'Disclosures', folder_banners: 'Banners', folder_signage: 'Signage', folder_healthcare_mktg: 'Healthcare Mktg', folder_awareness: 'Awareness', folder_patient_info: 'Patient Info', folder_staff_comms: 'Staff Comms', folder_internal_posters: 'Internal Posters', folder_newsletters: 'Newsletters', folder_web_banners: 'Web Banners', folder_education: 'Education', folder_recruitment: 'Recruitment', folder_prospectus: 'Prospectus', folder_open_day: 'Open Day', folder_campus: 'Campus', folder_courses: 'Courses', folder_graduation: 'Graduation', folder_conferences: 'Conferences', folder_logistics_mktg: 'Logistics Mktg', folder_client_facing: 'Client Facing', folder_proposals: 'Proposals', folder_fleet_branding: 'Fleet Branding', folder_vehicle_wraps: 'Vehicle Wraps', folder_uniforms: 'Uniforms', folder_trade_shows: 'Trade Shows', folder_displays: 'Displays', notifications_title: 'Notifications — {org}', notif_sale_await: 'Summer Sale Flyer awaiting your approval', notif_q3_submitted: 'Q3 Product Brochure submitted for review', notif_event_flagged: 'Event Poster flagged for revision', notif_retail_approved: 'Retail POS Banner approved by all reviewers', access_full_short: '✅ Full', access_view_short: '👁 View', access_none_short: '— None',
        awaiting: 'Awaiting', ai_brand_compliance: 'AI Brand Compliance', send_revision_request: 'Send Revision Request',
        revision_describe_text: 'Describe the changes needed. The designer will be notified immediately.', revision_describe_placeholder: 'Describe what needs to change…',
        cat_brand_color: 'Brand Color Issue', cat_logo_violation: 'Logo Usage Violation', cat_typography: 'Typography Problem', cat_messaging: 'Messaging / Copy Error', cat_layout: 'Layout Issue', cat_image_quality: 'Image Quality', cat_other: 'Other',
        comment_revision_text: 'Logo placement looks stretched — use the approved master file from the brand kit.', comment_approved_text: 'Looks good. Brand colors are spot on.',
        version_initial_upload: 'Initial upload', version_revised_cta: 'Revised CTA color', version_final: 'Final', version_initial: 'Initial',
        ai_m1_1: '✅ Color palette matches brand primary colors', ai_m1_2: '✅ Logo placement correct', ai_m1_3: '⚠️ CTA font size could be larger', ai_m1_4: '✅ Image quality meets print standards', ai_m1_5: '⚠️ Tagline slightly deviates from messaging guide',
        ai_m2_1: '✅ All brand colors correct', ai_m2_2: '✅ Typography matches brand guide', ai_m2_3: '✅ Logo clearspace correct', ai_m2_4: '✅ Imagery style aligned',
        ai_m3_1: '❌ Secondary color not in brand palette', ai_m3_2: '❌ Logo stretched — violates usage rules', ai_m3_3: '⚠️ Body copy too small for print', ai_m3_4: '⚠️ Contrast ratio fails WCAG AA',
        ai_m4_1: '✅ Excellent brand compliance', ai_m4_2: '✅ All checks passed',
        ai_m5_1: '✅ Platform dimensions correct', ai_m5_2: '✅ Brand colors applied', ai_m5_3: '⚠️ Minor logo clearspace on IG version',
        ai_m6_1: '✅ Brand colors correct', ai_m6_2: '⚠️ One image below 300dpi', ai_m6_3: '✅ Typography rules followed',
        ai_new_color_ok: '✅ Color palette matches brand guidelines', ai_new_logo_ok: '✅ Logo placement within approved guidelines', ai_new_typography_ok: '✅ Typography consistent with brand guide', ai_new_imagery_ok: '✅ Imagery meets brand standards', ai_new_score_note: '⚠️ Score above threshold — ready for review',
        ai_new_color_warn: '⚠️ Minor color variations detected', ai_new_clearspace_warn: '⚠️ Logo clearspace slightly below minimum', ai_new_font_warn: '⚠️ Font size may need adjustment'
      },
      mr: {
        dashboard: 'डॅशबोर्ड', materials: 'साहित्य ग्रंथालय', approvals: 'मंजुरी', upload: 'साहित्य अपलोड करा',
        users: 'वापरकर्ता प्रवेश', brand: 'ब्रँड मार्गदर्शक', activity: 'क्रियाकलाप नोंद',
        folders: 'फोल्डर', admin: 'प्रशासन', welcome: 'पुन्हा स्वागत', overview: 'विपणन साहित्य आढावा',
        pending: 'मंजुरीच्या प्रतीक्षेत', approved: 'मंजूर', revision: 'सुधारणा आवश्यक', total: 'एकूण साहित्य',
        designed_by: 'रचनाकार', uploaded: 'अपलोड केले', status: 'स्थिती', campaign: 'मोहीम',
        approve: 'मंजूर करा', request_revision: 'सुधारणा विनंती', close: 'बंद करा', submit: 'मंजुरीसाठी सादर करा',
        all_types: 'सर्व प्रकार', search_placeholder: 'नाव, रचनाकार, प्रकाराने शोधा…',
        recent_materials: 'अलीकडील साहित्य',
        material_name_1: 'उन्हाळी विक्री फ्लायर', material_name_2: 'Q3 उत्पादन ब्रोशर', material_name_3: 'कार्यक्रम घोषणा पोस्टर', material_name_4: 'किरकोळ POS बॅनर', material_name_5: 'सोशल मीडिया बंडल', material_name_6: 'लीफलेट — नवीन सेवा',
        admin_section: 'प्रशासन',
        folder_label: 'फोल्डर', lang_name: 'मराठी',
        login_error_password: 'कृपया आपला पासवर्ड प्रविष्ट करा.', login_error_invalid: 'अवैध वापरकर्तानाव किंवा पासवर्ड.',
        login_subtitle: 'आपल्या पोर्टलसाठी साइन इन करा', login_user: 'वापरकर्ता', login_password: 'पासवर्ड', login_button: 'साइन इन करा',
        signed_in_as: '{user} म्हणून साइन इन केले', switched_to: '{org} वर बदलले', viewing_as: 'पाहत आहात: {user}', logged_out: 'आपण लॉग आउट झालात', language_changed: 'भाषा बदलली: {lang}',
        switch_user_view: 'वापरकर्ता दृश्य बदला', logout: 'लॉग आउट',
        selected: 'निवडले', file_ready_submit: 'फाइल तयार आहे — तपशील भरा आणि सादर करा', enter_material_name: 'कृपया साहित्याचे नाव प्रविष्ट करा', running_precheck: '🤖 {org} साठी AI ब्रँड पूर्व-तपासणी चालू आहे…', precheck_complete: '✅ पूर्व-तपासणी पूर्ण — गुण 81/100', sent_to_approvers: '"{name}" {org} येथील मंजूरकर्त्यांना पाठवले 📨',
        edit_access_button: 'प्रवेश संपादित करा', access_saved: 'प्रवेश परवानग्या जतन केल्या', save_changes: 'बदल जतन करा', configure_access_for: 'या वापरकर्त्यासाठी {org} मध्ये फोल्डर प्रवेश सेट करा.', comment_added: 'टिप्पणी जोडली',
        version_compare_info: 'आवृत्ती तुलना — पूर्ण बांधणी वैशिष्ट्य', material_fully_approved: '"{material}" पूर्णपणे मंजूर! 🎉', revision_requested: '"{material}" वर सुधारणा विनंती केली', approval_recorded: 'मंजुरी नोंदवली ✅', revision_request_sent: 'सुधारणा विनंती पाठवली ⚠️',
        "org_Bio Factor": 'Bio Factor', "org_Ferty Base": 'Ferty Base', "org_Aqua": 'Aqua', "org_One Health Centre": 'One Health Centre', "org_Water Links": 'Water Links', "org_Beyond Organic": 'Beyond Organic',
        user_admin: 'अॅलेक्स', user_ceo: 'कॅरोल', user_coo: 'ओमर', user_director: 'डायना',
        role_admin: 'प्रशासक', role_ceo: 'CEO', role_coo: 'COO', role_director: 'संचालक', role_user: 'वापरकर्ता',
        perm_upload: 'अपलोड', perm_approve: 'मंजूर करा', perm_delete: 'हटवा', perm_manage_users: 'वापरकर्ते व्यवस्थापित करा', perm_all_folders: 'सर्व फोल्डर', perm_view_all: 'सर्व पहा', perm_final_approve: 'अंतिम मंजुरी', perm_manage_campaigns: 'मोहिमा व्यवस्थापित करा', perm_assigned_folders: 'नियुक्त फोल्डर', perm_view_brand_guide: 'ब्रँड गाइड पहा',
        sector_technology: 'तंत्रज्ञान', sector_retail_fmcg: 'किरकोळ आणि FMCG', sector_financial_services: 'वित्तीय सेवा', sector_healthcare: 'आरोग्य सेवा', sector_education: 'शिक्षण', sector_logistics_supply: 'लॉजिस्टिक्स आणि पुरवठा',
        select_org_subtitle: 'सुरू ठेवण्यासाठी आपली संस्था निवडा', select_lang_subtitle: 'कार्य भाषा निवडा',
        continue_to_language: 'भाषेकडे सुरू ठेवा →', back: '← मागे', enter_portal: 'पोर्टलमध्ये प्रवेश करा →', selection_flow_path: 'संस्था → भाषा → पोर्टल',
        switch_org: 'संस्था बदला', switch_lang: 'भाषा बदला', upload_new: '+ नवीन अपलोड करा',
        material_name: 'साहित्य नाव', type: 'प्रकार', campaign_project: 'मोहीम / प्रकल्प', designer_notes: 'रचनाकाराच्या नोंदी',
        folder_location: 'फोल्डर स्थान', upload_title: 'नवीन साहित्य अपलोड करा', upload_description: 'पुनरावलोकनासाठी डिझाइन सादर करा — AI पूर्व-तपासणी आपोआप चालते',
        click_to_select: 'फाइल निवडण्यासाठी क्लिक करा', file_types_hint: 'PDF, PNG, JPG, AI, PSD — 50MB पर्यंत',
        precheck_title: '🤖 AI पूर्व-तपासणी', precheck_description: 'आपले डिझाइन मंजूरकर्त्यांपर्यंत पोहोचण्यापूर्वी आपोआप ब्रँड मार्गदर्शकांविरुद्ध तपासले जाईल.', precheck_color_compliance: '✅ रंग पॅलेट अनुपालन', precheck_logo_placement: '✅ लोगो प्लेसमेंट आणि सुरक्षित क्षेत्र', precheck_typography_consistency: '✅ टायपोग्राफी सातत्य', precheck_previous_approved: '✅ पूर्वी मंजूर केलेल्या डिझाइनशी तुलना', precheck_score: '✅ ब्रँड मार्गदर्शक गुण (0–100)',
        workflow_title: '📋 कार्यप्रवाह', workflow_step1: 'अपलोड + AI पूर्व-तपासणी', workflow_step2: 'CEO, COO आणि संचालकांना सूचित केले', workflow_step3: 'प्रत्येक मंजूरकर्ता: मंजूर / सुधारणा', workflow_step4: 'सर्वांनी मंजूर केले → ग्रंथालयात प्रकाशित',
        filter_flyers: '🖼 फ्लायर', filter_brochures: '📄 ब्रोशर', filter_leaflets: '📃 लीफलेट', filter_posters: '🪧 पोस्टर', filter_banners: '🏳 बॅनर', filter_approved: '✅ मंजूर',
        type_flyer: 'फ्लायर', type_brochure: 'ब्रोशर', type_leaflet: 'लीफलेट', type_poster: 'पोस्टर', type_banner: 'बॅनर', type_social: 'सोशल मीडिया ग्राफिक',
        no_materials_stage: 'या टप्प्यात कोणतेही साहित्य नाही', user_access: 'वापरकर्ता प्रवेश नियंत्रण', folder_access_matrix: 'फोल्डर प्रवेश मॅट्रिक्स',
        brand_guidelines: 'ब्रँड मार्गदर्शक', color_palette: '🎨 रंग पॅलेट', typography: '🔤 टायपोग्राफी', logo_rules: '📐 लोगो नियम', imagery: '🖼 प्रतिमा',
        brand_typography_display: 'DISPLAY', brand_typography_body: 'BODY', brand_typography_caption: 'CAPTION', brand_typography_display_font: '{org} डिस्प्ले फॉन्ट', brand_typography_body_example: 'Inter Regular — 16px, 1.6 ओळ उंची', brand_typography_caption_example: 'Inter Light — 12px, ट्रॅकिंग +0.3',
        brand_logo_clearspace: '✅ किमान क्लियरस्पेस: सर्व बाजूंनी 2× लोगो उंची', brand_logo_minimum_size: '✅ किमान आकार: 80px डिजिटल / 20mm प्रिंट', brand_logo_approved_bg: '✅ मंजूर पार्श्वभूमी: पांढरा, ब्रँड प्राथमिक, ब्रँड गडद', brand_logo_no_stretch: '❌ ताणू नका, फिरवू नका किंवा पुन्हा रंगवू नका', brand_logo_no_busy_bg: '❌ व्यस्त छायाचित्र पार्श्वभूमीवर ठेवू नका',
        brand_imagery_quality: '✅ केवळ उच्च दर्जाचे परवानाकृत छायाचित्रण', brand_imagery_values: '✅ ब्रँड मूल्ये दर्शवते: आधुनिक, सर्वसमावेशक, व्यावसायिक', brand_imagery_color_grade: '✅ ब्रँड पॅलेटशी जुळणारे रंग-ग्रेड', brand_imagery_avoid_cliched: '❌ क्लिशे स्टॉक प्रतिमा टाळा', brand_imagery_no_watermark: '❌ वॉटरमार्क केलेल्या किंवा कमी-रिझोल्यूशन प्रतिमा नाहीत',
        activity_log: 'क्रियाकलाप नोंद', view: 'पहा', view_only: 'केवळ पहा', flagged: 'फ्लॅग केले', metadata: 'मेटाडेटा', approval_status: 'मंजुरी स्थिती', brand_score: 'ब्रँड गुण', version_history: 'आवृत्ती इतिहास', comments: 'टिप्पण्या', add_comment_placeholder: 'टिप्पणी जोडा…', post: 'पोस्ट', category: 'श्रेणी', notes: 'नोंदी', priority: 'प्राधान्य', priority_high: 'उच्च — मंजुरीपूर्वी दुरुस्त करणे आवश्यक', priority_medium: 'मध्यम — दुरुस्त करणे आवश्यक', priority_low: 'कमी — किरकोळ सूचना', compare: 'तुलना करा', access_full: 'पूर्ण प्रवेश', access_view: 'केवळ पहा', access_none: 'प्रवेश नाही',
        activity_uploaded: '{actor} ने "{material}" अपलोड केले', activity_uploaded_version: '{actor} ने "{material} {version}" अपलोड केले', activity_approved: '{actor} ने "{material}" मंजूर केले', activity_revision: '{actor} ने "{material}" वर सुधारणा विनंती केली — {reason}', activity_system_flagged: 'सिस्टम: AI पूर्व-तपासणीने {count} समस्या फ्लॅग केल्या (गुण: {score}/100)', activity_access_granted: '{actor} ने {subject} ला {folder} वर अपलोड प्रवेश दिला',
        reason_brand_color_issue: 'ब्रँड रंग समस्या', reason_logo_incorrect: 'लोगो चुकीचा आहे',
        folder_marketing: 'विपणन', folder_flyers: 'फ्लायर', folder_2025: '2025', folder_2024_archive: '2024 संग्रह', folder_brochures: 'ब्रोशर', folder_products: 'उत्पादने', folder_corporate: 'कॉर्पोरेट', folder_posters: 'पोस्टर', folder_events: 'कार्यक्रम', folder_retail_pos: 'किरकोळ POS', folder_digital: 'डिजिटल', folder_social_media: 'सोशल मीडिया', folder_email_headers: 'ईमेल हेडर', folder_print: 'प्रिंट', folder_retail: 'किरकोळ', folder_outdoor: 'आउटडोर', folder_campaigns: 'मोहिमा', folder_seasonal: 'हंगामी', folder_summer: 'उन्हाळा', folder_winter: 'हिवाळा', folder_festive: 'उत्सवी', folder_in_store: 'इन-स्टोर', folder_pos_materials: 'POS साहित्य', folder_window_displays: 'विंडो डिस्प्ले', folder_promotions: 'जाहिराती', folder_leaflets: 'लीफलेट', folder_email: 'ईमेल', folder_brand_assets: 'ब्रँड मालमत्ता', folder_logos: 'लोगो', folder_templates: 'टेम्पलेट', folder_client_comms: 'क्लायंट संवाद', folder_presentations: 'सादरीकरण', folder_regulatory: 'नियामक', folder_compliance_docs: 'अनुपालन दस्तऐवज', folder_disclosures: 'प्रकटीकरण', folder_banners: 'बॅनर', folder_signage: 'साइनेज', folder_healthcare_mktg: 'आरोग्य विपणन', folder_awareness: 'जागरूकता', folder_patient_info: 'रुग्ण माहिती', folder_staff_comms: 'कर्मचारी संवाद', folder_internal_posters: 'अंतर्गत पोस्टर', folder_newsletters: 'वृत्तपत्र', folder_web_banners: 'वेब बॅनर', folder_education: 'शिक्षण', folder_recruitment: 'भरती', folder_prospectus: 'प्रॉस्पेक्टस', folder_open_day: 'खुला दिवस', folder_campus: 'कॅम्पस', folder_courses: 'अभ्यासक्रम', folder_graduation: 'पदवीदान', folder_conferences: 'परिषदा', folder_logistics_mktg: 'लॉजिस्टिक्स विपणन', folder_client_facing: 'क्लायंट-फेसिंग', folder_proposals: 'प्रस्ताव', folder_fleet_branding: 'फ्लीट ब्रँडिंग', folder_vehicle_wraps: 'वाहन रॅप', folder_uniforms: 'गणवेश', folder_trade_shows: 'व्यापार प्रदर्शनी', folder_displays: 'डिस्प्ले', notifications_title: 'सूचना — {org}', notif_sale_await: 'उन्हाळी विक्री फ्लायर आपल्या मंजुरीच्या प्रतीक्षेत', notif_q3_submitted: 'Q3 उत्पादन ब्रोशर पुनरावलोकनासाठी सादर केले', notif_event_flagged: 'कार्यक्रम पोस्टर सुधारणेसाठी फ्लॅग केले', notif_retail_approved: 'किरकोळ POS बॅनर सर्व पुनरावलोकनकर्त्यांनी मंजूर केले', access_full_short: '✅ पूर्ण', access_view_short: '👁 पहा', access_none_short: '— काहीही नाही',
        awaiting: 'प्रतीक्षेत', ai_brand_compliance: 'AI ब्रँड अनुपालन', send_revision_request: 'सुधारणा विनंती पाठवा',
        revision_describe_text: 'आवश्यक बदल वर्णन करा. रचनाकाराला त्वरित सूचित केले जाईल.', revision_describe_placeholder: 'काय बदलणे आवश्यक आहे ते वर्णन करा…',
        cat_brand_color: 'ब्रँड रंग समस्या', cat_logo_violation: 'लोगो वापर उल्लंघन', cat_typography: 'टायपोग्राफी समस्या', cat_messaging: 'संदेश / मजकूर त्रुटी', cat_layout: 'लेआउट समस्या', cat_image_quality: 'प्रतिमा गुणवत्ता', cat_other: 'इतर',
        comment_revision_text: 'लोगो प्लेसमेंट ताणलेले दिसते — ब्रँड किटमधील मंजूर मास्टर फाइल वापरा.', comment_approved_text: 'छान दिसते. ब्रँड रंग बरोबर आहेत.',
        version_initial_upload: 'प्रारंभिक अपलोड', version_revised_cta: 'CTA रंग सुधारित', version_final: 'अंतिम', version_initial: 'प्रारंभिक',
        ai_m1_1: '✅ रंग पॅलेट ब्रँड प्राथमिक रंगांशी जुळते', ai_m1_2: '✅ लोगो प्लेसमेंट बरोबर', ai_m1_3: '⚠️ CTA फॉन्ट आकार मोठा असू शकतो', ai_m1_4: '✅ प्रतिमा गुणवत्ता प्रिंट मानकांची पूर्तता करते', ai_m1_5: '⚠️ टॅगलाइन संदेश मार्गदर्शकापासून थोडी विचलित आहे',
        ai_m2_1: '✅ सर्व ब्रँड रंग बरोबर', ai_m2_2: '✅ टायपोग्राफी ब्रँड गाइडशी जुळते', ai_m2_3: '✅ लोगो क्लियरस्पेस बरोबर', ai_m2_4: '✅ प्रतिमा शैली संरेखित',
        ai_m3_1: '❌ दुय्यम रंग ब्रँड पॅलेटमध्ये नाही', ai_m3_2: '❌ लोगो ताणलेले — वापर नियम उल्लंघन', ai_m3_3: '⚠️ मुख्य मजकूर प्रिंटसाठी खूप लहान', ai_m3_4: '⚠️ कॉन्ट्रास्ट गुणोत्तर WCAG AA अयशस्वी',
        ai_m4_1: '✅ उत्कृष्ट ब्रँड अनुपालन', ai_m4_2: '✅ सर्व तपासण्या उत्तीर्ण',
        ai_m5_1: '✅ प्लॅटफॉर्म आयाम बरोबर', ai_m5_2: '✅ ब्रँड रंग लागू', ai_m5_3: '⚠️ IG आवृत्तीवर किरकोळ लोगो क्लियरस्पेस',
        ai_m6_1: '✅ ब्रँड रंग बरोबर', ai_m6_2: '⚠️ एक प्रतिमा 300dpi खाली', ai_m6_3: '✅ टायपोग्राफी नियमांचे पालन',
        ai_new_color_ok: '✅ रंग पॅलेट ब्रँड मार्गदर्शकाशी जुळतो', ai_new_logo_ok: '✅ लोगो प्लेसमेंट मंजूर मार्गदर्शकांमध्ये आहे', ai_new_typography_ok: '✅ टायपोग्राफी ब्रँड गाइडशी सुसंगत', ai_new_imagery_ok: '✅ प्रतिमा ब्रँड मानकांची पूर्तता करते', ai_new_score_note: '⚠️ गुण उंबरठ्याच्या वर — पुनरावलोकनासाठी तयार',
        ai_new_color_warn: '⚠️ किरकोळ रंग बदल आढळले', ai_new_clearspace_warn: '⚠️ लोगो क्लियरस्पेस किमानपेक्षा किंचित कमी', ai_new_font_warn: '⚠️ फॉन्ट आकार समायोजन आवश्यक असू शकतो'
      },
      te: {
        dashboard: 'డాష్‌బోర్డ్', materials: 'మెటీరియల్స్ లైబ్రరీ', approvals: 'ఆమోదాలు', upload: 'మెటీరియల్ అప్‌లోడ్ చేయండి',
        users: 'వినియోగదారు యాక్సెస్', brand: 'బ్రాండ్ మార్గదర్శకాలు', activity: 'కార్యకలాప లాగ్',
        folders: 'ఫోల్డర్లు', admin: 'అడ్మిన్', welcome: 'తిరిగి స్వాగతం', overview: 'మార్కెటింగ్ మెటీరియల్స్ అవలోకనం',
        pending: 'ఆమోదం పెండింగ్‌లో ఉంది', approved: 'ఆమోదించారు', revision: 'సవరణ అవసరం', total: 'మొత్తం మెటీరియల్స్',
        designed_by: 'రూపొందించినది', uploaded: 'అప్‌లోడ్ చేశారు', status: 'స్థితి', campaign: 'ప్రచారం',
        approve: 'ఆమోదించండి', request_revision: 'సవరణ అభ్యర్థన', close: 'మూసివేయండి', submit: 'ఆమోదానికి సమర్పించండి',
        all_types: 'అన్ని రకాలు', search_placeholder: 'పేరు, డిజైనర్, రకం ద్వారా శోధించండి…',
        recent_materials: 'ఇటీవలి మెటీరియల్స్',
        material_name_1: 'సమ్మర్ సేల్ ఫ్లయర్', material_name_2: 'Q3 ఉత్పత్తి బ్రోచర్', material_name_3: 'ఈవెంట్ అనౌన్స్‌మెంట్ పోస్టర్', material_name_4: 'రిటైల్ POS బ్యానర్', material_name_5: 'సోషల్ మీడియా బండిల్', material_name_6: 'లీఫ్లెట్ — కొత్త సేవలు',
        admin_section: 'అడ్మిన్',
        folder_label: 'ఫోల్డర్', lang_name: 'తెలుగు',
        login_error_password: 'దయచేసి మీ పాస్‌వర్డ్ నమోదు చేయండి.', login_error_invalid: 'చెల్లని వినియోగదారు పేరు లేదా పాస్‌వర్డ్.',
        login_subtitle: 'మీ పోర్టల్‌కు సైన్ ఇన్ చేయండి', login_user: 'వినియోగదారు', login_password: 'పాస్‌వర్డ్', login_button: 'సైన్ ఇన్',
        signed_in_as: '{user} గా సైన్ ఇన్ చేశారు', switched_to: '{org} కి మారారు', viewing_as: 'చూస్తున్నారు: {user}', logged_out: 'మీరు లాగ్ అవుట్ అయ్యారు', language_changed: 'భాష మార్చబడింది: {lang}',
        switch_user_view: 'వినియోగదారు వీక్షణ మార్చండి', logout: 'లాగ్ అవుట్',
        selected: 'ఎంచుకున్నారు', file_ready_submit: 'ఫైల్ సిద్ధంగా ఉంది — వివరాలు పూరించి సమర్పించండి', enter_material_name: 'దయచేసి మెటీరియల్ పేరు నమోదు చేయండి', running_precheck: '🤖 {org} కోసం AI బ్రాండ్ ముందస్తు తనిఖీ జరుగుతోంది…', precheck_complete: '✅ ముందస్తు తనిఖీ పూర్తైంది — స్కోర్ 81/100', sent_to_approvers: '"{name}" ని {org} లో ఆమోదకులకు పంపారు 📨',
        edit_access_button: 'యాక్సెస్ సవరించండి', access_saved: 'యాక్సెస్ అనుమతులు సేవ్ చేయబడ్డాయి', save_changes: 'మార్పులు సేవ్ చేయండి', configure_access_for: 'ఈ వినియోగదారుకు {org} లో ఫోల్డర్ యాక్సెస్ కాన్ఫిగర్ చేయండి.', comment_added: 'వ్యాఖ్య జోడించబడింది',
        version_compare_info: 'వెర్షన్ పోలిక — పూర్తి నిర్మాణ ఫీచర్', material_fully_approved: '"{material}" పూర్తిగా ఆమోదించబడింది! 🎉', revision_requested: '"{material}" పై సవరణ అభ్యర్థించారు', approval_recorded: 'ఆమోదం నమోదు చేయబడింది ✅', revision_request_sent: 'సవరణ అభ్యర్థన పంపబడింది ⚠️',
        "org_Bio Factor": 'Bio Factor', "org_Ferty Base": 'Ferty Base', "org_Aqua": 'Aqua', "org_One Health Centre": 'One Health Centre', "org_Water Links": 'Water Links', "org_Beyond Organic": 'Beyond Organic',
        user_admin: 'అలెక్స్', user_ceo: 'కారోల్', user_coo: 'ఒమర్', user_director: 'డయానా',
        role_admin: 'అడ్మిన్', role_ceo: 'CEO', role_coo: 'COO', role_director: 'డైరెక్టర్', role_user: 'ವಿನ್ಯಾಸಕಾರರು / ಬಳಕೆದಾರರು',
        perm_upload: 'అప్‌లోడ్', perm_approve: 'ఆమోదించు', perm_delete: 'తొలగించు', perm_manage_users: 'వినియోగదారులను నిర్వహించు', perm_all_folders: 'అన్ని ఫోల్డర్లు', perm_view_all: 'అన్నీ చూడు', perm_final_approve: 'తుది ఆమోదం', perm_manage_campaigns: 'ప్రచారాలు నిర్వహించు', perm_assigned_folders: 'కేటాయించిన ఫోల్డర్లు', perm_view_brand_guide: 'బ్రాండ్ గైడ్ చూడు',
        sector_technology: 'సాంకేతికత', sector_retail_fmcg: 'రిటైల్ & FMCG', sector_financial_services: 'ఆర్థిక సేవలు', sector_healthcare: 'ఆరోగ్య సంరక్షణ', sector_education: 'విద్య', sector_logistics_supply: 'లాజిస్టిక్స్ & సరఫరా',
        select_org_subtitle: 'కొనసాగించడానికి మీ సంస్థను ఎంచుకోండి', select_lang_subtitle: 'పని చేసే భాష ఎంచుకోండి',
        continue_to_language: 'భాషకు కొనసాగు →', back: '← వెనుకకు', enter_portal: 'పోర్టల్‌లో ప్రవేశించు →', selection_flow_path: 'సంస్థ → భాష → పోర్టల్',
        switch_org: 'సంస్థ మార్చండి', switch_lang: 'భాష మార్చండి', upload_new: '+ కొత్తది అప్‌లోడ్',
        material_name: 'మెటీరియల్ పేరు', type: 'రకం', campaign_project: 'ప్రచారం / ప్రాజెక్ట్', designer_notes: 'డిజైనర్ నోట్స్',
        folder_location: 'ఫోల్డర్ స్థానం', upload_title: 'కొత్త మెటీరియల్ అప్‌లోడ్ చేయండి', upload_description: 'సమీక్షకు డిజైన్ సమర్పించండి — AI ముందస్తు తనిఖీ స్వయంచాలకంగా జరుగుతుంది',
        click_to_select: 'ఫైల్ ఎంచుకోవడానికి క్లిక్ చేయండి', file_types_hint: 'PDF, PNG, JPG, AI, PSD — 50MB వరకు',
        precheck_title: '🤖 AI ముందస్తు తనిఖీ', precheck_description: 'మీ డిజైన్ ఆమోదకులకు చేరే ముందు బ్రాండ్ మార్గదర్శకాలకు వ్యతిరేకంగా స్వయంచాలకంగా తనిఖీ చేయబడుతుంది.', precheck_color_compliance: '✅ రంగు పాలెట్ అనుపాలన', precheck_logo_placement: '✅ లోగో స్థానం & సురక్షిత మండలం', precheck_typography_consistency: '✅ టైపోగ్రఫీ స్థిరత్వం', precheck_previous_approved: '✅ గతంలో ఆమోదించిన డిజైన్లతో పోలిక', precheck_score: '✅ బ్రాండ్ మార్గదర్శక స్కోర్ (0–100)',
        workflow_title: '📋 వర్క్‌ఫ్లో', workflow_step1: 'అప్‌లోడ్ + AI ముందస్తు తనిఖీ', workflow_step2: 'CEO, COO & డైరెక్టర్‌కు నోటిఫై చేయబడ్డారు', workflow_step3: 'ప్రతి ఆమోదకుడు: ఆమోదించు / సవరణ', workflow_step4: 'అందరూ ఆమోదించారు → లైబ్రరీకి ప్రచురించబడింది',
        filter_flyers: '🖼 ఫ్లయర్లు', filter_brochures: '📄 బ్రోచర్లు', filter_leaflets: '📃 లీఫ్లెట్లు', filter_posters: '🪧 పోస్టర్లు', filter_banners: '🏳 బ్యానర్లు', filter_approved: '✅ ఆమోదించారు',
        type_flyer: 'ఫ్లయర్', type_brochure: 'బ్రోచర్', type_leaflet: 'లీఫ్లెట్', type_poster: 'పోస్టర్', type_banner: 'బ్యానర్', type_social: 'సోషల్ మీడియా గ్రాఫిక్',
        no_materials_stage: 'ఈ దశలో మెటీరియల్స్ లేవు', user_access: 'వినియోగదారు యాక్సెస్ నియంత్రణ', folder_access_matrix: 'ఫోల్డర్ యాక్సెస్ మాట్రిక్స్',
        brand_guidelines: 'బ్రాండ్ మార్గదర్శకాలు', color_palette: '🎨 రంగు పాలెట్', typography: '🔤 టైపోగ్రఫీ', logo_rules: '📐 లోగో నియమాలు', imagery: '🖼 చిత్రాలు',
        brand_typography_display: 'DISPLAY', brand_typography_body: 'BODY', brand_typography_caption: 'CAPTION', brand_typography_display_font: '{org} డిస్‌ప్లే ఫాంట్', brand_typography_body_example: 'Inter Regular — 16px, 1.6 లైన్ హైట్', brand_typography_caption_example: 'Inter Light — 12px, ట్రాకింగ్ +0.3',
        brand_logo_clearspace: '✅ కనీస క్లియర్‌స్పేస్: అన్ని వైపులా 2× లోగో ఎత్తు', brand_logo_minimum_size: '✅ కనీస పరిమాణం: 80px డిజిటల్ / 20mm ప్రింట్', brand_logo_approved_bg: '✅ ఆమోదించిన నేపథ్యాలు: తెలుపు, బ్రాండ్ ప్రైమరీ, బ్రాండ్ డార్క్', brand_logo_no_stretch: '❌ సాగదీయవద్దు, తిప్పవద్దు లేదా రంగు మార్చవద్దు', brand_logo_no_busy_bg: '❌ బిజీ ఫోటోగ్రాఫిక్ నేపథ్యంపై ఉంచవద్దు',
        brand_imagery_quality: '✅ అధిక నాణ్యత లైసెన్స్ పొందిన ఫోటోగ్రఫీ మాత్రమే', brand_imagery_values: '✅ బ్రాండ్ విలువలను ప్రతిబింబిస్తుంది: ఆధునిక, సమగ్ర, వృత్తిపరమైన', brand_imagery_color_grade: '✅ బ్రాండ్ పాలెట్‌కు అనుగుణంగా రంగు-గ్రేడ్', brand_imagery_avoid_cliched: '❌ క్లిచ్ స్టాక్ చిత్రాలను నివారించండి', brand_imagery_no_watermark: '❌ వాటర్‌మార్క్ చేయబడిన లేదా తక్కువ రిజల్యూషన్ చిత్రాలు వద్దు',
        activity_log: 'కార్యకలాప లాగ్', view: 'చూడు', view_only: 'చూడటం మాత్రమే', flagged: 'ఫ్లాగ్ చేయబడింది', metadata: 'మెటాడేటా', approval_status: 'ఆమోద స్థితి', brand_score: 'బ్రాండ్ స్కోర్', version_history: 'వెర్షన్ చరిత్ర', comments: 'వ్యాఖ్యలు', add_comment_placeholder: 'వ్యాఖ్య జోడించండి…', post: 'పోస్ట్', category: 'వర్గం', notes: 'నోట్స్', priority: 'ప్రాధాన్యత', priority_high: 'అధిక — ఆమోదానికి ముందు సరి చేయాలి', priority_medium: 'మధ్యమ — సరి చేయాలి', priority_low: 'తక్కువ — చిన్న సూచన', compare: 'పోల్చు', access_full: 'పూర్తి యాక్సెస్', access_view: 'చూడటం మాత్రమే', access_none: 'యాక్సెస్ లేదు',
        activity_uploaded: '{actor} "{material}" అప్‌లోడ్ చేశారు', activity_uploaded_version: '{actor} "{material} {version}" అప్‌లోడ్ చేశారు', activity_approved: '{actor} "{material}" ని ఆమోదించారు', activity_revision: '{actor} "{material}" పై సవరణ అభ్యర్థించారు — {reason}', activity_system_flagged: 'సిస్టమ్: AI ముందస్తు తనిఖీ {count} సమస్యలను ఫ్లాగ్ చేసింది (స్కోర్: {score}/100)', activity_access_granted: '{actor} {subject} కి {folder} లో అప్‌లోడ్ యాక్సెస్ ఇచ్చారు',
        reason_brand_color_issue: 'బ్రాండ్ రంగు సమస్య', reason_logo_incorrect: 'లోగో తప్పు',
        folder_marketing: 'మార్కెటింగ్', folder_flyers: 'ఫ్లయర్లు', folder_2025: '2025', folder_2024_archive: '2024 ఆర్కైవ్', folder_brochures: 'బ్రోచర్లు', folder_products: 'ఉత్పత్తులు', folder_corporate: 'కార్పొరేట్', folder_posters: 'పోస్టర్లు', folder_events: 'ఈవెంట్లు', folder_retail_pos: 'రిటైల్ POS', folder_digital: 'డిజిటల్', folder_social_media: 'సోషల్ మీడియా', folder_email_headers: 'ఇమెయిల్ హెడర్లు', folder_print: 'ప్రింట్', folder_retail: 'రిటైల్', folder_outdoor: 'అవుట్‌డోర్', folder_campaigns: 'ప్రచారాలు', folder_seasonal: 'సీజనల్', folder_summer: 'వేసవి', folder_winter: 'శీతాకాలం', folder_festive: 'పండుగ', folder_in_store: 'ఇన్-స్టోర్', folder_pos_materials: 'POS మెటీరియల్స్', folder_window_displays: 'విండో డిస్‌ప్లేలు', folder_promotions: 'ప్రమోషన్లు', folder_leaflets: 'లీఫ్లెట్లు', folder_email: 'ఇమెయిల్', folder_brand_assets: 'బ్రాండ్ ఆస్తులు', folder_logos: 'లోగోలు', folder_templates: 'టెంప్లేట్లు', folder_client_comms: 'క్లయింట్ కమ్యూనికేషన్స్', folder_presentations: 'ప్రెజెంటేషన్లు', folder_regulatory: 'నియంత్రణ', folder_compliance_docs: 'కంప్లయన్స్ డాక్యుమెంట్లు', folder_disclosures: 'వెల్లడింపులు', folder_banners: 'బ్యానర్లు', folder_signage: 'సైనేజ్', folder_healthcare_mktg: 'ఆరోగ్య మార్కెటింగ్', folder_awareness: 'అవగాహన', folder_patient_info: 'రోగి సమాచారం', folder_staff_comms: 'సిబ్బంది కమ్యూనికేషన్స్', folder_internal_posters: 'అంతర్గత పోస్టర్లు', folder_newsletters: 'న్యూస్‌లెటర్లు', folder_web_banners: 'వెబ్ బ్యానర్లు', folder_education: 'విద్య', folder_recruitment: 'నియామకం', folder_prospectus: 'ప్రాస్పెక్టస్', folder_open_day: 'ఓపెన్ డే', folder_campus: 'క్యాంపస్', folder_courses: 'కోర్సులు', folder_graduation: 'గ్రాడ్యుయేషన్', folder_conferences: 'సదస్సులు', folder_logistics_mktg: 'లాజిస్టిక్స్ మార్కెటింగ్', folder_client_facing: 'క్లయింట్-ఫేసింగ్', folder_proposals: 'ప్రతిపాదనలు', folder_fleet_branding: 'ఫ్లీట్ బ్రాండింగ్', folder_vehicle_wraps: 'వాహన ర్యాప్స్', folder_uniforms: 'యూనిఫామ్లు', folder_trade_shows: 'ట్రేడ్ షోలు', folder_displays: 'డిస్‌ప్లేలు', notifications_title: 'నోటిఫికేషన్లు — {org}', notif_sale_await: 'సమ్మర్ సేల్ ఫ్లయర్ మీ ఆమోదం కోసం వేచి ఉంది', notif_q3_submitted: 'Q3 ఉత్పత్తి బ్రోచర్ సమీక్షకు సమర్పించారు', notif_event_flagged: 'ఈవెంట్ పోస్టర్ సవరణకు ఫ్లాగ్ చేయబడింది', notif_retail_approved: 'రిటైల్ POS బ్యానర్ అందరి సమీక్షకులచే ఆమోదించబడింది', access_full_short: '✅ పూర్తి', access_view_short: '👁 చూడు', access_none_short: '— ఏదీ లేదు',
        awaiting: 'నిరీక్షిస్తోంది', ai_brand_compliance: 'AI బ్రాండ్ అనుపాలన', send_revision_request: 'సవరణ అభ్యర్థన పంపండి',
        revision_describe_text: 'అవసరమైన మార్పులను వివరించండి. డిజైనర్‌కు వెంటనే నోటిఫై చేయబడుతుంది.', revision_describe_placeholder: 'ఏమి మార్చాలో వివరించండి…',
        cat_brand_color: 'బ్రాండ్ రంగు సమస్య', cat_logo_violation: 'లోగో వినియోగ ఉల్లంఘన', cat_typography: 'టైపోగ్రఫీ సమస్య', cat_messaging: 'సందేశం / కాపీ లోపం', cat_layout: 'లేఅవుట్ సమస్య', cat_image_quality: 'చిత్ర నాణ్యత', cat_other: 'ఇతర',
        comment_revision_text: 'లోగో స్థానం సాగదీయబడినట్లు కనిపిస్తోంది — బ్రాండ్ కిట్ నుండి ఆమోదించిన మాస్టర్ ఫైల్ ఉపయోగించండి.', comment_approved_text: 'బాగా కనిపిస్తోంది. బ్రాండ్ రంగులు సరిగ్గా ఉన్నాయి.',
        version_initial_upload: 'మొదటి అప్‌లోడ్', version_revised_cta: 'CTA రంగు సవరించారు', version_final: 'తుది', version_initial: 'మొదటిది',
        ai_m1_1: '✅ రంగు పాలెట్ బ్రాండ్ ప్రైమరీ రంగులతో సరిపోలింది', ai_m1_2: '✅ లోగో స్థానం సరి', ai_m1_3: '⚠️ CTA ఫాంట్ పరిమాణం పెద్దదిగా ఉండవచ్చు', ai_m1_4: '✅ చిత్ర నాణ్యత ప్రింట్ ప్రమాణాలు నిర్వహిస్తుంది', ai_m1_5: '⚠️ ట్యాగ్‌లైన్ మెసేజింగ్ గైడ్ నుండి కొద్దిగా విచలనమైంది',
        ai_m2_1: '✅ అన్ని బ్రాండ్ రంగులు సరి', ai_m2_2: '✅ టైపోగ్రఫీ బ్రాండ్ గైడ్‌తో సరిపోలింది', ai_m2_3: '✅ లోగో క్లియర్‌స్పేస్ సరి', ai_m2_4: '✅ చిత్ర శైలి అమరింది',
        ai_m3_1: '❌ సెకండరీ రంగు బ్రాండ్ పాలెట్‌లో లేదు', ai_m3_2: '❌ లోగో సాగదీయబడింది — వినియోగ నియమాలు ఉల్లంఘించారు', ai_m3_3: '⚠️ బాడీ కాపీ ప్రింట్‌కు చాలా చిన్నది', ai_m3_4: '⚠️ కాంట్రాస్ట్ నిష్పత్తి WCAG AA విఫలమైంది',
        ai_m4_1: '✅ అద్భుతమైన బ్రాండ్ అనుపాలన', ai_m4_2: '✅ అన్ని తనిఖీలు పాస్ అయ్యాయి',
        ai_m5_1: '✅ ప్లాట్‌ఫారమ్ కొలతలు సరి', ai_m5_2: '✅ బ్రాండ్ రంగులు వర్తించారు', ai_m5_3: '⚠️ IG వెర్షన్‌లో మైనర్ లోగో క్లియర్‌స్పేస్',
        ai_m6_1: '✅ బ్రాండ్ రంగులు సరి', ai_m6_2: '⚠️ ఒక చిత్రం 300dpi కంటే తక్కువ', ai_m6_3: '✅ టైపోగ్రఫీ నియమాలు పాటించారు',
        ai_new_color_ok: '✅ రంగు పాలెట్ బ్రాండ్ మార్గదర్శకాలకు అనుగుణంగా ఉంది', ai_new_logo_ok: '✅ లోగో స్థానం ఆమోదించిన మార్గదర్శకాల్లో ఉంది', ai_new_typography_ok: '✅ టైపోగ్రఫీ బ్రాండ్ గైడ్‌తో స్థిరంగా ఉంది', ai_new_imagery_ok: '✅ చిత్రం బ్రాండ్ ప్రమాణాలు నిర్వహిస్తుంది', ai_new_score_note: '⚠️ స్కోర్ థ్రెషోల్డ్ కంటే ఎక్కువ — సమీక్షకు సిద్ధంగా ఉంది',
        ai_new_color_warn: '⚠️ చిన్న రంగు వైవిధ్యాలు గుర్తించారు', ai_new_clearspace_warn: '⚠️ లోగో క్లియర్‌స్పేస్ కనిష్టం కంటే కొద్దిగా తక్కువ', ai_new_font_warn: '⚠️ ఫాంట్ పరిమాణం సర్దుబాటు అవసరం కావచ్చు'
      },
      hi: {
        dashboard: 'डैशबोर्ड', materials: 'सामग्री पुस्तकालय', approvals: 'अनुमोदन', upload: 'सामग्री अपलोड करें',
        users: 'उपयोगकर्ता पहुंच', brand: 'ब्रांड दिशानिर्देश', activity: 'गतिविधि लॉग',
        folders: 'फ़ोल्डर', admin: 'प्रशासन', welcome: 'आपका स्वागत है', overview: 'मार्केटिंग सामग्री का अवलोकन',
        pending: 'अनुमोदन लंबित', approved: 'अनुमोदित', revision: 'संशोधन आवश्यक', total: 'कुल सामग्री',
        designed_by: 'डिज़ाइनर', uploaded: 'अपलोड किया', status: 'स्थिति', campaign: 'अभियान',
        approve: 'अनुमोदन करें', request_revision: 'संशोधन अनुरोध', close: 'बंद करें', submit: 'अनुमोदन के लिए भेजें',
        all_types: 'सभी प्रकार', search_placeholder: 'नाम या डिज़ाइनर से खोजें…',
        recent_materials: 'हाल की सामग्री',
        material_name_1: 'समर सेल फ़्लायर', material_name_2: 'Q3 प्रोडक्ट ब्रौशर', material_name_3: 'इवेंट अनाउंसमेंट पोस्टर', material_name_4: 'रिटेल पीओएस बैनर', material_name_5: 'सोशल मीडिया बंडल', material_name_6: 'लीफ़लेट — नई सेवाएँ',
        admin_section: 'व्यवस्थापक',
        folder_label: 'फ़ोल्डर', lang_name: 'हिन्दी',
        login_error_password: 'कृपया अपना पासवर्ड दर्ज करें।', login_error_invalid: 'अमान्य उपयोगकर्ता नाम या पासवर्ड।',
        login_subtitle: 'अपना पोर्टल जारी रखने के लिए साइन इन करें', login_user: 'उपयोगकर्ता', login_password: 'पासवर्ड', login_button: 'साइन इन करें',
        signed_in_as: '{user} के रूप में साइन इन किया गया', switched_to: '{org} पर स्विच किया गया', viewing_as: 'के रूप में देख रहे हैं: {user}', logged_out: 'आप लॉग आउट हो गए हैं', language_changed: 'भाषा बदल दी गई: {lang}',
        switch_user_view: 'उपयोगकर्ता दृश्य बदलें', logout: 'लॉग आउट',
        selected: 'चयनित', file_ready_submit: 'फ़ाइल तैयार है — विवरण भरें और सबमिट करें', enter_material_name: 'कृपया सामग्री का नाम दर्ज करें', running_precheck: '🤖 {org} के लिए AI ब्रांड पूर्व-जांच चल रही है…', precheck_complete: '✅ पूर्व-जांच पूर्ण — स्कोर 81/100', sent_to_approvers: '"{name}" को {org} में अनुमोदकों के पास भेज दिया गया 📨',
        edit_access_button: 'पहुंच संपादित करें', access_saved: 'पहुँच अनुमतियाँ सहेजी गईं', save_changes: 'परिवर्तनों को सहेजें', configure_access_for: 'इस उपयोगकर्ता के लिए {org} के भीतर फ़ोल्डर एक्सेस कॉन्फ़िगर करें।', comment_added: 'टिप्पणी जोड़ी गई',
        version_compare_info: 'संस्करण तुलना — पूर्ण निर्माण सुविधा', material_fully_approved: '"{material}" को पूरी तरह से मंज़ूरी मिली! 🎉', revision_requested: '"{material}" पर संशोधन का अनुरोध किया गया', approval_recorded: 'अनुमोदन दर्ज किया गया ✅', revision_request_sent: 'संशोधन अनुरोध भेजा गया ⚠️',
        "org_Bio Factor": 'Bio Factor', "org_Ferty Base": 'Ferty Base', "org_Aqua": 'Aqua', "org_One Health Centre": 'One Health Centre', "org_Water Links": 'Water Links', "org_Beyond Organic": 'Beyond Organic',
        user_admin: 'व्यवस्थापक', user_ceo: 'CEO', user_coo: 'COO', user_director: 'निदेशक',
        role_admin: 'व्यवस्थापक', role_ceo: 'CEO', role_coo: 'COO', role_director: 'निदेशक', role_user: 'उपयोगकर्ता',
        perm_upload: 'अपलोड', perm_approve: 'अनुमोदन', perm_delete: 'हटाएँ', perm_manage_users: 'उपयोगकर्ताओं का प्रबंधन करें', perm_all_folders: 'सभी फ़ोल्डर', perm_view_all: 'सभी देखें', perm_final_approve: 'अंतिम अनुमोदन', perm_manage_campaigns: 'कैम्पेन प्रबंधित करें', perm_assigned_folders: 'आवंटित फ़ोल्डर', perm_view_brand_guide: 'ब्रांड गाइड देखें',
        sector_technology: 'प्रौद्योगिकी', sector_retail_fmcg: 'रिटेल और FMCG', sector_financial_services: 'वित्तीय सेवाएँ', sector_healthcare: 'स्वास्थ्य देखभाल', sector_education: 'शिक्षा', sector_logistics_supply: 'लॉजिस्टिक और सप्लाई',
        select_org_subtitle: 'जारी रखने के लिए अपने संगठन का चयन करें', select_lang_subtitle: 'कार्य भाषा चुनें',
        continue_to_language: 'भाषा पर जाएँ →', back: '← वापस', enter_portal: 'पोर्टल में प्रवेश करें →', selection_flow_path: 'संगठन → भाषा → पोर्टल',
        switch_org: 'संगठन बदलें', switch_lang: 'भाषा बदलें', upload_new: '+ नया अपलोड करें',
        material_name: 'सामग्री नाम', type: 'प्रकार', campaign_project: 'अभियान / परियोजना', designer_notes: 'डिज़ाइनर नोट्स',
        folder_location: 'फ़ोल्डर स्थान', upload_title: 'नई सामग्री अपलोड करें', upload_description: 'समीक्षा के लिए डिज़ाइन सबमिट करें — एआई पूर्व-जांच स्वचालित है',
        click_to_select: 'फ़ाइल चुनने के लिए क्लिक करें', file_types_hint: 'PDF, PNG, JPG, AI, PSD — 50MB तक',
        precheck_title: '🤖 AI पूर्व-जांच', precheck_description: 'आपकी डिज़ाइन को अनुमोदकों तक पहुँचने से पहले स्वतः ब्रांड दिशानिर्देशों के विरुद्ध जाँचा जाएगा।', precheck_color_compliance: '✅ रंग पैलेट अनुपालन', precheck_logo_placement: '✅ लोगो प्लेसमेंट और सुरक्षित क्षेत्र', precheck_typography_consistency: '✅ टाइपोग्राफी संगति', precheck_previous_approved: '✅ पहले अनुमोदित डिज़ाइनों के साथ तुलना', precheck_score: '✅ ब्रांड दिशानिर्देश स्कोर (0–100)',
        workflow_title: '📋 वर्कफ़्लो', workflow_step1: 'अपलोड + AI पूर्व-जांच', workflow_step2: 'CEO, COO और निदेशक को सूचित किया गया', workflow_step3: 'प्रत्येक अनुमोदक: अनुमोदन / संशोधन', workflow_step4: 'सभी ने मंज़ूरी दी → पुस्तकालय में प्रकाशित',
        filter_flyers: '🖼 फ्लायर्स', filter_brochures: '📄 ब्रोशर', filter_leaflets: '📃 लीफलेट', filter_posters: '🪧 पोस्टर', filter_banners: '🏳 बैनर', filter_approved: '✅ अनुमोदित',
        type_flyer: 'फ्लायर', type_brochure: 'ब्रोशर', type_leaflet: 'लीफलेट', type_poster: 'पोस्टर', type_banner: 'बैनर', type_social: 'सोशल मीडिया ग्राफ़िक',
        no_materials_stage: 'इस चरण में कोई सामग्री नहीं', user_access: 'उपयोगकर्ता पहुँच', folder_access_matrix: 'फ़ोल्डर एक्सेस मैट्रिक्स',
        brand_guidelines: 'ब्रांड दिशानिर्देश', color_palette: '🎨 रंग पैलेट', typography: '🔤 टाइपोग्राफी', logo_rules: '📐 लोगो नियम', imagery: '🖼 छवियाँ',
        brand_typography_display: 'DISPLAY', brand_typography_body: 'BODY', brand_typography_caption: 'CAPTION', brand_typography_display_font: '{org} डिस्प्ले फ़ॉन्ट', brand_typography_body_example: 'Inter Regular — 16px, 1.6 लाइन ऊँचाई', brand_typography_caption_example: 'Inter Light — 12px, ट्रैकिंग +0.3',
        brand_logo_clearspace: '✅ न्यूनतम क्लियरस्पेस: सभी तरफ 2× लोगो ऊँचाई', brand_logo_minimum_size: '✅ न्यूनतम आकार: 80px डिजिटल / 20mm प्रिंट', brand_logo_approved_bg: '✅ अनुमोदित पृष्ठभूमियाँ: सफेद, ब्रांड प्राथमिक, ब्रांड डार्क', brand_logo_no_stretch: '❌ खींचें, घुमाएँ, या पुनः रंग न करें', brand_logo_no_busy_bg: '❌ व्यस्त फ़ोटो पृष्ठभूमि पर न रखें',
        brand_imagery_quality: '✅ केवल उच्च गुणवत्ता वाली लाइसेंस प्राप्त फ़ोटोग्राफी', brand_imagery_values: '✅ ब्रांड मूल्यों को दर्शाता है: आधुनिक, समावेशी, पेशेवर', brand_imagery_color_grade: '✅ ब्रांड पैलेट से संरेखित रंग-ग्रेड', brand_imagery_avoid_cliched: '❌ क्लिची स्टॉक इमेजरी से बचें', brand_imagery_no_watermark: '❌ कोई वॉटरमार्क या कम-रिज़ॉल्यूशन छवियाँ नहीं',
        brand_typography_display: 'DISPLAY', brand_typography_body: 'BODY', brand_typography_caption: 'CAPTION', brand_typography_display_font: '{org} डिस्प्ले फ़ॉन्ट', brand_typography_body_example: 'Inter Regular — 16px, 1.6 लाइन ऊँचाई', brand_typography_caption_example: 'Inter Light — 12px, ट्रैकिंग +0.3',
        brand_logo_clearspace: '✅ न्यूनतम क्लियरस्पेस: सभी तरफ 2× लोगो ऊँचाई', brand_logo_minimum_size: '✅ न्यूनतम आकार: 80px डिजिटल / 20mm प्रिंट', brand_logo_approved_bg: '✅ अनुमोदित पृष्ठभूमियाँ: सफेद, ब्रांड प्राथमिक, ब्रांड डार्क', brand_logo_no_stretch: '❌ खींचें, घुमाएँ, या पुनः रंग न करें', brand_logo_no_busy_bg: '❌ व्यस्त फ़ोटो पृष्ठभूमि पर न रखें',
        brand_imagery_quality: '✅ केवल उच्च गुणवत्ता वाली लाइसेंस प्राप्त फ़ोटोग्राफी', brand_imagery_values: '✅ ब्रांड मूल्यों को दर्शाता है: आधुनिक, समावेशी, पेशेवर', brand_imagery_color_grade: '✅ ब्रांड पैलेट से संरेखित रंग-ग्रेड', brand_imagery_avoid_cliched: '❌ क्लिची स्टॉक इमेजरी से बचें', brand_imagery_no_watermark: '❌ कोई वॉटरमार्क या कम-रिज़ॉल्यूशन छवियाँ नहीं',
        activity_log: 'गतिविधि लॉग', view: 'देखें', view_only: 'केवल देखें', flagged: 'फ़्लैग किया गया', metadata: 'मेटाडेटा', approval_status: 'अनुमोदन स्थिति', brand_score: 'ब्रांड स्कोर', version_history: 'संस्करण इतिहास', comments: 'टिप्पणियाँ', add_comment_placeholder: 'एक टिप्पणी जोड़ें…', post: 'पोस्ट', category: 'श्रेणी', notes: 'नोट्स', priority: 'प्राथमिकता', priority_high: 'उच्च — अनुमोदन से पहले ठीक किया जाना चाहिए', priority_medium: 'मध्यम — ठीक किया जाना चाहिए', priority_low: 'निम्न — मामूली प्रस्ताव', compare: 'तुलना', access_full: 'पूर्ण पहुंच', access_view: 'केवल देखें', access_none: 'कोई पहुंच नहीं',
        activity_uploaded: '{actor} ने "{material}" अपलोड किया', activity_uploaded_version: '{actor} ने "{material} {version}" अपलोड किया', activity_approved: '{actor} ने "{material}" को मंजूरी दी', activity_revision: '{actor} ने "{material}" पर संशोधन का अनुरोध किया — {reason}', activity_system_flagged: 'सिस्टम: AI पूर्व-जांच ने {count} मुद्दों को फ़्लैग किया (स्कोर: {score}/100)', activity_access_granted: '{actor} ने {subject} को {folder} पर अपलोड एक्सेस दिया',
        reason_brand_color_issue: 'ब्रांड रंग समस्या', reason_logo_incorrect: 'लोगो गलत है',
        folder_marketing: 'मार्केटिंग', folder_flyers: 'फ्लायर्स', folder_2025: '2025', folder_2024_archive: '2024 संग्रह', folder_brochures: 'ब्रोशर', folder_products: 'उत्पाद', folder_corporate: 'कॉर्पोरेट', folder_posters: 'पोस्टर', folder_events: 'ईवेंट्स', folder_retail_pos: 'रिटेल POS', folder_digital: 'डिजिटल', folder_social_media: 'सोशल मीडिया', folder_email_headers: 'ईमेल हेडर', folder_print: 'प्रिंट', folder_retail: 'रिटेल', folder_outdoor: 'आउटडोर', folder_campaigns: 'अभियान', folder_seasonal: 'मौसमी', folder_summer: 'गर्मी', folder_winter: 'सर्दी', folder_festive: 'त्योहारी', folder_in_store: 'इन-स्टोर', folder_pos_materials: 'POS सामग्री', folder_window_displays: 'विंडो डिस्प्ले', folder_promotions: 'प्रमोशन', folder_leaflets: 'लीफलेट', folder_email: 'ईमेल', folder_brand_assets: 'ब्रांड एसेट्स', folder_logos: 'लोगो', folder_templates: 'टेम्पलेट', folder_client_comms: 'क्लाइंट कम्युनिकेशन', folder_presentations: 'प्रेज़ेंटेशन', folder_regulatory: 'नियामक', folder_compliance_docs: 'अनुपालन दस्तावेज़', folder_disclosures: 'प्रकटीकरण', folder_banners: 'बैनर', folder_signage: 'साइनिज', folder_healthcare_mktg: 'हेल्थकेयर मार्केटिंग', folder_awareness: 'जागरूकता', folder_patient_info: 'रोगी जानकारी', folder_staff_comms: 'स्टाफ कम्युनिकेशन', folder_internal_posters: 'आंतरिक पोस्टर', folder_newsletters: 'न्यूज़लेटर', folder_web_banners: 'वेब बैनर', folder_education: 'शिक्षा', folder_recruitment: 'भर्ती', folder_prospectus: 'प्रॉस्पेक्टस', folder_open_day: 'ओपन डे', folder_campus: 'कैंपस', folder_courses: 'कोर्स', folder_graduation: 'ग्रेजुएशन', folder_conferences: 'सम्मेलन', folder_logistics_mktg: 'लॉजिस्टिक मार्केटिंग', folder_client_facing: 'क्लाइंट-फेसिंग', folder_proposals: 'प्रस्ताव', folder_fleet_branding: 'फ्लीट ब्रैंडिंग', folder_vehicle_wraps: 'वाहन लपेट', folder_uniforms: 'यूनिफ़ॉर्म', folder_trade_shows: 'ट्रेड शो', folder_displays: 'डिस्प्ले', notifications_title: 'सूचनाएँ — {org}', notif_sale_await: 'Summer Sale Flyer आपकी स्वीकृति के लिए प्रतीक्षा में है', notif_q3_submitted: 'Q3 Product Brochure समीक्षा के लिए सबमिट किया गया', notif_event_flagged: 'Event Poster को संशोधन के लिए फ़्लैग किया गया', notif_retail_approved: 'Retail POS Banner को सभी समीक्षा करने वालों ने मंज़ूरी दी', access_full_short: '✅ पूर्ण', access_view_short: '👁 देखें', access_none_short: '— कोई नहीं',
        awaiting: 'प्रतीक्षित', ai_brand_compliance: 'AI ब्रांड अनुपालन', send_revision_request: 'संशोधन अनुरोध भेजें',
        revision_describe_text: 'आवश्यक परिवर्तनों का वर्णन करें। डिज़ाइनर को तुरंत सूचित किया जाएगा।', revision_describe_placeholder: 'क्या बदलना है बताएं…',
        cat_brand_color: 'ब्रांड रंग समस्या', cat_logo_violation: 'लोगो उपयोग उल्लंघन', cat_typography: 'टाइपोग्राफी समस्या', cat_messaging: 'संदेश / कॉपी त्रुटि', cat_layout: 'लेआउट समस्या', cat_image_quality: 'छवि गुणवत्ता', cat_other: 'अन्य',
        comment_revision_text: 'लोगो प्लेसमेंट खिंचा हुआ दिखता है — ब्रांड किट से स्वीकृत मास्टर फ़ाइल उपयोग करें।', comment_approved_text: 'अच्छा दिखता है। ब्रांड रंग एकदम सही हैं।',
        version_initial_upload: 'प्रारंभिक अपलोड', version_revised_cta: 'CTA रंग संशोधित', version_final: 'अंतिम', version_initial: 'प्रारंभिक',
        ai_m1_1: '✅ रंग पैलेट ब्रांड प्राथमिक रंगों से मेल खाता है', ai_m1_2: '✅ लोगो प्लेसमेंट सही', ai_m1_3: '⚠️ CTA फ़ॉन्ट आकार बड़ा हो सकता है', ai_m1_4: '✅ छवि गुणवत्ता प्रिंट मानकों को पूरा करती है', ai_m1_5: '⚠️ टैगलाइन मैसेजिंग गाइड से थोड़ी भटकी हुई है',
        ai_m2_1: '✅ सभी ब्रांड रंग सही', ai_m2_2: '✅ टाइपोग्राफी ब्रांड गाइड से मेल खाती है', ai_m2_3: '✅ लोगो क्लियरस्पेस सही', ai_m2_4: '✅ इमेजरी स्टाइल संरेखित',
        ai_m3_1: '❌ सेकेंडरी रंग ब्रांड पैलेट में नहीं', ai_m3_2: '❌ लोगो खिंचा हुआ — उपयोग नियमों का उल्लंघन', ai_m3_3: '⚠️ बॉडी कॉपी प्रिंट के लिए बहुत छोटी', ai_m3_4: '⚠️ कॉन्ट्रास्ट अनुपात WCAG AA विफल',
        ai_m4_1: '✅ उत्कृष्ट ब्रांड अनुपालन', ai_m4_2: '✅ सभी जांचें उत्तीर्ण',
        ai_m5_1: '✅ प्लेटफ़ॉर्म आयाम सही', ai_m5_2: '✅ ब्रांड रंग लागू', ai_m5_3: '⚠️ IG संस्करण पर मामूली लोगो क्लियरस्पेस',
        ai_m6_1: '✅ ब्रांड रंग सही', ai_m6_2: '⚠️ एक छवि 300dpi से नीचे', ai_m6_3: '✅ टाइपोग्राफी नियमों का पालन',
        ai_new_color_ok: '✅ रंग पैलेट ब्रांड दिशानिर्देशों से मेल खाता है', ai_new_logo_ok: '✅ लोगो प्लेसमेंट स्वीकृत दिशानिर्देशों में है', ai_new_typography_ok: '✅ टाइपोग्राफी ब्रांड गाइड के अनुरूप', ai_new_imagery_ok: '✅ छवि ब्रांड मानकों को पूरा करती है', ai_new_score_note: '⚠️ स्कोर सीमा से ऊपर — समीक्षा के लिए तैयार',
        ai_new_color_warn: '⚠️ मामूली रंग विविधताएँ पाई गईं', ai_new_clearspace_warn: '⚠️ लोगो क्लियरस्पेस न्यूनतम से थोड़ा कम', ai_new_font_warn: '⚠️ फ़ॉन्ट आकार समायोजन की आवश्यकता हो सकती है'
      },
      ta: {
        dashboard: 'டாஷ்போர்டு', materials: 'பொருட்கள் நூலகம்', approvals: 'ஒப்புதல்கள்', upload: 'அப்லோட் மெட்டீரியல்',
        users: 'பயனர் அணுகல்', brand: 'பிராண்ட் வழிகாட்டுதல்கள்', activity: 'செயல்பாட்டு பதிவு', folders: 'கோப்புறைகள்',
        admin: 'நிர்வாகி', welcome: 'மீண்டும் வரவேற்கிறோம்', overview: 'சந்தைப்படுத்தல் பொருட்கள் கண்ணோட்டம்', pending: 'அனுமதி நிலுவையில் உள்ளது',
        approved: 'அங்கீகரிக்கப்பட்டது', revision: 'திருத்தம் தேவை', total: 'மொத்த பொருட்கள்', designed_by: 'வடிவமைத்தவர்',
        uploaded: 'பதிவேற்றப்பட்டது', status: 'நிலை', campaign: 'பிரச்சாரம்', approve: 'ஒப்புதல்',
        request_revision: 'மறுபரிசீலனை கோரிக்கை', close: 'மூடு', submit: 'ஒப்புதலுக்காக சமர்ப்பிக்கவும்', all_types: 'அனைத்து வகைகளும்',
        search_placeholder: 'பெயர், வடிவமைப்பாளர், வகை மூலம் தேடுங்கள்...', recent_materials: 'சமீபத்திய பொருட்கள்', material_name_1: 'கோடைகால விற்பனை ஃப்ளையர்', material_name_2: 'Q3 தயாரிப்பு சிற்றேடு',
        material_name_3: 'நிகழ்வு அறிவிப்பு சுவரொட்டி', material_name_4: 'சில்லறை POS பேனர்', material_name_5: 'சமூக ஊடகத் தொகுப்பு', material_name_6: 'துண்டு பிரசுரம் - புதிய சேவைகள்',
        admin_section: 'நிர்வாகி', folder_label: 'கோப்புறை', lang_name: 'Tamil', login_error_password: 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்.',
        login_error_invalid: 'தவறான பயனர்பெயர் அல்லது கடவுச்சொல்.', login_subtitle: 'உங்கள் போர்ட்டலில் தொடர உள்நுழையவும்', login_user: 'பயனர்', login_password: 'கடவுச்சொல்',
        login_button: 'உள்நுழைக', signed_in_as: '{user} ஆக உள்நுழைந்துள்ளீர்கள்', switched_to: '{org}க்கு மாற்றப்பட்டது', viewing_as: 'இவ்வாறு பார்க்கிறது: {user}',
        logged_out: 'நீங்கள் வெளியேறிவிட்டீர்கள்', language_changed: 'மொழி {lang} க்கு மாற்றப்பட்டது', switch_user_view: 'பயனர் பார்வையை மாற்றவும்', logout: 'வெளியேறு',
        selected: 'தேர்ந்தெடுக்கப்பட்டது', file_ready_submit: 'கோப்பு தயார் - விவரங்களைப் பூர்த்தி செய்து சமர்ப்பிக்கவும்', enter_material_name: 'பொருள் பெயரை உள்ளிடவும்', running_precheck: '🤖 இயங்கும் AI பிராண்ட் {org}க்கான முன் சோதனை...',
        precheck_complete: '✅ முன் சரிபார்ப்பு முடிந்தது - மதிப்பெண் 81/100', sent_to_approvers: '{org} 📨 இல் அனுமதியளிப்பவர்களுக்கு "{name}" அனுப்பப்பட்டது', edit_access_button: 'அணுகலைத் திருத்து', access_saved: 'அணுகல் அனுமதிகள் சேமிக்கப்பட்டன',
        save_changes: 'மாற்றங்களைச் சேமிக்கவும்', configure_access_for: '{org} இல் இந்தப் பயனருக்கான கோப்புறை அணுகலை உள்ளமைக்கவும்.', comment_added: 'கருத்து சேர்க்கப்பட்டது', version_compare_info: 'பதிப்பு ஒப்பீடு - முழு உருவாக்க அம்சம்',
        material_fully_approved: '"{material}" முழுமையாக அங்கீகரிக்கப்பட்டது! 🎉', revision_requested: '"{material}" இல் திருத்தம் கோரப்பட்டது', approval_recorded: 'ஒப்புதல் பதிவு செய்யப்பட்டது ✅', revision_request_sent: 'மறுசீரமைப்பு கோரிக்கை அனுப்பப்பட்டது ⚠️',
        "org_Bio Factor": 'உயிர் காரணி', "org_Ferty Base": 'ஃபெர்ட்டி பேஸ்', "org_Aqua": 'அக்வா', "org_One Health Centre": 'ஒரு சுகாதார மையம்',
        "org_Water Links": 'நீர் இணைப்புகள்', "org_Beyond Organic": 'ஆர்கானிக் தாண்டி', user_admin: 'நிர்வாகி', user_ceo: 'CEO',
        user_coo: 'சிஓஓ', user_director: 'இயக்குனர்', role_admin: 'நிர்வாகி', role_ceo: 'CEO',
        role_coo: 'சிஓஓ', role_director: 'இயக்குனர்', role_user: 'பயனர்', perm_upload: 'பதிவேற்றவும்', perm_approve: 'ஒப்புதல்',
        perm_delete: 'நீக்கு', perm_manage_users: 'பயனர்களை நிர்வகிக்கவும்', perm_all_folders: 'அனைத்து கோப்புறைகள்', perm_view_all: 'அனைத்தையும் பார்க்கவும்',
        perm_final_approve: 'இறுதி ஒப்புதல்', perm_manage_campaigns: 'பிரச்சாரங்களை நிர்வகிக்கவும்', perm_assigned_folders: 'ஒதுக்கப்பட்ட கோப்புறைகள்', perm_view_brand_guide: 'பிராண்ட் கையேட்டைப் பார்க்கவும்',
        sector_technology: 'தொழில்நுட்பம்', sector_retail_fmcg: 'சில்லறை & FMCG', sector_financial_services: 'நிதி சேவைகள்', sector_healthcare: 'சுகாதாரம்',
        sector_education: 'கல்வி', sector_logistics_supply: 'தளவாடங்கள் & வழங்கல்', select_org_subtitle: 'தொடர, உங்கள் நிறுவனத்தைத் தேர்ந்தெடுக்கவும்', select_lang_subtitle: 'வேலை செய்யும் மொழியைத் தேர்ந்தெடுக்கவும்',
        continue_to_language: 'மொழிக்கு தொடரவும் →', back: '← பின்', enter_portal: 'போர்ட்டலை உள்ளிடவும் →', selection_flow_path: 'அமைப்பு → மொழி → போர்டல்',
        switch_org: 'அமைப்பு மாறவும்', switch_lang: 'மொழி மாறவும்', upload_new: '+ புதிதாக பதிவேற்றவும்', material_name: 'பொருள் பெயர்',
        type: 'வகை', campaign_project: 'பிரச்சாரம் / திட்டம்', designer_notes: 'வடிவமைப்பாளர் குறிப்புகள்', folder_location: 'கோப்புறை இருப்பிடம்',
        upload_title: 'புதிய மெட்டீரியலைப் பதிவேற்றவும்', upload_description: 'மதிப்பாய்விற்காக வடிவமைப்பைச் சமர்ப்பிக்கவும் - AI முன் சரிபார்ப்பு தானாகவே இயங்கும்', click_to_select: 'கோப்பைத் தேர்ந்தெடுக்க கிளிக் செய்யவும்', file_types_hint: 'PDF, PNG, JPG, AI, PSD - 50MB வரை',
        precheck_title: '🤖 AI முன் சரிபார்ப்பு', precheck_description: 'அனுமதியளிப்பவர்களைப் பெறுவதற்கு முன், உங்கள் வடிவமைப்பு தானாகவே பிராண்ட் வழிகாட்டுதல்களுக்கு எதிராகச் சரிபார்க்கப்படும்.', precheck_color_compliance: '✅ வண்ணத் தட்டு இணக்கம்', precheck_logo_placement: '✅ லோகோ இடம் & பாதுகாப்பான மண்டலம்',
        precheck_typography_consistency: '✅ அச்சுக்கலை நிலைத்தன்மை', precheck_previous_approved: '✅ முந்தைய அங்கீகரிக்கப்பட்ட வடிவமைப்புகளுடன் ஒப்பீடு', precheck_score: '✅ பிராண்ட் வழிகாட்டுதல்கள் மதிப்பெண் (0–100)', workflow_title: '📋 பணிப்பாய்வு',
        workflow_step1: 'பதிவேற்றம் + AI முன் சரிபார்ப்பு', workflow_step2: 'CEO, COO & இயக்குனர் அறிவிக்கப்பட்டது', workflow_step3: 'ஒவ்வொரு ஒப்புதல் அளிப்பவர்: ஒப்புதல் / திருத்தம்', workflow_step4: 'அனைத்து ஒப்புதல் → நூலகத்தில் வெளியிடப்பட்டது',
        filter_flyers: '🖼 ஃபிளையர்கள்', filter_brochures: '📄 பிரசுரங்கள்', filter_leaflets: '📃 துண்டு பிரசுரங்கள்', filter_posters: '🪧 சுவரொட்டிகள்',
        filter_banners: '🏳 பதாகைகள்', filter_approved: '✅ அங்கீகரிக்கப்பட்டது', type_flyer: 'ஃப்ளையர்', type_brochure: 'சிற்றேடு',
        type_leaflet: 'துண்டு பிரசுரம்', type_poster: 'சுவரொட்டி', type_banner: 'பேனர்', type_social: 'சமூக ஊடக கிராஃபிக்',
        no_materials_stage: 'இந்த கட்டத்தில் பொருட்கள் இல்லை', user_access: 'பயனர் அணுகல் கட்டுப்பாடு', folder_access_matrix: 'கோப்புறை அணுகல் மேட்ரிக்ஸ்', brand_guidelines: 'பிராண்ட் வழிகாட்டுதல்கள்',
        color_palette: '🎨 வண்ணத் தட்டு', typography: '🔤 அச்சுக்கலை', logo_rules: '📐 லோகோ விதிகள்', imagery: '🖼 படங்கள்',
        brand_typography_display: 'காட்சி', brand_typography_body: 'உடல்', brand_typography_caption: 'தலைப்பு', brand_typography_display_font: '{org} காட்சி எழுத்துரு',
        brand_typography_body_example: 'இண்டர் ரெகுலர் - 16px, 1.6 வரி உயரம்', brand_typography_caption_example: 'இண்டர் லைட் - 12px, டிராக்கிங் +0.3', brand_logo_clearspace: '✅ குறைந்தபட்ச இடைவெளி: அனைத்து பக்கங்களிலும் 2× லோகோ உயரம்', brand_logo_minimum_size: '✅ குறைந்தபட்ச அளவு: 80px டிஜிட்டல் / 20mm பிரிண்ட்',
        brand_logo_approved_bg: '✅ அங்கீகரிக்கப்பட்ட bg: வெள்ளை, பிராண்ட் முதன்மை, பிராண்ட் டார்க்', brand_logo_no_stretch: '❌ நீட்டவோ, சுழற்றவோ அல்லது நிறமாற்றவோ வேண்டாம்', brand_logo_no_busy_bg: '❌ பிஸியான புகைப்பட பின்னணியில் வைக்க வேண்டாம்', brand_imagery_quality: '✅ உயர்தர உரிமம் பெற்ற புகைப்படம் மட்டுமே',
        brand_imagery_values: '✅ பிராண்ட் மதிப்புகளை பிரதிபலிக்கவும்: நவீன, உள்ளடக்கிய, தொழில்முறை', brand_imagery_color_grade: '✅ பிராண்ட் தட்டுடன் சீரமைக்க வண்ண-தரம்', brand_imagery_avoid_cliched: '❌ க்ளிஷே ஸ்டாக் படங்களைத் தவிர்க்கவும்', brand_imagery_no_watermark: '❌ வாட்டர்மார்க் செய்யப்பட்ட அல்லது குறைந்த தெளிவுத்திறன் கொண்ட படங்கள் இல்லை',
        activity_log: 'செயல்பாட்டு பதிவு', view: 'காண்க', view_only: 'பார்க்க மட்டும்', flagged: 'கொடியேற்றப்பட்டது',
        metadata: 'மெட்டாடேட்டா', approval_status: 'ஒப்புதல் நிலை', brand_score: 'பிராண்ட் ஸ்கோர்', version_history: 'பதிப்பு வரலாறு',
        comments: 'கருத்துகள்', add_comment_placeholder: 'கருத்தைச் சேர்க்கவும்…', post: 'இடுகை', category: 'வகை',
        notes: 'குறிப்புகள்', priority: 'முன்னுரிமை', priority_high: 'உயர் - ஒப்புதலுக்கு முன் சரிசெய்ய வேண்டும்', priority_medium: 'நடுத்தர - சரிசெய்ய வேண்டும்',
        priority_low: 'குறைந்த - சிறிய பரிந்துரை', compare: 'ஒப்பிடு', access_full: 'முழு அணுகல்', access_view: 'பார்க்க மட்டும்',
        access_none: 'அணுகல் இல்லை', activity_uploaded: '{actor} பதிவேற்றிய "{material}"', activity_uploaded_version: '{actor} பதிவேற்றிய "{material} {version}"', activity_approved: '{actor} அங்கீகரிக்கப்பட்ட "{material}"',
        activity_revision: '{actor} "{material}" - {reason} இல் மறுபரிசீலனை கோரப்பட்டது', activity_system_flagged: 'சிஸ்டம்: கொடியிடப்பட்ட {count} சிக்கல்களை AI முன் சரிபார்த்தல் (மதிப்பெண்: {score}/100)', activity_access_granted: '{actor} ஆனது {folder} க்கு {subject} பதிவேற்ற அணுகலை வழங்கியது', reason_brand_color_issue: 'பிராண்ட் நிற பிரச்சனை',
        reason_logo_incorrect: 'லோகோ தவறானது', folder_marketing: 'சந்தைப்படுத்தல்', folder_flyers: 'ஃபிளையர்கள்', folder_2025: '2025',
        folder_2024_archive: '2024 காப்பகம்', folder_brochures: 'பிரசுரங்கள்', folder_products: 'தயாரிப்புகள்', folder_corporate: 'கார்ப்பரேட்',
        folder_posters: 'சுவரொட்டிகள்', folder_events: 'நிகழ்வுகள்', folder_retail_pos: 'சில்லறை பிஓஎஸ்', folder_digital: 'டிஜிட்டல்',
        folder_social_media: 'சமூக ஊடகங்கள்', folder_email_headers: 'மின்னஞ்சல் தலைப்புகள்', folder_print: 'அச்சிடுக', folder_retail: 'சில்லறை விற்பனை',
        folder_outdoor: 'வெளிப்புற', folder_campaigns: 'பிரச்சாரங்கள்', folder_seasonal: 'பருவகால', folder_summer: 'கோடை',
        folder_winter: 'குளிர்காலம்', folder_festive: 'பண்டிகை', folder_in_store: 'கடையில்', folder_pos_materials: 'பிஓஎஸ் பொருட்கள்',
        folder_window_displays: 'சாளரக் காட்சிகள்', folder_promotions: 'பதவி உயர்வுகள்', folder_leaflets: 'துண்டு பிரசுரங்கள்', folder_email: 'மின்னஞ்சல்',
        folder_brand_assets: 'பிராண்ட் சொத்துக்கள்', folder_logos: 'சின்னங்கள்', folder_templates: 'வார்ப்புருக்கள்', folder_client_comms: 'கிளையண்ட் கம்ஸ்',
        folder_presentations: 'விளக்கக்காட்சிகள்', folder_regulatory: 'ஒழுங்குமுறை', folder_compliance_docs: 'இணக்க ஆவணங்கள்', folder_disclosures: 'வெளிப்படுத்தல்கள்',
        folder_banners: 'பதாகைகள்', folder_signage: 'அடையாளம்', folder_healthcare_mktg: 'ஹெல்த்கேர் எம்.கே.டி.ஜி', folder_awareness: 'விழிப்புணர்வு',
        folder_patient_info: 'நோயாளி தகவல்', folder_staff_comms: 'பணியாளர்கள் கம்ஸ்', folder_internal_posters: 'உள் சுவரொட்டிகள்', folder_newsletters: 'செய்திமடல்கள்',
        folder_web_banners: 'வலை பேனர்கள்', folder_education: 'கல்வி', folder_recruitment: 'ஆட்சேர்ப்பு', folder_prospectus: 'ப்ராஸ்பெக்டஸ்',
        folder_open_day: 'திறந்த நாள்', folder_campus: 'வளாகம்', folder_courses: 'படிப்புகள்', folder_graduation: 'பட்டப்படிப்பு',
        folder_conferences: 'மாநாடுகள்', folder_logistics_mktg: 'லாஜிஸ்டிக்ஸ் எம்.கே.டி.ஜி', folder_client_facing: 'வாடிக்கையாளர் எதிர்கொள்ளும்', folder_proposals: 'முன்மொழிவுகள்',
        folder_fleet_branding: 'கடற்படை பிராண்டிங்', folder_vehicle_wraps: 'வாகன உறைகள்', folder_uniforms: 'சீருடைகள்', folder_trade_shows: 'வர்த்தக காட்சிகள்',
        folder_displays: 'காட்சிகள்', notifications_title: 'அறிவிப்புகள் - {org}', notif_sale_await: 'கோடைகால விற்பனை ஃப்ளையர் உங்கள் ஒப்புதலுக்காகக் காத்திருக்கிறது', notif_q3_submitted: 'Q3 தயாரிப்பு சிற்றேடு மதிப்பாய்வுக்காக சமர்ப்பிக்கப்பட்டது',
        notif_event_flagged: 'நிகழ்வு சுவரொட்டி திருத்தத்திற்காக கொடியிடப்பட்டது', notif_retail_approved: 'அனைத்து மதிப்பாய்வாளர்களால் அங்கீகரிக்கப்பட்ட சில்லறை POS பேனர்', access_full_short: '✅ முழு', access_view_short: '👁 பார்க்கவும்',
        access_none_short: '- இல்லை', awaiting: 'காத்திருக்கிறது', ai_brand_compliance: 'AI பிராண்ட் இணக்கம்', send_revision_request: 'மறுசீரமைப்பு கோரிக்கையை அனுப்பவும்',
        revision_describe_text: 'தேவையான மாற்றங்களை விவரிக்கவும். வடிவமைப்பாளருக்கு உடனடியாக அறிவிக்கப்படும்.', revision_describe_placeholder: 'எதை மாற்ற வேண்டும் என்பதை விவரிக்கவும்...', cat_brand_color: 'பிராண்ட் வண்ண சிக்கல்', cat_logo_violation: 'லோகோ பயன்பாடு மீறல்',
        cat_typography: 'அச்சுக்கலை பிரச்சனை', cat_messaging: 'செய்தி அனுப்புதல் / நகல் பிழை', cat_layout: 'லேஅவுட் பிரச்சினை', cat_image_quality: 'படத்தின் தரம்',
        cat_other: 'மற்றவை', comment_revision_text: 'லோகோ இடம் நீட்டிக்கப்பட்டதாகத் தெரிகிறது - பிராண்ட் கிட்டில் இருந்து அங்கீகரிக்கப்பட்ட முதன்மைக் கோப்பைப் பயன்படுத்தவும்.', comment_approved_text: 'நன்றாக இருக்கிறது. பிராண்ட் நிறங்கள் ஸ்பாட் ஆன்.', version_initial_upload: 'ஆரம்ப பதிவேற்றம்',
        version_revised_cta: 'திருத்தப்பட்ட CTA நிறம்', version_final: 'இறுதி', version_initial: 'ஆரம்ப', ai_m1_1: '✅ வண்ணத் தட்டு பிராண்ட் முதன்மை வண்ணங்களுடன் பொருந்துகிறது',
        ai_m1_2: '✅ லோகோ இடம் சரியானது', ai_m1_3: '⚠️ CTA எழுத்துரு அளவு பெரியதாக இருக்கலாம்', ai_m1_4: '✅ படத்தின் தரம் அச்சு தரத்தை சந்திக்கிறது', ai_m1_5: '⚠️ டேக்லைன் மெசேஜிங் வழிகாட்டியில் இருந்து சற்று விலகுகிறது',
        ai_m2_1: '✅ அனைத்து பிராண்ட் நிறங்களும் சரியானவை', ai_m2_2: '✅ அச்சுக்கலை பிராண்ட் வழிகாட்டியுடன் பொருந்துகிறது', ai_m2_3: '✅ லோகோ க்ளியர்ஸ்பேஸ் சரியானது', ai_m2_4: '✅ பட நடை சீரமைக்கப்பட்டது',
        ai_m3_1: '❌ இரண்டாம் வண்ணம் பிராண்ட் பேலட்டில் இல்லை', ai_m3_2: '❌ லோகோ நீட்டிக்கப்பட்டது - பயன்பாட்டு விதிகளை மீறுகிறது', ai_m3_3: '⚠️ உடல் நகல் அச்சிடுவதற்கு மிகவும் சிறியது', ai_m3_4: '⚠️ மாறுபாடு விகிதம் WCAG AA இல் தோல்வியடைகிறது',
        ai_m4_1: '✅ சிறந்த பிராண்ட் இணக்கம்', ai_m4_2: '✅ அனைத்து காசோலைகளும் நிறைவேற்றப்பட்டன', ai_m5_1: '✅ பிளாட்ஃபார்ம் பரிமாணங்கள் சரியானவை', ai_m5_2: '✅ பிராண்ட் வண்ணங்கள் பயன்படுத்தப்பட்டன',
        ai_m5_3: '⚠️ ஐஜி பதிப்பில் சிறிய லோகோ கிளியர்ஸ்பேஸ்', ai_m6_1: '✅ பிராண்ட் நிறங்கள் சரியானவை', ai_m6_2: '⚠️ 300dpiக்குக் கீழே ஒரு படம்', ai_m6_3: '✅ அச்சுக்கலை விதிகள் பின்பற்றப்பட்டன',
        ai_new_color_ok: '✅ வண்ணத் தட்டு பிராண்ட் வழிகாட்டுதல்களுடன் பொருந்துகிறது', ai_new_logo_ok: '✅ அங்கீகரிக்கப்பட்ட வழிகாட்டுதல்களுக்குள் லோகோவை அமைத்தல்', ai_new_typography_ok: '✅ பிராண்டு வழிகாட்டிக்கு இசைவான அச்சுக்கலை', ai_new_imagery_ok: '✅ படங்கள் பிராண்ட் தரநிலைகளை சந்திக்கின்றன',
        ai_new_score_note: '⚠️ வரம்புக்கு மேல் மதிப்பெண் — மதிப்பாய்வுக்கு தயார்', ai_new_color_warn: '⚠️ சிறிய வண்ண மாறுபாடுகள் கண்டறியப்பட்டன', ai_new_clearspace_warn: '⚠️ லோகோ காலியிடம் குறைந்தபட்சம் சற்று கீழே', ai_new_font_warn: '⚠️ எழுத்துரு அளவு சரிசெய்தல் தேவைப்படலாம்'
      },
      kn: {
        dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', materials: 'ಮೆಟೀರಿಯಲ್ಸ್ ಲೈಬ್ರರಿ', approvals: 'ಅನುಮೋದನೆಗಳು', upload: 'ಅಪ್ಲೋಡ್ ವಸ್ತು',
        users: 'ಬಳಕೆದಾರರ ಪ್ರವೇಶ', brand: 'ಬ್ರಾಂಡ್ ಮಾರ್ಗಸೂಚಿಗಳು', activity: 'ಚಟುವಟಿಕೆ ಲಾಗ್', folders: 'ಫೋಲ್ಡರ್‌ಗಳು',
        admin: 'ನಿರ್ವಾಹಕ', welcome: 'ಮರಳಿ ಸ್ವಾಗತ', overview: 'ಮಾರ್ಕೆಟಿಂಗ್ ವಸ್ತುಗಳ ಅವಲೋಕನ', pending: 'ಅನುಮೋದನೆ ಬಾಕಿ ಇದೆ',
        approved: 'ಅನುಮೋದಿಸಲಾಗಿದೆ', revision: 'ಪರಿಷ್ಕರಣೆ ಅಗತ್ಯವಿದೆ', total: 'ಒಟ್ಟು ವಸ್ತುಗಳು', designed_by: 'ವಿನ್ಯಾಸಗೊಳಿಸಿದವರು',
        uploaded: 'ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ', status: 'ಸ್ಥಿತಿ', campaign: 'ಪ್ರಚಾರ', approve: 'ಅನುಮೋದಿಸಿ',
        request_revision: 'ಪರಿಷ್ಕರಣೆ ವಿನಂತಿ', close: 'ಮುಚ್ಚಿ', submit: 'ಅನುಮೋದನೆಗಾಗಿ ಸಲ್ಲಿಸಿ', all_types: 'ಎಲ್ಲಾ ವಿಧಗಳು',
        search_placeholder: 'ಹೆಸರು, ವಿನ್ಯಾಸಕಾರ, ಪ್ರಕಾರದ ಮೂಲಕ ಹುಡುಕಿ...', recent_materials: 'ಇತ್ತೀಚಿನ ವಸ್ತುಗಳು', material_name_1: 'ಬೇಸಿಗೆ ಮಾರಾಟದ ಫ್ಲೈಯರ್', material_name_2: 'Q3 ಉತ್ಪನ್ನ ಕರಪತ್ರ',
        material_name_3: 'ಈವೆಂಟ್ ಪ್ರಕಟಣೆಯ ಪೋಸ್ಟರ್', material_name_4: 'ಚಿಲ್ಲರೆ POS ಬ್ಯಾನರ್', material_name_5: 'ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮ ಬಂಡಲ್', material_name_6: 'ಕರಪತ್ರ - ಹೊಸ ಸೇವೆಗಳು',
        admin_section: 'ನಿರ್ವಾಹಕ', folder_label: 'ಫೋಲ್ಡರ್', lang_name: 'Kannada', login_error_password: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಗುಪ್ತಪದವನ್ನು ನಮೂದಿಸಿ.',
        login_error_invalid: 'ಅಮಾನ್ಯ ಬಳಕೆದಾರಹೆಸರು ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್.', login_subtitle: 'ನಿಮ್ಮ ಪೋರ್ಟಲ್‌ಗೆ ಮುಂದುವರಿಯಲು ಸೈನ್ ಇನ್ ಮಾಡಿ', login_user: 'ಬಳಕೆದಾರ', login_password: 'ಪಾಸ್ವರ್ಡ್',
        login_button: 'ಸೈನ್ ಇನ್ ಮಾಡಿ', signed_in_as: '{user} ನಂತೆ ಸೈನ್ ಇನ್ ಮಾಡಲಾಗಿದೆ', switched_to: '{org} ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ', viewing_as: 'ಇದರಂತೆ ವೀಕ್ಷಿಸಲಾಗುತ್ತಿದೆ: {user}',
        logged_out: 'ನೀವು ಲಾಗ್ ಔಟ್ ಆಗಿರುವಿರಿ', language_changed: 'ಭಾಷೆಯನ್ನು {lang} ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ', switch_user_view: 'ಬಳಕೆದಾರರ ವೀಕ್ಷಣೆಯನ್ನು ಬದಲಿಸಿ', logout: 'ಲಾಗ್ಔಟ್',
        selected: 'ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ', file_ready_submit: 'ಫೈಲ್ ಸಿದ್ಧವಾಗಿದೆ - ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ ಮತ್ತು ಸಲ್ಲಿಸಿ', enter_material_name: 'ದಯವಿಟ್ಟು ವಸ್ತುವಿನ ಹೆಸರನ್ನು ನಮೂದಿಸಿ', running_precheck: '🤖 {org} ಗಾಗಿ AI ಬ್ರ್ಯಾಂಡ್ ಪೂರ್ವ-ಪರಿಶೀಲನೆಯನ್ನು ಚಾಲನೆ ಮಾಡಲಾಗುತ್ತಿದೆ...',
        precheck_complete: '✅ ಪೂರ್ವ-ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಂಡಿದೆ - ಸ್ಕೋರ್ 81/100', sent_to_approvers: '"{name}" ಅನ್ನು {org} 📨 ನಲ್ಲಿ ಅನುಮೋದಿಸುವವರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ', edit_access_button: 'ಪ್ರವೇಶವನ್ನು ಸಂಪಾದಿಸಿ', access_saved: 'ಪ್ರವೇಶ ಅನುಮತಿಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ',
        save_changes: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ', configure_access_for: '{org} ಒಳಗೆ ಈ ಬಳಕೆದಾರರಿಗೆ ಫೋಲ್ಡರ್ ಪ್ರವೇಶವನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿ.', comment_added: 'ಕಾಮೆಂಟ್ ಸೇರಿಸಲಾಗಿದೆ', version_compare_info: 'ಆವೃತ್ತಿ ಹೋಲಿಕೆ - ಪೂರ್ಣ ನಿರ್ಮಾಣ ವೈಶಿಷ್ಟ್ಯ',
        material_fully_approved: '"{material}" ಸಂಪೂರ್ಣವಾಗಿ ಅನುಮೋದಿಸಲಾಗಿದೆ! 🎉', revision_requested: '"{material}" ನಲ್ಲಿ ಪರಿಷ್ಕರಣೆ ವಿನಂತಿಸಲಾಗಿದೆ', approval_recorded: 'ಅನುಮೋದನೆಯನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ ✅', revision_request_sent: 'ಪರಿಷ್ಕರಣೆ ವಿನಂತಿಯನ್ನು ಕಳುಹಿಸಲಾಗಿದೆ ⚠️',
        "org_Bio Factor": 'ಜೈವಿಕ ಅಂಶ', "org_Ferty Base": 'ಫರ್ಟಿ ಬೇಸ್', "org_Aqua": 'ಆಕ್ವಾ', "org_One Health Centre": 'ಒಂದು ಆರೋಗ್ಯ ಕೇಂದ್ರ',
        "org_Water Links": 'ನೀರಿನ ಲಿಂಕ್‌ಗಳು', "org_Beyond Organic": 'ಸಾವಯವವನ್ನು ಮೀರಿ', user_admin: 'ನಿರ್ವಾಹಕ', user_ceo: 'ಸಿಇಒ',
        user_coo: 'COO', user_director: 'ನಿರ್ದೇಶಕ', role_admin: 'ನಿರ್ವಾಹಕ', role_ceo: 'ಸಿಇಒ',
        role_coo: 'COO', role_director: 'ನಿರ್ದೇಶಕ', role_user: 'ಬಳಕೆದಾರ', perm_upload: 'ಅಪ್ಲೋಡ್ ಮಾಡಿ', perm_approve: 'ಅನುಮೋದಿಸಿ',
        perm_delete: 'ಅಳಿಸಿ', perm_manage_users: 'ಬಳಕೆದಾರರನ್ನು ನಿರ್ವಹಿಸಿ', perm_all_folders: 'ಎಲ್ಲಾ ಫೋಲ್ಡರ್‌ಗಳು', perm_view_all: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
        perm_final_approve: 'ಅಂತಿಮ ಅನುಮೋದನೆ', perm_manage_campaigns: 'ಅಭಿಯಾನಗಳನ್ನು ನಿರ್ವಹಿಸಿ', perm_assigned_folders: 'ನಿಯೋಜಿಸಲಾದ ಫೋಲ್ಡರ್‌ಗಳು', perm_view_brand_guide: 'ಬ್ರ್ಯಾಂಡ್ ಗೈಡ್ ವೀಕ್ಷಿಸಿ',
        sector_technology: 'ತಂತ್ರಜ್ಞಾನ', sector_retail_fmcg: 'ಚಿಲ್ಲರೆ & FMCG', sector_financial_services: 'ಹಣಕಾಸು ಸೇವೆಗಳು', sector_healthcare: 'ಆರೋಗ್ಯ ರಕ್ಷಣೆ',
        sector_education: 'ಶಿಕ್ಷಣ', sector_logistics_supply: 'ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಮತ್ತು ಸರಬರಾಜು', select_org_subtitle: 'ಮುಂದುವರಿಸಲು ನಿಮ್ಮ ಸಂಸ್ಥೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ', select_lang_subtitle: 'ಕೆಲಸದ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        continue_to_language: 'ಭಾಷೆಗೆ ಮುಂದುವರಿಯಿರಿ →', back: '← ಹಿಂದೆ', enter_portal: 'ಪೋರ್ಟಲ್ ನಮೂದಿಸಿ →', selection_flow_path: 'ಸಂಸ್ಥೆ → ಭಾಷೆ → ಪೋರ್ಟಲ್',
        switch_org: 'ಸ್ವಿಚ್ ಸಂಸ್ಥೆ', switch_lang: 'ಭಾಷೆ ಬದಲಿಸಿ', upload_new: '+ ಹೊಸದನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ', material_name: 'ವಸ್ತುವಿನ ಹೆಸರು',
        type: 'ಟೈಪ್ ಮಾಡಿ', campaign_project: 'ಪ್ರಚಾರ / ಯೋಜನೆ', designer_notes: 'ಡಿಸೈನರ್ ಟಿಪ್ಪಣಿಗಳು', folder_location: 'ಫೋಲ್ಡರ್ ಸ್ಥಳ',
        upload_title: 'ಹೊಸ ಮೆಟೀರಿಯಲ್ ಅನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ', upload_description: 'ವಿಮರ್ಶೆಗಾಗಿ ವಿನ್ಯಾಸವನ್ನು ಸಲ್ಲಿಸಿ - AI ಪೂರ್ವ ಪರಿಶೀಲನೆಯು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ರನ್ ಆಗುತ್ತದೆ', click_to_select: 'ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ', file_types_hint: 'PDF, PNG, JPG, AI, PSD - 50MB ವರೆಗೆ',
        precheck_title: '🤖 AI ಪೂರ್ವ ಪರಿಶೀಲನೆ', precheck_description: 'ಅನುಮೋದಕರನ್ನು ತಲುಪುವ ಮೊದಲು ನಿಮ್ಮ ವಿನ್ಯಾಸವನ್ನು ಬ್ರ್ಯಾಂಡ್ ಮಾರ್ಗಸೂಚಿಗಳ ವಿರುದ್ಧ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.', precheck_color_compliance: '✅ ಬಣ್ಣದ ಪ್ಯಾಲೆಟ್ ಅನುಸರಣೆ', precheck_logo_placement: '✅ ಲೋಗೋ ಪ್ಲೇಸ್‌ಮೆಂಟ್ ಮತ್ತು ಸುರಕ್ಷಿತ ವಲಯ',
        precheck_typography_consistency: '✅ ಮುದ್ರಣಕಲೆ ಸ್ಥಿರತೆ', precheck_previous_approved: '✅ ಹಿಂದಿನ ಅನುಮೋದಿತ ವಿನ್ಯಾಸಗಳೊಂದಿಗೆ ಹೋಲಿಕೆ', precheck_score: '✅ ಬ್ರ್ಯಾಂಡ್ ಮಾರ್ಗಸೂಚಿಗಳ ಸ್ಕೋರ್ (0–100)', workflow_title: '📋 ಕೆಲಸದ ಹರಿವು',
        workflow_step1: 'ಅಪ್‌ಲೋಡ್ + AI ಪೂರ್ವ-ಪರಿಶೀಲನೆ', workflow_step2: 'CEO, COO ಮತ್ತು ನಿರ್ದೇಶಕರಿಗೆ ಸೂಚಿಸಲಾಗಿದೆ', workflow_step3: 'ಪ್ರತಿ ಅನುಮೋದಕರು: ಅನುಮೋದಿಸಿ / ಪರಿಷ್ಕರಣೆ', workflow_step4: 'ಎಲ್ಲಾ ಅನುಮೋದನೆ → ಲೈಬ್ರರಿಗೆ ಪ್ರಕಟಿಸಲಾಗಿದೆ',
        filter_flyers: '🖼 ಫ್ಲೈಯರ್ಸ್', filter_brochures: '📄 ಕರಪತ್ರಗಳು', filter_leaflets: '📃 ಕರಪತ್ರಗಳು', filter_posters: '🪧 ಪೋಸ್ಟರ್‌ಗಳು',
        filter_banners: '🏳 ಬ್ಯಾನರ್‌ಗಳು', filter_approved: '✅ ಅನುಮೋದಿಸಲಾಗಿದೆ', type_flyer: 'ಫ್ಲೈಯರ್', type_brochure: 'ಕರಪತ್ರ',
        type_leaflet: 'ಕರಪತ್ರ', type_poster: 'ಪೋಸ್ಟರ್', type_banner: 'ಬ್ಯಾನರ್', type_social: 'ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮ ಗ್ರಾಫಿಕ್',
        no_materials_stage: 'ಈ ಹಂತದಲ್ಲಿ ಯಾವುದೇ ಸಾಮಗ್ರಿಗಳಿಲ್ಲ', user_access: 'ಬಳಕೆದಾರ ಪ್ರವೇಶ ನಿಯಂತ್ರಣ', folder_access_matrix: 'ಫೋಲ್ಡರ್ ಪ್ರವೇಶ ಮ್ಯಾಟ್ರಿಕ್ಸ್', brand_guidelines: 'ಬ್ರಾಂಡ್ ಮಾರ್ಗಸೂಚಿಗಳು',
        color_palette: '🎨 ಬಣ್ಣದ ಪ್ಯಾಲೆಟ್', typography: '🔤 ಮುದ್ರಣಕಲೆ', logo_rules: '📐 ಲೋಗೋ ನಿಯಮಗಳು', imagery: '🖼 ಚಿತ್ರಣ',
        brand_typography_display: 'ಪ್ರದರ್ಶನ', brand_typography_body: 'ದೇಹ', brand_typography_caption: 'ಶೀರ್ಷಿಕೆ', brand_typography_display_font: '{org} ಡಿಸ್ಪ್ಲೇ ಫಾಂಟ್',
        brand_typography_body_example: 'ಇಂಟರ್ ರೆಗ್ಯುಲರ್ - 16px, 1.6 ಸಾಲಿನ ಎತ್ತರ', brand_typography_caption_example: 'ಇಂಟರ್ ಲೈಟ್ - 12px, ಟ್ರ್ಯಾಕಿಂಗ್ +0.3', brand_logo_clearspace: '✅ ಕನಿಷ್ಠ ಕ್ಲಿಯರ್‌ಸ್ಪೇಸ್: ಎಲ್ಲಾ ಕಡೆಗಳಲ್ಲಿ 2× ಲೋಗೋ ಎತ್ತರ', brand_logo_minimum_size: '✅ ಕನಿಷ್ಠ ಗಾತ್ರ: 80px ಡಿಜಿಟಲ್ / 20mm ಮುದ್ರಣ',
        brand_logo_approved_bg: '✅ ಅನುಮೋದಿತ ಬಿಜಿ: ಬಿಳಿ, ಬ್ರಾಂಡ್ ಪ್ರಾಥಮಿಕ, ಬ್ರ್ಯಾಂಡ್ ಡಾರ್ಕ್', brand_logo_no_stretch: '❌ ಹಿಗ್ಗಿಸಬೇಡಿ, ತಿರುಗಿಸಬೇಡಿ ಅಥವಾ ಬಣ್ಣ ಮಾಡಬೇಡಿ', brand_logo_no_busy_bg: '❌ ಬಿಡುವಿಲ್ಲದ ಛಾಯಾಗ್ರಹಣದ ಹಿನ್ನೆಲೆಯಲ್ಲಿ ಇರಿಸಬೇಡಿ', brand_imagery_quality: '✅ ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಪರವಾನಗಿ ಪಡೆದ ಛಾಯಾಗ್ರಹಣ ಮಾತ್ರ',
        brand_imagery_values: '✅ ಬ್ರ್ಯಾಂಡ್ ಮೌಲ್ಯಗಳನ್ನು ಪ್ರತಿಬಿಂಬಿಸಿ: ಆಧುನಿಕ, ಅಂತರ್ಗತ, ವೃತ್ತಿಪರ', brand_imagery_color_grade: '✅ ಬ್ರಾಂಡ್ ಪ್ಯಾಲೆಟ್‌ನೊಂದಿಗೆ ಜೋಡಿಸಲು ಬಣ್ಣ-ದರ್ಜೆ', brand_imagery_avoid_cliched: '❌ ಕ್ಲೀಷೆ ಸ್ಟಾಕ್ ಚಿತ್ರಣವನ್ನು ತಪ್ಪಿಸಿ', brand_imagery_no_watermark: '❌ ಯಾವುದೇ ವಾಟರ್‌ಮಾರ್ಕ್ ಅಥವಾ ಕಡಿಮೆ ರೆಸಲ್ಯೂಶನ್ ಚಿತ್ರಗಳಿಲ್ಲ',
        activity_log: 'ಚಟುವಟಿಕೆ ಲಾಗ್', view: 'ವೀಕ್ಷಿಸಿ', view_only: 'ವೀಕ್ಷಿಸಿ ಮಾತ್ರ', flagged: 'ಧ್ವಜಾರೋಹಣ ಮಾಡಿದರು',
        metadata: 'ಮೆಟಾಡೇಟಾ', approval_status: 'ಅನುಮೋದನೆ ಸ್ಥಿತಿ', brand_score: 'ಬ್ರಾಂಡ್ ಸ್ಕೋರ್', version_history: 'ಆವೃತ್ತಿ ಇತಿಹಾಸ',
        comments: 'ಕಾಮೆಂಟ್‌ಗಳು', add_comment_placeholder: 'ಕಾಮೆಂಟ್ ಸೇರಿಸಿ...', post: 'ಪೋಸ್ಟ್ ಮಾಡಿ', category: 'ವರ್ಗ',
        notes: 'ಟಿಪ್ಪಣಿಗಳು', priority: 'ಆದ್ಯತೆ', priority_high: 'ಹೆಚ್ಚು - ಅನುಮೋದನೆಯ ಮೊದಲು ಸರಿಪಡಿಸಬೇಕು', priority_medium: 'ಮಧ್ಯಮ - ಸರಿಪಡಿಸಬೇಕು',
        priority_low: 'ಕಡಿಮೆ - ಸಣ್ಣ ಸಲಹೆ', compare: 'ಹೋಲಿಸಿ', access_full: 'ಪೂರ್ಣ ಪ್ರವೇಶ', access_view: 'ವೀಕ್ಷಣೆ ಮಾತ್ರ',
        access_none: 'ಪ್ರವೇಶವಿಲ್ಲ', activity_uploaded: '{actor} ಅಪ್‌ಲೋಡ್ "{material}"', activity_uploaded_version: '{actor} ಅಪ್‌ಲೋಡ್ "{material} {version}"', activity_approved: '{actor} ಅನುಮೋದಿತ "{material}"',
        activity_revision: '{actor} "{material}" - {reason} ನಲ್ಲಿ ಪರಿಷ್ಕರಣೆಗೆ ವಿನಂತಿಸಿದೆ', activity_system_flagged: 'ಸಿಸ್ಟಮ್: AI ಪೂರ್ವ-ಪರಿಶೀಲನೆ ಫ್ಲ್ಯಾಗ್ ಮಾಡಲಾದ {count} ಸಮಸ್ಯೆಗಳು (ಸ್ಕೋರ್: {score}/100)', activity_access_granted: '{actor} {subject} ಗೆ {folder} ಗೆ ಅಪ್‌ಲೋಡ್ ಪ್ರವೇಶವನ್ನು ನೀಡಿದೆ', reason_brand_color_issue: 'ಬ್ರಾಂಡ್ ಬಣ್ಣದ ಸಮಸ್ಯೆ',
        reason_logo_incorrect: 'ಲೋಗೋ ತಪ್ಪಾಗಿದೆ', folder_marketing: 'ಮಾರ್ಕೆಟಿಂಗ್', folder_flyers: 'ಫ್ಲೈಯರ್ಸ್', folder_2025: '2025',
        folder_2024_archive: '2024 ಆರ್ಕೈವ್', folder_brochures: 'ಕರಪತ್ರಗಳು', folder_products: 'ಉತ್ಪನ್ನಗಳು', folder_corporate: 'ಕಾರ್ಪೊರೇಟ್',
        folder_posters: 'ಪೋಸ್ಟರ್ಗಳು', folder_events: 'ಘಟನೆಗಳು', folder_retail_pos: 'ಚಿಲ್ಲರೆ POS', folder_digital: 'ಡಿಜಿಟಲ್',
        folder_social_media: 'ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮ', folder_email_headers: 'ಇಮೇಲ್ ಶೀರ್ಷಿಕೆಗಳು', folder_print: 'ಮುದ್ರಿಸು', folder_retail: 'ಚಿಲ್ಲರೆ',
        folder_outdoor: 'ಹೊರಾಂಗಣ', folder_campaigns: 'ಪ್ರಚಾರಗಳು', folder_seasonal: 'ಕಾಲೋಚಿತ', folder_summer: 'ಬೇಸಿಗೆ',
        folder_winter: 'ಚಳಿಗಾಲ', folder_festive: 'ಹಬ್ಬದ', folder_in_store: 'ಅಂಗಡಿಯಲ್ಲಿ', folder_pos_materials: 'POS ಮೆಟೀರಿಯಲ್ಸ್',
        folder_window_displays: 'ವಿಂಡೋ ಪ್ರದರ್ಶನಗಳು', folder_promotions: 'ಪ್ರಚಾರಗಳು', folder_leaflets: 'ಕರಪತ್ರಗಳು', folder_email: 'ಇಮೇಲ್',
        folder_brand_assets: 'ಬ್ರಾಂಡ್ ಸ್ವತ್ತುಗಳು', folder_logos: 'ಲೋಗೋಗಳು', folder_templates: 'ಟೆಂಪ್ಲೇಟ್‌ಗಳು', folder_client_comms: 'ಗ್ರಾಹಕ ಕಾಮ್ಸ್',
        folder_presentations: 'ಪ್ರಸ್ತುತಿಗಳು', folder_regulatory: 'ನಿಯಂತ್ರಕ', folder_compliance_docs: 'ಅನುಸರಣೆ ಡಾಕ್ಸ್', folder_disclosures: 'ಬಹಿರಂಗಪಡಿಸುವಿಕೆಗಳು',
        folder_banners: 'ಬ್ಯಾನರ್‌ಗಳು', folder_signage: 'ಸಂಕೇತ', folder_healthcare_mktg: 'ಹೆಲ್ತ್‌ಕೇರ್ ಎಂಕೆಟಿಜಿ', folder_awareness: 'ಅರಿವು',
        folder_patient_info: 'ರೋಗಿಯ ಮಾಹಿತಿ', folder_staff_comms: 'ಸಿಬ್ಬಂದಿ ಕಾಮ್ಸ್', folder_internal_posters: 'ಆಂತರಿಕ ಪೋಸ್ಟರ್ಗಳು', folder_newsletters: 'ಸುದ್ದಿಪತ್ರಗಳು',
        folder_web_banners: 'ವೆಬ್ ಬ್ಯಾನರ್‌ಗಳು', folder_education: 'ಶಿಕ್ಷಣ', folder_recruitment: 'ನೇಮಕಾತಿ', folder_prospectus: 'ಪ್ರಾಸ್ಪೆಕ್ಟಸ್',
        folder_open_day: 'ತೆರೆದ ದಿನ', folder_campus: 'ಕ್ಯಾಂಪಸ್', folder_courses: 'ಕೋರ್ಸ್‌ಗಳು', folder_graduation: 'ಪದವಿ',
        folder_conferences: 'ಸಮ್ಮೇಳನಗಳು', folder_logistics_mktg: 'ಲಾಜಿಸ್ಟಿಕ್ಸ್ Mktg', folder_client_facing: 'ಗ್ರಾಹಕರು ಎದುರಿಸುತ್ತಿದ್ದಾರೆ', folder_proposals: 'ಪ್ರಸ್ತಾವನೆಗಳು',
        folder_fleet_branding: 'ಫ್ಲೀಟ್ ಬ್ರ್ಯಾಂಡಿಂಗ್', folder_vehicle_wraps: 'ವಾಹನ ಸುತ್ತುಗಳು', folder_uniforms: 'ಸಮವಸ್ತ್ರಗಳು', folder_trade_shows: 'ವ್ಯಾಪಾರ ಪ್ರದರ್ಶನಗಳು',
        folder_displays: 'ಪ್ರದರ್ಶನಗಳು', notifications_title: 'ಅಧಿಸೂಚನೆಗಳು - {org}', notif_sale_await: 'ಬೇಸಿಗೆ ಮಾರಾಟದ ಫ್ಲೈಯರ್ ನಿಮ್ಮ ಅನುಮೋದನೆಗೆ ಕಾಯುತ್ತಿದೆ', notif_q3_submitted: 'Q3 ಉತ್ಪನ್ನ ಕರಪತ್ರವನ್ನು ಪರಿಶೀಲನೆಗಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ',
        notif_event_flagged: 'ಈವೆಂಟ್ ಪೋಸ್ಟರ್ ಅನ್ನು ಪರಿಷ್ಕರಣೆಗಾಗಿ ಫ್ಲ್ಯಾಗ್ ಮಾಡಲಾಗಿದೆ', notif_retail_approved: 'ಎಲ್ಲಾ ವಿಮರ್ಶಕರು ಅನುಮೋದಿಸಿದ ಚಿಲ್ಲರೆ POS ಬ್ಯಾನರ್', access_full_short: '✅ ಪೂರ್ಣ', access_view_short: '👁 ವೀಕ್ಷಿಸಿ',
        access_none_short: '- ಯಾವುದೂ ಇಲ್ಲ', awaiting: 'ನಿರೀಕ್ಷಿಸಲಾಗುತ್ತಿದೆ', ai_brand_compliance: 'AI ಬ್ರ್ಯಾಂಡ್ ಅನುಸರಣೆ', send_revision_request: 'ಪರಿಷ್ಕರಣೆ ವಿನಂತಿಯನ್ನು ಕಳುಹಿಸಿ',
        revision_describe_text: 'ಅಗತ್ಯವಿರುವ ಬದಲಾವಣೆಗಳನ್ನು ವಿವರಿಸಿ. ವಿನ್ಯಾಸಕಾರರಿಗೆ ತಕ್ಷಣ ಸೂಚನೆ ನೀಡಲಾಗುವುದು.', revision_describe_placeholder: 'ಏನನ್ನು ಬದಲಾಯಿಸಬೇಕು ಎಂಬುದನ್ನು ವಿವರಿಸಿ...', cat_brand_color: 'ಬ್ರಾಂಡ್ ಬಣ್ಣದ ಸಮಸ್ಯೆ', cat_logo_violation: 'ಲೋಗೋ ಬಳಕೆಯ ಉಲ್ಲಂಘನೆ',
        cat_typography: 'ಮುದ್ರಣಕಲೆ ಸಮಸ್ಯೆ', cat_messaging: 'ಸಂದೇಶ ಕಳುಹಿಸುವಿಕೆ / ನಕಲು ದೋಷ', cat_layout: 'ಲೇಔಟ್ ಸಮಸ್ಯೆ', cat_image_quality: 'ಚಿತ್ರದ ಗುಣಮಟ್ಟ',
        cat_other: 'ಇತರೆ', comment_revision_text: 'ಲೋಗೋ ಪ್ಲೇಸ್‌ಮೆಂಟ್ ವಿಸ್ತರಿಸಿದಂತೆ ಕಾಣುತ್ತದೆ - ಬ್ರ್ಯಾಂಡ್ ಕಿಟ್‌ನಿಂದ ಅನುಮೋದಿತ ಮಾಸ್ಟರ್ ಫೈಲ್ ಅನ್ನು ಬಳಸಿ.', comment_approved_text: 'ಚೆನ್ನಾಗಿ ಕಾಣುತ್ತದೆ. ಬ್ರ್ಯಾಂಡ್ ಬಣ್ಣಗಳು ಸ್ಪಾಟ್ ಆನ್ ಆಗಿದೆ.', version_initial_upload: 'ಆರಂಭಿಕ ಅಪ್ಲೋಡ್',
        version_revised_cta: 'ಪರಿಷ್ಕೃತ CTA ಬಣ್ಣ', version_final: 'ಅಂತಿಮ', version_initial: 'ಆರಂಭಿಕ', ai_m1_1: '✅ ಬಣ್ಣದ ಪ್ಯಾಲೆಟ್ ಬ್ರ್ಯಾಂಡ್ ಪ್ರಾಥಮಿಕ ಬಣ್ಣಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ',
        ai_m1_2: '✅ ಲೋಗೋ ನಿಯೋಜನೆ ಸರಿಯಾಗಿದೆ', ai_m1_3: '⚠️ CTA ಫಾಂಟ್ ಗಾತ್ರವು ದೊಡ್ಡದಾಗಿರಬಹುದು', ai_m1_4: '✅ ಚಿತ್ರದ ಗುಣಮಟ್ಟವು ಮುದ್ರಣ ಮಾನದಂಡಗಳನ್ನು ಪೂರೈಸುತ್ತದೆ', ai_m1_5: '⚠️ ಟ್ಯಾಗ್‌ಲೈನ್ ಮೆಸೇಜಿಂಗ್ ಗೈಡ್‌ನಿಂದ ಸ್ವಲ್ಪ ಭಿನ್ನವಾಗಿದೆ',
        ai_m2_1: '✅ ಎಲ್ಲಾ ಬ್ರ್ಯಾಂಡ್ ಬಣ್ಣಗಳು ಸರಿಯಾಗಿವೆ', ai_m2_2: '✅ ಮುದ್ರಣಕಲೆಯು ಬ್ರ್ಯಾಂಡ್ ಮಾರ್ಗದರ್ಶಿಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ', ai_m2_3: '✅ ಲೋಗೋ ಕ್ಲಿಯರ್‌ಸ್ಪೇಸ್ ಸರಿಯಾಗಿದೆ', ai_m2_4: '✅ ಚಿತ್ರಣ ಶೈಲಿಯನ್ನು ಜೋಡಿಸಲಾಗಿದೆ',
        ai_m3_1: '❌ ದ್ವಿತೀಯ ಬಣ್ಣವು ಬ್ರ್ಯಾಂಡ್ ಪ್ಯಾಲೆಟ್‌ನಲ್ಲಿಲ್ಲ', ai_m3_2: '❌ ಲೋಗೋ ವಿಸ್ತರಿಸಲಾಗಿದೆ - ಬಳಕೆಯ ನಿಯಮಗಳನ್ನು ಉಲ್ಲಂಘಿಸುತ್ತದೆ', ai_m3_3: '⚠️ ದೇಹದ ನಕಲು ಮುದ್ರಣಕ್ಕೆ ತುಂಬಾ ಚಿಕ್ಕದಾಗಿದೆ', ai_m3_4: '⚠️ ಕಾಂಟ್ರಾಸ್ಟ್ ಅನುಪಾತವು WCAG AA ವಿಫಲಗೊಳ್ಳುತ್ತದೆ',
        ai_m4_1: '✅ ಅತ್ಯುತ್ತಮ ಬ್ರ್ಯಾಂಡ್ ಅನುಸರಣೆ', ai_m4_2: '✅ ಎಲ್ಲಾ ಚೆಕ್‌ಗಳು ಪಾಸ್ ಆಗಿವೆ', ai_m5_1: '✅ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಆಯಾಮಗಳು ಸರಿಯಾಗಿವೆ', ai_m5_2: '✅ ಬ್ರಾಂಡ್ ಬಣ್ಣಗಳನ್ನು ಅನ್ವಯಿಸಲಾಗಿದೆ',
        ai_m5_3: '⚠️ ಐಜಿ ಆವೃತ್ತಿಯಲ್ಲಿ ಮೈನರ್ ಲೋಗೋ ಕ್ಲಿಯರ್‌ಸ್ಪೇಸ್', ai_m6_1: '✅ ಬ್ರ್ಯಾಂಡ್ ಬಣ್ಣಗಳು ಸರಿಯಾಗಿವೆ', ai_m6_2: '⚠️ 300dpi ಕೆಳಗೆ ಒಂದು ಚಿತ್ರ', ai_m6_3: '✅ ಮುದ್ರಣಕಲೆ ನಿಯಮಗಳನ್ನು ಅನುಸರಿಸಲಾಗಿದೆ',
        ai_new_color_ok: '✅ ಬಣ್ಣದ ಪ್ಯಾಲೆಟ್ ಬ್ರ್ಯಾಂಡ್ ಮಾರ್ಗಸೂಚಿಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ', ai_new_logo_ok: '✅ ಅನುಮೋದಿತ ಮಾರ್ಗಸೂಚಿಗಳಲ್ಲಿ ಲೋಗೋ ನಿಯೋಜನೆ', ai_new_typography_ok: '✅ ಮುದ್ರಣಕಲೆಯು ಬ್ರ್ಯಾಂಡ್ ಮಾರ್ಗದರ್ಶಿಗೆ ಅನುಗುಣವಾಗಿರುತ್ತದೆ', ai_new_imagery_ok: '✅ ಚಿತ್ರಣವು ಬ್ರ್ಯಾಂಡ್ ಮಾನದಂಡಗಳನ್ನು ಪೂರೈಸುತ್ತದೆ',
        ai_new_score_note: '⚠️ ಮಿತಿಗಿಂತ ಮೇಲಿನ ಸ್ಕೋರ್ - ಪರಿಶೀಲನೆಗೆ ಸಿದ್ಧವಾಗಿದೆ', ai_new_color_warn: '⚠️ ಚಿಕ್ಕ ಬಣ್ಣ ವ್ಯತ್ಯಾಸಗಳು ಪತ್ತೆಯಾಗಿವೆ', ai_new_clearspace_warn: '⚠️ ಲೋಗೋ ಕ್ಲಿಯರ್‌ಸ್ಪೇಸ್ ಕನಿಷ್ಠಕ್ಕಿಂತ ಸ್ವಲ್ಪ ಕಡಿಮೆ', ai_new_font_warn: '⚠️ ಫಾಂಟ್ ಗಾತ್ರಕ್ಕೆ ಹೊಂದಾಣಿಕೆ ಬೇಕಾಗಬಹುದು'
      },
      gu: {
        dashboard: 'ડેશબોર્ડ', materials: 'સામગ્રી પુસ્તકાલય', approvals: 'મંજૂરીઓ', upload: 'સામગ્રી અપલોડ કરો',
        users: 'વપરાશકર્તા ઍક્સેસ', brand: 'બ્રાન્ડ માર્ગદર્શિકા', activity: 'પ્રવૃત્તિ લોગ', folders: 'ફોલ્ડર્સ',
        admin: 'એડમિન', welcome: 'ફરી સ્વાગત છે', overview: 'માર્કેટિંગ સામગ્રી વિહંગાવલોકન', pending: 'મંજૂરી બાકી છે',
        approved: 'મંજૂર', revision: 'રિવિઝનની જરૂર છે', total: 'કુલ સામગ્રી', designed_by: 'દ્વારા ડિઝાઇન કરવામાં આવી છે',
        uploaded: 'અપલોડ કર્યું', status: 'સ્થિતિ', campaign: 'ઝુંબેશ', approve: 'મંજૂર',
        request_revision: 'પુનરાવર્તનની વિનંતી કરો', close: 'બંધ કરો', submit: 'મંજૂરી માટે સબમિટ કરો', all_types: 'બધા પ્રકારો',
        search_placeholder: 'નામ, ડિઝાઇનર, પ્રકાર દ્વારા શોધો...', recent_materials: 'તાજેતરની સામગ્રી', material_name_1: 'સમર સેલ ફ્લાયર', material_name_2: 'Q3 ઉત્પાદન બ્રોશર',
        material_name_3: 'ઇવેન્ટની જાહેરાત પોસ્ટર', material_name_4: 'છૂટક POS બેનર', material_name_5: 'સોશિયલ મીડિયા બંડલ', material_name_6: 'પત્રિકા - નવી સેવાઓ',
        admin_section: 'એડમિન', folder_label: 'ફોલ્ડર', lang_name: 'Gujarati', login_error_password: 'કૃપા કરીને તમારો પાસવર્ડ દાખલ કરો.',
        login_error_invalid: 'અમાન્ય વપરાશકર્તા નામ અથવા પાસવર્ડ.', login_subtitle: 'તમારા પોર્ટલ પર ચાલુ રાખવા માટે સાઇન ઇન કરો', login_user: 'વપરાશકર્તા', login_password: 'પાસવર્ડ',
        login_button: 'સાઇન ઇન કરો', signed_in_as: '{user} તરીકે સાઇન ઇન કર્યું', switched_to: '{org} પર સ્વિચ કર્યું', viewing_as: 'આ રીતે જોઈ રહ્યાં છીએ: {user}',
        logged_out: 'તમે લૉગ આઉટ થઈ ગયા છો', language_changed: 'ભાષા {lang} માં બદલાઈ', switch_user_view: 'વપરાશકર્તા દૃશ્ય સ્વિચ કરો', logout: 'લોગઆઉટ',
        selected: 'પસંદ કરેલ', file_ready_submit: 'ફાઇલ તૈયાર છે - વિગતો ભરો અને સબમિટ કરો', enter_material_name: 'કૃપા કરીને સામગ્રીનું નામ દાખલ કરો', running_precheck: '🤖 {org} માટે AI બ્રાન્ડ પ્રી-ચેક ચલાવી રહ્યાં છીએ…',
        precheck_complete: '✅ પૂર્વ-તપાસ પૂર્ણ — સ્કોર 81/100', sent_to_approvers: '"{name}" {org} 📨 પર મંજૂરકર્તાઓને મોકલવામાં આવ્યું', edit_access_button: 'એડિટ એક્સેસ', access_saved: 'ઍક્સેસ પરવાનગીઓ સાચવી',
        save_changes: 'ફેરફારો સાચવો', configure_access_for: '{org} ની અંદર આ વપરાશકર્તા માટે ફોલ્ડર ઍક્સેસ ગોઠવો.', comment_added: 'ટિપ્પણી ઉમેરી', version_compare_info: 'સંસ્કરણની તુલના કરો - સંપૂર્ણ બિલ્ડ સુવિધા',
        material_fully_approved: '"{material}" સંપૂર્ણપણે મંજૂર! 🎉', revision_requested: '"{material}" પર પુનરાવર્તનની વિનંતી કરી', approval_recorded: 'મંજૂરી રેકોર્ડ ✅', revision_request_sent: 'પુનરાવર્તન વિનંતી મોકલી ⚠️',
        "org_Bio Factor": 'બાયો ફેક્ટર', "org_Ferty Base": 'ફર્ટી બેઝ', "org_Aqua": 'એક્વા', "org_One Health Centre": 'એક આરોગ્ય કેન્દ્ર',
        "org_Water Links": 'વોટર લિંક્સ', "org_Beyond Organic": 'બિયોન્ડ ઓર્ગેનિક', user_admin: 'એડમિન', user_ceo: 'સીઇઓ',
        user_coo: 'સીઓઓ', user_director: 'દિગ્દર્શક', role_admin: 'એડમિન', role_ceo: 'સીઇઓ',
        role_coo: 'સીઓઓ', role_director: 'દિગ્દર્શક', role_user: 'વપરાશકર્તા', perm_upload: 'અપલોડ કરો', perm_approve: 'મંજૂર',
        perm_delete: 'કાઢી નાખો', perm_manage_users: 'વપરાશકર્તાઓ મેનેજ કરો', perm_all_folders: 'બધા ફોલ્ડર્સ', perm_view_all: 'બધા જુઓ',
        perm_final_approve: 'અંતિમ મંજૂરી', perm_manage_campaigns: 'ઝુંબેશ મેનેજ કરો', perm_assigned_folders: 'સોંપેલ ફોલ્ડર્સ', perm_view_brand_guide: 'બ્રાન્ડ માર્ગદર્શિકા જુઓ',
        sector_technology: 'ટેકનોલોજી', sector_retail_fmcg: 'છૂટક અને FMCG', sector_financial_services: 'નાણાકીય સેવાઓ', sector_healthcare: 'હેલ્થકેર',
        sector_education: 'શિક્ષણ', sector_logistics_supply: 'લોજિસ્ટિક્સ અને સપ્લાય', select_org_subtitle: 'ચાલુ રાખવા માટે તમારી સંસ્થા પસંદ કરો', select_lang_subtitle: 'કાર્યકારી ભાષા પસંદ કરો',
        continue_to_language: 'ભાષા પર ચાલુ રાખો →', back: '← પાછળ', enter_portal: 'પોર્ટલ દાખલ કરો →', selection_flow_path: 'સંસ્થા → ભાષા → પોર્ટલ',
        switch_org: 'સ્વિચ સંસ્થા', switch_lang: 'ભાષા સ્વિચ કરો', upload_new: '+ નવું અપલોડ કરો', material_name: 'સામગ્રીનું નામ',
        type: 'પ્રકાર', campaign_project: 'ઝુંબેશ / પ્રોજેક્ટ', designer_notes: 'ડિઝાઇનર નોંધો', folder_location: 'ફોલ્ડર સ્થાન',
        upload_title: 'નવી સામગ્રી અપલોડ કરો', upload_description: 'સમીક્ષા માટે ડિઝાઇન સબમિટ કરો — AI પ્રી-ચેક આપમેળે ચાલે છે', click_to_select: 'ફાઇલ પસંદ કરવા માટે ક્લિક કરો', file_types_hint: 'PDF, PNG, JPG, AI, PSD — 50MB સુધી',
        precheck_title: '🤖 AI પ્રી-ચેક', precheck_description: 'મંજૂરકર્તાઓ સુધી પહોંચતા પહેલા તમારી ડિઝાઇન બ્રાન્ડ માર્ગદર્શિકા સામે આપમેળે તપાસવામાં આવશે.', precheck_color_compliance: '✅ કલર પેલેટનું પાલન', precheck_logo_placement: '✅ લોગો પ્લેસમેન્ટ અને સેફ ઝોન',
        precheck_typography_consistency: '✅ ટાઇપોગ્રાફી સુસંગતતા', precheck_previous_approved: '✅ અગાઉની મંજૂર ડિઝાઇન સાથે સરખામણી', precheck_score: '✅ બ્રાન્ડ માર્ગદર્શિકા સ્કોર (0–100)', workflow_title: '📋 વર્કફ્લો',
        workflow_step1: 'અપલોડ + AI પ્રી-ચેક', workflow_step2: 'CEO, COO અને નિયામકને સૂચના આપી', workflow_step3: 'દરેક મંજૂર કરનાર: મંજૂર / પુનરાવર્તન', workflow_step4: 'બધા મંજૂર → લાઇબ્રેરીમાં પ્રકાશિત',
        filter_flyers: '🖼 ફ્લાયર્સ', filter_brochures: '📄 બ્રોશર', filter_leaflets: '📃 પત્રિકાઓ', filter_posters: '🪧 પોસ્ટરો',
        filter_banners: '🏳 બેનરો', filter_approved: '✅ મંજૂર', type_flyer: 'ફ્લાયર', type_brochure: 'બ્રોશર',
        type_leaflet: 'પત્રિકા', type_poster: 'પોસ્ટર', type_banner: 'બેનર', type_social: 'સોશિયલ મીડિયા ગ્રાફિક',
        no_materials_stage: 'આ તબક્કામાં કોઈ સામગ્રી નથી', user_access: 'વપરાશકર્તા ઍક્સેસ નિયંત્રણ', folder_access_matrix: 'ફોલ્ડર એક્સેસ મેટ્રિક્સ', brand_guidelines: 'બ્રાન્ડ માર્ગદર્શિકા',
        color_palette: '🎨 કલર પેલેટ', typography: '🔤 ટાઇપોગ્રાફી', logo_rules: '📐 લોગો નિયમો', imagery: '🖼 છબી',
        brand_typography_display: 'પ્રદર્શન', brand_typography_body: 'શરીર', brand_typography_caption: 'કૅપ્શન', brand_typography_display_font: '{org} ડિસ્પ્લે ફોન્ટ',
        brand_typography_body_example: 'ઇન્ટર રેગ્યુલર — 16px, 1.6 લાઇનની ઊંચાઈ', brand_typography_caption_example: 'ઇન્ટર લાઇટ — 12px, ટ્રેકિંગ +0.3', brand_logo_clearspace: '✅ ન્યૂનતમ ખાલી જગ્યા: બધી બાજુઓ પર 2× લોગોની ઊંચાઈ', brand_logo_minimum_size: '✅ ન્યૂનતમ કદ: 80px ડિજિટલ / 20mm પ્રિન્ટ',
        brand_logo_approved_bg: '✅ મંજૂર bg: સફેદ, બ્રાન્ડ પ્રાથમિક, બ્રાન્ડ ડાર્ક', brand_logo_no_stretch: '❌ ખેંચો, ફેરવશો નહીં અથવા ફરીથી રંગ કરશો નહીં', brand_logo_no_busy_bg: '❌ વ્યસ્ત ફોટોગ્રાફિક પૃષ્ઠભૂમિ પર ન મૂકો', brand_imagery_quality: '✅ માત્ર ઉચ્ચ ગુણવત્તાની લાઇસન્સવાળી ફોટોગ્રાફી',
        brand_imagery_values: '✅ બ્રાન્ડ મૂલ્યો પ્રતિબિંબિત કરો: આધુનિક, સમાવિષ્ટ, વ્યાવસાયિક', brand_imagery_color_grade: '✅ બ્રાન્ડ પેલેટ સાથે સંરેખિત કરવા માટે કલર-ગ્રેડ', brand_imagery_avoid_cliched: '❌ ક્લિચ્ડ સ્ટોક ઈમેજરી ટાળો', brand_imagery_no_watermark: '❌ કોઈ વોટરમાર્કવાળી અથવા ઓછા રિઝોલ્યુશનવાળી છબીઓ નથી',
        activity_log: 'પ્રવૃત્તિ લોગ', view: 'જુઓ', view_only: 'ફક્ત જુઓ', flagged: 'ધ્વજવંદન',
        metadata: 'મેટાડેટા', approval_status: 'મંજૂરીની સ્થિતિ', brand_score: 'બ્રાન્ડ સ્કોર', version_history: 'સંસ્કરણ ઇતિહાસ',
        comments: 'ટિપ્પણીઓ', add_comment_placeholder: 'એક ટિપ્પણી ઉમેરો...', post: 'પોસ્ટ', category: 'શ્રેણી',
        notes: 'નોંધો', priority: 'પ્રાથમિકતા', priority_high: 'ઉચ્ચ — મંજૂરી પહેલાં ઠીક કરવું આવશ્યક છે', priority_medium: 'મધ્યમ - ઠીક કરવું જોઈએ',
        priority_low: 'ઓછું — નાનું સૂચન', compare: 'સરખામણી કરો', access_full: 'સંપૂર્ણ ઍક્સેસ', access_view: 'ફક્ત જુઓ',
        access_none: 'કોઈ ઍક્સેસ નથી', activity_uploaded: '{actor} અપલોડ કરેલ "{material}"', activity_uploaded_version: '{actor} અપલોડ કરેલ "{material} {version}"', activity_approved: '{actor} મંજૂર "{material}"',
        activity_revision: '{actor} એ "{material}" — {reason} પર પુનરાવર્તનની વિનંતી કરી', activity_system_flagged: 'સિસ્ટમ: AI પ્રી-ચેક ફ્લેગ કરેલ {count} મુદ્દાઓ (સ્કોર: {score}/100)', activity_access_granted: '{actor} એ {folder} પર {subject} અપલોડની ઍક્સેસ આપી', reason_brand_color_issue: 'બ્રાન્ડ રંગ મુદ્દો',
        reason_logo_incorrect: 'લોગો ખોટો છે', folder_marketing: 'માર્કેટિંગ', folder_flyers: 'ફ્લાયર્સ', folder_2025: '2025',
        folder_2024_archive: '2024 આર્કાઇવ', folder_brochures: 'બ્રોશર', folder_products: 'ઉત્પાદનો', folder_corporate: 'કોર્પોરેટ',
        folder_posters: 'પોસ્ટરો', folder_events: 'ઘટનાઓ', folder_retail_pos: 'છૂટક POS', folder_digital: 'ડિજિટલ',
        folder_social_media: 'સોશિયલ મીડિયા', folder_email_headers: 'ઇમેઇલ હેડર્સ', folder_print: 'છાપો', folder_retail: 'છૂટક',
        folder_outdoor: 'આઉટડોર', folder_campaigns: 'ઝુંબેશ', folder_seasonal: 'મોસમી', folder_summer: 'ઉનાળો',
        folder_winter: 'શિયાળો', folder_festive: 'ઉત્સવની', folder_in_store: 'ઇન-સ્ટોર', folder_pos_materials: 'POS સામગ્રી',
        folder_window_displays: 'વિન્ડો ડિસ્પ્લે', folder_promotions: 'પ્રમોશન', folder_leaflets: 'પત્રિકાઓ', folder_email: 'ઈમેલ',
        folder_brand_assets: 'બ્રાન્ડ અસ્કયામતો', folder_logos: 'લોગો', folder_templates: 'નમૂનાઓ', folder_client_comms: 'ક્લાયન્ટ કોમ્સ',
        folder_presentations: 'પ્રસ્તુતિઓ', folder_regulatory: 'નિયમનકારી', folder_compliance_docs: 'પાલન દસ્તાવેજ', folder_disclosures: 'ડિસ્ક્લોઝર',
        folder_banners: 'બેનરો', folder_signage: 'ચિહ્ન', folder_healthcare_mktg: 'હેલ્થકેર Mktg', folder_awareness: 'જાગૃતિ',
        folder_patient_info: 'દર્દીની માહિતી', folder_staff_comms: 'સ્ટાફ કોમ', folder_internal_posters: 'આંતરિક પોસ્ટરો', folder_newsletters: 'ન્યૂઝલેટર્સ',
        folder_web_banners: 'વેબ બેનરો', folder_education: 'શિક્ષણ', folder_recruitment: 'ભરતી', folder_prospectus: 'પ્રોસ્પેક્ટસ',
        folder_open_day: 'ઓપન ડે', folder_campus: 'કેમ્પસ', folder_courses: 'અભ્યાસક્રમો', folder_graduation: 'ગ્રેજ્યુએશન',
        folder_conferences: 'પરિષદો', folder_logistics_mktg: 'લોજિસ્ટિક્સ Mktg', folder_client_facing: 'ક્લાયન્ટ ફેસિંગ', folder_proposals: 'દરખાસ્તો',
        folder_fleet_branding: 'ફ્લીટ બ્રાન્ડિંગ', folder_vehicle_wraps: 'વાહન આવરણ', folder_uniforms: 'ગણવેશ', folder_trade_shows: 'ટ્રેડ શો',
        folder_displays: 'દર્શાવે છે', notifications_title: 'સૂચનાઓ — {org}', notif_sale_await: 'સમર સેલ ફ્લાયર તમારી મંજૂરીની રાહ જોઈ રહ્યું છે', notif_q3_submitted: 'Q3 ઉત્પાદન બ્રોશર સમીક્ષા માટે સબમિટ કરવામાં આવ્યું છે',
        notif_event_flagged: 'ઇવેન્ટ પોસ્ટર પુનરાવર્તન માટે ધ્વજાંકિત', notif_retail_approved: 'રિટેલ POS બૅનર બધા સમીક્ષકો દ્વારા મંજૂર', access_full_short: '✅ સંપૂર્ણ', access_view_short: '👁 જુઓ',
        access_none_short: '- કોઈ નહીં', awaiting: 'પ્રતીક્ષામાં છે', ai_brand_compliance: 'AI બ્રાન્ડ અનુપાલન', send_revision_request: 'પુનરાવર્તન વિનંતી મોકલો',
        revision_describe_text: 'જરૂરી ફેરફારોનું વર્ણન કરો. ડિઝાઇનરને તરત જ સૂચિત કરવામાં આવશે.', revision_describe_placeholder: 'શું બદલવાની જરૂર છે તેનું વર્ણન કરો...', cat_brand_color: 'બ્રાન્ડ રંગ મુદ્દો', cat_logo_violation: 'લોગો વપરાશ ઉલ્લંઘન',
        cat_typography: 'ટાઇપોગ્રાફી સમસ્યા', cat_messaging: 'મેસેજિંગ / કોપી ભૂલ', cat_layout: 'લેઆઉટ સમસ્યા', cat_image_quality: 'છબી ગુણવત્તા',
        cat_other: 'અન્ય', comment_revision_text: 'લોગો પ્લેસમેન્ટ ખેંચાયેલું દેખાય છે — બ્રાન્ડ કીટમાંથી માન્ય માસ્ટર ફાઇલનો ઉપયોગ કરો.', comment_approved_text: 'સારું લાગે છે. બ્રાન્ડ રંગો હાજર છે.', version_initial_upload: 'પ્રારંભિક અપલોડ',
        version_revised_cta: 'સુધારેલ CTA રંગ', version_final: 'અંતિમ', version_initial: 'પ્રારંભિક', ai_m1_1: '✅ કલર પેલેટ બ્રાન્ડના પ્રાથમિક રંગો સાથે મેળ ખાય છે',
        ai_m1_2: '✅ લોગો પ્લેસમેન્ટ યોગ્ય', ai_m1_3: '⚠️ CTA ફોન્ટનું કદ મોટું હોઈ શકે છે', ai_m1_4: '✅ છબીની ગુણવત્તા પ્રિન્ટના ધોરણોને પૂર્ણ કરે છે', ai_m1_5: '⚠️ ટૅગલાઇન મેસેજિંગ માર્ગદર્શિકાથી સહેજ વિચલિત થાય છે',
        ai_m2_1: '✅ તમામ બ્રાન્ડના રંગો સાચા છે', ai_m2_2: '✅ ટાઇપોગ્રાફી બ્રાન્ડ માર્ગદર્શિકા સાથે મેળ ખાય છે', ai_m2_3: '✅ લોગો ખાલી જગ્યા સાચી', ai_m2_4: '✅ છબી શૈલી સંરેખિત',
        ai_m3_1: '❌ ગૌણ રંગ બ્રાન્ડ પેલેટમાં નથી', ai_m3_2: '❌ લોગો સ્ટ્રેચ્ડ — ઉપયોગના નિયમોનું ઉલ્લંઘન કરે છે', ai_m3_3: '⚠️ પ્રિન્ટ માટે મુખ્ય નકલ ખૂબ નાની છે', ai_m3_4: '⚠️ કોન્ટ્રાસ્ટ રેશિયો WCAG AA નિષ્ફળ જાય છે',
        ai_m4_1: '✅ ઉત્તમ બ્રાન્ડ અનુપાલન', ai_m4_2: '✅ તમામ ચેક પાસ થયા', ai_m5_1: '✅ પ્લેટફોર્મના પરિમાણો સાચા', ai_m5_2: '✅ બ્રાન્ડ રંગો લાગુ',
        ai_m5_3: '⚠️ IG સંસ્કરણ પર નાની લોગો ક્લિયરસ્પેસ', ai_m6_1: '✅ બ્રાન્ડના રંગો સાચા', ai_m6_2: '⚠️ 300dpi ની નીચેની એક છબી', ai_m6_3: '✅ ટાઇપોગ્રાફીના નિયમોનું પાલન',
        ai_new_color_ok: '✅ કલર પેલેટ બ્રાન્ડ માર્ગદર્શિકા સાથે મેળ ખાય છે', ai_new_logo_ok: '✅ માન્ય માર્ગદર્શિકામાં લોગો પ્લેસમેન્ટ', ai_new_typography_ok: '✅ બ્રાન્ડ માર્ગદર્શિકા સાથે સુસંગત ટાઇપોગ્રાફી', ai_new_imagery_ok: '✅ છબી બ્રાન્ડના ધોરણોને પૂર્ણ કરે છે',
        ai_new_score_note: '⚠️ થ્રેશોલ્ડથી ઉપરનો સ્કોર — સમીક્ષા માટે તૈયાર', ai_new_color_warn: '⚠️ નાની રંગની વિવિધતાઓ મળી', ai_new_clearspace_warn: '⚠️ લોગોની ખાલી જગ્યા ન્યૂનતમથી થોડી નીચે', ai_new_font_warn: '⚠️ ફોન્ટના કદને ગોઠવણની જરૂર પડી શકે છે'
      }
    };

    const USERS_DATA = {
      admin: { name: 'Admin', initials: 'AD', role: 'Admin', badge: 'ADMIN', avClass: 'av-admin', badgeClass: 'badge-admin', perms: ['Upload', 'Approve', 'Delete', 'Manage Users', 'All Folders'] },
      ceo: { name: 'CEO', initials: 'CE', role: 'CEO', badge: 'CEO', avClass: 'av-ceo', badgeClass: 'badge-ceo', perms: ['View All', 'Approve', 'Final Approve'] },
      coo: { name: 'COO', initials: 'CO', role: 'COO', badge: 'COO', avClass: 'av-coo', badgeClass: 'badge-coo', perms: ['View All', 'Approve', 'Manage Campaigns'] },
      director: { name: 'Director', initials: 'DI', role: 'Director', badge: 'DIRECTOR', avClass: 'av-director', badgeClass: 'badge-director', perms: ['Upload', 'Assigned Folders', 'View Brand Guide'] },
      user: { name: 'User', initials: 'US', role: 'User', badge: 'USER', avClass: 'av-user', badgeClass: 'badge-user', perms: ['Upload', 'View Brand Guide'] }
    };

    const USER_PASSWORDS = {
      admin: 'admin123',
      ceo: 'ceopass',
      coo: 'coopass',
      director: 'director123'
    };

    const BASE_MATERIALS = [
      {
        id: 1, name: 'Summer Sale Flyer', type: 'flyer', emoji: '🖼', designer: 'Diana (Director)', date: 'Jun 8, 2025', status: 'pending', campaign: 'Summer 2025',
        votes: { admin: 'pending', ceo: 'pending', coo: 'approved', director: 'approved' }, aiScore: 82,
        aiInsights: ['ai_m1_1', 'ai_m1_2', 'ai_m1_3', 'ai_m1_4', 'ai_m1_5'],
        versions: [{ v: 'v2', date: 'Jun 8', note: 'version_revised_cta' }, { v: 'v1', date: 'Jun 5', note: 'version_initial_upload' }]
      },
      {
        id: 2, name: 'Q3 Product Brochure', type: 'brochure', emoji: '📄', designer: 'Diana (Director)', date: 'Jun 7, 2025', status: 'pending', campaign: 'Q3 Launch',
        votes: { admin: 'pending', ceo: 'pending', coo: 'pending', director: 'approved' }, aiScore: 91,
        aiInsights: ['ai_m2_1', 'ai_m2_2', 'ai_m2_3', 'ai_m2_4'],
        versions: [{ v: 'v1', date: 'Jun 7', note: 'version_initial_upload' }]
      },
      {
        id: 3, name: 'Event Announcement Poster', type: 'poster', emoji: '🪧', designer: 'Diana (Director)', date: 'Jun 5, 2025', status: 'revision', campaign: 'Annual Conference',
        votes: { admin: 'revision', ceo: 'revision', coo: 'revision', director: 'approved' }, aiScore: 58,
        aiInsights: ['ai_m3_1', 'ai_m3_2', 'ai_m3_3', 'ai_m3_4'],
        versions: [{ v: 'v1', date: 'Jun 5', note: 'version_initial_upload' }]
      },
      {
        id: 4, name: 'Retail POS Banner', type: 'banner', emoji: '🏳', designer: 'Diana (Director)', date: 'Jun 3, 2025', status: 'approved', campaign: 'Retail 2025',
        votes: { admin: 'approved', ceo: 'approved', coo: 'approved', director: 'approved' }, aiScore: 95,
        aiInsights: ['ai_m4_1', 'ai_m4_2'],
        versions: [{ v: 'v2', date: 'Jun 3', note: 'version_final' }, { v: 'v1', date: 'May 30', note: 'version_initial' }]
      },
      {
        id: 5, name: 'Social Media Bundle', type: 'banner', emoji: '📱', designer: 'Diana (Director)', date: 'Jun 1, 2025', status: 'approved', campaign: 'Social June',
        votes: { admin: 'approved', ceo: 'approved', coo: 'approved', director: 'approved' }, aiScore: 88,
        aiInsights: ['ai_m5_1', 'ai_m5_2', 'ai_m5_3'],
        versions: [{ v: 'v1', date: 'Jun 1', note: 'version_initial' }]
      },
      {
        id: 6, name: 'Leaflet — New Services', type: 'leaflet', emoji: '📃', designer: 'Diana (Director)', date: 'May 28, 2025', status: 'approved', campaign: 'Service Launch',
        votes: { admin: 'approved', ceo: 'approved', coo: 'approved', director: 'approved' }, aiScore: 79,
        aiInsights: ['ai_m6_1', 'ai_m6_2', 'ai_m6_3'],
        versions: [{ v: 'v1', date: 'May 28', note: 'version_initial' }]
      },
    ];

    const BASE_ACTIVITY = [
      { key: 'activity_uploaded_version', actor: 'director', materialId: 1, version: 'v2', time: '2h ago', color: 'var(--blue)' },
      { key: 'activity_approved', actor: 'ceo', role: 'CEO', materialId: 4, time: '4h ago', color: 'var(--green)' },
      { key: 'activity_revision', actor: 'coo', role: 'COO', materialId: 3, reason: 'brand color issue', time: '5h ago', color: 'var(--orange)' },
      { key: 'activity_revision', actor: 'ceo', role: 'CEO', materialId: 3, reason: 'logo incorrect', time: '5h ago', color: 'var(--red)' },
      { key: 'activity_system_flagged', count: '4', score: '58', time: 'Jun 5', color: 'var(--purple)' },
      { key: 'activity_uploaded', actor: 'director', materialId: 3, time: 'Jun 5', color: 'var(--blue)' },
      { key: 'activity_approved', actor: 'coo', role: 'COO', materialId: 2, time: 'Jun 4', color: 'var(--green)' },
      { key: 'activity_access_granted', actor: 'admin', subject: 'director', folder: 'Flyers/2025', time: 'May 30', color: 'var(--teal)' },
    ];

    let notificationsList = [];

    async function loadNotifications() {
      if (!currentToken || !selectedOrg) return;
      try {
        const res = await fetch(`${API_BASE}/api/notifications?org_id=${selectedOrg.id}`, {
          headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        if (res.ok) {
          notificationsList = await res.json();
          updateNotifDot();
        }
      } catch (e) {
        console.error("Error loading notifications:", e);
      }
    }

    function updateNotifDot() {
      const unreadCount = notificationsList.filter(n => !n.isRead).length;
      const dot = document.getElementById('notif-dot');
      if (dot) {
        dot.style.display = unreadCount > 0 ? 'block' : 'none';
      }
    }

    // ═══════════════════════════════════════════
    //  STATE
    // ═══════════════════════════════════════════
    let selectedOrg = null;
    let selectedLang = null;
    let currentUser = 'admin';
    let currentToken = null;
    let currentFilter = 'all';
    let switcherOpen = false;
    let orgDDOpen = false;
    let langDDOpen = false;
    // Per-org materials (cloned so each org is independent)
    let orgMaterials = {};
    ORGANISATIONS.forEach(o => {
      orgMaterials[o.id] = JSON.parse(JSON.stringify(BASE_MATERIALS)).map(m => {
        // Adjust folder paths per org
        const paths = ORG_FOLDER_PATHS[o.id];
        m.folder = paths[m.id % paths.length] || paths[0];
        return m;
      });
    });

    function materials() { return orgMaterials[selectedOrg.id] || []; }
    function t(key, params = {}) {
      const template = (T[selectedLang?.id] || T.en)[key] || key;
      return Object.entries(params).reduce((text, [param, value]) => text.replace(new RegExp(`\{${param}\}`, 'g'), value), template);
    }
    function translateOrgName(org) { return t('org_' + org.id) || org.name; }
    function translateUserNameKey(key) { return t('user_' + key) || key; }
    function getUserKeyFromName(name) {
      const mapping = { alex: 'admin', carol: 'ceo', omar: 'coo', diana: 'director' };
      return mapping[name.toLowerCase()] || name.toLowerCase();
    }
    function translateRole(role) { return t('role_' + role.toLowerCase()) || role; }
    function translatePermission(name) {
      const mapping = {
        'Upload': 'perm_upload',
        'Approve': 'perm_approve',
        'Delete': 'perm_delete',
        'Manage Users': 'perm_manage_users',
        'All Folders': 'perm_all_folders',
        'View All': 'perm_view_all',
        'Final Approve': 'perm_final_approve',
        'Manage Campaigns': 'perm_manage_campaigns',
        'Assigned Folders': 'perm_assigned_folders',
        'View Brand Guide': 'perm_view_brand_guide'
      };
      const key = mapping[name] || ('perm_' + name.toLowerCase().replace(/[^a-z0-9]+/g, '_'));
      return t(key) || name;
    }
    function translateUserLabel(label) {
      if (!label) return label || '';
      const [namePart, rolePart] = label.split(' (');
      const userKey = getUserKeyFromName(namePart.trim());
      const translatedName = translateUserNameKey(userKey);
      if (!rolePart) return translatedName;
      const trimmedRole = rolePart.replace(/\)$/, '');
      return `${translatedName} (${translateRole(trimmedRole)})`;
    }
    function translateMaterialName(m) { return t('material_name_' + m.id) || m.name; }
    function folderKey(name) { return 'folder_' + name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }
    function translateFolderName(name) {
      if (!name) return '';
      const key = folderKey(name);
      const translation = t(key);
      return translation === key ? name : translation;
    }
    function translateFolderPath(path) {
      if (!path) return '';
      return path.split('/').map(segment => translateFolderName(segment)).join('/');
    }
    function translateActivityText(item) {
      const reasonKey = item.reason ? ('reason_' + item.reason.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')) : '';
      const params = {
        actor: item.actor ? translateUserNameKey(item.actor.toLowerCase()) : '',
        role: item.role ? translateRole(item.role) : '',
        material: item.materialId ? translateMaterialName({ id: item.materialId }) : (item.material || ''),
        version: item.version || '',
        reason: reasonKey ? t(reasonKey) : (item.reason || ''),
        count: item.count || '',
        score: item.score || '',
        subject: item.subject ? translateUserNameKey(item.subject.toLowerCase()) : '',
        folder: item.folder ? translateFolderPath(item.folder) : ''
      };
      return t(item.key, params);
    }



const { useState, useEffect, useCallback, useRef } = React;

function App() {
  const [currentToken, setCurrentToken] = useState(() => localStorage.getItem('bp_token'));
  const [currentUser, setCurrentUser] = useState(() => {
    const userJson = localStorage.getItem('bp_user');
    if (userJson) {
      try { return JSON.parse(userJson).role.toLowerCase(); } catch(e) {}
    }
    return 'admin';
  });
  const [currentUserName, setCurrentUserName] = useState(() => {
    const userJson = localStorage.getItem('bp_user');
    if (userJson) {
      try { return JSON.parse(userJson).name; } catch(e) {}
    }
    return 'Admin';
  });

  const [selectedOrg, setSelectedOrg] = useState(() => {
    const savedOrgId = localStorage.getItem('bp_selected_org_id');
    if (savedOrgId) {
      const org = ORGANISATIONS.find(o => o.id === savedOrgId);
      if (org) return org;
    }
    return null;
  });
  const [tempOrg, setTempOrg] = useState(null);
  const [selectedLang, setSelectedLang] = useState(() => {
    const savedLangId = localStorage.getItem('bp_selected_lang_id');
    if (savedLangId) {
      const lang = LANGUAGES.find(l => l.id === savedLangId);
      if (lang) return lang;
    }
    return LANGUAGES[0];
  });
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('bp_active_page') || 'dashboard';
  });
  const [currentFolderFilter, setCurrentFolderFilter] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [foldersMap, setFoldersMap] = useState(ORG_FOLDERS);
  const [materialsMap, setMaterialsMap] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [lightboxUrl, setLightboxUrl] = useState(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dropdowns and menus
  const [orgDDOpen, setOrgDDOpen] = useState(false);
  const [langDDOpen, setLangDDOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [modal, setModal] = useState(null); // { title, body, footer } or null

  // User registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState('Director');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');

  // Upload Form state
  const [selectedUploadFile, setSelectedUploadFile] = useState(null);
  const [uploadName, setUploadName] = useState('');
  const [uploadType, setUploadType] = useState('flyer');
  const [uploadCampaign, setUploadCampaign] = useState('');
  const [uploadFolder, setUploadFolder] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');

  // Sandbox Sandbox state
  const [sandboxEmail, setSandboxEmail] = useState('');

  // Lifted states to prevent Hook Rule violations (Error #310)
  const [approvalTab, setApprovalTab] = useState('pending');
  const [isEditingSuggestions, setIsEditingSuggestions] = useState(false);
  const [suggestionsVal, setSuggestionsVal] = useState('');
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  // Load translations & translations helper
  const langId = selectedLang?.id || 'en';
  const t = useCallback((key, params = {}) => {
    const template = (T[langId] || T.en)[key] || key;
    return Object.entries(params).reduce((text, [param, value]) => text.replace(new RegExp(`\\{${param}\\}`, 'g'), value), template);
  }, [langId]);

  const translateOrgName = useCallback((org) => org ? (t('org_' + org.id) || org.name) : '', [t]);
  const translateUserNameKey = useCallback((key) => t('user_' + key.toLowerCase()) || key, [t]);
  const translateRole = useCallback((role) => t('role_' + role.toLowerCase()) || role, [t]);
  
  const translatePermission = useCallback((name) => {
    const mapping = {
      'Upload': 'perm_upload', 'Approve': 'perm_approve', 'Delete': 'perm_delete',
      'Manage Users': 'perm_manage_users', 'All Folders': 'perm_all_folders',
      'View All': 'perm_view_all', 'Final Approve': 'perm_final_approve',
      'Manage Campaigns': 'perm_manage_campaigns', 'Assigned Folders': 'perm_assigned_folders',
      'View Brand Guide': 'perm_view_brand_guide'
    };
    const key = mapping[name] || ('perm_' + name.toLowerCase().replace(/[^a-z0-9]+/g, '_'));
    return t(key) || name;
  }, [t]);

  const translateUserLabel = useCallback((label) => {
    if (!label) return '';
    const [namePart, rolePart] = label.split(' (');
    const userKey = namePart.trim().toLowerCase();
    const translatedName = translateUserNameKey(userKey);
    if (!rolePart) return translatedName;
    const trimmedRole = rolePart.replace(/\)$/, '');
    return `${translatedName} (${translateRole(trimmedRole)})`;
  }, [translateUserNameKey, translateRole]);

  const translateMaterialName = useCallback((m) => t('material_name_' + m.id) || m.name, [t]);
  const translateFolderName = useCallback((name) => {
    if (!name) return '';
    const key = 'folder_' + name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const translation = t(key);
    return translation === key ? name : translation;
  }, [t]);

  const translateFolderPath = useCallback((path) => {
    if (!path) return '';
    return path.split('/').map(segment => translateFolderName(segment)).join('/');
  }, [translateFolderName]);

  const translateActivityText = useCallback((item) => {
    const reasonKey = item.reason ? ('reason_' + item.reason.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')) : '';
    const params = {
      actor: item.actor ? translateUserNameKey(item.actor.toLowerCase()) : '',
      role: item.role ? translateRole(item.role) : '',
      material: item.materialId ? translateMaterialName({ id: item.materialId }) : (item.material || ''),
      version: item.version || '',
      reason: reasonKey ? t(reasonKey) : (item.reason || ''),
      count: item.count || '',
      score: item.score || '',
      subject: item.subject ? translateUserNameKey(item.subject.toLowerCase()) : '',
      folder: item.folder ? translateFolderPath(item.folder) : ''
    };
    return t(item.key, params);
  }, [t, translateUserNameKey, translateRole, translateMaterialName, translateFolderPath]);

  // Toast Helper
  const addToast = useCallback((msg, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type, fade: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(to => to.id === id ? { ...to, fade: true } : to));
      setTimeout(() => {
        setToasts(prev => prev.filter(to => to.id !== id));
      }, 300);
    }, 3500);
  }, []);

  const currentOrgMaterials = selectedOrg ? (materialsMap[selectedOrg.id] || []) : [];

  // Fetching folders, materials, notifications
  const loadMaterialsAndRefresh = useCallback(async (orgId = selectedOrg?.id, token = currentToken) => {
    if (!orgId || !token) return;
    try {
      const fRes = await fetch(`${API_BASE}/api/folders?org_id=${orgId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (fRes.ok) {
        const fData = await fRes.json();
        setFoldersMap(prev => ({ ...prev, [orgId]: fData }));
      }
    } catch (e) {
      console.error("Error loading folders:", e);
    }

    try {
      const res = await fetch(`${API_BASE}/api/materials?org_id=${orgId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMaterialsMap(prev => ({ ...prev, [orgId]: data }));
      }
    } catch (e) {
      console.error("Error loading materials:", e);
    }

    try {
      const res = await fetch(`${API_BASE}/api/notifications?org_id=${orgId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error("Error loading notifications:", e);
    }
  }, [selectedOrg, currentToken]);

  const fetchUsers = useCallback(async () => {
    if (!currentToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (res.ok) {
        const users = await res.json();
        setUsersList(users);
      }
    } catch (e) {
      console.error('Error fetching users:', e);
    }
  }, [currentToken]);

  const loadRoles = useCallback(async () => {
    if (currentUser !== 'admin' || !currentToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/roles`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const roles = await res.json();
        setRolesList(roles);
        if (roles.length > 0) setRegRole(roles[0]);
      }
    } catch (e) {
      console.error('Error loading roles:', e);
    }
  }, [currentUser, currentToken]);

  // Auth Handling
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!loginEmail) {
      setLoginError('Please enter your email.'); return;
    }
    if (!loginPassword) {
      setLoginError(t('login_error_password')); return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.detail || data.error || 'Invalid credentials.');
        return;
      }
      setCurrentToken(data.token);
      localStorage.setItem('bp_token', data.token);
      localStorage.setItem('bp_user', JSON.stringify(data.user));
      setCurrentUser(data.user.role.toLowerCase());
      setCurrentUserName(data.user.name);
      setLoginError('');
      setLoginPassword('');
      addToast(t('signed_in_as', { user: data.user.name }), 'success');
    } catch (err) {
      console.error(err);
      setLoginError('Connection error. Please try again.');
    }
  };

  const handleGoogleLogin = async (response) => {
    const credential = response.credential;
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Google login failed.', 'error');
        return;
      }
      setCurrentToken(data.token);
      localStorage.setItem('bp_token', data.token);
      localStorage.setItem('bp_user', JSON.stringify(data.user));
      setCurrentUser(data.user.role.toLowerCase());
      setCurrentUserName(data.user.name);
      addToast(t('signed_in_as', { user: data.user.name }), 'success');
    } catch (err) {
      console.error('Google login error:', err);
      addToast('Server connection error during Google login.', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bp_token');
    localStorage.removeItem('bp_user');
    localStorage.removeItem('bp_selected_org_id');
    localStorage.removeItem('bp_selected_lang_id');
    localStorage.removeItem('bp_active_page');
    setCurrentToken(null);
    setCurrentUser('admin');
    setCurrentUserName('Admin');
    setSelectedOrg(null);
    setTempOrg(null);
    setSelectedLang(null);
    setMaterialsMap({});
    setNotifications([]);
    addToast(t('logged_out'), 'info');
  };

  // Sync selectedOrg to localStorage
  useEffect(() => {
    if (selectedOrg) {
      localStorage.setItem('bp_selected_org_id', selectedOrg.id);
    } else {
      localStorage.removeItem('bp_selected_org_id');
    }
  }, [selectedOrg]);

  // Sync selectedLang to localStorage
  useEffect(() => {
    if (selectedLang) {
      localStorage.setItem('bp_selected_lang_id', selectedLang.id);
    } else {
      localStorage.removeItem('bp_selected_lang_id');
    }
  }, [selectedLang]);

  // Sync activePage to localStorage
  useEffect(() => {
    if (activePage) {
      localStorage.setItem('bp_active_page', activePage);
    } else {
      localStorage.removeItem('bp_active_page');
    }
  }, [activePage]);

  // Google OAuth button initialization on mount or token change
  useEffect(() => {
    if (!currentToken && window.google) {
      const googleClientId = window.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
      const isSandboxMode = googleClientId.startsWith("YOUR_GOOGLE_CLIENT_ID") || googleClientId === "";
      if (!isSandboxMode) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleLogin
        });
        const btnContainer = document.getElementById("google-signin-btn");
        if (btnContainer) {
          window.google.accounts.id.renderButton(btnContainer, {
            type: "standard", shape: "rectangular", theme: "outline",
            text: "signin_with", size: "large", logo_alignment: "left"
          });
        }
      }
    }
  }, [currentToken]);

  // Load directories and data if logged in and organization is selected
  useEffect(() => {
    if (currentToken && selectedOrg) {
      loadMaterialsAndRefresh();
    }
  }, [currentToken, selectedOrg, loadMaterialsAndRefresh]);

  useEffect(() => {
    if (currentToken) {
      loadRoles();
      if (activePage === 'users') {
        fetchUsers();
      }
    }
  }, [currentToken, activePage, fetchUsers, loadRoles]);

  // Sync modal inputs when modal changes
  useEffect(() => {
    if (modal) {
      if (modal.type === 'material_detail' && modal.material) {
        setIsEditingSuggestions(false);
        setSuggestionsVal(modal.material.aiSuggestions || '');
      } else if (modal.type === 'edit_profile') {
        setEditName(modal.userName || '');
        setEditRole(modal.userRole || '');
      }
    }
  }, [modal]);

  // Folder helper calculations
  const getLeafPaths = (folders, prefix = '') => {
    let paths = [];
    folders.forEach(f => {
      const path = prefix ? `${prefix}/${f.name}` : f.name;
      paths.push(path);
      if (f.children) {
        paths = paths.concat(getLeafPaths(f.children, path));
      }
    });
    return paths;
  };

  const currentOrgFolders = selectedOrg ? (foldersMap[selectedOrg.id] || []) : [];
  const currentOrgFolderLeafPaths = selectedOrg ? getLeafPaths(currentOrgFolders) : [];

  // Folder stats calculation
  const getFolderStats = useCallback((folderPath) => {
    let count = 0;
    let totalScore = 0;
    currentOrgMaterials.forEach(m => {
      if (m.folder === folderPath || m.folder.startsWith(folderPath + '/')) {
        count++;
        totalScore += m.aiScore || 0;
      }
    });
    const avgCompliance = count > 0 ? Math.round(totalScore / count) : 0;
    return { count, avgCompliance };
  }, [currentOrgMaterials]);

  // Sync default values when active page is 'upload'
  useEffect(() => {
    if (activePage === 'upload' && currentOrgFolderLeafPaths.length > 0 && !uploadFolder) {
      setUploadFolder(currentOrgFolderLeafPaths[0]);
    }
  }, [activePage, currentOrgFolderLeafPaths, uploadFolder]);

  // Operations
  const handleCreateFolder = async (parentPath) => {
    if (currentUser !== 'admin') return;
    const newName = prompt(t('enter_new_folder_name') || 'Enter the name of the new folder:');
    if (!newName) return;
    const cleanName = newName.trim();
    if (!cleanName) return;

    let folderTree = JSON.parse(JSON.stringify(currentOrgFolders));
    function insertSubfolder(folders, targetPath, newFolderName) {
      if (!targetPath) {
        folders.push({ name: newFolderName });
        return true;
      }
      const parts = targetPath.split('/');
      let currentLevel = folders;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const found = currentLevel.find(f => f.name === part);
        if (!found) return false;
        if (i === parts.length - 1) {
          if (!found.children) found.children = [];
          found.children.push({ name: newFolderName });
          return true;
        }
        currentLevel = found.children || [];
      }
      return false;
    }

    const success = insertSubfolder(folderTree, parentPath, cleanName);
    if (!success) {
      addToast('Failed to find parent folder', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/folders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({ org_id: selectedOrg.id, folder_tree: folderTree })
      });
      if (res.ok) {
        setFoldersMap(prev => ({ ...prev, [selectedOrg.id]: folderTree }));
        addToast('Folder created successfully', 'success');
      } else {
        const data = await res.json();
        addToast(data.detail || 'Failed to save folder', 'error');
      }
    } catch (e) {
      console.error(e);
      addToast('Error saving folder', 'error');
    }
  };

  const handleRenameFolder = async (folderPath, currentName) => {
    if (currentUser !== 'admin') return;
    const newName = prompt(t('enter_rename_folder_name') || `Rename "${currentName}" to:`, currentName);
    if (!newName) return;
    const cleanName = newName.trim();
    if (!cleanName || cleanName === currentName) return;

    let folderTree = JSON.parse(JSON.stringify(currentOrgFolders));
    function findAndRename(folders, targetPath, newFolderName) {
      const parts = targetPath.split('/');
      let currentLevel = folders;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const found = currentLevel.find(f => f.name === part);
        if (!found) return false;
        if (i === parts.length - 1) {
          found.name = newFolderName;
          return true;
        }
        currentLevel = found.children || [];
      }
      return false;
    }

    const pathParts = folderPath.split('/');
    pathParts[pathParts.length - 1] = cleanName;
    const newFullPath = pathParts.join('/');

    const success = findAndRename(folderTree, folderPath, cleanName);
    if (!success) {
      addToast('Folder not found', 'error');
      return;
    }

    if (currentFolderFilter === folderPath) {
      setCurrentFolderFilter(null);
    }

    try {
      const res = await fetch(`${API_BASE}/api/folders/rename`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          org_id: selectedOrg.id,
          old_path: folderPath,
          new_path: newFullPath,
          folder_tree: folderTree
        })
      });
      if (res.ok) {
        setFoldersMap(prev => ({ ...prev, [selectedOrg.id]: folderTree }));
        loadMaterialsAndRefresh();
        addToast('Folder renamed successfully', 'success');
      } else {
        const data = await res.json();
        addToast(data.detail || 'Failed to rename folder', 'error');
      }
    } catch (e) {
      console.error(e);
      addToast('Error renaming folder', 'error');
    }
  };

  const handleDeleteFolder = async (folderPath, folderName) => {
    if (currentUser !== 'admin') return;
    const confirmed = confirm(`Are you sure you want to delete folder "${folderName}" and all of its contents?\nThis will permanently delete all materials stored in this folder and its subfolders.`);
    if (!confirmed) return;

    let folderTree = JSON.parse(JSON.stringify(currentOrgFolders));
    function removeFolderFromTree(folders, targetPath) {
      const parts = targetPath.split('/');
      let currentLevel = folders;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const foundIdx = currentLevel.findIndex(f => f.name === part);
        if (foundIdx === -1) return false;
        if (i === parts.length - 1) {
          currentLevel.splice(foundIdx, 1);
          return true;
        }
        currentLevel = currentLevel[foundIdx].children || [];
      }
      return false;
    }

    const success = removeFolderFromTree(folderTree, folderPath);
    if (!success) {
      addToast('Folder not found', 'error');
      return;
    }

    if (currentFolderFilter === folderPath || currentFolderFilter?.startsWith(folderPath + '/')) {
      setCurrentFolderFilter(null);
    }

    try {
      const res = await fetch(`${API_BASE}/api/folders/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          org_id: selectedOrg.id,
          folder_path: folderPath,
          folder_tree: folderTree
        })
      });
      if (res.ok) {
        setFoldersMap(prev => ({ ...prev, [selectedOrg.id]: folderTree }));
        loadMaterialsAndRefresh();
        addToast('Folder and contents deleted successfully', 'success');
      } else {
        const data = await res.json();
        addToast(data.detail || 'Failed to delete folder', 'error');
      }
    } catch (e) {
      console.error(e);
      addToast('Error deleting folder', 'error');
    }
  };

  const handleRenameMaterial = async (materialId, currentName) => {
    if (currentUser !== 'admin') return;
    const newName = prompt('Enter new filename:', currentName);
    if (!newName) return;
    const cleanName = newName.trim();
    if (!cleanName || cleanName === currentName) return;

    try {
      const res = await fetch(`${API_BASE}/api/materials/${materialId}/rename`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({ name: cleanName })
      });
      if (res.ok) {
        await loadMaterialsAndRefresh();
        addToast('File renamed successfully', 'success');
        // Re-open detail modal to reflect name change
        setTimeout(() => handleOpenFile(materialId), 100);
      } else {
        const data = await res.json();
        addToast(data.detail || 'Failed to rename file', 'error');
      }
    } catch (e) {
      console.error(e);
      addToast('Error renaming file', 'error');
    }
  };

  const handleCastVote = async (id, decision) => {
    if (!currentToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/materials/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({ decision })
      });

      if (res.ok) {
        const data = await res.json();
        await loadMaterialsAndRefresh();
        if (data.status === 'approved') {
          addToast(t('material_fully_approved', { material: data.name }), 'success');
        } else if (data.status === 'revision') {
          addToast(t('revision_requested', { material: data.name }), 'error');
        } else {
          addToast(decision === 'approved' ? t('approval_recorded') : t('revision_request_sent'), decision === 'approved' ? 'success' : 'info');
        }
        if (modal && modal.materialId === id) {
          // Refresh open modal
          setTimeout(() => handleOpenFile(id), 100);
        }
      } else {
        const errData = await res.json();
        addToast(errData.detail || 'Failed to submit vote', 'error');
      }
    } catch (e) {
      console.error('Vote error:', e);
      addToast('Network error while casting vote', 'error');
    }
  };

  const handleSaveSuggestions = async (id, suggestions) => {
    try {
      const res = await fetch(`${API_BASE}/api/materials/${id}/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({ suggestions })
      });
      if (res.ok) {
        await loadMaterialsAndRefresh();
        addToast('Suggestions updated successfully', 'success');
        setTimeout(() => handleOpenFile(id), 100);
      } else {
        const errData = await res.json();
        addToast(errData.detail || 'Failed to update suggestions', 'error');
      }
    } catch (e) {
      console.error('Error saving suggestions:', e);
      addToast('Failed to save suggestions due to network error', 'error');
    }
  };

  const handleReupload = async (id, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    addToast('Uploading revised document and running AI checks...', 'info');

    try {
      const res = await fetch(`${API_BASE}/api/materials/${id}/reupload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${currentToken}` },
        body: formData
      });
      if (res.ok) {
        addToast('Revised version uploaded successfully!', 'success');
        setModal(null);
        await loadMaterialsAndRefresh();
        setTimeout(() => handleOpenFile(id), 300);
      } else {
        const data = await res.json();
        addToast(data.detail || 'Failed to upload revised document', 'error');
      }
    } catch (e) {
      console.error(e);
      addToast('Error uploading revised document', 'error');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setRegError('');
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({ name: regName, email: regEmail, role: regRole, password: regPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setRegError(data.detail || data.error || 'Failed to create user.');
        return;
      }
      addToast('User created successfully!', 'success');
      setRegName(''); setRegEmail(''); setRegPassword('');
      fetchUsers();
    } catch (err) {
      console.error('Error creating user:', err);
      setRegError('Network error occurred.');
    }
  };

  const handleEditUser = async (userId, name, role) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({ name, role })
      });
      if (res.ok) {
        addToast('User profile updated successfully', 'success');
        setModal(null);
        fetchUsers();
      } else {
        const errData = await res.json();
        addToast(errData.detail || 'Failed to update user', 'error');
      }
    } catch (e) {
      console.error(e);
      addToast('Network error during update', 'error');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      if (res.ok) {
        addToast('User deleted successfully', 'success');
        fetchUsers();
      } else {
        const errData = await res.json();
        addToast(errData.detail || 'Failed to delete user', 'error');
      }
    } catch (e) {
      console.error(e);
      addToast('Network error during delete', 'error');
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadName) { addToast(t('enter_material_name'), 'error'); return; }
    if (!selectedUploadFile) { addToast('Please select a file to upload', 'error'); return; }

    const formData = new FormData();
    formData.append('file', selectedUploadFile);
    formData.append('name', uploadName);
    formData.append('type', uploadType);
    formData.append('campaign', uploadCampaign || '—');
    formData.append('folder', uploadFolder);
    formData.append('notes', uploadNotes);
    formData.append('org_id', selectedOrg.id);

    addToast(t('running_precheck', { org: translateOrgName(selectedOrg) }), 'info');

    try {
      const res = await fetch(`${API_BASE}/api/materials`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${currentToken}` },
        body: formData
      });

      if (res.ok) {
        const result = await res.json();
        addToast(t('precheck_complete'), 'success');
        if (result.material && result.material.aiRemarks) {
          addToast(`🤖 AI Remarks: ${result.material.aiRemarks}`, 'info');
        }
        setTimeout(() => {
          addToast(t('sent_to_approvers', { name: uploadName, org: translateOrgName(selectedOrg) }), 'success');
          // Reset form
          setUploadName(''); setUploadCampaign(''); setUploadNotes(''); setSelectedUploadFile(null);
          loadMaterialsAndRefresh().then(() => setActivePage('approvals'));
        }, 1200);
      } else {
        const errData = await res.json();
        addToast(errData.detail || 'Upload failed', 'error');
      }
    } catch (e) {
      console.error('Upload error:', e);
      addToast('Network error during upload', 'error');
    }
  };

  // Notification modal view & read-all trigger
  const handleShowNotifications = async () => {
    addToast('Marked all notifications as read', 'success');
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setModal({ type: 'notifications' });
    if (selectedOrg && currentToken) {
      try {
        await fetch(`${API_BASE}/api/notifications/read`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`
          },
          body: JSON.stringify({ org_id: selectedOrg.id })
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Document Modal Preview HTML helper
  const getFileThumbnailHTML = (m, customStyle = "") => {
    if (m.file_path) {
      const ext = m.file_path.split('.').pop().toLowerCase();
      const isImg = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext);
      const fileUrl = m.file_path.startsWith('http') ? m.file_path : `${API_BASE}/${m.file_path}`;
      if (isImg) {
        return <img src={fileUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius)', ...customStyle }} alt={m.name} />;
      } else if (ext === 'pdf') {
        if (customStyle.fontSize === '16px') {
          return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', fontSize: '10px', fontWeight: '700', color: 'var(--text3)' }}>📕 PDF</div>;
        }
        return <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none', borderRadius: 'var(--radius)', ...customStyle }} />;
      } else {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', fontSize: '13px', fontWeight: '700', color: 'var(--text3)', textTransform: 'uppercase' }}>📄 {ext}</div>;
      }
    }
    return <span style={{ fontSize: '24px' }}>{m.emoji}</span>;
  };

  // Open Document detail modal
  const handleOpenFile = (id) => {
    const m = currentOrgMaterials.find(x => x.id === id);
    if (!m) return;
    setModal({ type: 'material_detail', materialId: id, material: m });
  };

  // File Download handler with auto extension correction and image-to-PDF conversion
  const handleDownload = async (e, m) => {
    e.preventDefault();
    e.stopPropagation();
    const path = m.file_path || 'uploads/sample.pdf';
    const ext = path.split('.').pop().toLowerCase();
    const fileUrl = path.startsWith('http') ? path : `${API_BASE}/${path}`;
    const downloadName = m.name.split('.')[0] || 'document';

    if (ext === 'pdf') {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${downloadName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (['doc', 'docx'].includes(ext)) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${downloadName}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) {
      try {
        addToast("Converting image to PDF for download...", "info");
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = fileUrl;
        img.onload = () => {
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF({
            orientation: img.width > img.height ? 'l' : 'p',
            unit: 'px',
            format: [img.width, img.height]
          });
          pdf.addImage(img, 'PNG', 0, 0, img.width, img.height);
          pdf.save(`${downloadName}.pdf`);
          addToast("PDF downloaded successfully!", "success");
        };
        img.onerror = () => {
          // Fallback to original image download if canvas load fails
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = `${downloadName}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
      } catch (err) {
        console.error("PDF generation error:", err);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = `${downloadName}.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${downloadName}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Render Functions
  const renderFolderNode = (node, pathPrefix = '') => {
    const currentPath = pathPrefix ? `${pathPrefix}/${node.name}` : node.name;
    const stats = getFolderStats(currentPath);
    const isSelected = currentFolderFilter === currentPath;
    const activeClass = isSelected ? ' active' : '';

    const handleToggle = (e) => {
      const ch = e.currentTarget.nextElementSibling;
      const ar = e.currentTarget.querySelector('.folder-arrow');
      if (ch && ar) {
        const isOpen = ch.classList.toggle('open');
        ar.textContent = isOpen ? '▼' : '▶';
      }
    };

    const handleSelect = (e) => {
      setActivePage('materials');
      if (currentFolderFilter === currentPath) {
        setCurrentFolderFilter(null);
        addToast(t('all_folders'), 'info');
      } else {
        setCurrentFolderFilter(currentPath);
        addToast((t('folder_label') || 'Folder') + ': ' + translateFolderPath(currentPath), 'info');
      }
    };

    const adminActions = currentUser === 'admin' ? (
      <span className="folder-actions" style={{ marginLeft: 'auto', display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
        <span className="folder-action-btn" title="Add Subfolder" onClick={(e) => { e.stopPropagation(); handleCreateFolder(currentPath); }} style={{ cursor: 'pointer', fontSize: '10px' }}>➕</span>
        <span className="folder-action-btn" title="Delete Folder" onClick={(e) => { e.stopPropagation(); handleDeleteFolder(currentPath, node.name); }} style={{ cursor: 'pointer', fontSize: '10px' }}>🗑️</span>
      </span>
    ) : null;

    if (node.children) {
      return (
        <div className="folder" key={currentPath}>
          <div className="folder-name" onClick={handleToggle} onDoubleClick={(e) => { e.stopPropagation(); handleRenameFolder(currentPath, node.name); }} style={{ display: 'flex', alignItems: 'center', width: '100%', cursor: 'pointer' }} title={currentUser === 'admin' ? "Double-click to rename" : ""}>
            <span className="folder-arrow" style={{ fontSize: '9px', color: 'var(--text3)', marginRight: '6px' }}>▶</span>
            <span>📁</span> <span style={{ marginLeft: '4px', flexGrow: 1, textAlign: 'left' }}>{translateFolderName(node.name)}</span>
            {adminActions}
          </div>
          <div className="folder-children">
            {node.children.map(child => renderFolderNode(child, currentPath))}
          </div>
        </div>
      );
    } else {
      return (
        <div className={`folder-file${activeClass}`} key={currentPath} onClick={handleSelect} onDoubleClick={(e) => { e.stopPropagation(); handleRenameFolder(currentPath, node.name); }} style={{ display: 'flex', alignItems: 'center', width: '100%', cursor: 'pointer' }} title={currentUser === 'admin' ? "Double-click to rename" : ""}>
          <span>📂</span> <span style={{ marginLeft: '4px', flexGrow: 1, textAlign: 'left' }}>{translateFolderName(node.name)}</span>
          <span className="count" style={{ marginLeft: '6px', marginRight: '6px' }}>{stats.count}</span>
          {adminActions}
        </div>
      );
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.user-pill') && !e.target.closest('.user-switcher')) setSwitcherOpen(false);
      if (!e.target.closest('#topbar-org-pill') && !e.target.closest('#org-dd')) setOrgDDOpen(false);
      if (!e.target.closest('#topbar-lang-pill') && !e.target.closest('#lang-dd')) setLangDDOpen(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // JSX Rendering for screens
  if (!currentToken) {
    // ── LOGIN SCREEN ──
    const googleClientId = window.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
    const isSandboxMode = googleClientId.startsWith("YOUR_GOOGLE_CLIENT_ID") || googleClientId === "";
    return (
      <div className="select-screen" id="screen-login">
        <div className="sel-logo">
          <div className="sel-dot"></div>BrandPortal
        </div>
        <p className="sel-subtitle">{t('login_subtitle')}</p>
        <div className="card" style={{ maxWidth: '360px', width: '100%', marginBottom: '14px' }}>
          <div className="form-group">
            <label className="form-label">{t('login_user')}</label>
            <input className="form-control" type="email" placeholder="e.g. admin@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') handleLogin(e); }} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('login_password')}</label>
            <input className="form-control" type="password" placeholder={t('login_password')} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') handleLogin(e); }} />
          </div>
          {loginError && <div style={{ color: 'var(--red)', fontSize: '12px', minHeight: '18px', marginTop: '6px' }}>{loginError}</div>}
        </div>
        <button type="button" className="sel-btn" id="login-btn" onClick={handleLogin}>{t('login_button')}</button>

        <div style={{ textAlign: 'center', margin: '18px 0 10px', fontSize: '12px', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: '10px', width: '100%', maxWidth: '360px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          <span>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        {!isSandboxMode ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', width: '100%', maxWidth: '360px' }}>
            <div id="google-signin-btn" style={{ width: '100%' }}></div>
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: '360px', display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => setModal({ type: 'sandbox_login' })} type="button" className="btn btn-secondary" style={{ width: '100%', height: '40px', justifyContent: 'center', gap: '10px', fontWeight: 500, border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" style={{ width: '18px', height: '18px' }} />
              Sign in with Google (OAuth Sandbox)
            </button>
          </div>
        )}
        {renderModal()}
        {renderToasts()}
      </div>
    );
  }

  if (!selectedOrg) {
    // ── SCREEN 1 — SELECT ORGANISATION ──
    return (
      <div className="select-screen" id="screen-org">
        <div className="sel-logo"><div className="sel-dot"></div>BrandPortal</div>
        <p className="sel-subtitle">{t('select_org_subtitle')}</p>
        <div className="sel-step">
          <div className="step-dot active">1</div>
          <div className="step-line"></div>
          <div className="step-dot idle">2</div>
          <span style={{ fontSize: '12px', color: 'var(--text2)', marginLeft: '8px' }}>Organisation → Portal</span>
        </div>
        <div className="sel-grid">
          {ORGANISATIONS.map(o => (
            <div className={`sel-card${tempOrg?.id === o.id ? ' selected' : ''}`} key={o.id} onClick={() => setTempOrg(o)}>
              <div className="sel-card-icon">{o.icon}</div>
              <div className="sel-card-name">{o.name}</div>
            </div>
          ))}
        </div>
        <button className="sel-btn" disabled={!tempOrg} onClick={() => {
          setSelectedOrg(tempOrg);
          setSelectedLang(LANGUAGES[0]);
          addToast(`${tempOrg.icon} ${translateOrgName(tempOrg)} — ${LANGUAGES[0].flag} ${LANGUAGES[0].name}`, 'success');
        }}>
          {t('enter_portal')}
        </button>
        {renderToasts()}
      </div>
    );
  }

  // Helper inside modals
  function renderModal() {
    if (!modal) return null;
    let modalTitle = "";
    let modalBody = null;
    let modalFooter = null;

    const closeModal = () => setModal(null);

    if (modal.type === 'sandbox_login') {
      modalTitle = "Google OAuth Developer Sandbox";
      modalBody = (
        <div>
          <p style={{ color: 'var(--text2)', fontSize: '13px', marginBottom: '16px' }}>You are running in Developer Sandbox mode. Enter the email address to login with:</p>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" value={sandboxEmail} onChange={(e) => setSandboxEmail(e.target.value)} placeholder="e.g. admin@example.com" onKeyPress={(e) => { if(e.key === 'Enter') { handleGoogleLogin({ credential: "mock_token_for_" + sandboxEmail.toLowerCase() }); closeModal(); } }} />
          </div>
        </div>
      );
      modalFooter = (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'end', width: '100%' }}>
          <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { handleGoogleLogin({ credential: "mock_token_for_" + sandboxEmail.toLowerCase() }); closeModal(); }}>Sign in</button>
        </div>
      );
    } else if (modal.type === 'notifications') {
      modalTitle = t('notifications_title', { org: translateOrgName(selectedOrg) });
      modalBody = notifications.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text3)', fontSize: '13px' }}>No notifications available.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {notifications.map((n, idx) => (
            <div key={idx} style={{ padding: '12px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '10px', alignItems: 'start', background: !n.isRead ? 'var(--blue-dim)' : 'transparent' }}>
              <span style={{ fontSize: '18px' }}>{n.icon}</span>
              <div style={{ flex: 1, fontSize: '13px' }}>{n.message}</div>
              <span style={{ fontSize: '11px', color: 'var(--text3)', flexShrink: 0 }}>{n.time}</span>
            </div>
          ))}
        </div>
      );
      modalFooter = <button className="btn btn-secondary" onClick={closeModal}>{t('close')}</button>;
    } else if (modal.type === 'material_detail') {
      const m = modal.material;
      const path = m.file_path || 'uploads/sample.pdf';
      const fileUrl = path.startsWith('http') ? path : `${API_BASE}/${path}`;
      const ext = path.split('.').pop().toLowerCase();
      const canAct = m.votes[currentUser] === 'pending';

      const handleAddComment = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
          const inp = document.getElementById(`nc-comment-input`);
          if (inp && inp.value.trim()) {
            addToast(t('comment_added'), 'success');
            inp.value = '';
          }
        }
      };

      modalTitle = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {currentUser === 'admin' ? (
            <span onDoubleClick={() => handleRenameMaterial(m.id, m.name)} style={{ cursor: 'pointer' }} title="Double click to rename">{translateMaterialName(m)}</span>
          ) : (
            <span>{translateMaterialName(m)}</span>
          )}
          {currentUser === 'admin' && (
            <span onClick={() => handleRenameMaterial(m.id, m.name)} style={{ fontSize: '14px', cursor: 'pointer', marginLeft: '8px' }} title="Rename File">✏️</span>
          )}
        </div>
      );

      modalBody = (
        <div>
          <div className="two-col" style={{ gap: '14px', marginBottom: '18px' }}>
            <div 
              onClick={() => {
                if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) {
                  setLightboxUrl(fileUrl);
                } else if (ext === 'pdf') {
                  window.open(fileUrl, '_blank');
                }
              }}
              style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px', overflow: 'hidden', cursor: 'pointer' }}
              title="Click to view full screen"
            >
              {getFileThumbnailHTML(m, { fontSize: '56px' })}
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '10px' }}>{t('metadata')}</div>
              <table style={{ fontSize: '12px', width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr><td style={{ color: 'var(--text2)', padding: '3px 0' }}>{t('designed_by')}</td><td>{translateUserLabel(m.designer)}</td></tr>
                  <tr><td style={{ color: 'var(--text2)', padding: '3px 0' }}>{t('uploaded')}</td><td>{m.date}</td></tr>
                  <tr><td style={{ color: 'var(--text2)', padding: '3px 0' }}>{t('campaign')}</td><td>{m.campaign}</td></tr>
                  <tr><td style={{ color: 'var(--text2)', padding: '3px 0' }}>{t('folder_label')}</td><td style={{ color: 'var(--text3)' }}>{translateFolderPath(m.folder)}</td></tr>
                  <tr><td style={{ color: 'var(--text2)', padding: '3px 0' }}>{t('status')}</td><td>{getStatusPill(m.status)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {ext === 'pdf' && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '8px' }}>📄 PDF Document Preview</div>
              <iframe src={fileUrl} style={{ width: '100%', height: '450px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white' }} className="pdf-viewer"></iframe>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '8px' }}>{t('approval_status')}</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {Object.entries(m.votes).map(([role, v]) => (
                <div key={role} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '9px 12px', textAlign: 'center', minWidth: '90px' }}>
                  <div style={{ fontSize: '16px', marginBottom: '3px' }}>{v === 'approved' ? '✅' : v === 'revision' ? '⚠️' : '⏳'}</div>
                  <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>{role}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text2)', marginTop: '2px' }}>{v === 'pending' ? t('awaiting') : v === 'approved' ? t('approved') : t('revision')}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ai-panel">
            <h4>🤖 {t('ai_brand_compliance')} — {translateOrgName(selectedOrg)}</h4>
            <div className="ai-checks">
              {m.aiInsights.map((k, idx) => <div className="ai-check" key={idx}><span>{t(k)}</span></div>)}
            </div>
            <div className="ai-score" style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text2)' }}>{t('brand_score')}</span>
              <div className="score-bar">
                <div className="score-fill" style={{ width: `${m.aiScore}%`, background: m.aiScore >= 80 ? 'var(--green)' : m.aiScore >= 60 ? 'var(--orange)' : 'var(--red)' }}></div>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '700', color: m.aiScore >= 80 ? 'var(--green)' : m.aiScore >= 60 ? 'var(--orange)' : 'var(--red)' }}>{m.aiScore}/100</span>
            </div>

            {m.aiRemarks && (
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 12px', fontSize: '12px', color: 'var(--text2)', lineHeight: '1.5', marginTop: '12px' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--text)' }}>🤖 AI Analysis Remarks:</div>
                <div>{m.aiRemarks}</div>
              </div>
            )}

            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 12px', fontSize: '12px', color: 'var(--text2)', lineHeight: '1.5', marginTop: '12px' }}>
              <div style={{ fontWeight: '600', marginBottom: '6px', color: 'var(--text)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>💡 Suggestions for Improvement:</span>
                {['admin', 'ceo', 'coo', 'director'].includes(currentUser) && (
                  <button className="btn btn-sm btn-secondary" onClick={() => setIsEditingSuggestions(!isEditingSuggestions)} style={{ padding: '2px 8px', fontSize: '10px', margin: 0 }}>✏️ Edit</button>
                )}
              </div>
              {!isEditingSuggestions ? (
                <div style={{ whiteSpace: 'pre-wrap', marginTop: '4px' }}>{m.aiSuggestions || 'No suggestions generated.'}</div>
              ) : (
                <div style={{ marginTop: '6px' }}>
                  <textarea className="form-control" rows="3" value={suggestionsVal} onChange={(e) => setSuggestionsVal(e.target.value)} style={{ width: '100%', fontSize: '12px', background: 'var(--bg2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '6px' }} />
                  <div style={{ display: 'flex', justifyContent: 'end', gap: '6px', marginTop: '6px' }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => setIsEditingSuggestions(false)}>Cancel</button>
                    <button className="btn btn-sm btn-approve" onClick={() => { handleSaveSuggestions(m.id, suggestionsVal); setIsEditingSuggestions(false); }} style={{ background: 'var(--green)', color: 'white', border: 'none' }}>Save</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {m.status === 'revision' && (
            <div style={{ marginTop: '16px', border: '1px dashed var(--orange)', borderRadius: 'var(--radius)', padding: '12px', background: 'var(--bg3)' }}>
              <div style={{ fontWeight: '600', color: 'var(--orange)', fontSize: '12px', marginBottom: '6px' }}>⚠️ {t('revision')}</div>
              <p style={{ fontSize: '11px', color: 'var(--text2)', marginBottom: '8px' }}>A reviewer has requested revisions. Select and upload a revised document to update this material.</p>
              <input type="file" id={`reupload-file-input-${m.id}`} style={{ display: 'none' }} onChange={(e) => handleReupload(m.id, e.target.files[0])} />
              <button className="btn btn-secondary btn-sm" onClick={() => document.getElementById(`reupload-file-input-${m.id}`).click()} style={{ padding: '4px 8px', fontSize: '11px' }}>📎 Select Revised File</button>
            </div>
          )}

          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '8px' }}>{t('version_history')}</div>
            {m.versions.map((v, idx) => (
              <div className="version-row" key={idx}>
                <div className="version-thumb" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getFileThumbnailHTML(m)}
                </div>
                <div className="version-info">
                  <strong>{v.v} — {v.date}</strong><br />
                  <span style={{ color: 'var(--text2)' }}>{t(v.note)}</span>
                </div>
                <button className="btn btn-sm btn-secondary" onClick={() => addToast(t('version_compare_info'), 'info')}>{t('compare')}</button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '8px' }}>{t('comments')}</div>
            <div className="comment">
              <div className="comment-header"><span className="badge badge-coo">COO</span> Omar — {m.date}</div>
              <div className="comment-text">{m.status === 'revision' ? t('comment_revision_text') : t('comment_approved_text')}</div>
            </div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '7px' }}>
              <input className="form-control" placeholder={t('add_comment_placeholder')} style={{ flex: 1 }} id="nc-comment-input" onKeyPress={handleAddComment} />
              <button className="btn btn-secondary btn-sm" onClick={handleAddComment}>{t('post')}</button>
            </div>
          </div>
        </div>
      );

      const isReviewer = ['admin', 'ceo', 'coo', 'director'].includes(currentUser);
      const showActions = isReviewer && m.status !== 'approved';
      const showApprove = showActions && m.votes[currentUser] !== 'approved';
      const showRevision = showActions;

      modalFooter = (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'end', gap: '8px' }}>
          <button onClick={(e) => handleDownload(e, m)} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>📥 Download Document</button>
          {showApprove && (
            <button className="btn btn-approve" onClick={() => { handleCastVote(m.id, 'approved'); closeModal(); }}>✅ {t('approve')}</button>
          )}
          {showRevision && (
            <button className="btn btn-danger" onClick={() => setModal({ type: 'revision_vote', materialId: m.id })}>⚠️ {t('request_revision')}</button>
          )}
          <button className="btn btn-secondary" onClick={closeModal}>{t('close')}</button>
        </div>
      );
    } else if (modal.type === 'revision_vote') {
      const id = modal.materialId;
      modalTitle = t('request_revision');
      modalBody = (
        <div>
          <p style={{ color: 'var(--text2)', marginBottom: '14px', fontSize: '13px' }}>{t('revision_describe_text')}</p>
          <div className="form-group">
            <label className="form-label">{t('category')}</label>
            <select className="form-control" id="vote-revision-cat">
              <option>{t('cat_brand_color')}</option><option>{t('cat_logo_violation')}</option>
              <option>{t('cat_typography')}</option><option>{t('cat_messaging')}</option>
              <option>{t('cat_layout')}</option><option>{t('cat_image_quality')}</option><option>{t('cat_other')}</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t('notes')}</label>
            <textarea className="form-control" rows="4" placeholder={t('revision_describe_placeholder')} id="vote-revision-notes"></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">{t('priority')}</label>
            <select className="form-control" id="vote-revision-priority">
              <option>{t('priority_high')}</option>
              <option>{t('priority_medium')}</option>
              <option>{t('priority_low')}</option>
            </select>
          </div>
        </div>
      );
      modalFooter = (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'end' }}>
          <button className="btn btn-secondary" onClick={() => handleOpenFile(id)}>{t('close')}</button>
          <button className="btn btn-danger" onClick={() => { handleCastVote(id, 'revision'); closeModal(); }}>{t('send_revision_request')}</button>
        </div>
      );
    } else if (modal.type === 'edit_access') {
      const userId = modal.userId;
      modalTitle = t('edit_access_title', { user: modal.userName, org: translateOrgName(selectedOrg) });
      modalBody = (
        <div>
          <p style={{ color: 'var(--text2)', fontSize: '12px', marginBottom: '14px' }}>{t('configure_access_for', { org: translateOrgName(selectedOrg) })}</p>
          {currentOrgFolderLeafPaths.map(p => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: '12px' }}>
              <span style={{ color: 'var(--text2)' }}>{translateFolderPath(p)}</span>
              <select className="form-control" style={{ width: 'auto', padding: '3px 8px' }} defaultValue={t('access_full')}>
                <option>{t('access_full')}</option>
                <option>{t('access_view')}</option>
                <option>{t('access_none')}</option>
              </select>
            </div>
          ))}
        </div>
      );
      modalFooter = (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'end' }}>
          <button className="btn btn-secondary" onClick={closeModal}>{t('close')}</button>
          <button className="btn btn-primary" onClick={() => { addToast(t('access_saved'), 'success'); closeModal(); }}>{t('save_changes')}</button>
        </div>
      );
    } else if (modal.type === 'edit_profile') {
      const userId = modal.userId;

      modalTitle = "Edit User Profile";
      modalBody = (
        <div>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" value={editName} onChange={(e) => setEditName(e.target.value)} required />
          </div>
          <div className="form-group" style={{ marginTop: '12px' }}>
            <label className="form-label">Role</label>
            <select className="form-control" value={editRole} onChange={(e) => setEditRole(e.target.value)} required>
              {rolesList.map(r => <option value={r} key={r}>{translateRole(r)}</option>)}
            </select>
          </div>
        </div>
      );
      modalFooter = (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'end' }}>
          <button className="btn btn-secondary" onClick={closeModal}>{t('close')}</button>
          <button className="btn btn-primary" onClick={() => handleEditUser(userId, editName, editRole)}>{t('save_changes')}</button>
        </div>
      );
    }

    return (
      <div className="modal-overlay open" onClick={(e) => { if(e.target.classList.contains('modal-overlay')) closeModal(); }}>
        <div className="modal">
          <div className="modal-header">
            <h2>{modalTitle}</h2>
            <button className="close-btn" onClick={closeModal}>×</button>
          </div>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>{modalBody}</div>
          <div className="modal-footer">{modalFooter}</div>
        </div>
      </div>
    );
  }

  function getStatusPill(status) {
    const map = { pending: '🕐', approved: '✅', revision: '⚠️', draft: '📝' };
    const cls = { pending: 's-pending', approved: 's-approved', revision: 's-revision', draft: 's-draft' };
    const lbl = { pending: t('pending'), approved: t('approved'), revision: t('revision'), draft: 'Draft' };
    return <span className={`status-pill ${cls[status]}`}>{map[status]} {lbl[status]}</span>;
  }

  function renderToasts() {
    return (
      <div className="toast-container">
        {toasts.map(to => (
          <div className={`toast ${to.type}`} key={to.id} style={{ opacity: to.fade ? 0 : 1, transform: to.fade ? 'translateX(40px)' : 'none', transition: 'all .3s' }}>
            {to.msg}
          </div>
        ))}
      </div>
    );
  }

  // ── MAIN PORTAL ──
  const uData = USERS_DATA[currentUser] || USERS_DATA.admin;
  
  // Filter and search logic for materials
  let filteredMaterials = currentOrgMaterials;
  if (currentFolderFilter) {
    filteredMaterials = filteredMaterials.filter(m => m.folder === currentFolderFilter || m.folder.startsWith(currentFolderFilter + '/'));
  }
  if (currentFilter === 'approved') {
    filteredMaterials = filteredMaterials.filter(m => m.status === 'approved');
  } else if (currentFilter !== 'all') {
    filteredMaterials = filteredMaterials.filter(m => m.type === currentFilter);
  }
  if (searchQuery) {
    filteredMaterials = filteredMaterials.filter(m => translateMaterialName(m).toLowerCase().includes(searchQuery.toLowerCase()) || translateUserLabel(m.designer).toLowerCase().includes(searchQuery.toLowerCase()));
  }

  return (
    <div id="app" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="logo"><div className="logo-dot"></div>BrandPortal</div>
        
        {/* Org Dropdown */}
        <div style={{ position: 'relative' }}>
          <div className="org-pill" id="topbar-org-pill" onClick={() => setOrgDDOpen(!orgDDOpen)}>
            <span>{selectedOrg.icon}</span>
            <span style={{ fontWeight: 600, marginLeft: '6px', marginRight: '6px' }}>{translateOrgName(selectedOrg)}</span>
            <span style={{ color: 'var(--text3)', fontSize: '10px' }}>▼</span>
          </div>
          {orgDDOpen && (
            <div className="topbar-dropdown open" id="org-dd">
              <div style={{ padding: '8px 14px 6px', fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.6px' }}>{t('switch_org')}</div>
              {ORGANISATIONS.map(o => (
                <div className={`topbar-dd-item${o.id === selectedOrg.id ? ' selected-item' : ''}`} key={o.id} onClick={() => { setSelectedOrg(o); setOrgDDOpen(false); setCurrentFolderFilter(null); addToast(t('switched_to', { org: translateOrgName(o) }), 'info'); }}>
                  <span style={{ fontSize: '20px' }}>{o.icon}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{translateOrgName(o)}</div>
                  </div>
                  {o.id === selectedOrg.id && <span style={{ marginLeft: 'auto', color: 'var(--green)', fontSize: '12px' }}>✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Language Dropdown */}
        <div style={{ position: 'relative' }}>
          <div className="lang-pill" id="topbar-lang-pill" onClick={() => setLangDDOpen(!langDDOpen)}>
            <span>{selectedLang?.flag || '🌐'}</span>
            <span style={{ fontWeight: 500, marginLeft: '6px', marginRight: '6px' }}>{selectedLang?.name || 'Language'}</span>
            <span style={{ color: 'var(--text3)', fontSize: '10px' }}>▼</span>
          </div>
          {langDDOpen && (
            <div className="topbar-dropdown open" id="lang-dd" style={{ minWidth: '200px' }}>
              <div style={{ padding: '8px 14px 6px', fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.6px' }}>{t('switch_lang')}</div>
              {LANGUAGES.map(l => (
                <div className={`topbar-dd-item${l.id === selectedLang?.id ? ' selected-item' : ''}`} key={l.id} onClick={() => { setSelectedLang(l); setLangDDOpen(false); addToast(t('language_changed', { lang: `${l.flag} ${l.name}` }), 'success'); }}>
                  <span style={{ fontSize: '20px' }}>{l.flag}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{l.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{l.native}</div>
                  </div>
                  {l.id === selectedLang?.id && <span style={{ marginLeft: 'auto', color: 'var(--green)', fontSize: '12px' }}>✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="nav-sep"></div>
        
        {/* Notifications Button */}
        <button className="notif-btn" onClick={handleShowNotifications}>
          🔔
          {notifications.some(n => !n.isRead) && <span className="notif-dot" id="notif-dot"></span>}
        </button>

        {/* User Pill */}
        <div className="user-pill" onClick={() => setSwitcherOpen(!switcherOpen)}>
          <div className={`avatar ${uData.avClass}`}>{uData.initials}</div>
          <span style={{ fontSize: '12px', fontWeight: 500, marginLeft: '6px', marginRight: '6px' }}>{currentUserName}</span>
          <span className={`badge ${uData.badgeClass}`}>{translateRole(uData.role).toUpperCase()}</span>
        </div>
      </div>

      {/* LAYOUT CONTAINER */}
      <div className="layout">
        
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sb-section">
            <div className="sb-label">{translateOrgName(selectedOrg)}</div>
            
            <div className={`sb-item${activePage === 'dashboard' ? ' active' : ''}`} onClick={() => { setActivePage('dashboard'); setSwitcherOpen(false); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', width: '16px', height: '16px' }}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
              {t('dashboard')}
            </div>

            <div className={`sb-item${activePage === 'materials' ? ' active' : ''}`} onClick={() => { setActivePage('materials'); setSwitcherOpen(false); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', width: '16px', height: '16px' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              {t('materials')}
            </div>

            <div className={`sb-item${activePage === 'approvals' ? ' active' : ''}`} onClick={() => { setActivePage('approvals'); setSwitcherOpen(false); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', width: '16px', height: '16px' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              {t('approvals')}
              <span className="sb-count">{currentOrgMaterials.filter(m => m.status === 'pending').length}</span>
            </div>

            <div className={`sb-item${activePage === 'upload' ? ' active' : ''}`} onClick={() => { setActivePage('upload'); setSwitcherOpen(false); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', width: '16px', height: '16px' }}><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
              {t('upload')}
            </div>
          </div>

          {/* FOLDERS SECTION */}
          <div className="sb-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div className="sb-label" style={{ margin: 0 }}>{t('folders')}</div>
              {currentUser === 'admin' && (
                <span onClick={() => handleCreateFolder('')} title="Create Root Folder" style={{ cursor: 'pointer', opacity: 0.6, fontSize: '12px', marginRight: '12px' }}>📁➕</span>
              )}
            </div>
            <div className="folder-tree">
              {currentOrgFolders.map(folder => renderFolderNode(folder))}
            </div>
          </div>

          {/* ADMIN SECTION */}
          {currentUser === 'admin' && (
            <div className="sb-section">
              <div className="sb-label">{t('admin_section')}</div>
              
              <div className={`sb-item${activePage === 'users' ? ' active' : ''}`} onClick={() => { setActivePage('users'); setSwitcherOpen(false); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', width: '16px', height: '16px' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                {t('users')}
              </div>

              <div className={`sb-item${activePage === 'brand' ? ' active' : ''}`} onClick={() => { setActivePage('brand'); setSwitcherOpen(false); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', width: '16px', height: '16px' }}><circle cx="12" cy="12" r="10" /><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" /></svg>
                {t('brand')}
              </div>

              <div className={`sb-item${activePage === 'activity' ? ' active' : ''}`} onClick={() => { setActivePage('activity'); setSwitcherOpen(false); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', width: '16px', height: '16px' }}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                {t('activity')}
              </div>
            </div>
          )}
        </div>

        {/* MAIN WORKSPACE CONTENT */}
        <div className="main">
          <div className="content">
            {activePage === 'dashboard' && renderDashboard()}
            {activePage === 'materials' && renderMaterials()}
            {activePage === 'approvals' && renderApprovals()}
            {activePage === 'upload' && renderUpload()}
            {activePage === 'users' && renderUsers()}
            {activePage === 'brand' && renderBrand()}
            {activePage === 'activity' && renderActivityPage()}
            {activePage === 'register' && renderRegisterScreen()}
          </div>
        </div>
      </div>

      {/* USER SWITCHER MENU */}
      {switcherOpen && (
        <div className="user-switcher open" id="user-switcher">
          <div className="us-title">{t('switch_user_view')}</div>
          {Object.entries(USERS_DATA)
            .filter(([key]) => key === currentUser)
            .map(([key, value]) => {
              const isUserMatch = key === currentUser;
              return (
                <div className={`us-item${isUserMatch ? ' current' : ''}`} key={key}>
                  <div className={`avatar ${value.avClass}`}>{value.initials}</div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500 }}>{translateUserLabel(value.name)}</div>
                    <span className={`badge ${value.badgeClass}`}>{translateRole(value.role).toUpperCase()}</span>
                  </div>
                </div>
              );
            })}
          <div className="us-item" onClick={handleLogout} style={{ justifyContent: 'center', fontWeight: 700, color: 'var(--orange)', borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '12px' }}>
            {t('logout')}
          </div>
        </div>
      )}

      {renderModal()}
      {renderToasts()}

      {lightboxUrl && (
        <div className="lightbox-overlay" onClick={() => setLightboxUrl(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, cursor: 'zoom-out' }}>
          <img src={lightboxUrl} style={{ maxWidth: '95vw', maxHeight: '95vh', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }} />
        </div>
      )}
    </div>
  );

  // Subpage renders
  function renderDashboard() {
    const totalMaterials = currentOrgMaterials.length;
    const pendingApp = currentOrgMaterials.filter(m => m.status === 'pending').length;
    const approvedApp = currentOrgMaterials.filter(m => m.status === 'approved').length;
    const revisionApp = currentOrgMaterials.filter(m => m.status === 'revision').length;

    return (
      <div className="page active">
        <div className="ph">
          <h1>{t('dashboard')}</h1>
          <p>{t('welcome')}, {translateUserNameKey(currentUser)} — {selectedOrg.icon} {translateOrgName(selectedOrg)} {t('overview')} ({selectedLang?.flag} {selectedLang?.name})</p>
        </div>
        <div className="stats">
          <div className="stat">
            <div className="stat-n" style={{ color: 'var(--blue)' }}>{totalMaterials}</div>
            <div className="stat-l">{t('total')}</div>
            <div className="stat-delta delta-up">↑ 3 this week</div>
          </div>
          <div className="stat">
            <div className="stat-n" style={{ color: 'var(--orange)' }}>{pendingApp}</div>
            <div className="stat-l">{t('pending')}</div>
            <div className="stat-delta delta-pend">Needs review</div>
          </div>
          <div className="stat">
            <div className="stat-n" style={{ color: 'var(--green)' }}>{approvedApp}</div>
            <div className="stat-l">{t('approved')}</div>
            <div className="stat-delta delta-up">↑ 75% rate</div>
          </div>
          <div className="stat">
            <div className="stat-n" style={{ color: 'var(--red)' }}>{revisionApp}</div>
            <div className="stat-l">{t('revision')}</div>
            <div className="stat-delta" style={{ color: 'var(--text3)' }}>Flagged</div>
          </div>
        </div>
        <div className="two-col" style={{ gap: '18px' }}>
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>{t('recent_materials')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {currentOrgMaterials.slice(0, 4).map(m => (
                <div className="card-sm" key={m.id} onClick={() => handleOpenFile(m.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '22px', width: '32px', height: '32px', borderRadius: 'var(--radius)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg3)', flexShrink: 0 }}>
                    {getFileThumbnailHTML(m, { fontSize: '16px' })}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{translateMaterialName(m)}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{translateUserLabel(m.designer)} · {m.date}</div>
                  </div>
                  {getStatusPill(m.status)}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>{t('activity')}</h2>
            <div className="activity-list">
              {BASE_ACTIVITY.slice(0, 5).map((a, idx) => (
                <div className="activity-item" key={idx}>
                  <div className="activity-dot" style={{ background: a.color }}></div>
                  <div className="activity-text">{translateActivityText(a)}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderMaterials() {
    return (
      <div className="page active">
        <div className="ph">
          <h1>{t('materials')}</h1>
          <p>{selectedOrg.icon} {translateOrgName(selectedOrg)} — {selectedLang?.flag} {t('lang_name')}</p>
          <div className="ph-actions">
            <button className="btn btn-primary" onClick={() => setActivePage('upload')}>+ {t('upload_new')}</button>
          </div>
        </div>
        <div className="search-bar">
          <input type="text" placeholder={t('search_placeholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </div>
        <div className="filter-row">
          <div className={`filter-chip${currentFilter === 'all' ? ' active' : ''}`} onClick={() => setCurrentFilter('all')}>{t('all_types')}</div>
          <div className={`filter-chip${currentFilter === 'flyer' ? ' active' : ''}`} onClick={() => setCurrentFilter('flyer')}>{t('filter_flyers')}</div>
          <div className={`filter-chip${currentFilter === 'brochure' ? ' active' : ''}`} onClick={() => setCurrentFilter('brochure')}>{t('filter_brochures')}</div>
          <div className={`filter-chip${currentFilter === 'leaflet' ? ' active' : ''}`} onClick={() => setCurrentFilter('leaflet')}>{t('filter_leaflets')}</div>
          <div className={`filter-chip${currentFilter === 'poster' ? ' active' : ''}`} onClick={() => setCurrentFilter('poster')}>{t('filter_posters')}</div>
          <div className={`filter-chip${currentFilter === 'banner' ? ' active' : ''}`} onClick={() => setCurrentFilter('banner')}>{t('filter_banners')}</div>
          <div className={`filter-chip${currentFilter === 'approved' ? ' active' : ''}`} onClick={() => setCurrentFilter('approved')} style={{ marginLeft: 'auto' }}>{t('filter_approved')}</div>
        </div>
        <div className="file-grid">
          {filteredMaterials.map(m => {
            const path = m.file_path || 'uploads/sample.pdf';
            const fileUrl = path.startsWith('http') ? path : `${API_BASE}/${path}`;
            return (
              <div className="file-card" key={m.id} onClick={() => handleOpenFile(m.id)}>
                <div className="file-badge">{getStatusPill(m.status)}</div>
                <div className={`file-thumb ${m.type}`} style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getFileThumbnailHTML(m)}
                </div>
                <div className="file-info">
                  <div className="file-name">{translateMaterialName(m)}</div>
                  <div className="file-meta">
                    <span>👤 {translateUserLabel(m.designer).split(' (')[0]}</span>
                    <span>📅 {m.date}</span>
                  </div>
                  <div className="file-meta" style={{ marginTop: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--text3)' }}>📁 {translateFolderPath(m.folder).split('/').pop()}</span>
                      <span style={{ color: 'var(--purple)' }}>🤖 {m.aiScore}/100</span>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span onClick={(e) => handleDownload(e, m)} style={{ color: 'var(--text1)', fontSize: '14px', cursor: 'pointer' }} title="Download Document">📥</span>
                      <span onClick={(e) => { e.stopPropagation(); handleOpenFile(m.id); }} style={{ color: 'var(--text1)', fontSize: '14px', cursor: 'pointer' }} title="View Document">👁️</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderApprovals() {
    const mats = currentOrgMaterials.filter(m => m.status === approvalTab);

    return (
      <div className="page active">
        <div className="ph">
          <h1>{t('approvals')}</h1>
          <p>{selectedOrg.icon} {translateOrgName(selectedOrg)}</p>
        </div>
        <div className="tabs">
          <div className={`tab${approvalTab === 'pending' ? ' active' : ''}`} onClick={() => setApprovalTab('pending')}>{t('pending')}</div>
          <div className={`tab${approvalTab === 'revision' ? ' active' : ''}`} onClick={() => setApprovalTab('revision')}>{t('revision')}</div>
          <div className={`tab${approvalTab === 'approved' ? ' active' : ''}`} onClick={() => setApprovalTab('approved')}>{t('approved')}</div>
        </div>
        <div className="approval-list">
          {mats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text3)' }}>{t('no_materials_stage')}</div>
          ) : (
            mats.map(m => {
              const votes = Object.entries(m.votes).map(([role, v]) => (
                <span className={`vote ${v === 'approved' ? 'vote-approved' : v === 'revision' ? 'vote-revision' : 'vote-pending'}`} key={role}>
                  {role.toUpperCase()} {v === 'approved' ? '✅' : v === 'revision' ? '⚠️' : '⏳'}
                </span>
              ));
              const canAct = m.votes[currentUser] === 'pending';
              const path = m.file_path || 'uploads/sample.pdf';
              const fileUrl = path.startsWith('http') ? path : `${API_BASE}/${path}`;

              return (
                <div className={`approval-item${m.status === 'pending' ? ' urgent' : ''}`} key={m.id}>
                  <div className="ai-thumb" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getFileThumbnailHTML(m)}
                  </div>
                  <div className="approval-meta">
                    <h3>{translateMaterialName(m)}</h3>
                    <p>👤 {translateUserLabel(m.designer)} &nbsp;|&nbsp; 📅 {m.date} &nbsp;|&nbsp; 📁 {m.folder}</p>
                    <div className="approval-votes">{votes}</div>
                    <div style={{ fontSize: '11px', color: 'var(--purple)' }}>
                      🤖 AI: <strong style={{ color: m.aiScore >= 80 ? 'var(--green)' : m.aiScore >= 60 ? 'var(--orange)' : 'var(--red)' }}>{m.aiScore}/100</strong>
                    </div>
                  </div>
                  <div className="approval-actions">
                    <button className="btn btn-sm btn-secondary" onClick={() => handleOpenFile(m.id)}>{t('view')}</button>
                    <button onClick={(e) => handleDownload(e, m)} className="btn btn-sm btn-secondary" style={{ padding: '5px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>📥 Download</button>
                    {canAct ? (
                      <>
                        <button className="btn btn-sm btn-approve" onClick={() => handleCastVote(m.id, 'approved')}>✅ {t('approve')}</button>
                        <button className="btn btn-sm btn-danger" onClick={() => setModal({ type: 'revision_vote', materialId: m.id })}>⚠️</button>
                      </>
                    ) : m.votes[currentUser] === 'approved' ? (
                      <span style={{ color: 'var(--green)', fontSize: '11px' }}>✅ {t('approved')}</span>
                    ) : m.votes[currentUser] === 'revision' ? (
                      <span style={{ color: 'var(--orange)', fontSize: '11px' }}>⚠️ {t('flagged')}</span>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text3)' }}>{t('view_only')}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  function renderUpload() {
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setSelectedUploadFile(file);
      if (!uploadName) {
        setUploadName(file.name.split('.').slice(0, -1).join('.'));
      }
      addToast(t('file_ready_submit'), 'info');
    };

    const sizeMB = selectedUploadFile ? (selectedUploadFile.size / (1024 * 1024)).toFixed(1) : 0;
    const ext = selectedUploadFile ? selectedUploadFile.name.split('.').pop().toUpperCase() : '';

    return (
      <div className="page active">
        <div className="ph">
          <h1>{t('upload_title')}</h1>
          <p>{t('upload_description')}</p>
        </div>
        <div className="two-col">
          <div className="card">
            <div className="upload-zone" onClick={() => document.getElementById('upload-file-input').click()} style={{ borderColor: selectedUploadFile ? 'var(--green)' : 'var(--border)', background: selectedUploadFile ? 'var(--green-dim)' : 'transparent' }}>
              {selectedUploadFile ? (
                <>
                  <div style={{ color: 'var(--green)', fontSize: '32px', marginBottom: '8px' }}>✅</div>
                  <p style={{ fontWeight: 600 }}>{selectedUploadFile.name} {t('selected')}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text3)' }}>{sizeMB} MB — {ext}</p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '34px', marginBottom: '10px' }}>📎</div>
                  <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '5px' }}>{t('click_to_select')}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text3)' }}>{t('file_types_hint')}</p>
                </>
              )}
            </div>
            <input type="file" id="upload-file-input" style={{ display: 'none' }} onChange={handleFileChange} />
            <div className="form-group" style={{ marginTop: '14px' }}>
              <label className="form-label">{t('material_name')}</label>
              <input className="form-control" type="text" value={uploadName} onChange={(e) => setUploadName(e.target.value)} placeholder="e.g. Summer Sale Flyer" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('type')}</label>
              <select className="form-control" value={uploadType} onChange={(e) => setUploadType(e.target.value)}>
                <option value="flyer">{t('type_flyer')}</option>
                <option value="brochure">{t('type_brochure')}</option>
                <option value="leaflet">{t('type_leaflet')}</option>
                <option value="poster">{t('type_poster')}</option>
                <option value="banner">{t('type_banner')}</option>
                <option value="social">{t('type_social')}</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('campaign_project')}</label>
              <input className="form-control" type="text" value={uploadCampaign} onChange={(e) => setUploadCampaign(e.target.value)} placeholder="e.g. Q3 Product Launch" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('folder_location')}</label>
              <select className="form-control" value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value)}>
                {currentOrgFolderLeafPaths.map(p => (
                  <option value={p} key={p}>{translateFolderPath(p)}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('designer_notes')}</label>
              <textarea className="form-control" value={uploadNotes} onChange={(e) => setUploadNotes(e.target.value)} placeholder="Key design decisions, palette choices, target audience…"></textarea>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleUploadSubmit}>{t('submit')}</button>
          </div>
          <div>
            <div className="card" style={{ marginBottom: '14px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>{t('precheck_title')}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '12px' }}>{t('precheck_description')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '12px', color: 'var(--text2)' }}>
                <div>{t('precheck_color_compliance')}</div>
                <div>{t('precheck_logo_placement')}</div>
                <div>{t('precheck_typography_consistency')}</div>
                <div>{t('precheck_previous_approved')}</div>
                <div>{t('precheck_score')}</div>
              </div>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>{t('workflow_title')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '12px' }}>
                <div style={{ display: 'flex', gap: '9px', alignItems: 'center' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--blue-dim)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '10px', flexShrink: 0 }}>1</div>
                  <span style={{ color: 'var(--text2)' }}>{t('workflow_step1')}</span>
                </div>
                <div style={{ display: 'flex', gap: '9px', alignItems: 'center' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--blue-dim)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '10px', flexShrink: 0 }}>2</div>
                  <span style={{ color: 'var(--text2)' }}>{t('workflow_step2')}</span>
                </div>
                <div style={{ display: 'flex', gap: '9px', alignItems: 'center' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--blue-dim)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '10px', flexShrink: 0 }}>3</div>
                  <span style={{ color: 'var(--text2)' }}>{t('workflow_step3')}</span>
                </div>
                <div style={{ display: 'flex', gap: '9px', alignItems: 'center' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--blue-dim)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '10px', flexShrink: 0 }}>4</div>
                  <span style={{ color: 'var(--text2)' }}>{t('workflow_step4')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderUsers() {
    const roleStyleMap = {
      'Admin': { avClass: 'av-admin', initials: 'AD', perms: ['Upload', 'Approve', 'Delete', 'Manage Users', 'All Folders'] },
      'CEO': { avClass: 'av-ceo', initials: 'CE', perms: ['View All', 'Approve', 'Final Approve'] },
      'COO': { avClass: 'av-coo', initials: 'CO', perms: ['View All', 'Approve', 'Manage Campaigns'] },
      'Director': { avClass: 'av-director', initials: 'DI', perms: ['Upload', 'Assigned Folders', 'View Brand Guide'] },
      'User': { avClass: 'av-user', initials: 'US', perms: ['Upload', 'View Brand Guide'] }
    };

    return (
      <div className="page active">
        <div className="ph">
          <h1>{t('user_access')}</h1>
          <p>{selectedOrg.icon} {translateOrgName(selectedOrg)}</p>
        </div>

        {currentUser === 'admin' && (
          <div className="card" style={{ marginBottom: '22px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>👤 Create New User Account</h3>
            <form onSubmit={handleCreateUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', alignItems: 'end' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" placeholder="e.g. John Doe" value={regName} onChange={(e) => setRegName(e.target.value)} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control" placeholder="e.g. john@example.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Role</label>
                <select className="form-control" value={regRole} onChange={(e) => setRegRole(e.target.value)} required>
                  {rolesList.map(r => <option value={r} key={r}>{translateRole(r)}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Password (Optional for Google login)</label>
                <input type="password" className="form-control" placeholder="Optional" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: '38px', gridColumn: '1 / -1', marginTop: '6px', justifyContent: 'center', width: '180px', justifySelf: 'center' }}>Create User</button>
            </form>
            {regError && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '8px' }}>{regError}</div>}
          </div>
        )}

        <div className="people-grid">
          {usersList.map(u => {
            const meta = roleStyleMap[u.role] || roleStyleMap['Director'];
            const initials = u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || meta.initials;

            return (
              <div className="person-card" key={u.id}>
                <div className={`person-av ${meta.avClass}`}>{initials}</div>
                <div className="person-name">{u.name} <div style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 400, marginTop: '2px' }}>{u.email}</div></div>
                <div className="person-role">{translateRole(u.role)}</div>
                <div style={{ fontSize: '11px', color: 'var(--text2)', marginBottom: '8px' }}>{translateOrgName(selectedOrg)}</div>
                <div className="person-perms">
                  {meta.perms.map(p => <span className="perm-tag" key={p}>{translatePermission(p)}</span>)}
                </div>
                {currentUser === 'admin' && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                    <button className="btn btn-sm btn-secondary" style={{ flex: 1 }} onClick={() => setModal({ type: 'edit_access', userId: u.id, userName: u.name })}>{t('edit_access_button')}</button>
                    <button className="btn btn-sm btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setModal({ type: 'edit_profile', userId: u.id, userName: u.name, userRole: u.role })} title="Edit Profile">✏️</button>
                    <button className="btn btn-sm btn-danger" style={{ padding: '4px 8px' }} onClick={() => handleDeleteUser(u.id, u.name)} title="Delete User">🗑️</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Matrix table */}
        <div style={{ marginTop: '22px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>{t('folder_access_matrix')}</h2>
          <div className="card">
            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: 'var(--text2)' }}>
                  <th style={{ textAlign: 'left', padding: '7px 9px', borderBottom: '1px solid var(--border)' }}>{t('folder_label')}</th>
                  <th style={{ padding: '7px 9px', borderBottom: '1px solid var(--border)' }}>Admin</th>
                  <th style={{ padding: '7px 9px', borderBottom: '1px solid var(--border)' }}>CEO</th>
                  <th style={{ padding: '7px 9px', borderBottom: '1px solid var(--border)' }}>COO</th>
                  <th style={{ padding: '7px 9px', borderBottom: '1px solid var(--border)' }}>Director</th>
                </tr>
              </thead>
              <tbody>
                {currentOrgFolderLeafPaths.map((p, idx) => (
                  <tr key={p}>
                    <td style={{ padding: '7px 9px', color: 'var(--text2)' }}>{translateFolderPath(p)}</td>
                    <td style={{ padding: '7px 9px', textAlign: 'center', color: 'var(--green)' }}>{t('access_full_short')}</td>
                    <td style={{ padding: '7px 9px', textAlign: 'center', color: 'var(--blue)' }}>{idx % 3 === 2 ? t('access_full_short') : t('access_view_short')}</td>
                    <td style={{ padding: '7px 9px', textAlign: 'center', color: 'var(--blue)' }}>{idx % 2 === 0 ? t('access_full_short') : t('access_view_short')}</td>
                    <td style={{ padding: '7px 9px', textAlign: 'center', color: idx % 4 === 3 ? 'var(--text3)' : 'var(--green)' }}>{idx % 4 === 3 ? t('access_none_short') : t('access_full_short')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function renderBrand() {
    const colors = ORG_BRAND_COLORS[selectedOrg.id] || [];

    return (
      <div className="page active">
        <div className="ph">
          <h1>{t('brand_guidelines')}</h1>
          <p>{selectedOrg.icon} {translateOrgName(selectedOrg)}</p>
        </div>
        <div className="two-col">
          <div>
            <div className="card" style={{ marginBottom: '14px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>{t('color_palette')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {colors.map((c, idx) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} key={idx}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius)', background: c.hex, flexShrink: 0 }}></div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>{c.name} <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--text3)' }}>{c.hex}</span></div>
                      <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{c.use}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>{t('typography')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px' }}>
                <div><span style={{ color: 'var(--text2)', fontSize: '10px' }}>{t('brand_typography_display')}</span><br /><span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.5px' }}>{t('brand_typography_display_font', { org: translateOrgName(selectedOrg) })}</span></div>
                <div><span style={{ color: 'var(--text2)', fontSize: '10px' }}>{t('brand_typography_body')}</span><br /><span>{t('brand_typography_body_example')}</span></div>
                <div><span style={{ color: 'var(--text2)', fontSize: '10px' }}>{t('brand_typography_caption')}</span><br /><span style={{ fontSize: '11px', color: 'var(--text2)' }}>{t('brand_typography_caption_example')}</span></div>
              </div>
            </div>
          </div>
          <div>
            <div className="card" style={{ marginBottom: '14px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>{t('logo_rules')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '12px', color: 'var(--text2)' }}>
                <div>{t('brand_logo_clearspace')}</div>
                <div>{t('brand_logo_minimum_size')}</div>
                <div>{t('brand_logo_approved_bg')}</div>
                <div>{t('brand_logo_no_stretch')}</div>
                <div>{t('brand_logo_no_busy_bg')}</div>
              </div>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>{t('imagery')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '12px', color: 'var(--text2)' }}>
                <div>{t('brand_imagery_quality')}</div>
                <div>{t('brand_imagery_values')}</div>
                <div>{t('brand_imagery_color_grade')}</div>
                <div>{t('brand_imagery_avoid_cliched')}</div>
                <div>{t('brand_imagery_no_watermark')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderActivityPage() {
    return (
      <div className="page active">
        <div className="ph">
          <h1>{t('activity_log')}</h1>
          <p>{selectedOrg.icon} {translateOrgName(selectedOrg)}</p>
        </div>
        <div className="card">
          <div className="activity-list">
            {BASE_ACTIVITY.map((a, idx) => (
              <div className="activity-item" key={idx}>
                <div className="activity-dot" style={{ background: a.color }}></div>
                <div className="activity-text">{translateActivityText(a)}</div>
                <div className="activity-time">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderRegisterScreen() {
    return (
      <div className="select-screen" style={{ position: 'relative', minHeight: '80vh', zIndex: 10 }}>
        <div className="sel-logo"><div className="sel-dot"></div>BrandPortal</div>
        <p className="sel-subtitle" style={{ marginBottom: '25px' }}>Create New User Account (Admin Only)</p>
        <div className="card" style={{ maxWidth: '400px', width: '100%', marginBottom: '14px' }}>
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" placeholder="e.g. John Doe" value={regName} onChange={(e) => setRegName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="e.g. john@example.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-control" value={regRole} onChange={(e) => setRegRole(e.target.value)} required>
                {rolesList.map(r => <option value={r} key={r}>{translateRole(r)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Password (Optional for Google login)</label>
              <input type="password" className="form-control" placeholder="Optional" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
            </div>
            <button type="submit" className="sel-btn" style={{ width: '100%', marginTop: '18px' }}>Register User</button>
          </form>
          {regError && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '8px', minHeight: '18px' }}>{regError}</div>}
        </div>
        <button className="sel-back" onClick={() => { setActivePage('dashboard'); window.history.pushState({}, '', '/'); }}>← Back to Portal</button>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(<App />);

