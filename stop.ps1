Write-Host
Write-Host "stop process openresty*" -ForegroundColor Blue
Write-Host

# 关闭 openresty 进程
Get-Process -Name "openresty*" | Stop-Process -PassThru
