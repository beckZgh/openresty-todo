
function get_root_path() {
    $path = Get-Location
    while($path) {
        if (Test-Path "$path/.orpmrc") {
            return ("$path").replace("`\","`/")
        } else {
            $path = Split-Path $path
        }
    }
}
function get_orpm_path() {
    $drive = (Get-Location).Drive.Root
    return ($drive + ".orpm").replace("`\","`/")
}

function get_orpm_conf() {

    $root = get_root_path
    if (-not $root) { return }

    Get-Content "$root/.orpmrc" | ConvertFrom-JSON

}

$root = get_root_path
$orpm = get_orpm_path
$conf = get_orpm_conf
$ver  = $conf.openresty_ver
$arch = $conf.arch

Write-Host
Write-Host ---------------------------------------------
Write-Host "workspace: " -ForegroundColor Yellow -NoNewline
Write-Host "$root"       -ForegroundColor Blue
Write-Host "orpm home: " -ForegroundColor Yellow -NoNewline
Write-Host "$orpm"       -ForegroundColor Blue

# 关闭 openresty 进程
# Get-Process -Name "openresty*" | Stop-Process

$openresty      = "openresty-$ver-win$arch"
$openresty_exe  = "$orpm/openresty/$openresty/openresty.exe"

# 运行 nginx
Start-Process $openresty_exe -ArgumentList "-p ./nginx" -NoNewWindow

Write-Host
Write-Host "start process openresty*" -ForegroundColor Blue
Write-Host ---------------------------------------------
