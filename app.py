from flask import Flask, jsonify
from flask_cors import CORS  # <-- 1. IMPORT THIS
import requests
from bs4 import BeautifulSoup
import re

# Initialize the Flask application
app = Flask(__name__)
CORS(app) 
# Define the API endpoint
@app.route('/prices/<state>/<commodity>', methods=['GET'])
def get_prices(state, commodity):
    # Sanitize inputs
    state = state.strip().lower()
    commodity = commodity.strip().lower()

    try:
        # Build URL and fetch HTML
        url = f"https://www.napanta.com/agri-commodity-prices/{state}/{commodity}/"
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
        response = requests.get(url, headers=headers)
        response.raise_for_status() # Raises an exception for bad status codes (404, 500, etc.)

        soup = BeautifulSoup(response.text, 'html.parser')

        # --- Data Parsing ---
        summary_data = {}
        market_data = []

        rows = soup.select("table tr")

        # A helper to extract numbers from strings like '₹ 2,620/Quintal' -> 2620
        def extract_price(text):
            # Find all numbers (including those with commas) in the string
            numbers = re.findall(r'[\d,]+', text)
            if numbers:
                # Take the first number found, remove commas, and convert to float
                return float(numbers[0].replace(',', ''))
            return None

        # Process all table rows
        for row in rows:
            cols = row.find_all("td")
            if not cols:
                continue

            # Clean the text from each column
            data = [col.text.strip() for col in cols]

            # Case 1: Summary data (2 columns, e.g., ['Avg Market Price:', '₹ 2,600/Quintal'])
            if len(data) == 2:
                key = data[0].replace(':', '').strip()
                summary_data[key] = data[1]

            # Case 2: Detailed market data (usually 9 columns)
            elif len(data) > 7:
                price_avg = extract_price(data[6])
                if price_avg is not None:
                    market_data.append({
                        "district": data[0],
                        "market": data[1],
                        "variety": data[3],
                        "max_price": extract_price(data[4]),
                        "min_price": extract_price(data[5]),
                        "avg_price": price_avg,
                        "date": data[7]
                    })

        # Return the structured data as JSON
        return jsonify({
            "success": True,
            "state": state,
            "commodity": commodity,
            "summary": summary_data,
            "market_prices": market_data
        })

    except requests.exceptions.RequestException as e:
        # Handle network errors or 404 Not Found
        return jsonify({"success": False, "error": f"Failed to fetch data: {e}"}), 404
    except Exception as e:
        # Handle other potential errors during scraping
        return jsonify({"success": False, "error": f"An error occurred: {e}"}), 500

# To run the app locally for testing
if __name__ == '__main__':
    app.run(debug=True, port=5000)