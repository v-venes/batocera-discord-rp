<script lang="ts">
  let gameInfo = null
  // @ts-ignore ignore this for now
  window.api.onServerEvent((data) => {
    gameInfo = data
  })
</script>

<div class="connection-status">
  <span class="indicator {gameInfo === null ? 'disconnected' : 'connected'}" />
  <p>{gameInfo == null ? 'Waiting connection...' : 'Connected!'}</p>
</div>
