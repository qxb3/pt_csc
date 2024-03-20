export function solveNpp(jobs) {
  const processesInfo = jobs
    .sort((process1, process2) => {
      if (process1.arrivalTime > process2.arrivalTime) return 1
      if (process1.arrivalTime < process2.arrivalTime) return -1
      if (process1.priority > process2.priority) return 1
      if (process1.priority < process2.priority) return -1
      return 0
    })

  const table = []
  let gant = []

  let finishTime = []
  const readyQueue = []
  const finishedJobs = []

  for (let i = 0; i < processesInfo.length; i++) {
    if (i === 0) {
      readyQueue.push(processesInfo[0])
      finishTime.push(processesInfo[0].arrivalTime + processesInfo[0].burstTime)
      table.push({
        ...processesInfo[0],
        waitingTime: finishTime[0] - processesInfo[0].arrivalTime - processesInfo[0].burstTime,
        turnaroundTime: finishTime[0] - processesInfo[0].arrivalTime,
        finishedTime: finishTime[0]
      })

      processesInfo.forEach((p) => {
        if (p.arrivalTime <= finishTime[0] && !readyQueue.includes(p)) {
          readyQueue.push(p)
        }
      })

      readyQueue.shift()
      finishedJobs.push(processesInfo[0])

      gant.push({
        name: processesInfo[0].name,
        value: finishTime[0]
      })
    } else {
      if (
        readyQueue.length === 0 &&
        finishedJobs.length !== processesInfo.length
      ) {
        const unfinishedJobs = processesInfo
          .filter((p) => {
            return !finishedJobs.includes(p)
          })
          .sort((a, b) => {
            if (a.arrivalTime > b.arrivalTime) return 1
            if (a.arrivalTime < b.arrivalTime) return -1
            if (a.priority > b.priority) return 1
            if (a.priority < a.priority) return -1
            return 0
          })
        readyQueue.push(unfinishedJobs[0])
      }

      const rqSortedByPriority = [...readyQueue].sort((a, b) => {
        if (a.priority > b.priority) return 1
        if (a.priority < b.priority) return -1
        if (a.arrivalTime > b.arrivalTime) return 1
        if (a.arrivalTime < b.arrivalTime) return -1
        return 0
      })

      const processToExecute = rqSortedByPriority[0]

      const previousFinishTime = finishTime[finishTime.length - 1]

      if (processToExecute.arrivalTime > previousFinishTime) {
        finishTime.push(processToExecute.arrivalTime + processToExecute.burstTime)
        const newestFinishTime = finishTime[finishTime.length - 1]
        gant.push({
          name: processToExecute.name,
          value: newestFinishTime
        })
      } else {
        finishTime.push(previousFinishTime + processToExecute.burstTime)
        const newestFinishTime = finishTime[finishTime.length - 1]
        gant.push({
          name: processToExecute.name,
          value: newestFinishTime
        })
      }

      const newestFinishTime = finishTime[finishTime.length - 1]

      table.push({
        ...processToExecute,
        waitingTime: newestFinishTime - processToExecute.arrivalTime - processToExecute.burstTime,
        turnaroundTime: newestFinishTime - processToExecute.arrivalTime,
        finishedTime: newestFinishTime
      })

      processesInfo.forEach((p) => {
        if (
          p.arrivalTime <= newestFinishTime &&
          !readyQueue.includes(p) &&
          !finishedJobs.includes(p)
        ) {
          readyQueue.push(p)
        }
      })

      const indexToRemove = readyQueue.indexOf(processToExecute)
      if (indexToRemove > -1) {
        readyQueue.splice(indexToRemove, 1)
      }

      finishedJobs.push(processToExecute)
    }
  }

  table.sort((obj1, obj2) => {
    if (obj1.arrivalTime > obj2.arrivalTime) return 1
    if (obj1.arrivalTime < obj2.arrivalTime) return -1
    if (obj1.name > obj2.name) return 1
    if (obj1.name < obj2.name) return -1
    return 0
  })

  let avgWaitingTime = (table.reduce((acc, curr) => acc + curr.waitingTime, 0) / table.length).toFixed(3)
  let avgTurnaroundTime = (table.reduce((acc, curr) => acc + curr.turnaroundTime, 0) / table.length).toFixed(3)

  return { gant, table, avgWaitingTime, avgTurnaroundTime }
}
