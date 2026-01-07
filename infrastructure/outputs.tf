output "bucket_name" {
  description = "Name of the Object Storage bucket"
  value       = oci_objectstorage_bucket.portfolio_bucket.name
}

output "bucket_namespace" {
  description = "Namespace of the Object Storage bucket"
  value       = data.oci_objectstorage_namespace.ns.namespace
}

output "bucket_url" {
  description = "Public URL of the bucket"
  value       = "https://objectstorage.${var.region}.oraclecloud.com/n/${data.oci_objectstorage_namespace.ns.namespace}/b/${oci_objectstorage_bucket.portfolio_bucket.name}/o/"
}

# PAR output commented out since we're not using PARs
# output "par_access_uri" {
#   description = "Pre-authenticated request URI"
#   value       = oci_objectstorage_preauthrequest.portfolio_par.access_uri
#   sensitive   = true
# }