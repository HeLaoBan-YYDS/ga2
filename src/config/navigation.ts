import { BookOpen, Code2, Heart, Leaf, PackageSearch, Sprout, Users } from "lucide-react";

export const NAVIGATION_CONFIG = [
  { key: "codes", path: "/codes", icon: Code2, isContentType: true },
  { key: "guide", path: "/guide", icon: BookOpen, isContentType: true },
  { key: "release", path: "/release", icon: PackageSearch, isContentType: true },
  { key: "community", path: "/community", icon: Users, isContentType: true },
  { key: "pets", path: "/pets", icon: Heart, isContentType: true },
  { key: "crops", path: "/crops", icon: Sprout, isContentType: true },
  { key: "tools", path: "/tools", icon: Leaf, isContentType: true },
] as const;

export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map((item) => item.path.replace(/^\//, ""));
