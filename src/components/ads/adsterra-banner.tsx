const bannerSlots = {
  "banner-160x300": { width: 160, height: 300 },
  "banner-160x600": { width: 160, height: 600 },
  "banner-300x250": { width: 300, height: 250 },
  "banner-320x50": { width: 320, height: 50 },
  "banner-468x60": { width: 468, height: 60 },
  "banner-728x90": { width: 728, height: 90 },
} as const;

const adSandboxPermissions = "allow-scripts allow-popups allow-popups-to-escape-sandbox";

export type AdBannerType = keyof typeof bannerSlots;

type AdBannerProps = {
  adKey?: string | null;
  eager?: boolean;
  type: AdBannerType;
};

export function AdBanner({ adKey, eager = false, type }: AdBannerProps) {
  const key = adKey?.trim();

  if (!key) {
    return null;
  }

  const slot = bannerSlots[type];

  if (!slot) {
    return null;
  }

  return (
    <div className="flex w-full justify-center">
      <iframe
        title={`Advertisement ${type.replace("banner-", "")}`}
        src={`/ads/${type}.html?key=${encodeURIComponent(key)}`}
        width={slot.width}
        height={slot.height}
        scrolling="no"
        loading={eager ? "eager" : "lazy"}
        sandbox={adSandboxPermissions}
        referrerPolicy="no-referrer"
        style={{ border: "none" }}
      />
    </div>
  );
}
