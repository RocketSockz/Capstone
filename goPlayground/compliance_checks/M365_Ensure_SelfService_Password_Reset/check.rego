package opscompass_checks
import future.keywords

is_enabled := input.credentialReport.isEnabled
is_registered := input.credentialReport.isRegistered

default check_applies := true 
default check_passes := false 

verify_check(is_enabled, is_registered) {
  is_enabled == true 
  is_registered == true
}

check_passes = verify_check(is_enabled, is_registered)