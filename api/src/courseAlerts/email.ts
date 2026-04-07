import {
  COURSE_ALERT_FROM_EMAIL,
  COURSE_ALERT_REPLY_TO,
  FRONTEND_ENDPOINT,
  RESEND_API_KEY,
  RESEND_FETCH_TIMEOUT_MS,
  RESEND_MIN_INTERVAL_MS,
  RESEND_RATE_LIMIT_RETRIES,
} from '../config.js';
import winston from '../logging/winston.js';

let resendNextAllowedAt = 0;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function paceResend(): Promise<void> {
  for (;;) {
    const now = Date.now();
    const until = resendNextAllowedAt;
    if (now >= until) {
      resendNextAllowedAt = now + RESEND_MIN_INTERVAL_MS;
      return;
    }
    await sleep(until - now);
  }
}

function retryAfterMs(res: Response): number {
  const h = res.headers.get('retry-after');
  if (!h) return 1000;
  const sec = Number.parseInt(h, 10);
  if (Number.isFinite(sec) && sec >= 0) return Math.min(sec * 1000, 60_000);
  return 1000;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function courseUpdateEmailBodies(params: {
  courseTitle: string;
  courseCode: string;
  courseUrl: string;
  safeTitle: string;
  safeCode: string;
  safeUrl: string;
}): { html: string; text: string } {
  const { courseTitle, courseCode, courseUrl, safeTitle, safeCode, safeUrl } =
    params;
  const wrap =
    'max-width:560px;margin:0 auto;padding:24px 16px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:#222;';
  const btn =
    'display:inline-block;background:#468ff2;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;';
  const footer =
    'margin-top:28px;padding-top:16px;border-top:1px solid #e5e5e5;font-size:14px;line-height:1.45;color:#666;';
  const html = `<!DOCTYPE html><html><body style="margin:0;background:#f6f7f9;"><div style="${wrap}"><p style="margin:0 0 16px;">The course <strong>${safeTitle}</strong> (${safeCode}) has new catalog data on CourseTable <span style="color:#666;">(e.g. schedule, instructor, or syllabus may have changed).</span></p><p style="margin:0 0 24px;"><a href="${safeUrl}" style="${btn}">Open course on CourseTable</a></p><div style="${footer}">You received this because you turned on email alerts for this section.<br /><br />To stop: open <strong>Profile</strong> → <strong>Alerts</strong> and remove the course, or click the bell again on that course.</div></div></body></html>`;
  const text = [
    `The course "${courseTitle}" (${courseCode}) has new catalog data on CourseTable (e.g. schedule, instructor, or syllabus may have changed).`,
    '',
    `Open this course: ${courseUrl}`,
    '',
    'You received this because you turned on email alerts for this section.',
    '',
    'To stop: open Profile → Alerts and remove the course, or click the bell again on that course.',
  ].join('\n');
  return { html, text };
}

export async function sendCourseUpdateEmail(params: {
  to: string;
  courseTitle: string;
  courseCode: string;
  seasonCode: string;
  crn: number;
}): Promise<boolean> {
  if (!RESEND_API_KEY) {
    winston.warn('courseAlerts: RESEND_API_KEY unset; skipping email');
    return false;
  }

  const courseUrl = `${FRONTEND_ENDPOINT.replace(/\/$/u, '')}/catalog?course-modal=${params.seasonCode}-${params.crn}`;
  const safeTitle = escapeHtml(params.courseTitle);
  const safeCode = escapeHtml(params.courseCode);
  const safeUrl = escapeHtml(courseUrl);
  const { html, text } = courseUpdateEmailBodies({
    courseTitle: params.courseTitle,
    courseCode: params.courseCode,
    courseUrl,
    safeTitle,
    safeCode,
    safeUrl,
  });

  const body = JSON.stringify({
    from: COURSE_ALERT_FROM_EMAIL,
    reply_to: COURSE_ALERT_REPLY_TO,
    to: [params.to],
    subject: `CourseTable: ${params.courseCode} was updated`,
    html,
    text,
  });

  try {
    for (let attempt = 0; attempt <= RESEND_RATE_LIMIT_RETRIES; attempt += 1) {
      await paceResend();
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body,
        signal: AbortSignal.timeout(RESEND_FETCH_TIMEOUT_MS),
      });
      if (res.ok) return true;
      if (res.status === 429 && attempt < RESEND_RATE_LIMIT_RETRIES) {
        const ms = retryAfterMs(res);
        resendNextAllowedAt = Math.max(resendNextAllowedAt, Date.now() + ms);
        winston.warn(
          `courseAlerts: Resend 429; retry ${String(attempt + 1)}/${String(RESEND_RATE_LIMIT_RETRIES)} in ${String(ms)}ms`,
        );
        continue;
      }
      const errBody = await res.text();
      winston.error(
        `courseAlerts: Resend error ${res.status}: ${errBody.slice(0, 500)}`,
      );
      return false;
    }
    return false;
  } catch (err) {
    winston.error(`courseAlerts: Resend request failed: ${String(err)}`);
    return false;
  }
}
