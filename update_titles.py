import os
import re

title_map = {
    'modernizing-family-business': 'Modernizing a Family Business | NeuCorelytix',
    'how-much-stock-to-buy': 'How Much Stock to Buy? Inventory Optimization | NeuCorelytix',
    'whatsapp-customer-enquiries': 'Automating WhatsApp Customer Inquiries | NeuCorelytix',
    'what-can-ai-do-for-business': 'What Can AI Do for Your Business? | NeuCorelytix',
    'ai-vs-automation': 'AI vs. Automation for Business | NeuCorelytix',
    'best-selling-vs-profitable': 'Best-Selling vs Profitable Products | NeuCorelytix',
    'automate-repetitive-business-tasks': 'Automating Repetitive Business Tasks | NeuCorelytix',
    'automate-excel-data-entry': 'Automate Excel Data Entry | NeuCorelytix',
    'tracking-lost-sales-demand': 'Tracking Lost Sales & Demand | NeuCorelytix',
    'which-products-sell-most': 'Tracking Top Selling Products | NeuCorelytix',
    'about': 'About Us | NeuCorelytix Solutions'
}

for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            basename = os.path.splitext(file)[0]
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Only update if the title is strictly "NeuCorelytix"
            if re.search(r'<title>\s*NeuCorelytix\s*</title>', content, re.IGNORECASE):
                new_title = title_map.get(basename)
                if new_title:
                    content = re.sub(r'<title>\s*NeuCorelytix\s*</title>', f'<title>{new_title}</title>', content, flags=re.IGNORECASE)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f'Updated title for: {filepath} -> {new_title}')
                elif basename == 'index' and root != '.':
                    new_title = 'NeuCorelytix | Premier AI Solutions & Business Automation'
                    content = re.sub(r'<title>\s*NeuCorelytix\s*</title>', f'<title>{new_title}</title>', content, flags=re.IGNORECASE)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f'Updated title for: {filepath} -> {new_title}')

print("Done updating titles.")
