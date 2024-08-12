#!/usr/bin/env bash
build_web=false
while getopts "w" opt; do
  case $opt in
  w)
    build_web=true
    ;;
  esac
done

if [[ $build_web == true ]]; then
  yarn build
fi
rm -rf pkg/build
cp -fr build   pkg/
go build
