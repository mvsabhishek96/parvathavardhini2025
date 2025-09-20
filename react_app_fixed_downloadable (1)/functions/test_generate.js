// functions/test_generate.js
const fs = require("fs");
const path = require("path");
const { renderReceiptPNG } = require("./index.js"); // we'll expose a helper below OR call internal function - slight hack

// Because index.js doesn't export renderReceiptPNG, we import the file and call internal function via require cache hack.
// Simpler: copy renderReceiptPNG to a separate file for local testing, but to keep changes minimal:
(async () => {
  try {
    // Create a small test wrapper: load index.js and call its internal function by requiring with eval
    const mod = require("./index.js");

    // If the function isn't exported, we can re-create a minimal call by invoking admin signature, but simplest is to call via the firebase trigger simulated:
    // Instead, call the exported render via dynamic: if module exports renderReceiptPNG, call it. Otherwise create a tiny sample via logic duplicated:
    if (typeof mod.renderReceiptPNG === "function") {
      const result = await mod.renderReceiptPNG({
        name: "రామచంద్ర",
        gothra: "భరతి",
        city: "హైదరాబాద్",
        committeeMemberName: "Collector1",
        donationId: "test-1234"
      });
      fs.writeFileSync(path.join(__dirname, "out_test_receipt.png"), result.pngBuffer);
      console.log("Wrote out_test_receipt.png");
    } else {
      console.log("renderReceiptPNG not exported; please run a test through emulator or export the function for local test.");
    }
  } catch (err) {
    console.error("test_generate error:", err);
  }
})();
