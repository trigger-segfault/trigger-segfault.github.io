param (
	[switch]$nowatch,
	[switch]$noinc,
	[switch]$unpub,
	[switch]$noloop
)

# Use this instead of "localhost" or "0.0.0.0". This has the
# benefit of working with redirects, and being supported on LAN.
$ip = (Test-Connection -ComputerName $env:computername -count 1).IPV4Address.ipaddressTOstring
$port        = "4001"
$watch       = "--watch"
$incremental = "--incremental"
$unpublished = "--unpublished --future"
$loop        = -Not $noloop

if (     $nowatch) { $watch       = "" }
if (     $noinc)   { $incremental = "" }
if (-Not $unpub)   { $unpublished = "" }

# Keep retrying if we fail on startup due to liquid errors and whatnot.
# This way we can fix the error and wait for it to get itself back up.
do {
	# We use a batch file here to redirect the input stream to null.
	# I'm sick of typing Y, Y to terminate the batch job.
	# This would normally work fine in powershell with `$null | bundle exec jekyll serve ...`,
	# but VSCode will botch the output at the end and make it look like things are still running.
	./serve.cmd --host $ip --port $port  $watch $incremental $unpublished
	#bundle exec jekyll serve
} while ($loop)