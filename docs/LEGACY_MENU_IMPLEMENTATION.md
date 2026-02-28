# Legacy Menu Parity — Implementation Design

**Document Version:** 1.0  
**Date:** 2026-02-28  
**Related:** [LEGACY_MENU_PARITY.md](LEGACY_MENU_PARITY.md)

---

## 1. Nav Structure

### 1.1 Header (Signed Out)

| Element | Target | Notes |
|---------|--------|-------|
| Report | /incidents | CTA |
| Sign in | /sign-in | Ghost button |
| Join | /register | Member registration |
| Guest | /register/guest | Guest registration (new) |

### 1.2 Mobile Nav

Same as header: Join → /register, Guest → /register/guest.

### 1.3 Footer

- **Organisation** column: Add "Register" (member) and "Register guest" links, or keep single "Help" and add Membership subsection.
- **Bottom bar:** Add Octox development copyright link.

---

## 2. Help Hierarchy

| Page | Path | Content |
|------|------|---------|
| Help index | /help | Cards linking to all help pages |
| Member registration | /help/member-registration | Existing |
| Member FAQ | /help/member-faq | New — common questions |
| Guest registration | /register/guest | Existing; add help card |
| Troubleshooting | /help/troubleshooting | New — login, preferences, remember-me |
| Security | /help/security | New — data protection |
| Patrol administration | /help/patrol-administration | Existing |
| Glossary | /help/glossary | Existing |

---

## 3. Content Sources

- **Member FAQ:** Authored from LEGACY_SITE_DISCOVERY and common member questions.
- **Troubleshooting:** Browser support (Chrome, Firefox, Safari, Edge); login issues (Clerk); preferences (/account/settings); remember-me (Clerk session).
- **Security:** How we store data, who has access, contact for concerns (privacy@ or contact).

---

## 4. Footer Attribution

```
Development Copyright © [Octox](http://www.octoxgroup.com/)
```

Link opens in new tab with `rel="noopener noreferrer"`.
