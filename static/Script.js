const dropdownDefinitions = {
  category: {
    placeholder: "Select Category",
    multi: false,
    options: ["NSA", "SA"],
  },
  executor: {
    placeholder: "Select Executor",
    multi: false,
    options: ["Nokia", "RJIO"],
  },
  siteCell: {
    placeholder: "Select Site / Cell",
    multi: false,
    options: ["Site", "Cell"],
  },
  circle: {
    placeholder: "Select Circle(s)",
    multi: true,
    options: [
      "All Circles", "TL", "AP", "AS", "Bihar", "CG", "DL", "HR", "KA", "KL",
      "MAH", "MP", "MUM", "NE", "OR", "TN", "UPE", "UPW"
    ],
  },
  pePurpose: {
    placeholder: "Select PE Purpose",
    multi: true,
    options: [
      "Configuration Changes", "Knife Implementation", "Knife Removal", "Software Upgrade",
      "Site Reset", "SW Upgrades", "SW Downgrade", "Software Downgrade",
      "Parameter changes", "SCF Loading", "UL BLER",
    ],
  },
  pePurposeSub2: {
    placeholder: "Select PE Purpose - Sub2",
    multi: true,
    options: [
      "SE Improvement", "Energy Saving", "KPI Issues", "Upgrade", "30Mhz",
      "CQI Improvement", "MU-MIMO", "Latency", "VoNR", "BLER", "RACH", "RRC",
      "CA", "AL8", "Throughput", "LMS", "CBRA & CFRA", "Alarm Reduction",
      "Airport", "Mute & HOSR", "HOSR", "Tiltoffset", "20Mhz", "UL Improvement",
      "RET Configuration", "AL1", "BWP", "PDSCH", "GMC",
    ],
  },
  activityInitiator: {
    placeholder: "Select Activity Initiator",
    multi: true,
    options: [
      "Rakesh Bhandari", "Balaji Kundgire", "Nikunj Hirpara", "Karan Chaudhary",
      "Arun Sharma NPO", "Saurabh Chatterjee NPO", "Pranay Mestry", "Amit Joshi",
      "Adit Sharma", "Himanshu V GSD", "Sandeep K NPO", "Rutuja Khapare",
      "Vijendra Singh", "Jomon Francis GSD", "Saurabh Chatterjee GSD",
      "Mukesh Moradiya", "Rakesh Shah", "Neel Desai", "Himanshu Sharma",
      "Ashwani Gupta", "Doris X", "Vikas Bansal", "Shivaji Nalang",
      "Rajesh Mishra", "Durgesh Mishra", "Vivek Kokate", "SME", "Nikunj Hipara",
      "Ashish Sharma", "Ajay Sharma", "Mahesh Sharma", "Hari Dubey",
      "Satish Pandey", "Karan Choudhary", "Nishant Mhatre", "Arun Sharma",
      "Devang Badraliya", "Kalpesh Upadhey", "Pratap Surwase", "Dev Anand",
      "Riya Parab", "Komal Thareja",
    ],
  },
  activityOwner: {
    placeholder: "Select Activity Owner",
    multi: true,
    options: [
      "Pranay Mestry", "Vijendra Singh", "Vivek Kokate", "Sandeep K NPO",
      "Nikunj Hirpara", "Rakesh Bhandari", "Ashish Sharma", "Shahir Puttal",
      "Devang Bhadraliya", "Rakesh Shah", "Durgesh Mishra", "Jaymin Soni",
      "Neel Desai", "Karan Chaudhary", "Karan Choudhary", "Amit Gupta",
      "Ashok Kumar", "Balaji Kundgire", "Tarun Garg",
    ],
  },
  activityExecutor: {
    placeholder: "Select Activity Executor",
    multi: true,
    options: [
      "Sahil Sharma", "Ashish Sharma", "Ajay Sharma", "Ritwik Kumar Jana",
      "Jayesh Satghare", "Pranay Mestry", "Vivek Kokate", "Jay Anand Mishra",
      "Rakesh Shah Nokia CM", "Balamurlidharan K", "Shahir Puttal", "Pramod Kumar Singh",
    ],
  },
  deployApproval: {
    placeholder: "Select Deploy Approval",
    multi: false,
    options: ["Yes", "No"],
  },
  npoKpiApproval: {
    placeholder: "Select NPO KPI Approval",
    multi: false,
    options: ["Yes", "No"],
  },
  npoAtApproval: {
    placeholder: "Select NPO AT Approval",
    multi: false,
    options: ["Yes", "No"],
  },
  tssApproval: {
    placeholder: "Select TSS Approval",
    multi: false,
    options: ["Yes", "No"],
  },
  status: {
    placeholder: "Select Status",
    multi: false,
    options: ["Planned", "Activity Cancelled", "Activity Hold"],
  },
  domain: {
    placeholder: "Select Domain",
    multi: true,
    options: ["DCAP", "Deploy", "EMS", "NM", "NPI", "NPO AT", "NPO KPI", "SON", "SRAN", "TSS"],
  },
  remarks1: {
    placeholder: "Select Remarks1",
    multi: false,
    options: ["Trial", "NA"],
  },
  remarks2: {
    placeholder: "Select Remarks2",
    multi: false,
    options: ["1st Time", "2nd Time", "3rd Time", "Repeated"],
  },
};

