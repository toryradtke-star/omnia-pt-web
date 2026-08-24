import {NextResponse} from "next/server";

/**
 * Lead intake → GoHighLevel.
 *
 * Both site forms (/contact and /free-session) post here. We upsert the contact
 * into the Omnia sub-account; a GHL workflow keyed off `source` handles tagging
 * and pipeline placement.
 *
 * Deliberately does NOT send `tags`: the upsert endpoint treats that field as a
 * full replacement, so sending it would wipe tags already on an existing contact.
 */

const GHL_BASE = "https://services.leadconnectorhq.com";

/**
 * GHL sends breaking changes through this header. The marketplace docs list
 * `v3`; a lot of live integrations still run `2021-07-28`. We try the documented
 * value first and fall back once, so whichever the sub-account expects wins.
 */
const API_VERSIONS = ["v3", "2021-07-28"] as const;

/**
 * Site field → GHL custom field key, verified against Settings → Custom Fields.
 * Note the missing underscore in "painissues" — GHL stripped the slash out of
 * "pain/issues" when it generated the key. An unrecognized key is accepted with
 * a 200 and the value silently dropped, so these are copied, not guessed.
 *
 * `topic` has no home yet. The obvious candidate — "What concerns would you
 * like help with?" — only accepts Improving balance / Preventing falls /
 * Strength & mobility / Other, which is a falls-prevention ad funnel and shares
 * nothing with the site's service menu. Rather than post values that field
 * would reject, we prepend the topic to the free-text notes below. Swap to a
 * dedicated field once one exists whose options match the site's list.
 */
const FIELD_KEYS = {
  notes: "which_area_are_you_having_painissues",
} as const;

type Source = "contact-page" | "free-session";

type LeadBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  topic?: unknown;
  message?: unknown;
  source?: unknown;
};

const SOURCE_LABELS: Record<Source, string> = {
  "contact-page": "omniatherapies.com — contact form",
  "free-session": "omniatherapies.com — free session landing page",
};

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** GHL wants E.164. Assume US/Canada for a 10-digit local number. */
function toE164(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return raw.startsWith("+") ? raw : `+${digits}`;
}

function splitName(full: string): {firstName: string; lastName: string} {
  const parts = full.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return {firstName: full, lastName: ""};
  return {firstName: parts[0], lastName: parts.slice(1).join(" ")};
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Where a website enquiry lands. "Contact Log" is the intake pipeline — its
 * first stage is literally "New Leads", and it feeds the Contacted 1x..5x
 * follow-up cadence. "Blake's Patients" is the clinical journey (Eval
 * scheduled, Dry Needling, Discharged) and has no intake stage, so a fresh
 * enquiry does not belong there.
 *
 * Resolved by name rather than hard-coded id so renaming or reordering stages
 * in GHL doesn't silently break this.
 */
const PIPELINE_NAME = "Contact Log";
const STAGE_NAME = "New Leads";

type PipelineTarget = {pipelineId: string; stageId: string};

// Pipelines change rarely; resolve once per server instance.
let pipelineCache: PipelineTarget | null = null;

async function resolvePipeline(
  token: string,
  version: string,
): Promise<PipelineTarget | null> {
  if (pipelineCache) return pipelineCache;

  const locationId = process.env.GHL_LOCATION_ID;
  const response = await fetch(
    `${GHL_BASE}/opportunities/pipelines?locationId=${locationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Version: version,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    console.error(`[lead] Could not list pipelines (${response.status}).`);
    return null;
  }

  const data = await response.json().catch(() => null);
  const pipelines: Array<{id: string; name: string; stages?: Array<{id: string; name: string}>}> =
    data?.pipelines ?? [];

  const pipeline = pipelines.find((p) => p.name === PIPELINE_NAME);
  const stage = pipeline?.stages?.find((s) => s.name === STAGE_NAME);
  if (!pipeline || !stage) {
    console.error(
      `[lead] Pipeline "${PIPELINE_NAME}" / stage "${STAGE_NAME}" not found in GHL.`,
    );
    return null;
  }

  pipelineCache = {pipelineId: pipeline.id, stageId: stage.id};
  return pipelineCache;
}

/**
 * Opens an opportunity for the lead. Returns a short status string for the
 * response body rather than throwing — losing the pipeline entry is annoying,
 * losing the lead is not acceptable.
 *
 * No monetary value is sent unless GHL_OPPORTUNITY_VALUE is configured. Every
 * existing opportunity sits at $0 and inventing a figure would corrupt revenue
 * reporting more than leaving it blank does.
 */
async function createOpportunity(
  contactId: string,
  name: string,
  token: string,
  version: string,
): Promise<string> {
  try {
    const target = await resolvePipeline(token, version);
    if (!target) return "skipped: pipeline not resolved";

    const rawValue = process.env.GHL_OPPORTUNITY_VALUE;
    const monetaryValue = rawValue ? Number(rawValue) : undefined;

    const response = await fetch(`${GHL_BASE}/opportunities/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: version,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        locationId: process.env.GHL_LOCATION_ID,
        pipelineId: target.pipelineId,
        pipelineStageId: target.stageId,
        contactId,
        name,
        status: "open",
        ...(Number.isFinite(monetaryValue) && {monetaryValue}),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(`[lead] Opportunity create failed (${response.status}): ${detail}`);
      return `failed: ${response.status}`;
    }

    return "created";
  } catch (error) {
    console.error("[lead] Opportunity create threw:", error);
    return "failed: exception";
  }
}

