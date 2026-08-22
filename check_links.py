import os
import re

html_files = []
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

links = set()
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        hrefs = re.findall(r'href="([^"]+)"', content)
        for href in hrefs:
            if not href.startswith('http') and not href.startswith('#') and not href.startswith('mailto:') and not href.startswith('tel:'):
                links.add(href)

broken = []
for link in links:
    # Handle relative paths properly if needed, but for now just check if file exists in the directory structure
    # assuming they are relative to root if they start with / or relative to current file. 
    # For simplicity, we just check if it exists in the repo somewhere.
    link_clean = link.lstrip('/')
    link_clean = link_clean.split('?')[0] # remove query params
    link_clean = link_clean.split('#')[0] # remove hash
    
    if link_clean == '':
        continue
        
    found = False
    for root, dirs, files in os.walk('.'):
        for file in files:
            if link_clean == file or link_clean in os.path.join(root, file):
                found = True
                break
        if found:
            break
            
    if not found:
        broken.append(link)

print("Broken links found:", broken)
