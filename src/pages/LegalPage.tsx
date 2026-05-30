import { useEffect } from "react";
import type { LegalDocument } from "../content";
import {
  disclaimer,
  privacyPolicy,
  siteContent,
  termsAndConditions,
} from "../content";
import { LegalDocumentPanel } from "../components/LegalDocumentPanel";
import { LegalPageLayout } from "./LegalPageLayout";

export type LegalDocId = "privacy" | "terms" | "disclaimer";

const documents: Record<LegalDocId, LegalDocument> = {
  privacy: privacyPolicy,
  terms: termsAndConditions,
  disclaimer,
};

type LegalPageProps = {
  doc: LegalDocId;
};

export function LegalPage({ doc }: LegalPageProps) {
  const legalDoc = documents[doc];
  const headingId = `${doc}-heading`;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    window.document.title = `${legalDoc.title} — ${siteContent.companyName}`;
    return () => {
      window.document.title = siteContent.companyName;
    };
  }, [doc, legalDoc.title]);

  return (
    <LegalPageLayout>
      <LegalDocumentPanel document={legalDoc} titleId={headingId} />
    </LegalPageLayout>
  );
}
