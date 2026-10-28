const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const verificationStatus = document.getElementById("verificationStatus");

const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const progressMessage = document.getElementById("progressMessage");
const progressTrack = document.getElementById("progressTrack");

const processBtn = document.getElementById("processBtn");
const downloadBtn = document.getElementById("downloadBtn");
const removeFile = document.getElementById("removeFile");

const heroStatus = document.getElementById("heroStatus");
const heroFileStatus = document.getElementById("heroFileStatus");
const heroSceneStatus = document.getElementById("heroSceneStatus");

const cubeStage = document.getElementById("cubeStage");
const payloadCube = document.getElementById("payloadCube");

const uploadSection = document.getElementById("uploadSection");
const processSection = document.getElementById("processSection");
const downloadSection = document.getElementById("downloadSection");
const filePanel = document.getElementById("filePanel");

let selectedFile = null;
let processed = false;
let processing = false;
let progressTimer = null;

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + " KB";
  }
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function scrollToSection(section) {
  section.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function setProgress(value, message) {
  progressFill.style.width = value + "%";
  progressPercent.textContent = value + "%";
  progressMessage.textContent = message;
  progressTrack.setAttribute("aria-valuenow", value);
}

function resetProgress(message) {
  setProgress(0, message);
}

function updateFile(file) {
  selectedFile = file;
  processed = false;
  downloadBtn.disabled = true;

  if (!file) {
    fileName.textContent = "No file selected";
    fileSize.textContent = "Choose a file to get started";
    verificationStatus.textContent = "Waiting for file";

    heroStatus.textContent = "Asset Ready";
    heroFileStatus.textContent = "Waiting for file";
    heroSceneStatus.textContent = "Ready";

    processBtn.querySelector("small").textContent =
      "Start processing";

    downloadBtn.querySelector("small").textContent =
      "Export asset";

    resetProgress("Upload a file to begin processing.");
    return;
  }

  fileName.textContent = file.name;
  fileSize.textContent = formatFileSize(file.size);
  verificationStatus.textContent = "File Selected";

  heroStatus.textContent = "Asset Ready";
  heroFileStatus.textContent = "File uploaded";
  heroSceneStatus.textContent = "Ready";

  processBtn.querySelector("small").textContent =
    "Start processing";

  downloadBtn.querySelector("small").textContent =
    "Export asset";

  resetProgress("File uploaded. Ready to process.");
}

// Upload a file
fileInput.addEventListener("change", function () {
  const file = fileInput.files[0];

  if (!file) return;

  clearInterval(progressTimer);
  processing = false;

  updateFile(file);

  setTimeout(function () {
    scrollToSection(processSection);
  }, 350);
});

// Remove the selected file
removeFile.addEventListener("click", function () {
  clearInterval(progressTimer);

  processing = false;
  fileInput.value = "";

  updateFile(null);
  scrollToSection(uploadSection);
});

// Start demo processing
processBtn.addEventListener("click", function () {
  if (!selectedFile) {
    progressMessage.textContent =
      "Please upload a file first.";

    scrollToSection(uploadSection);
    return;
  }

  if (processing) return;

  processing = true;
  processed = false;
  downloadBtn.disabled = true;

  processBtn.querySelector("small").textContent =
    "Processing...";

  heroStatus.textContent = "Processing";
  heroFileStatus.textContent = "Processing file";
  heroSceneStatus.textContent = "In Progress";

  resetProgress("Initializing processing...");

  scrollToSection(filePanel);

  let progress = 0;

  clearInterval(progressTimer);

  // Demo animation only.
  // Replace this with the real backend processing function later.

  progressTimer = setInterval(function () {
    progress += Math.floor(Math.random() * 4) + 2;
    progress = Math.min(progress, 100);

    let message = "Scanning payload...";

    if (progress >= 25) message = "Processing asset...";
    if (progress >= 55) message = "Verifying file...";
    if (progress >= 85) message = "Finalizing output...";

    setProgress(progress, message);

    if (progress >= 100) {
      clearInterval(progressTimer);

      processing = false;
      processed = true;
      downloadBtn.disabled = false;

      processBtn.querySelector("small").textContent =
        "Process again";

      downloadBtn.querySelector("small").textContent =
        "Ready to download";

      heroStatus.textContent = "Asset Ready";
      heroFileStatus.textContent = "Processing complete";
      heroSceneStatus.textContent = "Success";

      verificationStatus.textContent = "Demo Completed";

      progressMessage.textContent =
        "✓ Demo processing completed successfully.";

      setTimeout(function () {
        scrollToSection(downloadSection);
      }, 650);
    }
  }, 120);
});

// Download the selected file
downloadBtn.addEventListener("click", function () {
  if (!selectedFile || !processed) return;

  // This demo downloads the original file.
  // A real backend must provide the processed output.

  const url = URL.createObjectURL(selectedFile);
  const link = document.createElement("a");

  link.href = url;
  link.download = selectedFile.name;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 1000);

  progressMessage.textContent = "✓ Download started";
});

