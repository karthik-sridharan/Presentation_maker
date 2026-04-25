# Rollback — Stage 27B

Stage 27B is designed to be low risk: the production editor behavior still comes from the Stage 24C classic-script runtime. The new ES module files are diagnostic/parity assets only.

## Immediate rollback

If Stage 27B diagnostics fail after deployment:

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

The following Stage 27B-only files can be removed or ignored:

```text
js/diagnostics-stage27b.js
js/module-manifest-stage27b.js
js/esm/utils-stage27b.js
js/esm/block-style-stage27b.js
js/es-module-smoke-stage27b.js
diagnostics-stage27b.html
RELEASE_NOTES_STAGE27B.md
ES_MODULE_MIGRATION_PLAN.md
STAGE27B_README.txt
RELEASE_FILES_STAGE27B.json
```

## Rollback verification

After rollback, confirm the Stage 24C diagnostics report no missing assets/globals/DOM ids and no boot errors.
