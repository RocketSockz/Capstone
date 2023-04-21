package iam_summary_map_checks
import future.keywords

account_mfa_enabled := input.document.AccountMFAEnabled

default check_applies := true 
default check_passes := false 

verify_check(account_mfa_enabled) {
  account_mfa_enabled == 1
}

check_passes = verify_check(account_mfa_enabled)