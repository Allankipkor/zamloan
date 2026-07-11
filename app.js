// ==========================================
// ZAMLOAN LIMIT BOOST - INTERACTIVE LOGIC
// ==========================================

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
  
  let walletName = "MTN MoMo";
  if (selectedProvider === "airtel") walletName = "Airtel Money";
  if (selectedProvider === "zamtel") walletName = "Zamtel Cash";
  summaryWallet.textContent = `${walletName} (+260)`;
  
  submitBtnText.textContent = `PAY ${currentPackage.fee} VIA STK PUSH`;
  
  if (pkgIdInput) pkgIdInput.value = currentPackage.id;
  if (pkgLimitInput) pkgLimitInput.value = currentPackage.limitValue;
  if (pkgFeeInput) pkgFeeInput.value = currentPackage.feeValue;
}

// 8. Provider Card Actions
function selectProvider(provider) {
  selectedProvider = provider;
  
  // Update UI selection classes
  const cards = document.querySelectorAll(".provider-card");
  cards.forEach(card => {
    if (card.dataset.provider === provider) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });

  // Adjust prefixes or helpers if necessary
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

// 10. Form Submission & STK Progress Stepper Simulation
function handlePaymentSubmit(event) {
  event.preventDefault();
  
  const phone = document.getElementById("phoneNumber").value.replace(/\D/g, "");
  const nrc = document.getElementById("nrcNumber").value;
  
  // Zambian Phone Validation check (standard suffix must be 9 digits after prefix, e.g. 97XXXXXXX)
  if (phone.length !== 9) {
    alert("Please enter a valid 9-digit mobile number (e.g. 977123456).");
    return;
  }

  // NRC Format Validation check (XXXXXX/XX/X is 9 digits with 2 slashes, length 11)
  if (nrc.length !== 11) {
    alert("Please enter a valid NRC number in XXXXXX/XX/X format.");
    return;
  }

  // Set up success modal initial states
  document.getElementById("modalSuccessBox").classList.add("hidden");
  document.getElementById("modalErrorBox").classList.add("hidden");
  
  const steps = ["step1", "step2", "step3", "step4"];
  steps.forEach(stepId => {
    const el = document.getElementById(stepId);
    el.classList.remove("active", "completed");
  });
  
  // Show modal
  const modal = document.getElementById("stkModal");
  modal.classList.remove("hidden");
  
  // Trigger step 1
  runStkStepper(phone);
}

function runStkStepper(phone) {
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");
  const step4 = document.getElementById("step4");
  const step2Text = document.getElementById("step2Text");
  const modalTitle = document.getElementById("modalTitle");
  const modalSub = document.getElementById("modalSub");

  // Step 1: Init Connection
  modalTitle.textContent = "Sending STK Push";
  modalSub.textContent = "Do not lock your device or close this view";
  step1.classList.add("active");
  
  setTimeout(() => {
    step1.classList.remove("active");
    step1.classList.add("completed");
    
    // Step 2: Awaiting PIN
    step2.classList.add("active");
    let providerName = selectedProvider.toUpperCase();
    if (providerName === "MTN") providerName = "MTN MoMo";
    if (providerName === "AIRTEL") providerName = "Airtel Money";
    if (providerName === "ZAMTEL") providerName = "Zamtel Cash";
    
    step2Text.textContent = `A prompt has been sent to +260 ${phone}. Enter your ${providerName} PIN.`;
    modalTitle.textContent = "Awaiting PIN Entry";
    
    setTimeout(() => {
      step2.classList.remove("active");
      step2.classList.add("completed");
      
      // Step 3: Verifying Transaction
      step3.classList.add("active");
      modalTitle.textContent = "Verifying Payment";
      
      setTimeout(() => {
        step3.classList.remove("active");
        step3.classList.add("completed");
        
        // Step 4: Upgrading Limit
        step4.classList.add("active");
        modalTitle.textContent = "Updating Account Profile";
        
        setTimeout(() => {
          step4.classList.remove("active");
          step4.classList.add("completed");
          
          // Complete / Show success box
          showBoostSuccess(phone);
        }, 2200);
      }, 3000);
    }, 4500); // Wait for dummy PIN input
  }, 2200);
}

function showBoostSuccess(phone) {
  // Hide stepper components visually
  const stepper = document.querySelector(".progress-stepper");
  if (stepper) stepper.classList.add("hidden");
  
  // Hide modal header info
  document.getElementById("modalTitle").classList.add("hidden");
  document.getElementById("modalSub").classList.add("hidden");
  document.querySelector(".modal-icon").classList.add("hidden");

  // Set details on success layout
  document.getElementById("successPhone").textContent = `+260 ${phone.substring(0, 3)}****${phone.substring(7)}`;
  document.getElementById("successLimit").textContent = currentPackage.limit;
  
  // Reveal success box
  document.getElementById("modalSuccessBox").classList.remove("hidden");
}

function closeModalAndReset() {
  // Close Modal
  document.getElementById("stkModal").classList.add("hidden");
  
  // Reset visibility of stepper elements
  const stepper = document.querySelector(".progress-stepper");
  if (stepper) stepper.classList.remove("hidden");
  document.getElementById("modalTitle").classList.remove("hidden");
  document.getElementById("modalSub").classList.remove("hidden");
  document.querySelector(".modal-icon").classList.remove("hidden");
  
  // Reset form
  document.getElementById("phoneNumber").value = "";
  document.getElementById("nrcNumber").value = "";
  
  // Hide checkout container
  cancelCheckout();
}

function closeModalAndRetry() {
  document.getElementById("stkModal").classList.add("hidden");
  // Keep form filled so user can check credentials and submit again
}

// 11. Real-time Toast Notifications Scheduler (Simulated Upgrades)
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
      <div class="toast-desc">Boosted borrowing limit to <strong>${pkg.limit}</strong> via STK Push</div>
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
