#!/bin/zsh

en0=`ifconfig en0 | grep -E "(inet |status:)" | head -n 1 | awk '{ print $2}'`
pub0=`piactl get pubip`
vpn0=`piactl get vpnip`
vpnregion=`piactl get region`

json='{"en0": "'$en0'", "pub0": "'$pub0'", "vpn0": "'$vpn0'", "vpnregion": "'$vpnregion'"}'

echo $json
