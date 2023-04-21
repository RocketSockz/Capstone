package keyvault_checks
import future.keywords

purge_protection := input.document.properties.enablePurgeProtection

default check_applies := true 
default check_passes := false 

verify_check(purge_protection) {
  purge_protection == true
}

check_passes = verify_check(purge_protection)