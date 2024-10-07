function submitApplication(e) {
    e.preventDefault(); // You can ignore this; prevents the default form submission!

    // TODO: Alert the user of the job that they applied for!
    let JOB = document.getElementsByName("job");
    let selectedJob = null;
    for (let job of JOB) {
        if(job.checked){
            selectedJob = job.value;
        }
    }

    if (selectedJob === null){
        alert("Please select a job!");
    } else {
        alert("Thank you for applying to be a " + selectedJob + "!");
    }
}