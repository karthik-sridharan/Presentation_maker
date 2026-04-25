# Rollback — Stage 27A

Stage 27A is designed to be low risk: the production editor behavior still comes from the Stage 24C classic-script runtime. The new ES module files are diagnostic/parity assets only.

## Immediate rollback

If Stage 27A diagnostics fail after deployment:

1. Restore the Stage 24C `index.html`.
2. Restore the Stage 24C diagnostics page or point users to `diagnostics-stage24c.html`.
3. Keep the Stage 24C classic assets in place:

```text
css/styles-stage24c.css
js/*-stage24c.js
```

4. Clear cache with a Stage 24C query string, for example:

```text
index.html?v=stage24c-20260425-2&clearLuminaStorage=1
```

## What can be removed during rollback

The following Stage 27A-only files can be removed or ignored:

```text
js/diagnostics-stage27a.js
js/module-manifest-stage27a.js
js/esm/utils-stage27a.mjs
js/esm/block-style-stage27a.mjs
js/es-module-smoke-stage27a.mjs
diagnostics-stage27a.html
RELEASE_NOTES_STAGE27A.md
ES_MODULE_MIGRATION_PLAN.md
STAGE27A_README.txt
RELEASE_FILES_STAGE27A.json
```

## Rollback verification

After rollback, confirm the Stage 24C diagnostics report no missing assets/globals/DOM ids and no boot errors.
