from playwright.sync_api import sync_playwright


with sync_playwright() as p:

    browser = p.chromium.launch()

    page = browser.new_page()

    page.goto(
        "https://strata.framer.website",
        wait_until="networkidle"
    )

    html = page.content()

    with open("page.html","w") as f:
        f.write(html)

    browser.close()