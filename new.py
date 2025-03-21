import os

def aggregate_ts_tsx_code(directories, output_file):
    with open(output_file, "w", encoding="utf-8") as out_file:
        for directory in directories:
            for root, _, files in os.walk(directory):
                for file in files:
                    if file.endswith(".ts") or file.endswith(".tsx"):
                        file_path = os.path.join(root, file)
                        relative_path = os.path.relpath(file_path, directory)
                        
                        out_file.write(f"app/{relative_path}\n")
                        out_file.write("// code here\n")
                        
                        with open(file_path, "r", encoding="utf-8") as f:
                            out_file.write(f.read())
                        
                        out_file.write("\n\n")

if __name__ == "__main__":
    directories_to_search = ["./app", "./components", "./lib", "./services"]  # Change this to your target directories
    output_file_path = "aggregated_code.txt"
    aggregate_ts_tsx_code(directories_to_search, output_file_path)
    print(f"Aggregated code saved to {output_file_path}")