export async function POST(request: Request) {
  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;

  let body: LeadBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({error: "Malformed request."}, {status: 400});
  }

  const name = str(body.name);
  const email = str(body.email);
  const phone = str(body.phone);
  const topic = str(body.topic);
  const message = str(body.message);
  const source: Source = body.source === "free-session" ? "free-session" : "contact-page";

  // Re-validate server-side. The client checks are for UX, not trust.
  if (!name) return NextResponse.json({error: "Name is required."}, {status: 400});
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({error: "A valid email is required."}, {status: 400});
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({error: "A valid phone number is required."}, {status: 400});
  }

  // No credential → fail loudly. The old contact form showed a fake success
  // banner and dropped the lead; never do that again.
  if (!token || !locationId) {
    console.error("[lead] GHL_API_TOKEN or GHL_LOCATION_ID is not set — lead not saved.");
    return NextResponse.json(
      {error: "Lead capture is not configured."},
      {status: 503},
    );
  }

  // Topic and message share one multi-line field, topic first so it's the
  // first thing whoever opens the contact reads.
  const notes = [
    topic && `Interested in: ${topic}`,
    message,
  ]
    .filter(Boolean)
    .join("\n\n");

  const customFields: Array<{key: string; fieldValue: string}> = [];
  if (notes) customFields.push({key: FIELD_KEYS.notes, fieldValue: notes});

  const {firstName, lastName} = splitName(name);

  const payload = {
    locationId,
    firstName,
    lastName,
    name,
    email,
    phone: toE164(phone),
    source: SOURCE_LABELS[source],
    ...(customFields.length > 0 && {customFields}),
  };

  let lastStatus = 0;
  let lastDetail = "";

  for (const version of API_VERSIONS) {
    let response: Response;
    try {
      response = await fetch(`${GHL_BASE}/contacts/upsert`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Version: version,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("[lead] Could not reach GoHighLevel:", error);
      return NextResponse.json({error: "Could not reach the CRM."}, {status: 502});
    }

    if (response.ok) {
      const data = await response.json().catch(() => null);
      const contactId = data?.contact?.id ?? data?.id ?? null;

      // Best-effort: the lead is already safe in Contacts, so a pipeline
      // problem must never turn into a failed submission.
      const opportunity = contactId
        ? await createOpportunity(contactId, name, token, version)
        : "skipped: no contact id returned";

      return NextResponse.json({
        ok: true,
        created: data?.new ?? null,
        apiVersion: version,
        opportunity,
      });
    }

    lastStatus = response.status;
    lastDetail = await response.text().catch(() => "");

    // Only a version rejection is worth retrying; anything else is a real error.
    const isVersionProblem = response.status === 400 || response.status === 422;
    if (!isVersionProblem) break;
  }

  console.error(`[lead] GoHighLevel upsert failed (${lastStatus}): ${lastDetail}`);
  return NextResponse.json({error: "The CRM rejected the lead."}, {status: 502});
}
