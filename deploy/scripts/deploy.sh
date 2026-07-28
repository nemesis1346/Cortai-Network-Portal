#!/usr/bin/env bash
# Build and publish the SPA to S3 + CloudFront.
#
# Requires (as env vars, or exported by CI from `terraform output`):
#   BUCKET_NAME
#   CLOUDFRONT_DISTRIBUTION_ID
#
# Never hardcodes account-specific values — this script alone does not tell you
# which AWS account it will run against; that's set by whatever AWS credentials
# are active in the shell/CI job that calls it.
set -euo pipefail

: "${BUCKET_NAME:?Set BUCKET_NAME (see terraform output s3_bucket_name)}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?Set CLOUDFRONT_DISTRIBUTION_ID (see terraform output cloudfront_distribution_id)}"

npm ci
npm run check
npm run build

aws s3 sync dist/ "s3://${BUCKET_NAME}" --delete
aws cloudfront create-invalidation --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" --paths "/*"

echo "Deployed to s3://${BUCKET_NAME}, invalidated ${CLOUDFRONT_DISTRIBUTION_ID}"