# Deploy — prepared, not executed

**Nothing in this folder has been run against a real AWS account.** No `terraform apply`,
no `aws s3 sync`, no GitHub Actions deploy run. These are prepared artifacts for a
deliberate, later run — not a live pipeline.

## Shape

Static SPA on S3 (private bucket) + CloudFront (Origin Access Control):

```
Vite build (dist/) → S3 bucket (private, versioned) → CloudFront (OAC) → HTTPS
```

## To actually deploy, in order

1. **One-time IAM setup** (not doable from this repo alone): create an AWS IAM role
   that trusts GitHub's OIDC provider, scoped to `s3:PutObject`/`s3:DeleteObject` on
   the target bucket and `cloudfront:CreateInvalidation` on the target distribution.
2. `cd deploy/terraform && terraform init && terraform apply -var bucket_name=<globally-unique-name>`
   — creates the S3 bucket + CloudFront distribution. Note the outputs.
3. In the GitHub repo: Settings → Environments → create `production`, add required
   reviewers. Settings → Secrets/Variables → add `AWS_ROLE_TO_ASSUME` (secret),
   `AWS_REGION`, `BUCKET_NAME`, `CLOUDFRONT_DISTRIBUTION_ID` (variables, from step 2's
   `terraform output`).
4. Run the `Deploy (manual)` workflow from the Actions tab (`workflow_dispatch`), or
   locally: `BUCKET_NAME=... CLOUDFRONT_DISTRIBUTION_ID=... bash deploy/scripts/deploy.sh`
   with AWS credentials active in your shell.

## Why Terraform, not CDK

A single S3+CloudFront static-site distribution is exactly the minimal shape Terraform's
HCL suits — no custom constructs, no synth step. CDK would add a Node/TS bootstrap for
no benefit at this scope. If the wider CoreTi platform standardizes on CDK elsewhere,
defer to that precedent before running this for real — it wasn't checked here.