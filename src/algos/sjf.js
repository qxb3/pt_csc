export function solveSjf(jobs) {
  jobs.sort((a, b) => a.burstTime - b.burstTime)

  let currentTime = 0
  let gant = []
  let table = []
  let totalTurnaroundTime = 0
  let totalWaitingTime = 0

  jobs.forEach(job => {
    const waitingTime = Math.max(0, currentTime - job.arrivalTime)
    const turnaroundTime = waitingTime + job.burstTime
    const finishedTime = currentTime + job.burstTime

    currentTime = finishedTime

    gant.push({ name: job.name, value: finishedTime })

    table.push({
      name: job.name,
      arrivalTime: job.arrivalTime,
      burstTime: job.burstTime,
      waitingTime: waitingTime,
      turnaroundTime: turnaroundTime,
      finishedTime: finishedTime
    })

    totalTurnaroundTime += turnaroundTime
    totalWaitingTime += waitingTime
  })

  const avgTurnaroundTime = (totalTurnaroundTime / jobs.length).toFixed(3)
  const avgWaitingTime = (totalWaitingTime / jobs.length).toFixed(3)

  return { gant, table, avgTurnaroundTime, avgWaitingTime }
}
