package cache_cluster_checks
import future.keywords

flow_logs := input.document.FlowLogs

default check_applies := true 
default check_passes := false 

verify_check(flow_logs) {
  count(flow_logs) != 0
}

check_passes = verify_check(flow_logs)