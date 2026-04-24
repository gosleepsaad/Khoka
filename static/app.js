'use strict';

// ══════════════════════════════════════════════════════════════════
// TRANSLATIONS
// ══════════════════════════════════════════════════════════════════
const T = {
  en: {
    total: 'Total', clear: 'Clear', done_btn: 'DONE',
    nav_bill: 'Bill', nav_udhaar: 'Udhaar', nav_dashboard: 'Home',
    nav_sales: 'Sales', nav_more: 'More', nav_exit: 'Exit',
    owner_btn: 'Owner', owner_login: 'Owner Login', wrong_pin: 'Wrong PIN. Try again.',
    cancel: 'Cancel', add_udhaar: 'Add Udhaar', customer_name: 'Customer Name',
    search_customer: 'Search customer...', amount: 'Amount (Rs)',
    note_optional: 'Note (optional)', note_placeholder: 'e.g. Cigarettes',
    save_udhaar: 'Save Udhaar', or_add_new_customer: 'Or Add New Customer',
    add_customer: '+ Add Customer', phone: 'Phone number',
    today_sales: "Today's Sales", today_profit: "Today's Profit",
    total_udhaar: 'Total Udhaar', low_stock: 'Low Stock', items: 'items',
    ai_daily_summary: 'AI Daily Summary', top_items_week: 'Top Items This Week',
    customer_list: 'Customer List', select_customer: 'Select Customer',
    payment: 'Add Payment', mark_paid: 'Add Payment', transaction_history: 'Transaction History',
    filter: 'Filter', add_expense: 'Add Expense', add_expense_btn: 'Add Expense',
    category: 'Category', monthly_totals: 'Monthly Totals', recent_expenses: 'Recent Expenses',
    add_item: '+ Add Item', add_category: '+ New Category', item_manager: 'Item Manager',
    buy_list: 'Buy List', add_to_buy_list: '+ Add to Buy List', refresh: 'Refresh',
    ai_insights: 'AI Insights', ask_claude: 'Ask Claude', more: 'More',
    custom_item: 'Custom Item', item_name: 'Item Name', price: 'Price (Rs)',
    add_to_bill: 'Add to Bill', add: 'Add', expenses: 'Expenses',
    bill: 'Bill', offline_banner: 'AI features require internet',
    claude_welcome: "Assalam-o-Alaikum! I'm your shop assistant. Ask me anything about your business in English, Urdu, or Roman Urdu.",
    chat_placeholder: 'Ask about your shop...', send: 'Send',
    no_items: 'No items yet', sale_done: 'Sale completed!',
    udhaar_saved: 'Udhaar saved', customer_added: 'Customer added',
    expense_added: 'Expense added', item_added: 'Item added',
    fill_required: 'Please fill required fields', paid: 'Paid',
    order_tajir: 'Order via Tajir', done: 'Done', section_cig: 'Cigarettes',
    section_drinks: 'Cold Drinks', section_snacks: 'Snacks', section_other: 'Other',
    hot_items: 'Hot Items This Week', slow_items: 'Slow Moving Items',
    best_time: 'Best Sales Time', udhaar_top: 'Highest Udhaar', restock: 'Restock Urgency',
    no_data: 'No data yet', yesterday: 'Yesterday', vs_yesterday: 'vs yesterday',
    receipt: 'Receipt', cash: 'Cash', udhaar: 'Udhaar', add_to_udhaar: 'Add to Udhaar',
    change_pin: 'Change PIN', current_pin: 'Current PIN', new_pin: 'New PIN (4 digits)',
    confirm_pin: 'Confirm New PIN', save_pin: 'Save PIN', back: '← Back',
  },
  ur: {
    total: 'کل', clear: 'صاف', done_btn: 'مکمل',
    nav_bill: 'بل', nav_udhaar: 'ادھار', nav_dashboard: 'ہوم',
    nav_sales: 'فروخت', nav_more: 'مزید', nav_exit: 'باہر',
    owner_btn: 'مالک', owner_login: 'مالک لاگ ان', wrong_pin: 'غلط پن، دوبارہ کوشش کریں',
    cancel: 'رد کریں', add_udhaar: 'ادھار ڈالیں', customer_name: 'گاہک کا نام',
    search_customer: 'گاہک تلاش کریں...', amount: 'رقم (روپے)',
    note_optional: 'نوٹ (اختیاری)', note_placeholder: 'مثال: سگریٹ',
    save_udhaar: 'ادھار محفوظ', or_add_new_customer: 'یا نیا گاہک',
    add_customer: '+ گاہک شامل', phone: 'فون نمبر',
    today_sales: 'آج کی فروخت', today_profit: 'آج کا منافع',
    total_udhaar: 'کل ادھار', low_stock: 'کم اسٹاک', items: 'اشیاء',
    ai_daily_summary: 'AI روزانہ خلاصہ', top_items_week: 'اس ہفتے کے بہترین آئٹم',
    customer_list: 'گاہکوں کی فہرست', select_customer: 'گاہک منتخب کریں',
    payment: 'ادائیگی', mark_paid: 'ادائیگی شامل', transaction_history: 'لین دین کی تاریخ',
    filter: 'فلٹر', add_expense: 'خرچ ڈالیں', add_expense_btn: 'خرچ ڈالیں',
    category: 'قسم', monthly_totals: 'ماہانہ کل', recent_expenses: 'حالیہ اخراجات',
    add_item: '+ آئٹم ڈالیں', add_category: '+ نئی قسم', item_manager: 'آئٹم مینیجر',
    buy_list: 'خریداری فہرست', add_to_buy_list: '+ فہرست میں شامل', refresh: 'تازہ کریں',
    ai_insights: 'AI بصیرت', ask_claude: 'Claude سے پوچھیں', more: 'مزید',
    custom_item: 'کسٹم آئٹم', item_name: 'آئٹم کا نام', price: 'قیمت (روپے)',
    add_to_bill: 'بل میں شامل', add: 'شامل', expenses: 'اخراجات',
    bill: 'بل', offline_banner: 'AI فیچرز کے لیے انٹرنیٹ درکار ہے',
    claude_welcome: 'السلام علیکم! میں آپ کا دکان کا مددگار ہوں۔ اردو، انگریزی یا رومن اردو میں پوچھیں۔',
    chat_placeholder: 'اپنی دکان کے بارے میں پوچھیں...',
    no_items: 'ابھی کوئی آئٹم نہیں', sale_done: 'سیل مکمل!',
    udhaar_saved: 'ادھار محفوظ', customer_added: 'گاہک شامل', expense_added: 'خرچ شامل',
    item_added: 'آئٹم شامل', fill_required: 'ضروری خانے پُر کریں',
    paid: 'ادا', order_tajir: 'تاجر سے آرڈر', done: 'ہو گیا',
    section_cig: 'سگریٹ', section_drinks: 'ٹھنڈے مشروبات', section_snacks: 'نمکین',
    section_other: 'دیگر', hot_items: 'مقبول ترین آئٹم', slow_items: 'سست آئٹم',
    best_time: 'بہترین وقت', udhaar_top: 'سب سے زیادہ ادھار', restock: 'ری اسٹاک ضرورت',
    no_data: 'ابھی کوئی ڈیٹا نہیں', yesterday: 'کل', vs_yesterday: 'کل کے مقابلے میں',
    receipt: 'رسید', cash: 'نقد', udhaar: 'ادھار', add_to_udhaar: 'ادھار میں شامل',
    change_pin: 'پن تبدیل کریں', current_pin: 'موجودہ پن', new_pin: 'نیا پن (4 ہندسے)',
    confirm_pin: 'نئے پن کی تصدیق', save_pin: 'پن محفوظ کریں', back: '← واپس',
  },
};

