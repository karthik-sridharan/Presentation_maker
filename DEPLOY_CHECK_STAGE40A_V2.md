# Stage 40A v2 Deployment Check

1. Open the deployed `index.html?v=stage40a-20260427-2&clearLuminaStorage=1`.
2. Open the AI drawer.
3. Go to the Prompt step and confirm two planning buttons appear:
   - Create editable deck plan
   - Build plan from outline
4. Click Build plan from outline and confirm the drawer moves to Plan.
5. Edit one slide plan card, validate it, then generate preview from plan.
6. Confirm Apply remains disabled until a valid preview exists.
7. Copy diagnostics and confirm `stage40ADeckPlanningStatus.pass === true`.