const dropdownStates = {};
let form = null;
let toast = null;

function showToast(message, type = "default") {
  toast.textContent = message;
  if (type === "success") {
    toast.style.background = "#065f46";
  } else if (type === "error") {
    toast.style.background = "#991b1b";
  } else {
    toast.style.background = "#111827";
  }
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createDropdown(fieldName, config) {
  const host = document.getElementById(`dd-${fieldName}`);
  if (!host) return;

  dropdownStates[fieldName] = {
    selected: [],
    multi: config.multi,
    options: [...config.options],
    placeholder: config.placeholder,
  };

  host.innerHTML = `
    <div class="dd" data-field="${fieldName}">
      <button type="button" class="dd-btn" aria-haspopup="listbox" aria-expanded="false">
        <div class="dd-btn-text">
          <span class="placeholder">${config.placeholder}</span>
        </div>
        <span class="dd-icon">▼</span>
      </button>
      <div class="dd-menu">
        <input class="dd-search" type="text" placeholder="Search..." />
        <div class="dd-options"></div>
      </div>
      <input type="hidden" name="${fieldName}" value="" />
    </div>
  `;

  renderOptions(fieldName);
  attachDropdownEvents(fieldName);
}

function renderOptions(fieldName, filterText = "") {
  const root = document.querySelector(`.dd[data-field="${fieldName}"]`);
  if (!root) return;

  const state = dropdownStates[fieldName];
  const optionsContainer = root.querySelector(".dd-options");
  const filtered = state.options.filter((option) =>
    option.toLowerCase().includes(filterText.toLowerCase())
  );

  optionsContainer.innerHTML = filtered
    .map((option) => {
      const checked = state.selected.includes(option) ? "checked" : "";
      const inputType = state.multi ? "checkbox" : "radio";
      return `
        <label class="dd-option">
          <input type="${inputType}" name="${fieldName}_option" value="${escapeHtml(option)}" ${checked}>
          <span>${escapeHtml(option)}</span>
        </label>
      `;
    })
    .join("");

  syncDropdownUI(fieldName);
}

function syncDropdownUI(fieldName) {
  const root = document.querySelector(`.dd[data-field="${fieldName}"]`);
  if (!root) return;

  const state = dropdownStates[fieldName];
  const btnText = root.querySelector(".dd-btn-text");
  const hiddenInput = root.querySelector(`input[type="hidden"][name="${fieldName}"]`);
  hiddenInput.value = state.selected.join(", ");

  if (state.selected.length === 0) {
    btnText.innerHTML = `<span class="placeholder">${state.placeholder}</span>`;
  } else {
    btnText.innerHTML = state.selected
      .map((item) => `<span class="chip">${escapeHtml(item)}</span>`)
      .join("");
  }

  updateSummary();
}

function attachDropdownEvents(fieldName) {
  const root = document.querySelector(`.dd[data-field="${fieldName}"]`);
  if (!root) return;

  const button = root.querySelector(".dd-btn");
  const search = root.querySelector(".dd-search");
  const optionsContainer = root.querySelector(".dd-options");

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    closeAllDropdowns(fieldName);
    root.classList.toggle("open");
    button.classList.toggle("open");
    button.setAttribute("aria-expanded", root.classList.contains("open") ? "true" : "false");
    if (root.classList.contains("open")) {
      search.focus();
    }
  });

  search.addEventListener("input", () => {
    renderOptions(fieldName, search.value);
  });

  optionsContainer.addEventListener("change", (event) => {
    const value = event.target.value;
    const state = dropdownStates[fieldName];

    if (state.multi) {
      if (event.target.checked) {
        if (!state.selected.includes(value)) {
          state.selected.push(value);
        }
      } else {
        state.selected = state.selected.filter((item) => item !== value);
      }
    } else {
      state.selected = event.target.checked ? [value] : [];
      root.classList.remove("open");
      button.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    }

    syncDropdownUI(fieldName);
  });
}

