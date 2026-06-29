import json
import os
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from google import genai
from google.genai import types

# Load the map
with open("top_50_map.json", "r") as f:
    book_map = json.load(f)

books = list(book_map.keys())

# Get the day of the year to determine which single book to scrape today
day_of_year = datetime.now().timetuple().tm_yday
target_index = day_of_year % len(books)
target_book = books[target_index]
cgc_id = book_map[target_book]

print(f"Today's target: {target_book} (ID: {cgc_id})")

# Fetch from cgcdata.com
url = f"http://www.cgcdata.com/cgc/search/comicid/{cgc_id}"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
response = requests.get(url, headers=headers)

if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'html.parser')
    page_text = soup.get_text()
    
    if "GEMINI_API_KEY" in os.environ:
        # The client automatically picks up the GEMINI_API_KEY env variable
        client = genai.Client()
        
        # AI Extraction
        prompt = f"Extract the 'Total Graded' and 'Universal' (Blue Label) counts from this text. Return ONLY a valid JSON object with keys 'total_graded' (int) and 'universal_count' (int). Text: {page_text[:5000]}"
        
        # Use the new SDK syntax and the 2.5-flash model
        ai_response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        
        # Parse the guaranteed JSON response
        data = json.loads(ai_response.text)
        
        record = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "book": target_book,
            "cgc_id": cgc_id,
            "total_graded": data.get("total_graded"),
            "universal_count": data.get("universal_count")
        }
        
        # Save to census_history.json
        history_file = "census_history.json"
        if os.path.exists(history_file):
            with open(history_file, "r") as f:
                history = json.load(f)
        else:
            history = []
            
        history.append(record)
        
        with open(history_file, "w") as f:
            json.dump(history, f, indent=2)
            
        print(f"Successfully recorded: {record}")
    else:
        print("GEMINI_API_KEY not found in environment. Please set it to parse the results.")
else:
    print(f"Failed to fetch {url}. Status: {response.status_code}")