// ══════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════
const KhokaApp = (() => {
  let lang = localStorage.getItem('khoka_lang') || 'en';
  let isOwner = false;
  let currentScreen = 'bill';
  let categories = [];
  let bill = {}; // item_id -> {name, price, qty}
  let pinBuffer = '';
  let correctPin = localStorage.getItem('khoka_pin') || '1234'; // cached, refreshed from server
  let allCustomers = [];
  let selectedUdhaarCustomer = null;
  let ownerSelectedCustomer = null;
  let currentDetailCustomer = null;
  let speechRecognition = null;
  let isListening = false;

  // ── i18n ─────────────────────────────────────────────────────
  function t(key) { return T[lang][key] || T.en[key] || key; }

  function applyLang() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    document.getElementById('lang-toggle-btn').textContent = lang === 'en' ? 'اردو' : 'EN';
    document.documentElement.lang = lang;
    document.body.style.direction = lang === 'ur' ? 'rtl' : 'ltr';
    updateDoneBtn();
  }

  function toggleLang() {
    lang = lang === 'en' ? 'ur' : 'en';
    localStorage.setItem('khoka_lang', lang);
    applyLang();
    renderBillGrid();
  }

  // ── Toast ────────────────────────────────────────────────────
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2000);
  }

  // ── Navigation ───────────────────────────────────────────────
  function showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + name);
    if (el) el.classList.add('active');
    currentScreen = name;

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const navBtn = document.getElementById('nav-' + name);
    if (navBtn) navBtn.classList.add('active');

    // Show/hide chat input
    const chatRow = document.getElementById('chat-input-row');
    chatRow.style.display = name === 'ask' ? 'flex' : 'none';

    // Show/hide done button
    document.getElementById('done-btn').style.display = name === 'bill' ? 'block' : 'none';

    // Lazy load data
    if (name === 'dashboard') loadDashboard();
    if (name === 'udhaar') loadOwnerCustomers();
    if (name === 'sales') loadSales();
    if (name === 'expenses') loadExpenses();
    if (name === 'items') loadItems();
    if (name === 'buylist') loadBuyList();
    if (name === 'insights') loadInsights();

    // Scroll to top
    document.getElementById('screen-wrap').scrollTop = 0;
  }

  // ── Owner Auth ────────────────────────────────────────────────
  function openOwnerLogin() {
    if (isOwner) {
      exitOwner();
      return;
    }
    pinBuffer = '';
    updatePinDots();
    document.getElementById('pin-error').style.display = 'none';
    document.getElementById('pin-modal').classList.remove('hidden');
  }

  function closePinModal() {
    document.getElementById('pin-modal').classList.add('hidden');
    pinBuffer = '';
    updatePinDots();
  }

  function pinInput(digit) {
    if (pinBuffer.length >= 4) return;
    pinBuffer += digit;
    updatePinDots();
    if (pinBuffer.length === 4) checkPin();
  }

  function pinClear() {
    pinBuffer = pinBuffer.slice(0, -1);
    updatePinDots();
  }

  function updatePinDots() {
    for (let i = 0; i < 4; i++) {
      document.getElementById('pd' + i).classList.toggle('filled', i < pinBuffer.length);
    }
  }

  function checkPin() {
    if (pinBuffer === correctPin) {
      isOwner = true;
      closePinModal();
      enterOwnerMode();
    } else {
      document.getElementById('pin-error').style.display = 'block';
      pinBuffer = '';
      updatePinDots();
      setTimeout(() => { document.getElementById('pin-error').style.display = 'none'; }, 1500);
    }
  }

  function showChangePinSheet() {
    document.getElementById('current-pin-input').value = '';
    document.getElementById('new-pin-input').value = '';
    document.getElementById('confirm-pin-input').value = '';
    document.getElementById('pin-change-error').style.display = 'none';
    openSheet('change-pin-sheet');
  }

  async function saveNewPin() {
    const current = document.getElementById('current-pin-input').value.trim();
    const newPin = document.getElementById('new-pin-input').value.trim();
    const confirm = document.getElementById('confirm-pin-input').value.trim();
    const errEl = document.getElementById('pin-change-error');

    if (newPin !== confirm) {
      errEl.textContent = 'New PINs do not match';
      errEl.style.display = 'block';
      return;
    }
    if (!/^\d{4}$/.test(newPin)) {
      errEl.textContent = 'PIN must be exactly 4 digits';
      errEl.style.display = 'block';
      return;
    }

    const resp = await fetch('/api/settings/pin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_pin: current, new_pin: newPin }),
    });
    if (!resp.ok) {
      const data = await resp.json();
      errEl.textContent = data.detail || 'Error changing PIN';
      errEl.style.display = 'block';
      return;
    }
    correctPin = newPin;
    localStorage.setItem('khoka_pin', newPin);
    closeSheet('change-pin-sheet');
    toast('PIN changed successfully');
  }

  function enterOwnerMode() {
    // Hide worker nav, show owner nav
    document.getElementById('nav-bill').style.display = 'none';
    document.getElementById('nav-worker-udhaar').style.display = 'none';
    document.getElementById('nav-dashboard').style.display = '';
    document.getElementById('nav-udhaar').style.display = '';
    document.getElementById('nav-sales').style.display = '';
    document.getElementById('nav-more').style.display = '';
    document.getElementById('nav-worker-exit').style.display = '';
    document.getElementById('owner-toggle-btn').innerHTML = '<span data-i18n="owner_btn">Owner</span> 🔓';
    showScreen('dashboard');
  }

  function exitOwner() {
    isOwner = false;
    document.getElementById('nav-bill').style.display = '';
    document.getElementById('nav-worker-udhaar').style.display = '';
    document.getElementById('nav-dashboard').style.display = 'none';
    document.getElementById('nav-udhaar').style.display = 'none';
    document.getElementById('nav-sales').style.display = 'none';
    document.getElementById('nav-more').style.display = 'none';
    document.getElementById('nav-worker-exit').style.display = 'none';
    document.getElementById('owner-toggle-btn').innerHTML = '<span data-i18n="owner_btn">Owner</span> 🔒';
    applyLang();
    showScreen('bill');
  }

  // ── Bill Calculator ───────────────────────────────────────────
  function renderBillGrid() {
    const grid = document.getElementById('bill-grid');
    if (!categories.length) {
      grid.innerHTML = '<div class="empty-state">Loading...</div>';
      return;
    }

    let html = '';
    categories.forEach(cat => {
      const catNameKey = cat.name.toLowerCase() === 'cigarettes' ? 'section_cig'
        : cat.name.toLowerCase().includes('cold') ? 'section_drinks'
        : cat.name.toLowerCase().includes('snack') ? 'section_snacks'
        : 'section_other';
      const catName = T[lang][catNameKey] || cat.name;
      html += `<div class="section-header">${catName}</div>`;
      html += `<div class="item-grid">`;
      cat.items.forEach(item => {
        const inBill = bill[item.id];
        const isCig = cat.name === 'Cigarettes';
        const itemName = lang === 'ur' && item.name_ur ? item.name_ur : item.name;
        html += `
          <button class="item-btn ${isCig ? 'cig-btn' : ''} ${inBill ? 'in-bill' : ''}"
            onclick="KhokaApp.addToBill(${item.id}, '${escHtml(item.name)}', ${item.price})"
            data-item-id="${item.id}">
            <span class="item-name">${escHtml(itemName)}</span>
            <span class="item-price">Rs ${item.price}</span>
          </button>`;
      });
      // Custom item button in last category
      if (cat.id === categories[categories.length - 1].id) {
        html += `
          <button class="item-btn custom-item-btn" onclick="KhokaApp.showCustomItemSheet()">
            <span class="item-name">➕ Custom</span>
            <span class="item-price text-muted">Any</span>
          </button>`;
      }
      html += `</div>`;
    });
    grid.innerHTML = html;
  }

  function addToBill(itemId, itemName, price) {
    itemId = String(itemId);
    if (bill[itemId]) {
      bill[itemId].qty += 1;
    } else {
      bill[itemId] = { name: itemName, price, qty: 1 };
    }
    updateBillUI();
    // Visual feedback
    const btn = document.querySelector(`[data-item-id="${itemId}"]`);
    if (btn) {
      btn.classList.add('in-bill');
      btn.style.transform = 'scale(0.95)';
      setTimeout(() => { btn.style.transform = ''; }, 120);
    }
  }

  function adjustQty(itemId, delta) {
    itemId = String(itemId);
    if (!bill[itemId]) return;
    bill[itemId].qty += delta;
    if (bill[itemId].qty <= 0) delete bill[itemId];
    updateBillUI();
    // Sync grid buttons
    const btn = document.querySelector(`[data-item-id="${itemId}"]`);
    if (btn) btn.classList.toggle('in-bill', !!bill[itemId]);
  }

  function updateBillUI() {
    const items = Object.entries(bill);
    const total = items.reduce((s, [, v]) => s + v.price * v.qty, 0);

    document.getElementById('bill-total-amount').textContent = `Rs ${total}`;
    document.getElementById('done-btn').textContent = `${t('done_btn')} — Rs ${total}`;
    document.getElementById('done-btn').disabled = items.length === 0;

    const bar = document.getElementById('bill-items-bar');
    if (items.length === 0) {
      bar.innerHTML = '';
      bar.setAttribute('data-empty', t('no_items'));
      return;
    }
    bar.removeAttribute('data-empty');
    bar.innerHTML = items.map(([id, v]) => `
      <div class="bill-chip">
        <button class="bill-chip-qty-btn" onclick="KhokaApp.adjustQty('${id}',-1)">−</button>
        <span class="bill-chip-qty">${v.qty}</span>
        <span>${escHtml(v.name)}</span>
        <button class="bill-chip-qty-btn" onclick="KhokaApp.adjustQty('${id}',1)">+</button>
      </div>`).join('');
  }

  function clearBill() {
    bill = {};
    updateBillUI();
    document.querySelectorAll('.item-btn').forEach(b => b.classList.remove('in-bill'));
  }

  // Pending sale data (set when receipt is shown, consumed on cash/udhaar)
  let pendingSale = null;

  function completeSale() {
    const items = Object.entries(bill);
    if (!items.length) return;
    const total = items.reduce((s, [, v]) => s + v.price * v.qty, 0);

    pendingSale = {
      items: items.map(([id, v]) => ({
        item_id: isNaN(id) ? null : Number(id),
        item_name: v.name,
        price: v.price,
        quantity: v.qty,
      })),
      total,
    };

    // Show receipt sheet
    const receiptItems = document.getElementById('receipt-items');
    receiptItems.innerHTML = items.map(([, v]) => `
      <div class="flex-between" style="padding:5px 0;border-bottom:1px solid var(--border);">
        <span>${escHtml(v.name)} <span style="color:var(--text-muted);">×${v.qty}</span></span>
        <span class="fw-bold">Rs ${fmt(v.price * v.qty)}</span>
      </div>`).join('');
    document.getElementById('receipt-total').textContent = `Rs ${fmt(total)}`;

    // Reset udhaar picker
    document.getElementById('sale-udhaar-search').value = '';
    document.getElementById('sale-udhaar-cust-id').value = '';
    document.getElementById('sale-udhaar-selected').style.display = 'none';
    document.getElementById('sale-udhaar-results').classList.remove('open');

    openSheet('receipt-sheet');
  }

  async function finishSaleCash() {
    if (!pendingSale) return;
    closeSheet('receipt-sheet');
    clearBill();
    toast(t('sale_done'));
    fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pendingSale),
    }).catch(() => {});
    pendingSale = null;
  }

  function startSaleUdhaar() {
    closeSheet('receipt-sheet');
    openSheet('sale-udhaar-sheet');
    document.getElementById('sale-udhaar-search').focus();
  }

  function searchSaleCustomers(query) {
    const results = document.getElementById('sale-udhaar-results');
    if (!query.trim()) { results.classList.remove('open'); return; }
    const matches = allCustomers.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
    let html = matches.slice(0, 6).map(c =>
      `<div class="search-result-item" onclick="KhokaApp.selectSaleCustomer(${c.id},'${escHtml(c.name)}')">${escHtml(c.name)}</div>`
    ).join('');
    const exact = matches.find(c => c.name.toLowerCase() === query.toLowerCase());
    if (!exact) {
      html += `<div class="search-result-item" style="color:var(--green);font-style:italic;"
        onclick="KhokaApp.selectNewSaleCustomer('${escHtml(query)}')">
        ➕ Add "${escHtml(query)}" as new customer
      </div>`;
    }
    results.innerHTML = html;
    results.classList.add('open');
  }

  function selectSaleCustomer(id, name) {
    document.getElementById('sale-udhaar-cust-id').value = id;
    document.getElementById('sale-udhaar-search').value = name;
    document.getElementById('sale-udhaar-results').classList.remove('open');
    document.getElementById('sale-udhaar-selected').style.display = 'inline-block';
    document.getElementById('sale-udhaar-selected').textContent = '✓ ' + name;
  }

  function selectNewSaleCustomer(name) {
    document.getElementById('sale-udhaar-cust-id').value = '';
    document.getElementById('sale-udhaar-search').value = name;
    document.getElementById('sale-udhaar-results').classList.remove('open');
    document.getElementById('sale-udhaar-selected').style.display = 'inline-block';
    document.getElementById('sale-udhaar-selected').textContent = '✨ New: ' + name;
  }

  async function finishSaleUdhaar() {
    if (!pendingSale) return;
    let custId = document.getElementById('sale-udhaar-cust-id').value;
    const typedName = document.getElementById('sale-udhaar-search').value.trim();
    if (!typedName) { toast(t('fill_required')); return; }

    // Auto-create customer if needed
    if (!custId && typedName) {
      const resp = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: typedName }),
      });
      const newCust = await resp.json();
      allCustomers.push(newCust);
      custId = newCust.id;
    }

    closeSheet('sale-udhaar-sheet');
    clearBill();
    toast(`${t('udhaar_saved')} — ${typedName}`);

    // Save sale then udhaar
    const saleResp = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pendingSale),
    });
    const sale = await saleResp.json();
    await fetch('/api/udhaar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: Number(custId), amount: pendingSale.total, note: 'Bill udhaar' }),
    });
    pendingSale = null;
  }

  function showCustomItemSheet() {
    document.getElementById('custom-item-name').value = '';
    document.getElementById('custom-item-price').value = '';
    openSheet('custom-item-sheet');
  }

  function addCustomItem() {
    const name = document.getElementById('custom-item-name').value.trim();
    const price = parseFloat(document.getElementById('custom-item-price').value);
    if (!name || isNaN(price) || price <= 0) { toast(t('fill_required')); return; }
    const tempId = 'custom_' + Date.now();
    bill[tempId] = { name, price, qty: 1 };
    updateBillUI();
    closeSheet('custom-item-sheet');
  }

  // ── Worker Udhaar ─────────────────────────────────────────────
  async function searchCustomers(query) {
    const results = document.getElementById('udhaar-search-results');
    if (!query.trim()) { results.classList.remove('open'); return; }

    const matches = allCustomers.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );

    let html = matches.slice(0, 6).map(c =>
      `<div class="search-result-item" onclick="KhokaApp.selectUdhaarCustomer(${c.id}, '${escHtml(c.name)}')">${escHtml(c.name)}</div>`
    ).join('');

    // Always show "create new" option so worker can add on the fly
    const exactMatch = matches.find(c => c.name.toLowerCase() === query.toLowerCase());
    if (!exactMatch) {
      html += `<div class="search-result-item" style="color:var(--green);font-style:italic;"
        onclick="KhokaApp.selectNewUdhaarCustomer('${escHtml(query)}')">
        ➕ Add "${escHtml(query)}" as new customer
      </div>`;
    }

    results.innerHTML = html;
    results.classList.add('open');
  }

  function selectUdhaarCustomer(id, name) {
    selectedUdhaarCustomer = { id, name };
    document.getElementById('udhaar-customer-id').value = id;
    document.getElementById('udhaar-search').value = name;
    document.getElementById('udhaar-search-results').classList.remove('open');
    document.getElementById('udhaar-selected-customer').style.display = 'inline-block';
    document.getElementById('udhaar-selected-customer').textContent = '✓ ' + name;
  }

  // Select a new (not-yet-created) customer by name — will be created on save
  function selectNewUdhaarCustomer(name) {
    selectedUdhaarCustomer = { id: null, name };
    document.getElementById('udhaar-customer-id').value = '';
    document.getElementById('udhaar-search').value = name;
    document.getElementById('udhaar-search-results').classList.remove('open');
    document.getElementById('udhaar-selected-customer').style.display = 'inline-block';
    document.getElementById('udhaar-selected-customer').textContent = '✨ New: ' + name;
  }

  async function saveWorkerUdhaar() {
    const amount = parseFloat(document.getElementById('udhaar-amount').value);
    const note = document.getElementById('udhaar-note').value;
    let custId = document.getElementById('udhaar-customer-id').value;
    const typedName = document.getElementById('udhaar-search').value.trim();

    if (!typedName || isNaN(amount) || amount <= 0) { toast(t('fill_required')); return; }

    // Auto-create customer if not selected from list
    if (!custId && typedName) {
      const resp = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: typedName }),
      });
      const newCust = await resp.json();
      allCustomers.push(newCust);
      custId = newCust.id;
      toast(`Customer "${typedName}" created`);
    }

    await fetch('/api/udhaar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: Number(custId), amount, note }),
    });
    // Reset
    document.getElementById('udhaar-search').value = '';
    document.getElementById('udhaar-customer-id').value = '';
    document.getElementById('udhaar-amount').value = '';
    document.getElementById('udhaar-note').value = '';
    document.getElementById('udhaar-selected-customer').style.display = 'none';
    selectedUdhaarCustomer = null;
    toast(t('udhaar_saved'));
  }

  async function addNewCustomer() {
    const name = document.getElementById('new-cust-name').value.trim();
    const phone = document.getElementById('new-cust-phone').value.trim();
    if (!name) { toast(t('fill_required')); return; }
    const resp = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone }),
    });
    const cust = await resp.json();
    allCustomers.push(cust);
    document.getElementById('new-cust-name').value = '';
    document.getElementById('new-cust-phone').value = '';
    toast(t('customer_added'));
  }

  // ── Dashboard ─────────────────────────────────────────────────
  async function loadDashboard() {
    const [dash, summary] = await Promise.all([
      fetch('/api/dashboard').then(r => r.json()),
      fetch(`/api/ai/summary?language=${lang}`).then(r => r.json()).catch(() => ({ summary: '' })),
    ]);

    document.getElementById('dash-today-sales').textContent = `Rs ${fmt(dash.today_sales)}`;
    const profitEl = document.getElementById('dash-today-profit');
    profitEl.textContent = `Rs ${fmt(dash.today_profit)}`;
    profitEl.className = 'stat-value' + (dash.today_profit < 0 ? ' red' : '');
    document.getElementById('dash-udhaar').textContent = `Rs ${fmt(dash.total_udhaar)}`;
    document.getElementById('dash-low-stock').textContent = dash.low_stock_count;

    // Top items
    const topEl = document.getElementById('dash-top-items');
    if (dash.top_items_week?.length) {
      topEl.innerHTML = dash.top_items_week.map((item, i) => `
        <div class="flex-between" style="padding:6px 0;border-bottom:1px solid var(--border);">
          <span>${i + 1}. ${escHtml(item.item_name)}</span>
          <span class="chip chip-green">${item.qty} sold</span>
        </div>`).join('');
    } else {
      topEl.innerHTML = `<div class="text-muted">${t('no_data')}</div>`;
    }

    // Summary
    const summaryEl = document.getElementById('dash-summary-text');
    summaryEl.innerHTML = formatAIText(summary.summary || 'Loading...');
    summaryEl.dir = lang === 'ur' ? 'rtl' : 'ltr';
  }

  function speakSummary() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const text = document.getElementById('dash-summary-text').innerText;
    if (!text || text.includes('shimmer')) return;
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang === 'ur' ? 'ur-PK' : 'en-US';
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
    const btn = document.getElementById('summary-speak-btn');
    btn.textContent = '⏹';
    utt.onend = () => { btn.textContent = '🔊'; };
    btn.onclick = () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        btn.textContent = '🔊';
        btn.onclick = () => KhokaApp.speakSummary();
      }
    };
  }

  // ── Owner Udhaar ──────────────────────────────────────────────
  async function loadOwnerCustomers() {
    const resp = await fetch('/api/customers');
    allCustomers = await resp.json();
    const listEl = document.getElementById('udhaar-customer-list');

    if (!allCustomers.length) {
      listEl.innerHTML = `<div class="empty-state">${t('no_data')}</div>`;
      return;
    }

    listEl.innerHTML = allCustomers.map(c => {
      const bal = c.balance || 0;
      return `
        <div class="customer-item" onclick="KhokaApp.showCustomerDetail(${c.id})">
          <div class="customer-avatar">${c.name[0].toUpperCase()}</div>
          <div class="customer-info">
            <div class="customer-name">${escHtml(c.name)}</div>
            <div class="customer-meta">${c.phone || ''}</div>
          </div>
          <div class="customer-balance ${bal <= 0 ? 'zero' : ''}">
            ${bal > 0 ? `Rs ${fmt(bal)}` : '✓'}
          </div>
        </div>`;
    }).join('');
  }

  function showUdhaarTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.tab === tab));
    document.getElementById('udhaar-list-tab').style.display = tab === 'list' ? '' : 'none';
    document.getElementById('udhaar-add-tab').style.display = tab === 'add' ? '' : 'none';
  }

  function ownerSearchCustomers(query) {
    const results = document.getElementById('owner-udhaar-results');
    if (!query.trim()) { results.classList.remove('open'); return; }
    const matches = allCustomers.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
    let html = matches.slice(0, 6).map(c =>
      `<div class="search-result-item" onclick="KhokaApp.selectOwnerCustomer(${c.id}, '${escHtml(c.name)}')">${escHtml(c.name)}</div>`
    ).join('');
    const exactMatch = matches.find(c => c.name.toLowerCase() === query.toLowerCase());
    if (!exactMatch) {
      html += `<div class="search-result-item" style="color:var(--green);font-style:italic;"
        onclick="KhokaApp.selectNewOwnerCustomer('${escHtml(query)}')">
        ➕ Add "${escHtml(query)}" as new customer
      </div>`;
    }
    results.innerHTML = html;
    results.classList.add('open');
  }

  function selectOwnerCustomer(id, name) {
    ownerSelectedCustomer = { id, name };
    document.getElementById('owner-udhaar-cust-id').value = id;
    document.getElementById('owner-udhaar-search').value = name;
    document.getElementById('owner-udhaar-results').classList.remove('open');
    document.getElementById('owner-udhaar-selected').style.display = 'inline-block';
    document.getElementById('owner-udhaar-selected').textContent = '✓ ' + name;
  }

  function selectNewOwnerCustomer(name) {
    ownerSelectedCustomer = { id: null, name };
    document.getElementById('owner-udhaar-cust-id').value = '';
    document.getElementById('owner-udhaar-search').value = name;
    document.getElementById('owner-udhaar-results').classList.remove('open');
    document.getElementById('owner-udhaar-selected').style.display = 'inline-block';
    document.getElementById('owner-udhaar-selected').textContent = '✨ New: ' + name;
  }

  async function saveOwnerUdhaar() {
    const amount = parseFloat(document.getElementById('owner-udhaar-amount').value);
    const note = document.getElementById('owner-udhaar-note').value;
    let custId = document.getElementById('owner-udhaar-cust-id').value;
    const typedName = document.getElementById('owner-udhaar-search').value.trim();
    if (!typedName || isNaN(amount) || amount <= 0) { toast(t('fill_required')); return; }

    if (!custId && typedName) {
      const resp = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: typedName }),
      });
      const newCust = await resp.json();
      allCustomers.push(newCust);
      custId = newCust.id;
    }

    await fetch('/api/udhaar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: Number(custId), amount, note }),
    });
    document.getElementById('owner-udhaar-amount').value = '';
    document.getElementById('owner-udhaar-note').value = '';
    toast(t('udhaar_saved'));
    loadOwnerCustomers();
    showUdhaarTab('list');
  }

  async function showCustomerDetail(customerId) {
    currentDetailCustomer = customerId;
    showScreen('customer-detail');
    const data = await fetch(`/api/customers/${customerId}/transactions`).then(r => r.json());

    document.getElementById('customer-detail-header').innerHTML = `
      <div class="flex-between">
        <div>
          <div class="fw-bold" style="font-size:20px;">${escHtml(data.name)}</div>
          <div class="text-muted">${data.phone || ''}</div>
        </div>
        <div style="text-align:right;">
          <div class="stat-label">Balance</div>
          <div class="stat-value ${data.balance > 0 ? 'red' : 'text-green'}">Rs ${fmt(data.balance)}</div>
        </div>
      </div>`;

    const txnList = document.getElementById('customer-txn-list');
    if (!data.transactions?.length) {
      txnList.innerHTML = `<div class="text-muted">${t('no_data')}</div>`;
      return;
    }
    txnList.innerHTML = data.transactions.map(tx => `
      <div class="txn-item">
        <div>
          <div class="${tx.type === 'debit' ? 'txn-debit' : 'txn-credit'}">
            ${tx.type === 'debit' ? '−' : '+'}Rs ${fmt(tx.amount)}
          </div>
          <div class="txn-meta">${tx.note || ''}</div>
        </div>
        <div class="txn-meta">${fmtDate(tx.created_at)}</div>
      </div>`).join('');
  }

  async function addPayment() {
    const amount = parseFloat(document.getElementById('pay-amount').value);
    if (isNaN(amount) || amount <= 0) { toast(t('fill_required')); return; }
    await fetch(`/api/customers/${currentDetailCustomer}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    document.getElementById('pay-amount').value = '';
    toast(t('paid'));
    showCustomerDetail(currentDetailCustomer);
  }

  // ── Sales ─────────────────────────────────────────────────────
  async function loadSales() {
    const from = document.getElementById('sales-from').value;
    const to = document.getElementById('sales-to').value;
    let url = '/api/sales?limit=100';
    if (from) url += `&date_from=${from}`;
    if (to) url += `&date_to=${to}`;

    document.getElementById('sales-list').innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    const sales = await fetch(url).then(r => r.json());
    const el = document.getElementById('sales-list');

    if (!sales.length) {
      el.innerHTML = `<div class="empty-state"><div class="empty-icon">📊</div>${t('no_data')}</div>`;
      return;
    }

    el.innerHTML = sales.map(s => `
      <div class="sale-item">
        <div class="sale-header">
          <div class="sale-total">Rs ${fmt(s.total)}</div>
          <div class="sale-time">${fmtDate(s.created_at)}</div>
        </div>
        <div class="sale-items-list">
          ${s.items.map(i => `${escHtml(i.item_name)} ×${i.quantity}`).join(' · ')}
        </div>
      </div>`).join('');
  }

  // ── Expenses ──────────────────────────────────────────────────
  async function loadExpenses() {
    const data = await fetch('/api/expenses').then(r => r.json());

    // Monthly totals
    const monthlyEl = document.getElementById('expense-monthly');
    monthlyEl.innerHTML = (data.monthly_totals || []).map(m => `
      <div class="flex-between" style="padding:6px 0;border-bottom:1px solid var(--border);">
        <span>${m.month}</span>
        <span class="fw-bold">Rs ${fmt(m.total)}</span>
      </div>`).join('') || `<div class="text-muted">${t('no_data')}</div>`;

    const listEl = document.getElementById('expense-list');
    if (!data.expenses?.length) {
      listEl.innerHTML = `<div class="text-muted">${t('no_data')}</div>`;
      return;
    }
    listEl.innerHTML = data.expenses.map(e => `
      <div class="expense-item">
        <div>
          <span class="expense-category cat-${e.category}">${e.category}</span>
          <div class="text-muted" style="font-size:12px;">${e.note || ''} · ${fmtDate(e.created_at)}</div>
        </div>
        <div class="fw-bold text-red">Rs ${fmt(e.amount)}</div>
      </div>`).join('');
  }

  async function addExpense() {
    const category = document.getElementById('expense-cat').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const note = document.getElementById('expense-note').value;
    if (isNaN(amount) || amount <= 0) { toast(t('fill_required')); return; }
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, amount, note }),
    });
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-note').value = '';
    toast(t('expense_added'));
    loadExpenses();
  }

  // ── Item Manager ──────────────────────────────────────────────
  async function loadItems() {
    const el = document.getElementById('items-list');
    el.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    const cats = await fetch('/api/items').then(r => r.json());
    categories = cats;
    renderBillGrid();

    let html = '';
    cats.forEach(cat => {
      html += `<div class="card mb-8">
        <div class="card-title">${escHtml(cat.name)} · ${escHtml(cat.name_ur)}</div>`;
      if (!cat.items.length) {
        html += `<div class="text-muted" style="font-size:13px;">No items</div>`;
      }
      cat.items.forEach(item => {
        html += `
          <div class="item-manage-row">
            <div class="item-manage-info">
              <div class="item-manage-name">${escHtml(item.name)}</div>
              <div class="item-manage-price">Rs ${item.price}</div>
            </div>
            ${item.is_low_stock ? '<span class="low-stock-badge">Low</span>' : ''}
            <button class="btn btn-sm ${item.is_low_stock ? 'btn-secondary' : 'btn-outline'}"
              onclick="KhokaApp.toggleLowStock(${item.id})"
              title="${item.is_low_stock ? 'Mark OK' : 'Mark Low'}">
              ${item.is_low_stock ? '✓ Low' : '⚠ Low?'}
            </button>
            <button class="btn btn-sm btn-danger" onclick="KhokaApp.removeItem(${item.id})">🗑</button>
          </div>`;
      });
      html += `</div>`;
    });
    el.innerHTML = html || `<div class="empty-state">${t('no_data')}</div>`;
  }

  function showAddItemSheet() {
    const sel = document.getElementById('new-item-cat');
    sel.innerHTML = categories.map(c =>
      `<option value="${c.id}">${escHtml(c.name)}</option>`
    ).join('');
    openSheet('add-item-sheet');
  }

  async function addItem() {
    const catId = Number(document.getElementById('new-item-cat').value);
    const name = document.getElementById('new-item-name').value.trim();
    const nameUr = document.getElementById('new-item-name-ur').value.trim();
    const price = parseFloat(document.getElementById('new-item-price').value);
    if (!name || isNaN(price) || price <= 0) { toast(t('fill_required')); return; }
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category_id: catId, name, name_ur: nameUr, price }),
    });
    document.getElementById('new-item-name').value = '';
    document.getElementById('new-item-name-ur').value = '';
    document.getElementById('new-item-price').value = '';
    toast(t('item_added'));
    closeSheet('add-item-sheet');
    loadItems();
  }

  async function toggleLowStock(itemId) {
    await fetch(`/api/items/${itemId}/low-stock`, { method: 'PUT' });
    loadItems();
  }

  async function removeItem(itemId) {
    await fetch(`/api/items/${itemId}`, { method: 'DELETE' });
    toast('Item removed');
    loadItems();
  }

  function showAddCategorySheet() { openSheet('add-category-sheet'); }

  async function addCategory() {
    const name = document.getElementById('new-cat-name').value.trim();
    const nameUr = document.getElementById('new-cat-name-ur').value.trim();
    if (!name) { toast(t('fill_required')); return; }
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, name_ur: nameUr }),
    });
    document.getElementById('new-cat-name').value = '';
    document.getElementById('new-cat-name-ur').value = '';
    closeSheet('add-category-sheet');
    loadItems();
  }

  // ── Buy List ──────────────────────────────────────────────────
  async function loadBuyList() {
    const items = await fetch('/api/buy-list').then(r => r.json());
    const el = document.getElementById('buy-list-items');
    if (!items.length) {
      el.innerHTML = `<div class="empty-state"><div class="empty-icon">🛒</div>${t('no_data')}</div>`;
      return;
    }
    el.innerHTML = items.map(item => `
      <div class="buy-item" id="buy-row-${item.id}">
        <div class="buy-item-name">
          ${escHtml(item.item_name)}
          ${item.note ? `<div class="text-muted" style="font-size:12px;">${escHtml(item.note)}</div>` : ''}
        </div>
        <a class="tajir-btn" href="https://tajir.pk" target="_blank" rel="noopener">📦 Tajir</a>
        <button class="btn btn-sm btn-secondary" onclick="KhokaApp.completeBuyItem(${item.id})">✓</button>
      </div>`).join('');
  }

  async function completeBuyItem(id) {
    await fetch(`/api/buy-list/${id}/complete`, { method: 'PUT' });
    document.getElementById('buy-row-' + id)?.remove();
    toast(t('done'));
  }

  function showAddBuySheet() { openSheet('add-buy-sheet'); }

  async function addBuyItem() {
    const name = document.getElementById('buy-item-name').value.trim();
    const note = document.getElementById('buy-item-note').value.trim();
    if (!name) { toast(t('fill_required')); return; }
    await fetch('/api/buy-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_name: name, note }),
    });
    document.getElementById('buy-item-name').value = '';
    document.getElementById('buy-item-note').value = '';
    closeSheet('add-buy-sheet');
    loadBuyList();
  }

  // ── AI Insights ───────────────────────────────────────────────
  async function loadInsights() {
    const el = document.getElementById('insights-content');
    el.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    if (!navigator.onLine) {
      el.innerHTML = `<div class="card"><div class="empty-state">🔌 ${t('offline_banner')}</div></div>`;
      return;
    }

    try {
      const data = await fetch('/api/ai/insights').then(r => r.json());
      const fmt2 = data.formatted || {};
      const sections = [
        { key: 'hot_items', label: t('hot_items'), icon: '🔥', text: fmt2.hot_items_text },
        { key: 'slow_items', label: t('slow_items'), icon: '🐢', text: fmt2.slow_items_text },
        { key: 'best_time', label: t('best_time'), icon: '⏰', text: fmt2.best_time_text },
        { key: 'udhaar_top', label: t('udhaar_top'), icon: '💸', text: fmt2.udhaar_text },
        { key: 'restock', label: t('restock'), icon: '📦', text: fmt2.restock_text },
      ];

      let html = '';

      // Hot items fallback
      if (!fmt2.hot_items_text && data.hot_items?.length) {
        html += `<div class="card mb-8"><div class="card-title">🔥 ${t('hot_items')}</div>`;
        html += data.hot_items.map(i =>
          `<div class="insight-item"><b>${escHtml(i.item_name)}</b> — ${i.qty} sold (Rs ${fmt(i.revenue)})</div>`
        ).join('');
        html += '</div>';
      } else if (fmt2.hot_items_text) {
        html += `<div class="card mb-8"><div class="card-title">🔥 ${t('hot_items')}</div><div class="insight-item">${escHtml(fmt2.hot_items_text)}</div></div>`;
      }

      // Slow items
      if (!fmt2.slow_items_text && data.slow_items?.length) {
        html += `<div class="card mb-8"><div class="card-title">🐢 ${t('slow_items')}</div>`;
        html += data.slow_items.map(i =>
          `<div class="insight-item">${escHtml(i)}</div>`
        ).join('');
        html += '</div>';
      } else if (fmt2.slow_items_text) {
        html += `<div class="card mb-8"><div class="card-title">🐢 ${t('slow_items')}</div><div class="insight-item">${escHtml(fmt2.slow_items_text)}</div></div>`;
      }

      // Best hours
      if (data.best_hours?.length) {
        html += `<div class="card mb-8"><div class="card-title">⏰ ${t('best_time')}</div>`;
        html += data.best_hours.map(h =>
          `<div class="insight-item">${h.hour}:00 — Rs ${fmt(h.total)}</div>`
        ).join('');
        html += '</div>';
      }

      // Top udhaar
      if (data.top_udhaar_customers?.length) {
        html += `<div class="card mb-8"><div class="card-title">💸 ${t('udhaar_top')}</div>`;
        html += data.top_udhaar_customers.map(c =>
          `<div class="insight-item flex-between"><span>${escHtml(c.name)}</span><span class="fw-bold text-red">Rs ${fmt(c.balance)}</span></div>`
        ).join('');
        html += '</div>';
      }

      el.innerHTML = html || `<div class="empty-state">${t('no_data')}</div>`;
    } catch (e) {
      el.innerHTML = `<div class="card"><div class="empty-state">Error loading insights</div></div>`;
    }
  }

  // ── Ask Claude ────────────────────────────────────────────────
  async function sendChat() {
    const input = document.getElementById('chat-input');
    const question = input.value.trim();
    if (!question) return;
    input.value = '';

    if (!navigator.onLine) {
      appendChat('ai', '🔌 ' + t('offline_banner'));
      return;
    }

    appendChat('user', question);
    const thinkingId = appendChat('ai', '...');

    try {
      const resp = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, language: lang }),
      });
      const data = await resp.json();
      const el = document.getElementById(thinkingId);
      el.innerHTML = formatAIText(data.answer || 'No response');
      el.dir = lang === 'ur' ? 'rtl' : 'ltr';
    } catch {
      document.getElementById(thinkingId).textContent = '❌ Error connecting to AI';
    }
    scrollChatToBottom();
  }

  function formatAIText(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')  // strip **bold**
      .replace(/\*(.*?)\*/g, '$1')       // strip *italic*
      .replace(/\n/g, '<br>');
  }

  function appendChat(role, text) {
    const el = document.createElement('div');
    const id = 'msg-' + Date.now();
    el.id = id;
    el.className = `chat-bubble ${role}`;
    if (role === 'ai') {
      el.innerHTML = formatAIText(text);
      el.dir = lang === 'ur' ? 'rtl' : 'ltr';
    } else {
      el.textContent = text;
    }
    document.getElementById('chat-messages').appendChild(el);
    scrollChatToBottom();
    return id;
  }

  function scrollChatToBottom() {
    const wrap = document.getElementById('screen-wrap');
    setTimeout(() => { wrap.scrollTop = wrap.scrollHeight; }, 50);
  }

  // ── Voice Input ───────────────────────────────────────────────
  function toggleMic() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast('Voice not supported on this browser');
      return;
    }
    if (isListening) {
      speechRecognition?.stop();
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRecognition = new SpeechRecognition();
    speechRecognition.lang = 'ur-PK';
    speechRecognition.interimResults = false;
    speechRecognition.maxAlternatives = 1;

    speechRecognition.onstart = () => {
      isListening = true;
      document.getElementById('mic-btn').classList.add('listening');
    };
    speechRecognition.onresult = e => {
      const transcript = e.results[0][0].transcript;
      document.getElementById('chat-input').value = transcript;
    };
    speechRecognition.onerror = () => {
      isListening = false;
      document.getElementById('mic-btn').classList.remove('listening');
    };
    speechRecognition.onend = () => {
      isListening = false;
      document.getElementById('mic-btn').classList.remove('listening');
    };
    speechRecognition.start();
  }

  // ── More Menu ─────────────────────────────────────────────────
  function toggleMoreMenu() {
    const sheet = document.getElementById('more-sheet');
    const backdrop = document.getElementById('more-backdrop');
    sheet.classList.toggle('hidden');
    backdrop.style.display = sheet.classList.contains('hidden') ? 'none' : '';
  }

  function closeMoreMenu() {
    document.getElementById('more-sheet').classList.add('hidden');
    document.getElementById('more-backdrop').style.display = 'none';
  }

  // ── Sheets ────────────────────────────────────────────────────
  function openSheet(id) {
    document.getElementById(id).classList.remove('hidden');
    document.getElementById('sheet-backdrop').style.display = '';
  }

  function closeSheet(id) {
    document.getElementById(id).classList.add('hidden');
    if (!document.querySelectorAll('.sheet:not(.hidden)').length)
      document.getElementById('sheet-backdrop').style.display = 'none';
  }

  function closeAllSheets() {
    document.querySelectorAll('.sheet').forEach(s => s.classList.add('hidden'));
    document.getElementById('sheet-backdrop').style.display = 'none';
  }

  // ── Helpers ───────────────────────────────────────────────────
  function fmt(n) {
    return Number(n || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 });
  }

  function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString())
      return d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
    if (d.toDateString() === yesterday.toDateString())
      return t('yesterday') + ' ' + d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });
  }

  function escHtml(str) {
    return String(str || '').replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  }

  function updateDoneBtn() {
    const items = Object.entries(bill);
    const total = items.reduce((s, [, v]) => s + v.price * v.qty, 0);
    document.getElementById('done-btn').textContent = `${t('done_btn')} — Rs ${total}`;
  }

  // ── Init ──────────────────────────────────────────────────────
  async function init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/static/sw.js').catch(() => {});
    }

    // Offline banner
    window.addEventListener('online', () => document.getElementById('offline-banner').classList.remove('show'));
    window.addEventListener('offline', () => document.getElementById('offline-banner').classList.add('show'));
    if (!navigator.onLine) document.getElementById('offline-banner').classList.add('show');

    // Fetch live PIN from server
    fetch('/api/settings/pin').then(r => r.json()).then(d => {
      if (d.pin) { correctPin = d.pin; localStorage.setItem('khoka_pin', d.pin); }
    }).catch(() => {});

    // Load items/categories
    try {
      const data = await fetch('/api/items').then(r => r.json());
      categories = data;
    } catch { categories = []; }

    // Load customers for udhaar search
    try {
      allCustomers = await fetch('/api/customers').then(r => r.json());
    } catch { allCustomers = []; }

    // Set default date filters to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('sales-from').value = today;
    document.getElementById('sales-to').value = today;

    // Apply language
    applyLang();
    renderBillGrid();
    showScreen('bill');

    // Enter key for chat
    document.getElementById('chat-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') sendChat();
    });

    // Touch swipe on bill items bar for a natural feel
    document.getElementById('bill-items-bar').style.overflowX = 'auto';
  }

  // Public API
  return {
    init, toggleLang, showScreen, openOwnerLogin, closePinModal, exitOwner,
    pinInput, pinClear, addToBill, adjustQty, clearBill, completeSale,
    finishSaleCash, startSaleUdhaar, searchSaleCustomers, selectSaleCustomer,
    selectNewSaleCustomer, finishSaleUdhaar,
    showCustomItemSheet, addCustomItem, searchCustomers, selectUdhaarCustomer,
    selectNewUdhaarCustomer, saveWorkerUdhaar, addNewCustomer, loadDashboard,
    loadOwnerCustomers, showUdhaarTab, ownerSearchCustomers, selectOwnerCustomer,
    selectNewOwnerCustomer, saveOwnerUdhaar,
    showChangePinSheet, saveNewPin,
    showCustomerDetail, addPayment, loadSales, loadExpenses, addExpense,
    loadItems, showAddItemSheet, addItem, toggleLowStock, removeItem,
    showAddCategorySheet, addCategory, loadBuyList, completeBuyItem,
    showAddBuySheet, addBuyItem, loadInsights, sendChat, toggleMic,
    toggleMoreMenu, closeMoreMenu, openSheet, closeSheet, closeAllSheets,
    speakSummary,
  };
})();

document.addEventListener('DOMContentLoaded', () => KhokaApp.init());