function closeAllDropdowns(exceptField = null) {
  document.querySelectorAll(".dd").forEach((dropdown) => {
    const field = dropdown.getAttribute("data-field");
    if (field !== exceptField) {
      dropdown.classList.remove("open");
      const button = dropdown.querySelector(".dd-btn");
      if (button) {
        button.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
      }
    }
  });
}

document.addEventListener("click", () => closeAllDropdowns());

async function loadNextSerial() {
  try {
    const response = await fetch("/next-sno");
    const data = await response.json();
    document.getElementById("sno").value = data.next_sno || "";
    updateSummary();
  } catch (error) {
    console.error("S.No load error:", error);
    showToast("S.No load nahi hua.", "error");
  }
}

function getDropdownValue(fieldName) {
  return dropdownStates[fieldName] ? dropdownStates[fieldName].selected : [];
}

function updateSummary() {
  const sno = document.getElementById("sno").value || "-";
  const peNonPe = document.getElementById("peNonPe").value.trim() || "-";
  const category = getDropdownValue("category").join(", ") || "-";
  const executor = getDropdownValue("executor").join(", ") || "-";
  const status = getDropdownValue("status").join(", ") || "Draft";

  document.getElementById("summarySno").textContent = sno;
  document.getElementById("summaryPeType").textContent = peNonPe;
  document.getElementById("summaryCategory").textContent = category;
  document.getElementById("summaryExecutor").textContent = executor;
  document.getElementById("badgeSno").textContent = sno;
  document.getElementById("badgeStatus").textContent = status;
}

function buildPayload() {
  const peNonPeValue = document.getElementById("peNonPe").value.trim();
  return {
    sno: document.getElementById("sno").value.trim(),
    peNonPe: peNonPeValue ? [peNonPeValue] : [],
    peNonPeUser: peNonPeValue,
    category: getDropdownValue("category"),
    executor: getDropdownValue("executor"),
    totalNodeCount: document.getElementById("totalNodeCount").value.trim(),
    siteCell: getDropdownValue("siteCell"),
    circle: getDropdownValue("circle"),
    dateOfPe: document.getElementById("dateOfPe").value,
    pePurpose: getDropdownValue("pePurpose"),
    pePurposeSub2: getDropdownValue("pePurposeSub2"),
    activityInitiator: getDropdownValue("activityInitiator"),
    activityOwner: getDropdownValue("activityOwner"),
    activityExecutor: getDropdownValue("activityExecutor"),
    deployApproval: getDropdownValue("deployApproval"),
    npoKpiApproval: getDropdownValue("npoKpiApproval"),
    npoAtApproval: getDropdownValue("npoAtApproval"),
    tssApproval: getDropdownValue("tssApproval"),
    status: getDropdownValue("status"),
    domain: getDropdownValue("domain"),
    remarks1: getDropdownValue("remarks1"),
    remarks2: getDropdownValue("remarks2"),
    contactNo: document.getElementById("contactNo").value.trim(),
    contactDetails: document.getElementById("contactNo").value.trim(),
    remarks: document.getElementById("remarks").value.trim(),
    activityDetails: document.getElementById("activityDetails").value.trim(),
  };
}

