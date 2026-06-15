import { BookOpen, Code2, Flame, Map, Swords, Trophy, Users, Zap } from "lucide-react";

export const NAVIGATION_CONFIG = [] as const;

export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map((item) => item.path.replace(/^\//, ""));
