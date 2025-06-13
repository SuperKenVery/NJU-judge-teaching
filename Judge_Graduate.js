/**
 * One-Click Course Evaluation Script
 * * This script automates the process of course evaluations by:
 * 1. Finding all unevaluated courses on the main page.
 * 2. Clicking on a course, navigating to its evaluation form.
 * 3. Filling out the form by selecting the highest possible ratings.
 * 4. Submitting the form.
 * 5. Verifying the final score is 100 and confirming the submission.
 * 6. Returning to the main page and moving to the next course.
 * 7. Logging the name of each course as it completes.
 */

// Helper function to introduce a delay. Web pages need time to load.
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// The main function to run the evaluation process.
async function runAutoEvaluation() {
    console.log("Starting the one-click course evaluation script...");

    // This loop will continue as long as it finds unevaluated courses.
    while (true) {
        await sleep(2000); // Wait a moment for the page to be stable

        // STEP 1: Find the next unevaluated course on the main page.
        // The '.sc-panel-warning' class indicates an unevaluated course ("未评教").
        const unevaluatedCourseElement = document.querySelector('.sc-panel-warning');

        // If no more unevaluated courses are found, the script's job is done.
        if (!unevaluatedCourseElement) {
            console.log("✅ All courses have been evaluated. Script finished!");
            break; // Exit the loop
        }

        // Find the clickable parent container and get the course name from the 'title' attribute.
        const courseContainer = unevaluatedCourseElement.closest('[data-action="评教"]');
        const courseName = courseContainer.querySelector('.pjwj_card_content')?.title || 'Unknown Course';

        console.log(`--- Now evaluating: ${courseName} ---`);

        // STEP 2: Click the course to go to the secondary evaluation page.
        courseContainer.click();
        await sleep(3000); // Wait for the evaluation page to fully load.

        // STEP 3: On the secondary page, fill out the evaluation form.
        // This uses the code you provided to select all top-score radio buttons.
        const ratingInputs = document.querySelectorAll('input[role="pj_form_radio"][value="5"], input[role="pj_form_radio"][value="50"]');
        
        if (ratingInputs.length > 0) {
            ratingInputs.forEach(input => input.click());
            console.log("✔️ Ratings selected.");
        } else {
            console.error(`❌ ERROR: Could not find rating options for ${courseName}. Returning to list.`);
            window.history.back(); // Go back to the main page
            await sleep(3000);
            continue; // Move to the next iteration of the loop
        }

        await sleep(1000); // Brief pause after filling the form.

        // STEP 4: Find and click the "提交" (Submit) button.
        const submitButton = document.querySelector('a.bh-btn.bh-btn-primary[data-action="提交"]');
        if (submitButton) {
            submitButton.click();
            console.log("✔️ Submit button clicked.");
        } else {
            console.error(`❌ ERROR: Could not find the 'Submit' button for ${courseName}. Returning to list.`);
            window.history.back();
            await sleep(3000);
            continue;
        }

        await sleep(1500); // Wait for the confirmation pop-up.

        // STEP 5: Handle the confirmation dialog.
        // Check if the score is 100 and then click the "确定" (Confirm) button.
        const scoreElement = document.querySelector('.bh-dialog-center .bh-color-info');
        const confirmButton = document.querySelector('.bh-dialog-center .bh-dialog-btn.bh-bg-primary');

        if (scoreElement && scoreElement.textContent.trim() === '100' && confirmButton) {
            console.log("✔️ Score is 100. Confirming submission...");
            confirmButton.click();
            // Print the completed course name to the console.
            console.log(`✅ SUCCESS: Evaluation completed for: ${courseName}`);
        } else {
            console.error(`❌ ERROR: Score was not 100 or the confirm button was not found. Aborting submission for ${courseName}.`);
            const cancelButton = document.querySelector('.bh-dialog-center .bh-dialog-btn:not(.bh-bg-primary)');
            if (cancelButton) {
                cancelButton.click();
            }
            // Go back to the main page to avoid getting stuck.
            await sleep(1000);
            window.history.back();
        }

        // STEP 6: Wait for the page to return to the main course list and refresh.
        // This delay is important to allow the page to update the status of the course just evaluated.
        await sleep(4000);
    }
}

// Call the function to start the process.
runAutoEvaluation();