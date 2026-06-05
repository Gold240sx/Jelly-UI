import type { SVGProps } from 'react';

/** The ids of the built-in lucide-style glyphs. */
export type IconName =
  | 'dashboard'
  | 'links'
  | 'blog'
  | 'files'
  | 'mywork'
  | 'tasks'
  | 'calendar'
  | 'messages'
  | 'analytics'
  | 'payments'
  | 'automations'
  | 'settings';

export interface JellyIconDef {
  id: IconName;
  label: string;
  /** A pleasant default accent for this glyph. */
  color: string;
  section: 'main' | 'manage' | 'extra';
  /** Inner SVG markup (paths / rects / lines) for a `0 0 24 24` viewBox. */
  path: string;
}

/** A small, BIAB-flavoured registry of lucide-style line icons. */
export const ICONS: JellyIconDef[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    color: '#4f86f7',
    section: 'main',
    path: '<rect width="7" height="9" x="3" y="3" rx="1.5"/><rect width="7" height="5" x="14" y="3" rx="1.5"/><rect width="7" height="9" x="14" y="12" rx="1.5"/><rect width="7" height="5" x="3" y="16" rx="1.5"/>',
  },
  {
    id: 'links',
    label: 'Helpful Links',
    color: '#15c39a',
    section: 'main',
    path: '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>',
  },
  {
    id: 'blog',
    label: 'Blog Editor',
    color: '#9b7cf0',
    section: 'main',
    path: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  },
  {
    id: 'files',
    label: 'Files & Media',
    color: '#14b8a6',
    section: 'main',
    path: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  },
  {
    id: 'mywork',
    label: 'My work',
    color: '#6d6af0',
    section: 'manage',
    path: '<rect x="3" y="4" width="6" height="6" rx="1.5"/><rect x="3" y="14" width="6" height="6" rx="1.5"/><path d="M13 7h8"/><path d="M13 17h8"/>',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    color: '#ec4faa',
    section: 'manage',
    path: '<rect x="3" y="5" width="6" height="6" rx="1.5"/><path d="m3.5 16.5 1.8 1.8 3.2-3.6"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    color: '#f5a524',
    section: 'extra',
    path: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2.5"/><path d="M3 10h18"/>',
  },
  {
    id: 'messages',
    label: 'Messages',
    color: '#22b8d6',
    section: 'extra',
    path: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    color: '#f43f6e',
    section: 'extra',
    path: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  },
  {
    id: 'payments',
    label: 'Payments',
    color: '#16a34a',
    section: 'extra',
    path: '<rect width="20" height="14" x="2" y="5" rx="2.5"/><path d="M2 10h20"/>',
  },
  {
    id: 'automations',
    label: 'Automations',
    color: '#84cc16',
    section: 'extra',
    path: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  },
  {
    id: 'settings',
    label: 'Settings',
    color: '#7c8aa5',
    section: 'extra',
    path: '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/>',
  },
];

const PATHS = Object.fromEntries(ICONS.map((i) => [i.id, i.path])) as Record<IconName, string>;

/** All built-in icon ids. */
export const iconNames: IconName[] = ICONS.map((i) => i.id);

/** The default accent colour the registry suggests for a given glyph. */
export function iconColor(name: IconName): string {
  return ICONS.find((i) => i.id === name)?.color ?? '#a855f7';
}

export interface JellyGlyphProps
  extends Omit<SVGProps<SVGSVGElement>, 'dangerouslySetInnerHTML' | 'children'> {
  name: IconName;
}

/**
 * Renders a built-in icon as an `<svg>` ready to drop straight into `<Jelly>`:
 *
 * ```tsx
 * <Jelly color={iconColor('links')} aria-label="Links">
 *   <JellyGlyph name="links" />
 * </Jelly>
 * ```
 */
export function JellyGlyph({ name, ...rest }: JellyGlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      {...rest}
      dangerouslySetInnerHTML={{ __html: PATHS[name] }}
    />
  );
}
