package iam_summary_map_checks
import future.keywords

access_keys := input.document.AccountAccessKeysPresent

default check_applies := true 
default check_passes := false 

verify_check(access_keys) {
  access_keys == 0
}

check_passes = verify_check(access_keys)package iam_summary_map_checks
import future.keywords

access_keys := input.document.AccountAccessKeysPresent

default check_applies := true 
default check_passes := false 

verify_check(access_keys) {
  access_keys == 0
}

check_passes = verify_check(access_keys)