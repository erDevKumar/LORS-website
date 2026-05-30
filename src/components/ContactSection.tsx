import { contactEmail, contactMailto, siteContent } from "../content";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="section-snap relative border-t border-white/10 px-4 py-24 sm:px-6"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lors-glow/80">
          Contact
        </p>
        <h2 id="contact-heading" className="section-heading mt-2">
          Let&apos;s build what&apos;s next
        </h2>
        <p className="section-sub mx-auto">
          Partnerships, product inquiries, or IT consulting — reach out and we&apos;ll connect you
          with the right team at {siteContent.companyName}.
        </p>
        <a
          href={contactMailto()}
          className="mt-10 inline-flex min-h-[52px] items-center justify-center rounded-full bg-lors-accent px-10 py-3 text-base font-semibold text-white shadow-lg shadow-lors-accent/30 transition hover:bg-lors-glow hover:text-lors-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lors-glow"
        >
          Get in touch
        </a>
        <p className="mt-4">
          <a
            href={`mailto:${contactEmail()}`}
            className="text-sm text-lors-glow/90 transition hover:text-lors-glow hover:underline"
          >
            {contactEmail()}
          </a>
        </p>
      </div>
    </section>
  );
}
