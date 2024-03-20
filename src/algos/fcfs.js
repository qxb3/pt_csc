export function solveFcfs(jobs) {
  jobs.sort((a, b) => a.arrivalTime - b.arrivalTime)

  let currentTime = 0
  let gant = [{ name: 'start', value: 0 }]
  let table = []

  let totalWaitingTime = 0
  let totalTurnaroundTime = 0

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

    totalWaitingTime += waitingTime
    totalTurnaroundTime += turnaroundTime
  })

  const avgWaitingTime = (totalWaitingTime / jobs.length).toFixed(3)
  const avgTurnaroundTime = (totalTurnaroundTime / jobs.length).toFixed(3)

  return { gant, table, avgWaitingTime, avgTurnaroundTime }
}
