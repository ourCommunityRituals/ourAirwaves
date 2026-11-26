// Text on a solid accent fill. The hub's Button uses text-black, which is too
// dark on the light-mode accent; --on-accent is the hub token made for this.
// The `!` makes it win over the part's own class. Remove once the hub's Button
// uses --on-accent itself.
export const ON_ACCENT = '!text-[color:var(--on-accent)]';
