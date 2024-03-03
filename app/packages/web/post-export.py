#!/usr/bin/env python3
import os
import re
import sys

# Check if the correct number of command-line arguments is provided
if len(sys.argv) != 2:
    print("Usage: python script.py <folder_path>")
    sys.exit(1)

folder_path = sys.argv[1]

# Task 1: Rename the file
def move_file(old_file_path, new_file_path):
    try:
        os.rename(old_file_path, new_file_path)
        print(f"File renamed: {old_file_path} -> {new_file_path}")
    except FileNotFoundError:
        print(f"File not found: {old_file_path}")
move_file(os.path.join(folder_path, "assets/js/smart-forms.min.js"), os.path.join(folder_path, "assets/js/smart-forms.mjs"))
move_file(os.path.join(folder_path, "sitemap.xml"), os.path.join(folder_path, "public/sitemap.xml"))

# Task 2: Replace script tag in HTML files
html_files = []
excluded_dirs = ["node_modules", "dist"]

# Function to recursively find HTML files
def find_html_files(directory):
    for root, dirs, files in os.walk(directory):
        if any(excluded_dir in root for excluded_dir in excluded_dirs):
            continue
        for file in files:
            if file.endswith(".html"):
                html_files.append(os.path.join(root, file))

# Find HTML files in the specified directory and its subdirectories
find_html_files(folder_path)

# Replace script tag in HTML files
for html_file in html_files:
    try:
        with open(html_file, "r") as file:
            content = file.read()
            
        # Use regular expression to capture the existing unique key and replace script tag
        content, replacements = re.subn(r'<script\s+src="(.*/)?smart-forms\.min\.js\?h=([^"]*)">',
                                        r'<script src="\1smart-forms.mjs?h=\2" type="module">',
                                        content)
        
        if replacements > 0:
            print(f"Script tag replaced in: {html_file}")
        
        with open(html_file, "w") as file:
            file.write(content)
        
    except FileNotFoundError:
        print(f"HTML file not found: {html_file}")

print("Script execution completed.")