function validatePayload(data) {
  if (!data.sno) return "S.No missing hai.";
  if (data.peNonPe.length === 0) return "PE / Non-PE (User) fill karein.";
  if (data.contactNo && !/^\d+$/.test(data.contactNo)) return "User Phone No. me sirf numbers allowed hain.";
  if (data.category.length === 0) return "Category select karein.";
  if (data.executor.length === 0) return "Executor select karein.";
  if (data.siteCell.length === 0) return "Site / Cell select karein.";
  return null;
}

function resetCustomDropdowns() {
  Object.keys(dropdownStates).forEach((fieldName) => {
    dropdownStates[fieldName].selected = [];
    const root = document.querySelector(`.dd[data-field="${fieldName}"]`);
    if (root) {
      root.querySelector(".dd-search").value = "";
      renderOptions(fieldName, "");
      syncDropdownUI(fieldName);
    }
  });
}

function addActivityCard(payload) {
  const list = document.getElementById("activityList");
  if (!list) return;

  const currentEmpty = list.querySelector(".activity-item.empty");
  if (currentEmpty) currentEmpty.remove();

  const card = document.createElement("div");
  card.className = "activity-item";
  const executor = payload.activityExecutor.join(", ") || payload.executor.join(", ") || "-";
  const domain = payload.domain.join(", ") || "-";
  const status = payload.status.join(", ") || "Planned";

  card.innerHTML = `
    <strong>S.No ${escapeHtml(payload.sno)} - ${escapeHtml(executor)}</strong>
    <span>Domain: ${escapeHtml(domain)}</span>
    <span class="tag">${escapeHtml(status)}</span>
  `;

  list.prepend(card);
}

async function submitForm(event) {
  event.preventDefault();
  const payload = buildPayload();
  const validationError = validatePayload(payload);

  if (validationError) {
    showToast(validationError, "error");
    return;
  }

  try {
    const response = await fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (response.ok && result.success) {
      addActivityCard(payload);
      showToast(result.message || "Data save ho gaya.", "success");
      document.getElementById("badgeAction").textContent = "Saved";
      form.reset();
      resetCustomDropdowns();
      await loadNextSerial();
    } else {
      showToast(result.message || "Save failed.", "error");
      document.getElementById("badgeAction").textContent = "Failed";
    }
  } catch (error) {
    console.error("Submit error:", error);
    showToast("Server error aaya.", "error");
    document.getElementById("badgeAction").textContent = "Error";
  }
}

document.getElementById("resetBtn").addEventListener("click", async () => {
  form.reset();
  resetCustomDropdowns();
  await loadNextSerial();
  document.getElementById("badgeAction").textContent = "Reset";
  showToast("Form reset ho gaya.");
});

form.addEventListener("submit", submitForm);
document.getElementById("peNonPe").addEventListener("input", updateSummary);

window.addEventListener("DOMContentLoaded", async () => {
  Object.entries(dropdownDefinitions).forEach(([fieldName, config]) => {
    createDropdown(fieldName, config);
  });
  await loadNextSerial();
  updateSummary();
});
