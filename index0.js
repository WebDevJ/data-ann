// https://docs.google.com/document/d/e/2PACX-1vRMx5YQlZNa3ra8dYYxmv-QIQ3YJe8tbI3kqcuC7lQiZm-CSEznKfN_HYNSpoXcZIV3Y_O3YoUB1ecq/pub

// Here's the JavaScript solution to solve the problem. The solution fetches and parses the document data, creates a 2D grid, and prints it in a way that forms the specified graphic.

//const fetch = require("node-fetch"); // Use node-fetch for HTTP requests if running in a Node.js environment.
import fetch from 'node-fetch'
async function printGridFromDoc(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from URL: ${response.statusText}`);
        }
        const data = await response.text();

        // Ensure data is a string
        if (typeof data !== "string") {
            throw new Error("Document content is not a valid string");
        }

        // Split and filter rows
        const rows = data.split("\n").filter(line => line && line.trim());

        // Parse the grid data
        const gridData = rows.map(row => {
            const parts = row.split(",");
            if (parts.length < 3) {
                console.warn(`Skipping malformed row: ${row}`);
                return null; // Skip rows with missing fields
            }
            const [char, x, y] = parts;
            return {
                char: char.trim(),
                x: parseInt(x.trim(), 10),
                y: parseInt(y.trim(), 10),
            };
        }).filter(entry => entry !== null); // Remove invalid rows

        // Determine grid dimensions
        const maxX = Math.max(...gridData.map(entry => entry.x));
        const maxY = Math.max(...gridData.map(entry => entry.y));

        // Initialize the grid
        const grid = Array.from({ length: maxY + 1 }, () => Array(maxX + 1).fill(" "));

        // Populate the grid
        gridData.forEach(({ char, x, y }) => {
            grid[y][x] = char; // Place character in the grid
        });

        // Print the grid
        grid.forEach(row => console.log(row.join("")));
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}


// Example 
const docUrl = "https://docs.google.com/document/d/e/2PACX-1vRMx5YQlZNa3ra8dYYxmv-QIQ3YJe8tbI3kqcuC7lQiZm-CSEznKfN_HYNSpoXcZIV3Y_O3YoUB1ecq/pub";
printGridFromDoc(docUrl);
