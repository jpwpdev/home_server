```ps1
param(
    [Parameter()]
    [String]$driveName
)

if($driveName) {
    $selectedDrive = $driveName+":"
    echo $selectedDrive
    $driveEject = New-Object -comObject Shell.Application
    $driveEject.Namespace(17).ParseName($selectedDrive).InvokeVerb("Eject")
}
else {
    Write-Output "No drive specified"
}
```