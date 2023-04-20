package cloudtrail_checks
import future.keywords

kms_key_id := input.document.KmsKeyId

default check_applies := true 
default check_passes := false 

verify_check(kms_key_id) {
  kms_key_id != ""
}

check_passes = verify_check(kms_key_id)