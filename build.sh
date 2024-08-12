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
  if [[ ! -f build/index.html ]]; then
    yarn install
    yarn build
  fi
fi
rm -rf pkg/build
cp -fr build   pkg/
go build
