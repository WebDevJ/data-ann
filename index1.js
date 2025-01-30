const { JSDOM } = require("jsdom");
const fetch = require("node-fetch");

async function printGoogleDocGrid(docUrl) {
    try {
        // Fetch Google Doc content
        const response = await fetch(docUrl);
        if (!response.ok) throw new Error("Failed to fetch the document");
        const html = await response.text();

        // Parse the HTML
        const dom = new JSDOM(html);
        const document = dom.window.document;
        const table = document.querySelector("table");
        if (!table) throw new Error("No table found in document");

        // Extract rows
        const rows = Array.from(table.querySelectorAll("tr"));
        let data = [];

        for (let i = 1; i < rows.length; i++) { // Skipping header row
            const cells = rows[i].querySelectorAll("td");
            if (cells.length === 3) {
                let x = parseInt(cells[0].textContent.trim());
                let char = cells[1].textContent.trim();
                let y = parseInt(cells[2].textContent.trim());
                data.push({ x, char, y });
            }
        }

        // Determine grid dimensions
        const maxX = Math.max(...data.map(d => d.x));
        const maxY = Math.max(...data.map(d => d.y));

        // Initialize empty grid
        let grid = Array.from({ length: maxY + 1 }, () => Array(maxX + 1).fill(" "));

        // Populate grid with characters
        data.forEach(({ x, char, y }) => {
            grid[y][x] = char;
        });

        // Print the grid
        console.log(grid.map(row => row.join("")).join("\n"));

    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Example usage
const googleDocUrl = "https://docs.google.com/document/d/e/2PACX-1vRMx5YQlZNa3ra8dYYxmv-QIQ3YJe8tbI3kqcuC7lQiZm-CSEznKfN_HYNSpoXcZIV3Y_O3YoUB1ecq/pub";
printGoogleDocGrid(googleDocUrl);
