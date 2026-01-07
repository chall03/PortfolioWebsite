# Data source to get the Object Storage namespace
data "oci_objectstorage_namespace" "ns" {
  compartment_id = var.compartment_ocid
}

# Object Storage bucket for static website hosting
resource "oci_objectstorage_bucket" "portfolio_bucket" {
  compartment_id = var.compartment_ocid
  namespace      = data.oci_objectstorage_namespace.ns.namespace
  name           = var.bucket_name
  access_type    = "ObjectRead"  # Public read access

  versioning = "Enabled"

  metadata = {
    "website" = "true"
  }
}

# PAR commented out - not needed for public static website hosting
# resource "oci_objectstorage_preauthrequest" "portfolio_par" {
#   namespace    = data.oci_objectstorage_namespace.ns.namespace
#   bucket       = oci_objectstorage_bucket.portfolio_bucket.name
#   name         = "portfolio-public-access"
#   access_type  = "AnyObjectRead"
#   time_expires = timeadd(timestamp(), "87600h") # 10 years
# }