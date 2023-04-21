package opscompass_checks
import future.keywords

db_instance_class := input.document.DBInstanceClass
db_engine := input.document.Engine
db_licensing := input.document.LicenseModel

default check_applies := false 

verify_check_applies(engineType, instanceSize) {
	se2_engine = regex.match("oracle-se2", engineType) 
    large_instance_sizes := ["3xlarge", "4xlarge", "6xlarge", "8xlarge", "10xlarge", "12xlarge", "16xlarge", "32xlarge"]
    
    some instance_size in large_instance_sizes 
    large_instance := regex.match(instance_size, instanceSize)
    
    se2_engine ; large_instance
}  

check_applies = verify_check_applies(db_engine, db_instance_class)

check_passes if check_applies {
	db_licensing != "bring-your-own-license"
}