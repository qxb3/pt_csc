<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

	export let showModal // boolean

	let dialog // HTMLDialogElement

  $: {
    if (dialog && showModal) {
      dialog.showModal()
      dispatch('open')
    } else if (dialog && !showModal) {
      dialog.close()
      dispatch('close')
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<slot name="header" />

		<slot />

    <div class="controls">
      <button on:click={() => dialog.close()} class="close-modal button">Cancel</button>

      <slot name="controls" />
    </div>
	</div>
</dialog>

<style>
	dialog {
    width: 34em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

	dialog > div {
		padding: 1em;
	}

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoom {
		from {
			transform: scale(0.95);
		}

		to {
			transform: scale(1);
		}
	}

	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

  .controls {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
  }

  .controls .close-modal { background-color: #ff1a1a; }
</style>