// Main 3D cube: rotate with cursor movement
cubeStage.addEventListener("pointermove", function (event) {
  if (event.pointerType === "touch") return;

  const rect = cubeStage.getBoundingClientRect();

  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  const rotateX = (0.5 - y) * 85;
  const rotateY = (x - 0.5) * 105;

  payloadCube.style.animation = "none";

  payloadCube.style.transform =
    `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  payloadCube.style.filter =
    "drop-shadow(0 0 38px #13a5ff)";
});

cubeStage.addEventListener("pointerleave", function () {
  payloadCube.style.transform =
    "rotateX(-23deg) rotateY(-32deg)";

  payloadCube.style.filter =
    "drop-shadow(0 0 25px #145bff)";

  payloadCube.style.animation = "";
});

// 3D movement for the complete Upload, Process and Download cards
document.querySelectorAll(".tilt-section").forEach(function (section) {
  section.addEventListener("pointermove", function (event) {
    if (event.pointerType === "touch") return;

    const rect = section.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - y) * 4;
    const rotateY = (x - 0.5) * 5;

    section.style.setProperty("--tilt-x", rotateX + "deg");
    section.style.setProperty("--tilt-y", rotateY + "deg");
    section.style.transform =
      `perspective(1200px) rotateX(${rotateX}deg) ` +
      `rotateY(${rotateY}deg) translateY(-3px)`;
  });

  section.addEventListener("pointerleave", function () {
    section.style.setProperty("--tilt-x", "0deg");
    section.style.setProperty("--tilt-y", "0deg");
    section.style.transform =
      "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  });
});

// 3D tilt for buttons and their icons
document.querySelectorAll(".tilt-card").forEach(function (button) {
  button.addEventListener("pointermove", function (event) {
    if (event.pointerType === "touch" || button.disabled) return;

    const rect = button.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - y) * 16;
    const rotateY = (x - 0.5) * 20;

    button.style.transform =
      `perspective(900px) rotateX(${rotateX}deg) ` +
      `rotateY(${rotateY}deg) translateY(-5px) scale(1.025)`;

    // Move the icon independently inside its button
    const icon = button.querySelector(".action-icon");

    if (icon) {
      icon.style.transform =
        `translateZ(38px) rotateX(${-rotateX * 0.7}deg) ` +
        `rotateY(${-rotateY * 0.7}deg) scale(1.12)`;
    }
  });

  button.addEventListener("pointerleave", function () {
    button.style.transform = "";

    const icon = button.querySelector(".action-icon");

    if (icon) {
      icon.style.transform = "";
    }
  });
});

// Extra movement for the side icons and illustration boxes
document.querySelectorAll(".tilt-icon").forEach(function (icon) {
  icon.addEventListener("pointermove", function (event) {
    if (event.pointerType === "touch") return;

    const rect = icon.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - y) * 24;
    const rotateY = (x - 0.5) * 28;

    icon.style.transform =
      `translateZ(32px) rotateX(${rotateX}deg) ` +
      `rotateY(${rotateY}deg) scale(1.1)`;

    icon.style.filter =
      "brightness(1.25) drop-shadow(0 0 12px #16cfff)";
  });

  icon.addEventListener("pointerleave", function () {
    icon.style.transform = "";
    icon.style.filter = "";
  });
});

// Keyboard support for the upload label
const uploadButton = document.querySelector(".upload-button");

uploadButton.addEventListener("keydown", function (event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    fileInput.click();
  }
});