// pages/phillipston-prr.js
import { el } from "../lib/dom.js";
import { archiveRecord } from "../lib/archieve.js";  // your existing archiver

export async function renderPhillipstonPrr(ctx) {
  const { sp, cfg, refresh } = ctx;

  let submitted = false;
  let caseId = null;
  let error = null;
  let deadline = null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    error = null;
    submitted = false;

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name")?.trim(),
      email: formData.get("email")?.trim(),
      phone: formData.get("phone")?.trim() || "",
      request: formData.get("request")?.trim(),
      agree: formData.get("agree"),
    };

    if (!data.name || !data.email || !data.request || !data.agree) {
      error = "Please complete all required fields and check the agreement box.";
      refresh?.();
      return;
    }

    try {
      // Prepare record for ARCHIEVE
      const record = {
        title: `PRR - ${data.name} - ${new Date().toLocaleDateString()}`,
        type: "Public Records Request",
        content: `Requester: ${data.name} <${data.email}> ${data.phone ? `(${data.phone})` : ''}\n\nRequest:\n${data.request}`,
        tags: ["Phillipston", "PRR", "MGL c.66"],
        retentionClass: "Permanent",
      };

      // Save to ARCHIEVE (list + file in folder)
      const saved = await archiveRecord(sp, cfg, record);

      // Calculate T10 deadline (10 business days)
      let daysToAdd = 10;
      let current = new Date();
      while (daysToAdd > 0) {
        current.setDate(current.getDate() + 1);
        const day = current.getDay();
        if (day !== 0 && day !== 6) daysToAdd--; // skip weekends
      }
      deadline = current.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

      caseId = `PRR-${saved.Id.toString().padStart(4, '0')}`;
      submitted = true;
    } catch (err) {
      console.error(err);
      error = "Failed to submit request. Please try again or contact support.";
    }

    refresh?.();
  };

  const content = el("div", { class: "stack gap-xl" }, [
    renderCard({
      title: "Phillipston Public Records Request",
      description: "Submit under Massachusetts Public Records Law (M.G.L. c. 66 §10 & 950 CMR 32.00)",
      variant: "hero",
    }),

    submitted
      ? el("div", { class: "card text-center py-12" }, [
          el("div", { class: "text-6xl mb-6 text-green-500" }, ["✓"]),
          el("h2", { class: "text-3xl font-bold mb-4" }, ["Request Received"]),
          el("p", { class: "text-xl mb-6" }, [
            "Your request has been securely saved in ARCHIEVE.",
            el("br"),
            `Case ID: ${caseId}`
          ]),
          el("p", { class: "text-lg mb-8" }, [
            "Phillipston must respond by ",
            el("strong", {}, [deadline || "within 10 business days"]),
            ". You will be notified."
          ]),
          el("button", {
            class: "btn btn--primary mt-6",
            onclick: () => {
              submitted = false;
              caseId = null;
              deadline = null;
              error = null;
              refresh?.();
            },
          }, ["Submit Another Request"]),
        ])
      : el("form", {
          class: "stack gap-xl",
          onsubmit: handleSubmit,
        }, [
          el("div", { class: "grid grid--2 gap-lg" }, [
            el("div", { class: "stack gap-md" }, [
              el("label", { class: "label" }, ["Full Name *"]),
              el("input", { type: "text", name: "name", class: "input", required: true }),
            ]),
            el("div", { class: "stack gap-md" }, [
              el("label", { class: "label" }, ["Email Address *"]),
              el("input", { type: "email", name: "email", class: "input", required: true }),
            ]),
          ]),

          el("div", { class: "stack gap-md" }, [
            el("label", { class: "label" }, ["Phone Number (optional)"]),
            el("input", { type: "tel", name: "phone", class: "input" }),
          ]),

          el("div", { class: "stack gap-md" }, [
            el("label", { class: "label" }, ["Describe the records requested *"]),
            el("textarea", {
              name: "request",
              class: "textarea",
              rows: 8,
              required: true,
              placeholder: "Be specific: date range, departments, names, topics, document types...",
            }),
          ]),

          el("div", { class: "flex items-start gap-md" }, [
            el("input", { type: "checkbox", id: "agree", name: "agree", class: "checkbox mt-1", required: true }),
            el("label", { for: "agree", class: "text-sm leading-tight" }, [
              "I understand this is a public records request under Massachusetts law and that the Town will respond within 10 business days unless a valid extension is required."
            ]),
          ]),

          error && el("div", { class: "error" }, [error]),

          el("button", {
            type: "submit",
            class: "btn btn--primary w-full py-4 text-lg",
          }, ["Submit Public Records Request"]),
        ]),

    renderCard({
      title: "What happens next?",
      description: "The Town of Phillipston will confirm receipt and must respond within 10 business days unless an extension applies. All requests are stored in ARCHIEVE under /PHILLIPSTON/PRR.",
      variant: "calm",
    }),

    el("p", { class: "small muted text-center" }, [
      "Managed by PublicLogic • Helping towns reduce liability and serve residents better"
    ]),
  ]);

  return {
    title: "Phillipston PRR Form",
    subtitle: "Public Records Request – Phillipston, MA",
    content,
  };
}
