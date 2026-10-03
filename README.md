# Portfolio Infrastructure

Terraform configuration for OCI static website hosting.

## Prerequisites

- Terraform >= 1.0
- OCI CLI configured
- OCI API key pair generated

## Setup

1. Copy the example variables file:
```bash
   cp terraform.tfvars.example terraform.tfvars
```

2. Edit `terraform.tfvars` with your actual OCI credentials:
   - Find your tenancy OCID: OCI Console → Profile → Tenancy
   - Find your user OCID: OCI Console → Profile → User Settings
   - Add your API key fingerprint
   - Set your compartment OCID

3. Initialize Terraform:
```bash
   terraform init
```

4. Import existing bucket (if applicable):
```bash
   terraform import oci_objectstorage_bucket.portfolio_bucket \
     "n/<YOUR_NAMESPACE>/b/personal-website"
```

5. Review and apply:
```bash
   terraform plan
   terraform apply
```

## Running Locally

The site is plain HTML — no build step required. Serve it with any static file server from the `website/` directory.

**Python (built-in):**
```bash
cd website
python3 -m http.server 8080
```
Then open [http://localhost:8080](http://localhost:8080).

**Node.js (`npx`):**
```bash
cd website
npx serve .
```

## Important Files

- `terraform.tfvars` - **NEVER COMMIT THIS** - Contains your secrets
- `terraform.tfvars.example` - Safe template with placeholder values