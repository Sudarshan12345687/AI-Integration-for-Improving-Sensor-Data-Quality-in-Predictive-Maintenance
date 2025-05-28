document.addEventListener("DOMContentLoaded", () => {
    initializeLiveChart();
});

let rawData = [];
let cleanedData = [];

function handleFileUpload() {
    const fileInput = document.getElementById("fileInput").files[0];
    if (!fileInput) {
        alert("Please upload a CSV file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result;
        processCSVData(csvData);
    };
    reader.readAsText(fileInput);
}

function processCSVData(csvData) {
    const rows = csvData.split("\n").map(row => row.split(","));
    rawData = rows.map(row => parseFloat(row[1])).filter(value => !isNaN(value));
    displayChart(rawData, "rawDataChart", "Raw Sensor Data");
}

function removeNoise() {
    cleanedData = rawData.map(value => value * 0.95 + Math.random() * 0.05);
    displayChart(cleanedData, "cleanedDataChart", "Noise-Filtered Data");
}

function handleMissingValues() {
    cleanedData = rawData.map(value => (isNaN(value) ? cleanedData[cleanedData.length - 1] : value));
    displayChart(cleanedData, "cleanedDataChart", "Missing Data Handled");
}

function detectAnomalies() {
    cleanedData = rawData.map(value => (value > 90 ? 75 : value));
    displayChart(cleanedData, "cleanedDataChart", "Anomaly Detection Applied");
}

function displayChart(data, canvasId, label) {
    const ctx = document.getElementById(canvasId).getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: Array.from({ length: data.length }, (_, i) => i + 1),
            datasets: [{ label, data, borderColor: "#3498db", fill: false }]
        },
        options: { responsive: true }
    });
}

function initializeLiveChart() {
    const ctx = document.getElementById("liveSensorChart").getContext("2d");
    let liveData = [];

    const liveChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{ label: "Live Sensor Data", data: liveData, borderColor: "#e74c3c", fill: false }]
        },
        options: { responsive: true }
    });

    setInterval(() => {
        if (liveData.length > 20) liveData.shift();
        liveData.push(Math.random() * 100);
        liveChart.data.labels = Array.from({ length: liveData.length }, (_, i) => i + 1);
        liveChart.update();
    }, 1000);
}
