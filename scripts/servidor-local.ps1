param(
    [switch]$Reiniciar,
    [ValidateRange(1024, 65535)][int]$Puerto = 8080
)
$ErrorActionPreference = 'Stop'
$raizProyecto = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$rutaServidor = Join-Path $PSScriptRoot 'servir.mjs'
$urlLocal = "http://127.0.0.1:$Puerto/mazo/"

try {
    $comandoNode = Get-Command node -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
    $ejecutableNode = if ($comandoNode) { $comandoNode.Source } else { Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' }
    if (-not (Test-Path -LiteralPath $ejecutableNode -PathType Leaf)) {
        throw 'No se encontro Node.js. Abre este proyecto desde Codex o instala Node.js antes de iniciar el servidor.'
    }

    $escuchando = @([Net.NetworkInformation.IPGlobalProperties]::GetIPGlobalProperties().GetActiveTcpListeners() | Where-Object { $_.Port -eq $Puerto }).Count -gt 0
    if ($escuchando) {
        $identidad = $null
        try { $identidad = Invoke-RestMethod -Uri ($urlLocal + '__servidor_local__') -TimeoutSec 3 } catch { }
        $esEsteProyecto = $identidad -and $identidad.proyecto -eq 'white-death-deck-manager' -and [string]::Equals([string]$identidad.raiz, $raizProyecto, [StringComparison]::OrdinalIgnoreCase)
        if (-not $Reiniciar -and $esEsteProyecto) {
            Write-Host "El servidor de este proyecto ya esta iniciado: $urlLocal"
            Write-Host 'Para preparar la ultima version, utiliza REINICIAR_LOCAL.cmd.'
            exit 0
        }

        $conexiones = @(Get-NetTCPConnection -LocalPort $Puerto -State Listen -ErrorAction Stop)
        $propietarios = @($conexiones | Select-Object -ExpandProperty OwningProcess -Unique)
        if ($propietarios.Count -ne 1) { throw "El puerto $Puerto no tiene un propietario unico. No se detuvo ningun proceso." }
        $idServidor = $propietarios[0]
        $procesoServidor = Get-CimInstance Win32_Process -Filter "ProcessId = $idServidor"
        $esNode = $procesoServidor.Name -eq 'node.exe'
        $rutaAbsolutaCoincide = $procesoServidor.CommandLine -and $procesoServidor.CommandLine.IndexOf($rutaServidor, [StringComparison]::OrdinalIgnoreCase) -ge 0
        $identidadCoincide = $esEsteProyecto -and $identidad.pid -eq $idServidor
        if (-not $esNode -or (-not $rutaAbsolutaCoincide -and -not $identidadCoincide)) {
            throw "El puerto $Puerto esta ocupado y no se pudo identificar el servidor de este proyecto. Cierra su terminal con Ctrl+C y vuelve a ejecutar este archivo. No se detuvo ningun proceso."
        }
        if (-not $Reiniciar) {
            Write-Host "El servidor de este proyecto ya esta iniciado: $urlLocal"
            Write-Host 'Para preparar la ultima version, utiliza REINICIAR_LOCAL.cmd.'
            exit 0
        }
    }

    Write-Host 'Preparando catalogo y version offline...'
    & $ejecutableNode (Join-Path $PSScriptRoot 'preparar.mjs')
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo preparar la aplicacion. El servidor anterior no se ha detenido.' }

    if ($escuchando) {
        # Solo el PID comprobado; nunca terminar todos los procesos de Node.
        $procesoActual = Get-CimInstance Win32_Process -Filter "ProcessId = $idServidor"
        if (-not $procesoActual -or $procesoActual.CreationDate -ne $procesoServidor.CreationDate -or $procesoActual.CommandLine -ne $procesoServidor.CommandLine) {
            throw 'El servidor cambio durante la preparacion. No se detuvo ningun proceso; vuelve a intentarlo.'
        }
        Stop-Process -Id $idServidor -ErrorAction Stop
        Wait-Process -Id $idServidor -Timeout 10 -ErrorAction SilentlyContinue
    }
    Write-Host "Servidor local: $urlLocal"
    Write-Host 'Deja esta ventana abierta. Para detener el servidor, pulsa Ctrl+C.'
    Write-Host 'En la web, usa General > Buscar y aplicar actualizacion para cargar la version nueva.'
    $env:MAZO_PUERTO = [string]$Puerto
    & $ejecutableNode $rutaServidor
    if ($LASTEXITCODE -ne 0) { throw 'El servidor se detuvo con un error. Revisa si el puerto sigue ocupado.' }
} catch {
    Write-Host ('ERROR: ' + $_.Exception.Message) -ForegroundColor Red
    exit 1
}
