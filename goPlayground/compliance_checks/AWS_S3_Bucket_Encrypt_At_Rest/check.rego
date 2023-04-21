package opscompass_checks
import future.keywords

server_side_encryption := input.ServerSideEncryptionConfiguration

default check_applies := true 
default check_passes := false 

verify_check(server_side_encryption) {
  server_side_encryption != null
}

check_passes = verify_check(server_side_encryption)