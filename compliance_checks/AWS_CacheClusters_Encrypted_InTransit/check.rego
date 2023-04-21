package opscompass_checks
import future.keywords

transit_encryption_enabled := input.document.TransitEncryptionEnabled
at_rest_encryption_enabled := input.document.AtRestEncryptionEnabled 

default check_applies := true 
default check_passes := false 

verify_check(transit_encryption_enabled, at_rest_encryption_enabled) {
  transit_encryption_enabled == true 
  at_rest_encryption_enabled == true
}

check_passes = verify_check(transit_encryption_enabled, at_rest_encryption_enabled)