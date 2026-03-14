import os
import re

directories = ['components', 'app']
target_files = []

for d in directories:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                target_files.append(os.path.join(root, file))

def update_size(match):
    prefix = match.group(1)
    size = int(match.group(2))
    suffix = match.group(3)
    
    # Logic for increasing font sizes
    if size < 11:
        new_size = size + 3
    elif size <= 16:
        new_size = size + 2
    elif size <= 20:
        new_size = size + 2
    else:
        new_size = size + 2 # Just add 2 to larger ones
        
    return f"{prefix}{new_size}{suffix}"

for file_path in target_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Matches 'fontSize: 12' or 'fontSize:12' or 'fontSize={12}' 
    new_content = re.sub(r'(fontSize:\s*)(\d+)(,|\s|\})', update_size, content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated fonts in {file_path}")

print("Done")
