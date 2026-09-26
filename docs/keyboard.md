# jany-latyn — keyboard input

The script needs only six non-ASCII letters: ö (Latin U+00F6), ü (Latin
U+00FC), í (Latin U+00ED), ŋ (U+014B), ç (U+00E7), and ş (U+015F), plus capitals Ö Ü Í Ŋ Ç Ş. Everything else is plain
ASCII — long vowels are typed twice (e.g. `oo`, `öö`, `üü`), and words are 100% alphabetic without internal apostrophes.

Mapping (all platforms): AltGr / Option + o/u/i/n/c/s → ö/ü/í/ŋ/ç/ş; add Shift for the
capitals Ö/Ü/Í/Ŋ/Ç/Ş.

## Testbed letters (ĭ, ĩ, ñ, ı, ä)

The installable layouts below type the Jany-Latyn letters only. The
comparison settings that the testbed can select (whitepaper §7) are not on them:

| Letter | Codepoint | Used when |
|---|---|---|
| ĭ Ĭ | U+012D / U+012C | glide option `breve-i` |
| ĩ Ĩ | U+0129 / U+0128 | glide option `tilde-i` |
| ñ Ñ | U+00F1 / U+00D1 | velar-nasal option `tilde-n` |
| ı I | U+0131 / U+0049 | ы option `dotless-i` |
| ä Ä | U+00E4 / U+00C4 | compose-mode letter (whitepaper §20) |

The web playground's virtual keyboard covers all of them. Its Alt / Option
layer follows the options currently selected, so the same keys always produce
the letters of the active variant:

| Key | Produces |
|---|---|
| ⌥ O | ö, or ө in the Cyrillic-ө modes |
| ⌥ U | ü, ұ, or ū, per vowel mode |
| ⌥ I | í, ĭ, or ĩ, per glide option (no Alt letter for the plain `i` / `y` glides) |
| ⌥ N | ŋ, or ñ |
| ⌥ Y | ı, only while ы is written `ı` |
| ⌥ C / ⌥ S | ç / ş, only in cedilla mode |
| ⌥ A | ä |

Shift gives the capital; `ı` capitalizes to plain `I`, matching the engine. A
row above the keys lists every special letter of the active variant for
one-click insertion. Outside the playground, use your OS character viewer
with the codepoints above.

## macOS

`packages/engine/keymaps/jany-latyn.keylayout` is a complete US ANSI layout with Option and
Control layers.

### Features & Crash Prevention
- **Full ANSI Coverage:** Maps all keycodes 0–127, including the entire numpad
  (digits 0–9, `-`, `+`, `*`, `/`, `=`, `.`, Enter) and navigation cluster
  (Up/Down/Left/Right arrow keys, Forward Delete, Home, End, Page Up/Down, Escape).
- **Modifier & Terminal Support:** Dedicated mapping for Control combinations
  (`Ctrl+C`, `Ctrl+D`, `Ctrl+Z`, `Ctrl+R`, arrow history in terminals) and Command
  GUI hotkeys (`Cmd+C`, `Cmd+V`, `Cmd+Z`) preventing OS-level input crashes.
- **Special characters:**
  - Option + `c` → `ç`  (Option + Shift + `c` → `Ç`)
  - Option + `s` → `ş`  (Option + Shift + `s` → `Ş`)
  - Option + `o` → `ö`  (Option + Shift + `o` → `Ö`)
  - Option + `u` → `ü`  (Option + Shift + `u` → `Ü`)
  - Option + `i` → `í`  (Option + Shift + `i` → `Í`)
  - Option + `n` → `ŋ`  (Option + Shift + `n` → `Ŋ`)

### Installation & Activation
1. Copy the layout to your user Keyboard Layouts directory:
   ```sh
   cp packages/engine/keymaps/jany-latyn.keylayout ~/Library/Keyboard\ Layouts/
   ```
2. Log out of macOS and log back in (or reboot) so macOS indexes the new file.
3. Open **System Settings** → **Keyboard** → **Text Input** → **Input Sources** → click **Edit...**.
4. Click the **+** button at the bottom left, search for **"jany-latyn"** (under *Others* or *English*), select it, and click **Add**.
5. Switch to `jany-latyn` from the macOS menu bar input switcher or via `Fn` / `Globe` key.

## Linux (XKB)

`packages/engine/keymaps/jany.xkb` is a symbols fragment over the US base with
`level3(ralt_switch)`.

X11 session:
```sh
mkdir -p ~/.config/xkb/symbols
cp packages/engine/keymaps/jany.xkb ~/.config/xkb/symbols/jany
setxkbmap -I$HOME/.config/xkb -layout jany -print | xkbcomp -I$HOME/.config/xkb - $DISPLAY
```
Wayland: point your compositor's xkb config at the same include path (e.g.
`xkb_options`/custom layout in sway: `input * xkb_layout jany` with
XKB_CONFIG_EXTRA_PATH or a system-wide install into
`/usr/share/X11/xkb/symbols/`). Untested on this project's development machine
(macOS) — report issues.

## Windows

Use MSKLC: load the US base, assign Ctrl+Alt (=AltGr) o/u/i/n to ö/ü/í/ŋ and
Ctrl+Alt+Shift to Ö/Ü/Í/Ŋ, build an installer. Not covered by this repo.

## Fallback honesty

No keymap available → ASCII fallback mode (SPEC.md §3) is the intended path.
