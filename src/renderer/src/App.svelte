<script lang="ts">
  import electronLogo from './assets/batocera-icon.png'
  import ConnectionStatus from './components/ConnectionStatus.svelte'

  let gameInfo = null
  // @ts-ignore ignore this for now
  window.api.onServerEvent((data) => {
    gameInfo = data
  })
  // @ts-ignore ignore this for now
  const stopRp = (): void => window.api.ipcRenderer.send('stop-rp')
</script>

<img alt="logo" class="logo" src={electronLogo} />
{#if gameInfo === null}
  <div class="spinner" />
{/if}
{#if gameInfo !== null}
  <div class="text">{gameInfo.gameName}</div>
  <p class="tip">{gameInfo.platform}</p>
  <div class="actions">
    <div class="action">
      <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions a11y-missing-attribute-->
      <a target="_blank" rel="noreferrer" on:click={stopRp}>Stop RP</a>
    </div>
  </div>
{/if}
<ConnectionStatus />
