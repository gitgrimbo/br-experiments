# image-generator

## Using Functions

GCF and AWS have different APIs for implementing functions.

### Google Cloud Functions

Need to use req.rawBody because of the way GCF handles requests - see https://cloud.google.com/functions/docs/writing/http#handling_multipart_form_uploads.

Can't access internet fonts because of network egress?  Same for remote image URLs.

## AWS

