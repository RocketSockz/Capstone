package opscompass_checks

import future.keywords

ip_permissions := input.document.IpPermissions

group_name := input.document.GroupName

default check_applies := false

default check_passes := false

default valid_ports := false 
default valid_ranges := false 


verify_check_applies(group_name) if {
	group_name != "default"
}

check_applies = verify_check_applies(group_name)

## The check passes if the IP range is above 3050
valid_ports if {
	every ip_permission in ip_permissions {
		ip_permission.ToPort > 3050 ; ip_permission.FromPort > 3050 ; ip_permission.FromPort != 3050 ; ip_permission.ToPort != 3050
	}
}


valid_ports valid_ranges if {
	 not input.document.IpPermissions
}



## The check passes if the IP range is below 3050
valid_ports if {
 	every ip_permission in ip_permissions {
		ip_permission.ToPort < 3050 ; ip_permission.FromPort < 3050 ; ip_permission.FromPort != 3050 ; ip_permission.ToPort != 3050
	}
}

valid_ranges if {
	every ip_permission in ip_permissions {
		every range in ip_permission.IpRanges {
        	range.CidrIp != "0.0.0.0/0"
		}
	}
}

check_passes if {
	valid_ranges ; valid_ports 
} 



