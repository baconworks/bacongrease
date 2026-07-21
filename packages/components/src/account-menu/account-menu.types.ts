// The account identity the menu renders. At least one of firstName / lastName MUST be present — the
// union enforces that at compile time, so an empty user can't be passed. Initials derive from
// whichever names are given (David / Bacon -> "DB"; David alone -> "D"). Everything else is optional
// and the dropdown lays out only what it's given, so a name-only user and a fully-detailed one both
// render cleanly.
type UserName =
  | { firstName: string; lastName?: string }
  | { firstName?: string; lastName: string };

export type AccountUser = UserName & {
  email?: string;
  username?: string;
  department?: string;
  role?: string;
  /** Avatar image; when present it replaces the derived-initials circle. */
  imageUrl?: string;
};
