import {
  contactEmail,
  contactMailto,
  siteContent,
  supportMailto,
} from "../content";
import { SectionHeader } from "./SectionHeader";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="section-snap relative border-t border-white/10 px-4 py-24 sm:px-6"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeader
          eyebrow="Contact & support"
          title="Corporate communications"
          subtitle="Whether you are an industry researcher, tech journalist, prospective talent, or looking to discuss strategic infrastructure integrations, reach out directly to our central response desk."
          titleId="contact-heading"
          className="mx-auto"
        />
        <a
          href={contactMailto()}
          className="mt-10 inline-flex min-h-[52px] items-center justify-center rounded-full bg-lors-accent px-10 py-3 text-base font-semibold text-white shadow-lg shadow-lors-accent/30 transition hover:bg-lors-glow hover:text-lors-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lors-glow"
        >
          Global intake
        </a>
        <p className="mt-4">
          <a
            href={`mailto:${contactEmail()}`}
            className="text-sm text-lors-glow/90 transition hover:text-lors-glow hover:underline"
          >
            {contactEmail()}
          </a>
        </p>
        {siteContent.contactSla && (
          <p className="mt-6 text-sm text-white/55">
            Response SLA: {siteContent.contactSla}
          </p>
        )}
        {siteContent.pgpNote && (
          <p className="mt-2 text-sm text-white/45">
            Secure PGP Key: {siteContent.pgpNote}
          </p>
        )}

        <div className="mx-auto mt-10 max-w-lg rounded-xl border border-white/10 bg-lors-deep/50 p-6 text-left">
          <h3 className="font-display text-base font-semibold text-white">
            Product support channels
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Need help with RouteMates or FamilyOS? For active system status or bug
            reporting, append{" "}
            <code className="text-lors-glow/80">[Support - RouteMates]</code> or{" "}
            <code className="text-lors-glow/80">[Support - FamilyOS]</code> to your
            email subject header. Our automated triage routing will send your ticket
            instantly to the dedicated product engineering pod.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={supportMailto("routemates")}
              className="inline-flex min-h-[40px] items-center rounded-full border border-white/25 px-5 py-2 text-sm font-medium text-lors-glow/90 transition hover:border-lors-glow/50 hover:bg-white/5"
            >
              RouteMates support
            </a>
            <a
              href={supportMailto("familyos")}
              className="inline-flex min-h-[40px] items-center rounded-full border border-white/25 px-5 py-2 text-sm font-medium text-lors-glow/90 transition hover:border-lors-glow/50 hover:bg-white/5"
            >
              FamilyOS support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
