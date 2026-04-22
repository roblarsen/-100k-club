"""
local_auth_setup.py

Launches a visible Chromium browser so the user can manually log in to
auction sites (e.g. Heritage Auctions, ComicLink).  Once the user is done,
the browser session (cookies, localStorage, etc.) is saved to auth.json so
that headless scrapers can reuse it via Playwright's storage_state feature.

Usage:
    python local_auth_setup.py

Requirements:
    pip install playwright
    playwright install chromium
"""

from playwright.sync_api import sync_playwright


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()

        print("Browser is open.")
        print("Please log in to the auction sites you need (Heritage, ComicLink, etc.).")
        print("When you are finished, return here and press ENTER to save your session.")

        page.goto("about:blank")

        input("\nPress ENTER to save session and close the browser...")

        context.storage_state(path="auth.json")
        print("Session saved to auth.json")

        browser.close()


if __name__ == "__main__":
    main()
