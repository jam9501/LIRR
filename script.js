// Data for each year (Total trains and delayed trains)
const yearData = {
    2022: { totalTrains: 226066, lateTrains: 8691 },
    2023: { totalTrains: 303519, lateTrains: 17064 },
    2024: { totalTrains: 316000, lateTrains: 11480 },
};

// Calculate the number of cubes per train for 700 trains per dot
const trainsPerDot = 500;  // Each dot represents 700 trains
const cubesPerTrain = 1 / trainsPerDot; // Adjusted per train to fit the new dot allocation

// Variables to track the number of cubes added dynamically
let cubesFor2022 = 0;
let cubesFor2023 = 0;
let cubesFor2024 = 0;

// Function to generate the train grid for each year and add cubes progressively
function generateTrainGrid(yearId, totalTrains, lateTrains, cubesForYear) {
    const gridContainer = document.getElementById(yearId);
    const cubesToAdd = Math.min(totalTrains * cubesPerTrain - cubesForYear, 450); // Limit to 450 cubes at once

    // Set grid height dynamically based on cubes
    const totalHeight = Math.ceil(cubesToAdd / 30) * 40; // Adjust grid height based on number of cubes
    gridContainer.style.height = `${totalHeight}px`;

    // Calculate how many late trains to add
    const scaledLateTrains = Math.round(lateTrains * cubesPerTrain); // Scaled late trains based on cubesPerTrain

    // Loop to create the cubes
    for (let i = cubesForYear; i < cubesForYear + cubesToAdd; i++) {
        const cube = document.createElement("div");
        cube.classList.add("train-cube");

        // Highlight the late trains
        if (i < scaledLateTrains) {
            cube.classList.add("late");
        }

        // Immediately add 'show' class for 2022 to make it static
        if (yearId === "trainGrid2022") {
            cube.classList.add("show");
        }

        gridContainer.appendChild(cube);

        // Add transition to show cubes growing dynamically for 2023 and 2024
        if (yearId !== "trainGrid2022") {
            setTimeout(() => {
                cube.classList.add("show");
            }, 50 * (i - cubesForYear)); // Delay for smooth transition
        }
    }

    // Update the counter for the total number of cubes loaded
    if (yearId === "trainGrid2022") cubesFor2022 += cubesToAdd;
    if (yearId === "trainGrid2023") cubesFor2023 += cubesToAdd;
    if (yearId === "trainGrid2024") cubesFor2024 += cubesToAdd;
}

// Initialize Scrollama
const scroller = scrollama();

// Scrollama setup for each year (steps trigger visibility)
scroller
    .setup({
        step: ".step",
        offset: 0.3, // Trigger step halfway into the viewport
        progress: true, // Enable progress tracking (0-1)
    })
    .onStepEnter((response) => {
        const { element, index } = response;
        const year = index + 2022;

        // Show the scrolly text when the user scrolls to the year step
        const scrollyText = document.querySelectorAll(".scrolly-text")[index];
        scrollyText.classList.add("show");

        // Add cubes when the user scrolls to the year step (except 2022)
        if (year === 2023 && cubesFor2023 < yearData[2023].totalTrains * cubesPerTrain) {
            generateTrainGrid("trainGrid2023", yearData[2023].totalTrains, yearData[2023].lateTrains, cubesFor2023);
        }
        if (year === 2024 && cubesFor2024 < yearData[2024].totalTrains * cubesPerTrain) {
            generateTrainGrid("trainGrid2024", yearData[2024].totalTrains, yearData[2024].lateTrains, cubesFor2024);
        }

        // Fade in the grid when it enters the viewport
        element.querySelector(".train-grid").style.opacity = 1;
    })
    .onStepExit((response) => {
        // Remove the "show" class when exiting the step
        const scrollyText = document.querySelectorAll(".scrolly-text")[response.index];
        scrollyText.classList.remove("show");
    });

// Enable Scrollama
scroller.enable();

// Generate 2022 grid on page load with immediate show
generateTrainGrid("trainGrid2022", yearData[2022].totalTrains, yearData[2022].lateTrains, cubesFor2022);
