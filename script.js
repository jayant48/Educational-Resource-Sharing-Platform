// Backend URL
const backendUrl = "http://54.234.175.217:3000"; // Replace with your backend URL

// Get DOM elements
const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");
const fileTableBody = document.getElementById("fileTableBody");

// Function to fetch the file list
const fetchFiles = async () => {
    try {
        const response = await fetch(`${backendUrl}/files`);
        const data = await response.json();
        console.log(data); // Debug: Log backend response in console
        fileTableBody.innerHTML = ""; // Clear existing rows

        // Check if there are any files
        if (!data.files || data.files.length === 0) {
            const row = document.createElement("tr");
            const noFilesCell = document.createElement("td");
            noFilesCell.textContent = "No files found.";
            noFilesCell.setAttribute("colspan", "2");
            row.appendChild(noFilesCell);
            fileTableBody.appendChild(row);
            return;
        }

        // Populate table with files
        data.files.forEach(file => {
            const row = document.createElement("tr");

            const fileNameCell = document.createElement("td");
            fileNameCell.textContent = file.name;

            const actionCell = document.createElement("td");
            const downloadButton = document.createElement("button");
            downloadButton.textContent = "Download";
            downloadButton.onclick = () => {
                const downloadUrl = `${backendUrl}/download/${file.name}`; // Use backend for downloading
                window.open(downloadUrl, "_blank");
            };
            actionCell.appendChild(downloadButton);

            row.appendChild(fileNameCell);
            row.appendChild(actionCell);
            fileTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching files:", error);
    }
};

// Function to upload a file
const uploadFile = async () => {
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${backendUrl}/upload`, {
            method: "POST",
            body: formData,
        });
        if (response.ok) {
            alert("File uploaded successfully!");
            fetchFiles(); // Refresh file list
        } else {
            throw new Error("Failed to upload file.");
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file.");
    }
};

// Attach event listeners
uploadButton.addEventListener("click", uploadFile);

// Fetch files on page load
fetchFiles();
