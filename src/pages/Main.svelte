<script>
  import Modal from '../lib/Modal.svelte'
  import { solveFcfs } from '../algos/fcfs.js'
  import { solveSjf } from '../algos/sjf.js'
  import { solveSrtf } from '../algos/srtf'
  import { solveNpp } from '../algos/npp.js'

  let algorithm = 'fcfs'

  let jobs = []
  let result = null

  let isAddJob = false
  let modalJobName = 'Job1'
  let modalArrivalTime = 1
  let modalBurstTime = 0
  let modalPriority = 0
  let modalErr = ''

  /**
  * Adds a job
  *
  * @param {string} name
  * @param {number} arrivalTime
  * @param {number} burstTime
  */
  function addJob(name, arrivalTime, burstTime, priority = 0) {
    if (jobs.find(v => v.name === name)) return modalErr = `There is already a job named: "${name}"`

    jobs = [...jobs, { name, arrivalTime, burstTime, priority }]

    isAddJob = false
    modalErr = ''
  }

  function showAddJobModal() {
    modalJobName = `Job${jobs.length + 1}`
    modalArrivalTime = jobs.length

    isAddJob = true
  }

  function solve() {
    if (jobs.length <= 0) return

    if (algorithm === 'fcfs') result = solveFcfs(jobs)
    if (algorithm === 'sjf') result = solveSjf(jobs)
    if (algorithm === 'srtf') result = solveSrtf(jobs)
    if (algorithm === 'npp') result = solveNpp(jobs)
  }
</script>

<Modal bind:showModal={isAddJob} on:close={() => modalErr = ''}>
  <div slot="header">
    <h1>Add job</h1>
    {#if modalErr.length > 0}
      <p class="modal-err">⚠ {modalErr}</p>
    {/if}
  </div>

  <div class="modal-body">
    <span>
      <label for="input">Job Name:</label>
      <input bind:value={modalJobName} type="text" placeholder="Job Name" />
    </span>

    <span>
      <label for="input">Arrival Time:</label>
      <input bind:value={modalArrivalTime} type="number" placeholder="Arrival Times" />
    </span>

    <span>
      <label for="input">Burst Time:</label>
      <input bind:value={modalBurstTime} type="number" placeholder="Burst Times" />
    </span>

    {#if algorithm === 'npp' || algorithm === 'pp'}
      <span>
        <label for="input">Priority (Lower = Highest):</label>
        <input bind:value={modalPriority} type="number" placeholder="Priority" />
      </span>
    {/if}
  </div>

  <div slot="controls">
    <button on:click={() => addJob(modalJobName, modalArrivalTime, modalBurstTime, modalPriority)} class="modal-add button">Add</button>
  </div>
</Modal>

<main>
  <div id="input" class="card">
    <div class="header">
      <h1 class="title">Input</h1>

      <select bind:value={algorithm} class="algorithms">
        <option value="fcfs">First Come First Serve (FCFS)</option>
        <option value="sjf">Shortest Job First (SJF)</option>
        <option value="srtf">Shortest Remaining Time First (SRTF)</option>
        <option value="npp">Non-Preemtive Priority (NPP)</option>
        <option value="pp">Preemtive Priority (PP)</option>
      </select>
    </div>

    <div style="overflow-x: scroll;">
      <table class="table">
        <thead>
          <tr>
            <th>Job</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
            {#if algorithm === 'npp' || algorithm === 'pp'}
              <th>Priority</th>
            {/if}
          </tr>
        </thead>

        <tbody>
          {#if jobs.length <= 0}
            <tr>
              <th>...</th>
              <th>...</th>
              <th>...</th>
              {#if algorithm === 'npp' || algorithm === 'pp'}
                <th>...</th>
              {/if}
            </tr>
          {:else}
            {#each jobs as job}
              <tr>
                <th>{job.name}</th>
                <th>{job.arrivalTime}</th>
                <th>{job.burstTime}</th>
                {#if algorithm === 'npp' || algorithm === 'pp'}
                  <th>{job.priority}</th>
                {/if}
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>

    <div class="controls">
      <button on:click={solve} class="solve button">Solve</button>
      <button on:click={showAddJobModal} class="add button">Add +</button>
    </div>
  </div>

  <div id="result" class="card">
    <h1 class="title">Result</h1>

    {#if !result}
      <p style="color: #a6a6a6; font-size: 14px; margin: 1rem 0 0 0;">No result</p>
    {:else}
      <div style="overflow-x: scroll;">
        <table>
          <thead>
            <tr>
              <th>Job</th>
              <th>Arrival Time</th>
              <th>Burst Time</th>
              {#if algorithm === 'npp' || algorithm === 'pp'}
                <th>Priority</th>
              {/if}
              <th>Waiting Time</th>
              <th>Turnaround Time</th>
              <th>Finished Time</th>
            </tr>
          </thead>

          <tbody>
            {#each result.table as job}
              <tr>
                <th>{job.name}</th>
                <th>{job.arrivalTime}</th>
                <th>{job.burstTime}</th>
                {#if algorithm === 'npp' || algorithm === 'pp'}
                  <th>{job.priority}</th>
                {/if}
                <th>{job.waitingTime}</th>
                <th>{job.turnaroundTime}</th>
                <th>{job.finishedTime}</th>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    margin: 5rem 3rem;
  }

  .modal-err {
    background-color: #ff1a1a;
    color: #fff;
    padding: 8px;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .modal-body input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 12px;
    outline: none;
    transition: border-color 0.3s ease;
  }

  .modal-add {
    background-color: #228B22;
  }

  #input {
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header .algorithms {
    background-color: transparent;
    border: 1px solid #ccc;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    width: 250px;
    cursor: pointer;
    outline: none;
  }

  .controls .solve { background-color: #4169E1; margin-top: 1rem; }
  .controls .add { background-color: #228B22; }

  #result {
    padding: 1rem;
    max-width: 1024px;
    margin: 3rem auto 0 auto;
  }
</style>
