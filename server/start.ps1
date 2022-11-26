# 关闭 openresty 进程
# Get-Process -Name "openresty*" | Stop-Process

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

$root = get_root_path
$orpm = get_orpm_path
$ver  = "1.21.4.1"
$arch = "64"

$openresty      = "openresty-$ver-win$arch"
$openresty_exe  = "$orpm/openresty/$openresty/openresty.exe"

Write-Host
Write-Host ---------------------------------------------
Write-Host "workspace: " -ForegroundColor Yellow -NoNewline
Write-Host "$root"       -ForegroundColor Blue
Write-Host "orpm home: " -ForegroundColor Yellow -NoNewline
Write-Host "$orpm"       -ForegroundColor Blue
Write-Host "openresty_exe: " -ForegroundColor Yellow -NoNewline
Write-Host "$openresty_exe"  -ForegroundColor Blue

# 运行 nginx
Start-Process $openresty_exe -ArgumentList "-p $root/nginx" -NoNewWindow

Write-Host
Write-Host "start process openresty*" -ForegroundColor Blue
Write-Host ---------------------------------------------
