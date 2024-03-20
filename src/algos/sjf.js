export function solveSjf(jobs) {
  // Sort jobs based on burst time (shortest job first)
  jobs.sort((a, b) => a.burstTime - b.burstTime);

  let currentTime = 0;
  let gant = [];
  let table = [];
  let totalTurnaroundTime = 0;
  let totalWaitingTime = 0;

  // Iterate through each job
  jobs.forEach(job => {
    // Calculate waiting time
    const waitingTime = Math.max(0, currentTime - job.arrivalTime);
    // Calculate turnaround time
    const turnaroundTime = waitingTime + job.burstTime;
    // Calculate finish time
    const finishedTime = currentTime + job.burstTime;

    // Update current time
    currentTime = finishedTime;

    // Push entry to Gantt chart
    gant.push({ name: job.name, value: finishedTime });

    // Push entry to table
    table.push({
      name: job.name,
      arrivalTime: job.arrivalTime,
      burstTime: job.burstTime,
      waitingTime: waitingTime,
      turnaroundTime: turnaroundTime,
      finishedTime: finishedTime
    });

    // Update total turnaround time and waiting time
    totalTurnaroundTime += turnaroundTime;
    totalWaitingTime += waitingTime;
  });

  // Calculate average turnaround time and waiting time with 2 decimal places
  const avgTurnaroundTime = (totalTurnaroundTime / jobs.length).toFixed(2);
  const avgWaitingTime = (totalWaitingTime / jobs.length).toFixed(2);

  return { gant, table, avgTurnaroundTime, avgWaitingTime };
}
