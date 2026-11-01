export interface BizProfile {
    managerName: string;
    businessName: string;
    phone: string;
    address: string;
}

export interface BizService {
    name: string;
    price: string;
    active: boolean;
}

export interface BizPayload {
    profile: BizProfile;
    services: BizService[];
}

const LIMITS = {
    name: 60,
    phone: 30,
    address: 120,
    serviceName: 50,
    price: 30,
    maxServices: 15,
};

// سقف طول رشته انکودشده (برای اینکه آدرس کامل QR از ~۹۰۰ کاراکتر بیشتر نشود)
const DEFAULT_MAX_ENCODED = 750;
// سقف ورودی هنگام دکود (جلوگیری از پارامترهای غول‌پیکر)
const MAX_DECODE_INPUT = 4000;

function str(v: unknown, max: number): string {
    if (typeof v === "string") return v.trim().slice(0, max);
    if (typeof v === "number") return String(v).slice(0, max);
    return "";
}

/* ---------- Base64 امن برای یونیکد (فارسی/ایموجی) و مناسب URL ---------- */

function toBase64Url(text: string): string {
    const bytes = new TextEncoder().encode(text);
    let bin = "";
    bytes.forEach((b) => {
        bin += String.fromCharCode(b);
    });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(b64: string): string {
    let s = b64.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    const bin = atob(s);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
}

/* ---------- انکود: پروفایل + خدمات فعال → رشته فشرده ---------- */

export function encodeBiz(
    input: { profile?: unknown; services?: unknown },
    maxChars: number = DEFAULT_MAX_ENCODED
): { encoded: string; usedServices: number; totalServices: number } {
    const rp =
        input.profile && typeof input.profile === "object"
            ? (input.profile as Record<string, unknown>)
            : {};

    const p = [
        str(rp.managerName, LIMITS.name),
        str(rp.businessName, LIMITS.name),
        str(rp.phone, LIMITS.phone),
        str(rp.address, LIMITS.address),
    ];

    const services: [string, string][] = Array.isArray(input.services)
        ? input.services
            .filter(
                (s): s is Record<string, unknown> =>
                    !!s &&
                    typeof s === "object" &&
                    Boolean((s as Record<string, unknown>).active) &&
                    Boolean(str((s as Record<string, unknown>).name, LIMITS.serviceName))
            )
            .slice(0, LIMITS.maxServices)
            .map((s): [string, string] => [
                str(s.name, LIMITS.serviceName),
                str(s.price, LIMITS.price),
            ])
        : [];

    const hasProfile = p.some(Boolean);
    if (!hasProfile && services.length === 0) {
        return { encoded: "", usedServices: 0, totalServices: 0 };
    }

    // اگر طول زیاد شد، از آخر لیست خدمات یکی‌یکی حذف می‌کنیم
    for (let n = services.length; n >= 0; n--) {
        const encoded = toBase64Url(JSON.stringify({ p, s: services.slice(0, n) }));
        if (encoded.length <= maxChars || n === 0) {
            return { encoded, usedServices: n, totalServices: services.length };
        }
    }

    return { encoded: "", usedServices: 0, totalServices: services.length };
}

/* ---------- دکود: رشته ‌ی ?biz= → { profile, services } یا null ---------- */

export function decodeBiz(param: string | null | undefined): BizPayload | null {
    if (!param || param.length > MAX_DECODE_INPUT) return null;

    try {
        const data = JSON.parse(fromBase64Url(param)) as { p?: unknown; s?: unknown };
        if (!data || typeof data !== "object") return null;

        const p = Array.isArray(data.p) ? data.p : [];
        const profile: BizProfile = {
            managerName: str(p[0], LIMITS.name),
            businessName: str(p[1], LIMITS.name),
            phone: str(p[2], LIMITS.phone),
            address: str(p[3], LIMITS.address),
        };

        const services: BizService[] = Array.isArray(data.s)
            ? data.s
                .filter((x): x is unknown[] => Array.isArray(x))
                .slice(0, LIMITS.maxServices)
                .map((x) => ({
                    name: str(x[0], LIMITS.serviceName),
                    price: str(x[1], LIMITS.price),
                    active: true,
                }))
                .filter((s) => s.name)
            : [];

        const hasProfile = Object.values(profile).some(Boolean);
        if (!hasProfile && services.length === 0) return null;

        return { profile, services };
    } catch {
        return null;
    }
}
