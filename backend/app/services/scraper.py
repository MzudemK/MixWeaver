import requests
from bs4 import BeautifulSoup

class Scraper:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
        }

    def scrape_billboard_hot_100(self, date: str):
        """
        Scrapes the Billboard Hot 100 chart for a given date (YYYY-MM-DD).
        Returns a list of song titles.
        """
        url = f"https://www.billboard.com/charts/hot-100/{date}/"
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")
            # Select logic based on example script: "li ul li h3"
            # Note: Billboard structure might change, but we follow the example script logic
            song_elements = soup.select("li ul li h3")
            song_names = [song.getText().strip() for song in song_elements]
            
            return song_names
        except Exception as e:
            print(f"Error scraping billboard: {e}")
            return []
