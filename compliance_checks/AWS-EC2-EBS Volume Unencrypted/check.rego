package opscompass_checks
import future.keywords

encrypted := input.document.Encrypted

default check_applies := true 
default check_passes := false 

verify_check(encrypted) {
  encrypted == true
}

check_passes = verify_check(encrypted)