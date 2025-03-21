<script lang="ts">
    import { onMount } from 'svelte';
  
    let data: {
      activeDevices: Array<{
        name: string | null;
        os: string;
        ip: string;
        mac: string | null;
        timestamp: Date;
      }>;
      totalConnected: number;
      withPhoneNumber: number;
      percentageWithPhone: number;
      allClasses: Array<{ class: string; phone: string }>;
    } | null = null;
  
    let error: string | null = null;
  
    const fetchData = async () => {
      try {
        const response = await fetch('/api/devices');
        if (!response.ok) throw new Error('Feil ved henting av data');
        data = await response.json();
      } catch (err) {
        error = err instanceof Error ? err.message : 'Ukjent feil';
      }
    };
  
    onMount(() => {
      fetchData();
      const interval = setInterval(fetchData, 3000); // Oppdater hvert 3. sekund
      return () => clearInterval(interval);
    });
  </script>
  
  <div class="dashboard">
    <h1>Phishing Overvåkning</h1>
  
    {#if error}
      <div class="error">{error}</div>
    {:else if !data}
      <p>Laster data...</p>
    {:else}
      <!-- Statistikkseksjon -->
      <div class="stats">
        <div class="stat-box">
          <h3>Aktive Enheter</h3>
          <p class="stat-value">{data.activeDevices.length}</p>
        </div>
        <div class="stat-box">
          <h3>Totalt Tilkoblet</h3>
          <p class="stat-value">{data.totalConnected}</p>
        </div>
        <div class="stat-box">
          <h3>Telefonnummer Registrert</h3>
          <p class="stat-value">
            {data.withPhoneNumber} ({data.percentageWithPhone.toFixed(1)}%)
          </p>
        </div>
      </div>
  
      <!-- Aktive Enheter -->
      <section>
        <h2>Aktive Enheter</h2>
        <table>
          <thead>
            <tr>
              <th>Navn</th>
              <th>OS</th>
              <th>IP</th>
              <th>MAC</th>
              <th>Tidspunkt</th>
            </tr>
          </thead>
          <tbody>
            {#each data.activeDevices as device}
              <tr>
                <td>{device.name || 'Ukjent'}</td>
                <td>{device.os}</td>
                <td>{device.ip}</td>
                <td>{device.mac || 'Ukjent'}</td>
                <td>{new Date(device.timestamp).toLocaleTimeString()}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>
  
      <!-- Registrerte Klasser og Telefoner -->
      <section>
        <h2>Registrerte Klasser og Telefoner</h2>
        <table>
          <thead>
            <tr>
              <th>Klasse</th>
              <th>Telefonnummer</th>
            </tr>
          </thead>
          <tbody>
            {#each data.allClasses as c}
              <tr>
                <td>{c.class}</td>
                <td>{c.phone}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>
    {/if}
  </div>
  
  <style>
    .dashboard {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  
    h1 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }
  
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }
  
    .stat-box {
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #007bff;
      margin: 0.5rem 0;
    }
  
    section {
      margin-bottom: 2rem;
    }
  
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
  
    th {
      background-color: #007bff;
      color: white;
    }
  
    tr:hover {
      background-color: #f1f1f1;
    }
  
    .error {
      color: red;
      background: #ffe6e6;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 2rem;
    }
  </style>