package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
	"time"

	"github.com/open-policy-agent/opa/rego"
)

func main() {
	go_check_dir := "./compliance_checks"
	go_checks := listDirsInDir(go_check_dir)
	// query := rego.New(
	// 	rego.Query(`passes = data.opscompass_checks.check_passes
	// 							applies = data.opscompass_checks.check_applies`),
	// 	rego.Module("keyvault_checks.rego", module),
	// 	rego.Input(pass_file),
	// )

	// eval_result, err := query.Eval(ctx)

	// fmt.Print(eval_result)

	// if err != nil {
	// 	fmt.Print(eval_result)
	// }

	for _, directory := range go_checks {
		dir_path := go_check_dir + "/" + directory.Name()
		// Get rego file
		rego_file := dir_path + "/check.rego"
		rego_file_as_string := readRegoFile(rego_file)
		// Get Check Pass
		pass_case_path := dir_path + "/pass.json"
		pass_case := readFile(pass_case_path)
		// Get Checks for Fails
		fail_case_path := dir_path + "/fail.json"
		fail_case := readFile(fail_case_path)

		fmt.Print(`Check `, dir_path, "\n")
		start_pass := time.Now()
		pass_result := evaluate_policy_on_resource(rego_file_as_string, pass_case)
		end_pass := time.Since(start_pass)
		start_fail := time.Now()
		fail_result := evaluate_policy_on_resource(rego_file_as_string, fail_case)
		end_fail := time.Since(start_fail)

		total_time := end_fail + end_pass
		fmt.Print(`Pass Result: `, pass_result, ` Runtime`, end_pass, "\n")
		fmt.Print(`Fail Result: `, fail_result, ` Runtime`, end_fail, "\n")
		fmt.Print("Total Time elapsed: ", total_time, "\n")
	}
}

func evaluate_policy_on_resource(policy string, resource map[string]interface{}) rego.ResultSet {
	ctx := context.Background()
	query := rego.New(
		rego.Query(`passes = data.opscompass_checks.check_passes
								applies = data.opscompass_checks.check_applies`),
		rego.Module("opscompass_checks.rego", policy),
		rego.Input(resource),
	)

	eval_result, _ := query.Eval(ctx)
	return eval_result
}

func listFilesInDir(path string) []fs.DirEntry {
	files, err := os.ReadDir(path)
	if err != nil {
		fmt.Print(err)
	}

	var final_files []fs.DirEntry
	for _, file := range files {
		if !file.IsDir() {
			final_files = append(final_files, file)
		}
	}

	return final_files
}

func listDirsInDir(path string) []fs.DirEntry {
	dirs, err := os.ReadDir(path)
	if err != nil {
		fmt.Print(err)
	}

	var final_dirs []fs.DirEntry
	for _, dir := range dirs {
		if dir.IsDir() {
			final_dirs = append(final_dirs, dir)
		}
	}

	return final_dirs
}

func readRegoFile(path string) string {
	data, err := os.ReadFile(path)
	if err != nil {
		fmt.Print(err)
	}

	return string(data)
}

func readFile(path string) map[string]interface{} {
	// read file
	data, err := os.ReadFile(path)
	if err != nil {
		fmt.Print(err)
	}

	// Define the variable as an arbitrary JSON object
	var example map[string]interface{}

	err = json.Unmarshal(data, &example)
	if err != nil {
		fmt.Println("error:", err)
	}

	return example
}
