import cv2
import pytesseract
import json
import os

# Update this path to where Tesseract is installed on your desktop
# Example for Windows: r'C:\Program Files\Tesseract-OCR\tesseract.exe'
pytesseract.pytesseract.tesseract_cmd = r'/usr/local/bin/tesseract'

def extract_index_from_images(image_folder):
    full_data = []
    # Sorting ensures pages 85-119 stay in order
    image_files = sorted([f for f in os.listdir(image_folder) if f.endswith('.jpg')])

    for filename in image_files:
        print(f"Processing {filename}...")
        img = cv2.imread(os.path.join(image_folder, filename))
        h, w, _ = img.shape

        # The CBM index uses a strict 3-column layout
        # We crop the image into 3 vertical strips to prevent the OCR 
        # from reading across the entire page horizontally.
        column_width = w // 3
        for i in range(3):
            start_x = i * column_width
            end_x = (i + 1) * column_width
            column_img = img[0:h, start_x:end_x]
            
            # Extract text from the column
            text = pytesseract.image_to_string(column_img)
            
            # Simple parsing: each line in the column is an entry
            lines = text.split('\n')
            for line in lines:
                if len(line.strip()) > 10:  # Filter out noise/short lines
                    full_data.append({
                        "source_file": filename,
                        "column": i + 1,
                        "raw_text": line.strip()
                    })

    # Save all thousands of entries to a single local JSON file
    with open('full_comic_index.json', 'w') as f:
        json.dump(full_data, f, indent=4)
    
    print(f"Done! Extracted {len(full_data)} entries to full_comic_index.json")

if __name__ == "__main__":
    # Use '.' if the script is in the same folder as your 35 images
    extract_index_from_images('.')