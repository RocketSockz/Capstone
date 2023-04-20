package main

import (
	"encoding/json"
	"fmt"
	// "github.com/open-policy-agent/opa/rego"
	"os"
	"io/fs"
)

func main() {
    fmt.Println("hello world")
		listFilesInDir("./compliance_checks")

		listDirsInDir("./compliance_checks")
		readFile("./compliance_checks/AWS_RDS_Oracle_BYOL/fail_example.json")
}

func listFilesInDir(path string) ([]fs.DirEntry) {
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

func listDirsInDir(path string) ([]fs.DirEntry) {
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


func readFile(path string) () {
	// read file
	data, err := os.ReadFile(path)
	if err != nil {
		fmt.Print(err)
	}

	// Define the variable as an arbitrary JSON object
	var fail_example map[string]interface{} 
	
	err = json.Unmarshal(data, &fail_example)
	if err != nil {
		fmt.Println("error:", err)
	}

	fmt.Printf("JSON Data from IO: %s\n\n", data)
	fmt.Printf("JSON data unmarshaled: %s\n\n", fail_example)
	fmt.Printf("type from JSON object: %s\n\n", fail_example["type"])
	return
}