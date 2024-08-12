#!/usr/bin/env bash
yarn build
pushd build || exit
go-bindata -o ../bindata/bindata.go -pkg bindata *
popd || exit
go build
