import fs from "fs";
import path from "path";
import {
  CAREERS_APPLY_PATH,
  CAREERS_GOOGLE_FORM_URL,
} from "../config/careers-form.mjs";

const firebasePath = path.resolve("firebase.json");
const firebase = JSON.parse(fs.readFileSync(firebasePath, "utf8"));

const redirect = {
  source: CAREERS_APPLY_PATH,
  destination: CAREERS_GOOGLE_FORM_URL,
  type: 302,
};

const redirects = firebase.hosting.redirects ?? [];
const withoutApply = redirects.filter((r) => r.source !== CAREERS_APPLY_PATH);
firebase.hosting.redirects = [...withoutApply, redirect];

fs.writeFileSync(firebasePath, `${JSON.stringify(firebase, null, 2)}\n`, "utf8");
console.log(`Firebase redirect synced: ${CAREERS_APPLY_PATH} → Google Form`);
