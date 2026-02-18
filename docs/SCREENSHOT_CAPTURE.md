# Screenshot Capture Procedure

Use this process to populate `docs/EVIDENCE_MATRIX.md`.

## 1. Start the app

```bash
bun run dev
```

## 2. Capture by viewport

Required viewports:
- desktop: `1440x900`
- tablet: `1024x1366`
- mobile: `390x844`

## 3. Required states
- default
- hover/focus
- error (form validation)
- success (submission complete)

## 4. Route list
- `/`
- `/about`
- `/contact`
- `/dashboard`
- `/documents`
- `/donate`
- `/events`
- `/events/[id]`
- `/find`
- `/incidents`
- `/incidents/[id]`
- `/register`
- `/register/guest`
- `/safety-tips`
- `/safety-tips/[slug]`
- `/sponsors`
- `/start-scheme`
- `/vacation-watch`
- `/volunteer`
- `/terms`
- `/privacy`
- `/disclaimer`
- `/sign-in`
- `/sign-up`

## 5. Folder structure

```
evidence/
  before/
  during/
  after/
    desktop/
    tablet/
    mobile/
```
