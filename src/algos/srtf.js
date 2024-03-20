export function solveSrtf(names) {
  const processesInfo = names
    .sort((obj1, obj2) => {
      if (obj1.arrivalTime > obj2.arrivalTime) return 1
      if (obj1.arrivalTime < obj2.arrivalTime) return -1
      if (obj1.burstTime > obj2.burstTime) return 1
      if (obj1.burstTime < obj2.burstTime) return -1
      return 0
    })

  const gant = []
  const table = []

  let avgWaitingTime = 0
  let avgTurnaroundTime = 0

  const readyQueue = []
  let currentTime = processesInfo[0].arrivalTime
  const unfinishedJobs = [...processesInfo]

  const remainingTime = processesInfo.reduce((acc, process) => {
    acc[process.name] = process.burstTime
    return acc
  }, {})

  readyQueue.push(unfinishedJobs[0])
  while (
    Object.values(remainingTime).reduce((acc, cur) => {
      return acc + cur
    }, 0) &&
    unfinishedJobs.length > 0
  ) {
    let prevIdle = false
    if (readyQueue.length === 0 && unfinishedJobs.length > 0) {
      prevIdle = true
      readyQueue.push(unfinishedJobs[0])
    }

    readyQueue.sort((a, b) => {
      // Equal-priority processes are scheduled in FCFS order.
      if (remainingTime[a.name] > remainingTime[b.name]) return 1
      if (remainingTime[a.name] < remainingTime[b.name]) return -1
      return 0
    })

    const processToExecute = readyQueue[0]

    const processATLessThanBT = processesInfo.filter((p) => {
      let curr = currentTime
      if (prevIdle) {
        curr = processToExecute.arrivalTime
      }

      return (
        p.arrivalTime <= remainingTime[processToExecute.name] + curr &&
        p !== processToExecute &&
        !readyQueue.includes(p) &&
        unfinishedJobs.includes(p)
      )
    })

    let gotInterruption = false
    processATLessThanBT.some((p) => {
      if (prevIdle) {
        currentTime = processToExecute.arrivalTime
      }

      const amount = p.arrivalTime - currentTime

      if (currentTime >= p.arrivalTime) {
        readyQueue.push(p)
      }

      if (p.burstTime < remainingTime[processToExecute.name] - amount) {
        remainingTime[processToExecute.name] -= amount
        readyQueue.push(p)
        currentTime += amount

        gant.push({
          name: processToExecute.name,
          value: currentTime
        })

        gotInterruption = true
        return true
      }
    })

    const processToArrive = processesInfo.filter((p) => {
      return (
        p.arrivalTime <= currentTime &&
        p !== processToExecute &&
        !readyQueue.includes(p) &&
        unfinishedJobs.includes(p)
      )
    })

    // Push new processes to readyQueue
    readyQueue.push(...processToArrive)

    if (!gotInterruption) {
      if (prevIdle) {
        const remainingT = remainingTime[processToExecute.name]
        remainingTime[processToExecute.name] -= remainingT
        currentTime = processToExecute.arrivalTime + remainingT

        processATLessThanBT.forEach((p) => {
          if (currentTime >= p.arrivalTime && !readyQueue.includes(p)) {
            readyQueue.push(p)
          }
        })

        gant.push({
          name: processToExecute.name,
          value: currentTime
        })
      } else {
        const remainingT = remainingTime[processToExecute.name]
        remainingTime[processToExecute.name] -= remainingT
        currentTime += remainingT

        processATLessThanBT.forEach((p) => {
          if (currentTime >= p.arrivalTime && !readyQueue.includes(p)) {
            readyQueue.push(p)
          }
        })

        gant.push({
          name: processToExecute.name,
          value: currentTime
        })
      }
    }

    readyQueue.push(readyQueue.shift())

    if (remainingTime[processToExecute.name] === 0) {
      const indexToRemoveUJ = unfinishedJobs.indexOf(processToExecute)
      if (indexToRemoveUJ > -1) {
        unfinishedJobs.splice(indexToRemoveUJ, 1)
      }
      const indexToRemoveRQ = readyQueue.indexOf(processToExecute)
      if (indexToRemoveRQ > -1) {
        readyQueue.splice(indexToRemoveRQ, 1)
      }

      let waitingTime = currentTime - processToExecute.arrivalTime - processToExecute.burstTime
      let turnaroundTime = currentTime - processToExecute.arrivalTime

      table.push({
        ...processToExecute,
        waitingTime,
        turnaroundTime,
        finishedTime: currentTime
      })

      avgWaitingTime += processToExecute.arrivalTime
      avgTurnaroundTime += turnaroundTime
    }
  }

  return { gant, table, avgWaitingTime, avgTurnaroundTime }
}
